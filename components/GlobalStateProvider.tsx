import { auth } from "@/config/firebase";
import { authenticate, verifyPersistance } from "@/firebase-queries/auth";
import { addNewClub } from "@/firebase-queries/club";
import { uploadProfilePic } from "@/firebase-queries/storage";
import AdminMachine, { AdminActor } from "@/machines/admin";
import AlertMachine, { AlertActor } from "@/machines/alert";
import AuthMachine, { AuthActor } from "@/machines/auth";
import { useActor, useInterpret } from "@xstate/react";
import { AnimatePresence } from "framer-motion";
import { createContext, useEffect, useState } from "react";
import AlertMsg from "./AlertMsg";
import Authenticate from "./Authenticate";
import Footer from "./Footer";
import Header from "./Header";

export const GlobalStateContext = createContext<{
  authService: AuthActor | undefined;
  adminService: AdminActor | undefined;
  alertService: AlertActor | undefined;
}>({
  authService: undefined,
  adminService: undefined,
  alertService: undefined,
});

const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const [loggedIn, setLoggedIn] = useState<boolean | undefined>(undefined);

  const alertService = useInterpret(AlertMachine);

  const authService = useInterpret(AuthMachine, {
    services: {
      verifyAdmin: async (_, event) => {
        return await authenticate(event.email, event.password);
      },
      verifyPersistance: async () => {
        return await verifyPersistance();
      },
    },
  });

  const adminService = useInterpret(AdminMachine, {
    services: {
      AddNewClub: async (_, event) => {
        // return await addNewClub(event.data.club, event.data.photo)
        const newClubProc = async (
          club: NewClubType,
          photo: File | undefined
        ) => {
          return new Promise<{ club: ClubType; message: string }>(
            async (resolve, reject) => {
              // try {
              console.log("image ", photo);
              if (photo) {
                const url = await uploadProfilePic(club.name, photo)
                  .then((url) => url)
                  .catch((e) => {
                    console.log("2 ", e);
                    reject(e.message);
                    return null;
                  });
                // console.log("photoUrl: ", url);
                if (!url) return;
                club.photoUrl = url;
              }
              await fetch("/api/addClub", {
                method: "POST",
                body: JSON.stringify({ club }),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then(async (res) => {
                  console.log("res: ", res);
                  const data = await res.json();
                  if (res.status === 200)
                    resolve({
                      club: data.club as ClubType,
                      message: data.message as string,
                    });
                  else reject(data.message as string);
                })
                .catch((e) => reject(e.message));
              // } catch (e: any) {
              //   console.log("3 ", e.message);
              //   reject(e.message);
              // }
            }
          );
        };
        return await newClubProc(event.data.club, event.data.photo);
      },
      EditClub: async (context, event) => {
        const editClubProc = async (
          club: ClubType,
          photo: File | undefined
        ) => {
          return new Promise<{ club: ClubType; message: string }>(
            async (resolve, reject) => {
              if (photo) {
                const url = await uploadProfilePic(club.name, photo)
                  .then((url) => url)
                  .catch((e) => {
                    console.log("2 ", e);
                    reject(e.message);
                    return null;
                  });
                // console.log("photoUrl: ", url);
                if (!url) return;
                club.photoUrl = url;
              }
              await fetch("/api/editClub", {
                method: "PUT",
                body: JSON.stringify({ club }),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then(async (res) => {
                  console.log("res: ", res);
                  const data = await res.json();
                  console.log("data in service: ", data);
                  if (res.status === 200)
                    resolve({
                      club: data.club as ClubType,
                      message: data.message as string,
                    });
                  else reject(data.message as string);
                })
                .catch((e) => reject(e.message));
            }
          );
        };
        return await editClubProc(event.data.club, event.data.photo);
      },
      ChangePassword: async (context, event) => {
        const changePasswordProc = async (id: string, newPassword: string) => {
          return new Promise<{
            success: boolean;
            message: string;
          }>(async (resolve, reject) => {
            console.log("id: ", id, "newPassword: ", newPassword);
            await fetch("/api/changePassword", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id, newPassword }),
            })
              .then(async (res) => {
                console.log(res);
                if (res.status === 200)
                  resolve({
                    success: true,
                    message: (await res.json()).message as string,
                  });
                else reject((await res.json()).message as string);
              })
              .catch((e) => {
                console.log("eerrorrr: ", e);
                reject(e.message);
              });
          });
        };

        return await changePasswordProc(event.data.id, event.data.newPassword);
      },
      DeleteClub: async (context, event) => {
        const deleteClubProc = async (id: string) => {
          return new Promise<{
            id: string;
            message: string;
          }>(async (resolve, reject) => {
            await fetch("/api/deleteClub", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id }),
            })
            .then(async (res) => {
              const data = await res.json()
              if(res.status === 200) resolve({
                id: data.id as string,
                message: data.message as string
              })
              else reject(data.message as string)
            })
            resolve({ id: "aef", message: "afefe" });
          });
        };

        return await deleteClubProc(context.currentClub!.id);
      },
    },
  });

  const [state, send] = useActor(authService);
  useEffect(() => {
    auth.onAuthStateChanged((_) => {
      send("VERIFY_PERSISTANCE");
    });
  }, []);

  useEffect(() => {
    console.log("auth errorMsg: ", state.context.errorMsg);
  }, [state.context]);

  const [adminState, adminSend] = useActor(adminService);
  const [alertState, alertSend] = useActor(alertService);

  useEffect(() => {
    if (adminState.context.alertMsg)
      alertSend({ type: "ALERT", msg: adminState.context.alertMsg });
  }, [adminState.context.alertMsg]);

  return (
    <GlobalStateContext.Provider
      value={{ authService, adminService, alertService }}
    >
      <Header />
      {state.matches("verifyingPersistance") && (
        <div className="mainLoader"></div>
      )}
      {!state.context.loggedIn && !state.matches("verifyingPersistance") && (
        <Authenticate />
      )}
      {state.matches("loggedIn") && (
        <>
          <div
            onClick={() => {
              send("LOGOUT");
            }}
            className="btnFtrs fixed  bg-stone-800 text-white 
          bottom-10 right-5 rounded-full px-4 cursor-pointer
          "
          >
            Logout
          </div>
        </>
      )}
      {state.matches("loggedIn") && <>{children}</>}
      <Footer />
      <AnimatePresence>
        {alertState.matches("visible") && (
          <AlertMsg
            msg={
              alertState.context.alertMsg || "Something went wrong. Try again"
            }
          />
        )}
      </AnimatePresence>
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
