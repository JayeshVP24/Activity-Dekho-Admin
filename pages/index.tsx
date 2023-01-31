import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "@/components/GlobalStateProvider";
import { useActor } from "@xstate/react/lib/useActor";
import { GetServerSideProps, NextPage } from "next";
import { getClubList, getStats } from "@/firebase-queries/club";
import Image from "next/image";
import AvatarGenerator from "@/components/AvatarGenerator";
import ModalWrapper from "@/components/ModalWrapper";
import AddClubForm from "@/components/AddClubFrom";
import EditClubForm from "@/components/EditClubForm";
import ChangePassword from "@/components/ChangePasswordForm";
import DeleteConfirmation from "@/components/DeleteConfirmation";

const Home: NextPage<{
  data: {
    clubList: ClubType[];
    stats: StatsType;
  };
  error: string | null;
}> = ({ error, data }) => {
  const globalService = useContext(GlobalStateContext);
  const [state, send] = useActor(globalService.adminService!);

  const [filteredEvents, setFilteredEvents] = useState<ClubType[]>([]);

  useEffect(() => {
    if (error) {
      send({ type: "ERROR_LOAD_DATA", data: error });
    } else {
      send({ type: "LOAD_DASHBOARD_DATA", data });
    }
  }, []);
  useEffect(() => {
    state.context.clubList && setFilteredEvents(state.context.clubList);
  }, [state.context.clubList]);

  useEffect(() => {
    console.log("admin errorMsg:", state.context.errorMsg);
  }, [state.context.errorMsg]);

  return (
    <main className="mx-6 lg:mx-20 mt-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-y-6 lg:justify-around  ">
        <h1
          className="text-4xl font-bold 
      lg:text-7xl lg:w-min"
        >
          Welcome Admin🫡
        </h1>
        {state.matches("Display Error") && (
          <div className="">
            <h2 className="text-xl lg:text-3xl">{state.context.errorMsg}</h2>
            <h3 className="text-2xl lg:text-5xl font-semibold">
              Some Error Occured, Please try again later 😵‍💫
            </h3>
          </div>
        )}
        {state.context.stats && (
          <>
            <section className="flex flex-wrap gap-8  lg:gap-20">
              <div className="bg-zinc-900 text-white w-max p-6 lg:p-12 rounded-3xl">
                <h2 className="text-xl lg:text-3xl">Total Clubs</h2>
                <h3 className="text-3xl lg:text-5xl font-bold">
                  {state.context.stats?.totalClubs}
                </h3>
              </div>
              <div className="bg-zinc-900 text-white w-max p-6 lg:p-12 rounded-3xl">
                <h2 className="text-xl lg:text-3xl">Total Events</h2>
                <h3 className="text-3xl lg:text-5xl font-bold">
                  {state.context.stats?.totalEvents}
                </h3>
              </div>
            </section>
          </>
        )}
      </div>
      {state.context.clubList && (
        <section className="mt-8">
          <h2 className="text-3xl lg:text-5xl font-semibold">All clubs</h2>
          <input
            className="w-full max-w-2xl outline-none rounded-full px-6 py-2 my-4 bg-opacity-50 bg-white
            "
            type="text"
            placeholder="Search"
            onChange={(e) => {
              console.log(e.target.value);
              setFilteredEvents(() => {
                return (
                  state.context.clubList?.filter((club) => {
                    return (
                      club.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                      club.fullName
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    );
                  }) || []
                );
              });
              // send({ type: "FILTER_ATTENDANCE", query: e.target.value });
            }}
          />
          {filteredEvents.length === 0 && (
            <div className="my-10">
              <p className="text-center text-3xl">
                No event with that query 💀
              </p>
            </div>
          )}
          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-6 lg:gap-12 mt-4">
            {filteredEvents?.map((club) => (
              <div
                key={club.id}
                className="bg-yellow-300 py-4 px-4 pr-8 rounded-2xl lg:w-max
                lg:py-8 lg:pl-8 flex flex-col justify-between max-w-md
                "
              >
                <div className="flex items-center w-max gap-x-4 ">
                  {club.photoUrl && (
                    <Image
                      src={club.photoUrl}
                      width="100"
                      height={100}
                      alt={`Logo of ${club.name}`}
                      className="w-20"
                    />
                  )}
                  {!club.photoUrl && <AvatarGenerator name={club.name} />}
                  <span className="max-w-[15rem]">
                    <h3 className="text-xl lg:text-2xl font-semibold">
                      {club.name}
                    </h3>
                    <p className=" text-sm">{club.fullName}</p>
                  </span>
                </div>
                <div className="text-sm max-w-[20rem] lg:text-base flex flex-wrap gap-2 lg:gap-x-4 mt-4">
                  <button
                    className="px-3 py-px bg-blue-400 rounded-full
                  hover:ring-4 ring-blue-400 ring-opacity-40
                  active:scale-90 transition-all"
                    onClick={() => {
                      send({ type: "CHANGE_PASSWORD", data: club });
                    }}
                  >
                    Change Password
                  </button>
                  <button
                    className="px-3 py-px bg-green-400 rounded-full
                  hover:ring-4 ring-green-400 ring-opacity-40
                  active:scale-90 transition-all"
                    onClick={() => {
                      send({ type: "EDIT_CLUB", data: club });
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="px-3 py-px bg-red-400 rounded-full
                  hover:ring-4 ring-red-400 ring-opacity-40
                  active:scale-90 transition-all"
                    onClick={() => {
                      send({ type: "DELETE_CLUB", data: club });
                    }}
                  >
                    Delete Club
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <div
        onClick={() => {
          send("ADD_CLUB");
        }}
        className="btnFtrs fixed  bg-stone-800 text-white 
                bottom-24 right-5 rounded-full px-4 cursor-pointer  
                 "
      >
        Add Club
      </div>
      {/* {state.matches("New Club") && ( */}
      <ModalWrapper
        closeModal={() => send({ type: "CLOSE_NEW_CLUB_MODAL" })}
        isModalOpen={state.matches("New Club")}
        loading={false}
      >
        <AddClubForm />
      </ModalWrapper>
      {/* )} */}
      {/* {state.matches("Edit Club") && ( */}
      <ModalWrapper
        closeModal={() => send({ type: "EDITCLUB.CLOSE_MODAL" })}
        isModalOpen={state.matches("Edit Club")}
        loading={false}
      >
        <EditClubForm />
      </ModalWrapper>
      {/* )} */}
      <ModalWrapper
        isModalOpen={state.matches("Change Password")}
        closeModal={() => send({ type: "CHANGEPASSWORD.CLOSE_MODAL" })}
        loading={false}
      >
        <ChangePassword />
      </ModalWrapper>
      <ModalWrapper
        isModalOpen={state.matches("Delete Club")}
        closeModal={() => send({ type: "DELETECLUB.CLOSE_MODAL" })}
        loading={false}
      >
        <DeleteConfirmation />
      </ModalWrapper>
      
    </main>
  );
};
export default Home;
export const getServerSideProps: GetServerSideProps = async (context) => {
  // console.log("getServerSideProps: ", context)
  try {
    const clubList = await getClubList();
    // console.log("clubList in index.ts: ", clubList);
    const stats = await getStats(clubList);
    // console.log("statsRes: ", stats);
    return {
      props: {
        data: { clubList, stats },
      },
    };
  } catch (err: any) {
    return {
      props: {
        error: err.message,
      },
    };
  }
};
