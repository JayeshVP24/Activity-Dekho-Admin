import { auth } from "@/config/firebase";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const authenticate =  (email: string, password: string) => {
  // console.log("authenticate please")
  return  new Promise<void | string>((resolve, reject) => {
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password).then((user) => {
        auth.currentUser?.getIdTokenResult()
        .then(idTokenResult => {
            if(!!idTokenResult.claims.admin) {
                // sessionStorage.setItem("admin", user.user.uid);
                console.log("You are an admin")
                resolve();
            } else {
              console.log("You are not an admin")
              // throw new Error("you are not an admin")
              reject("You are not an admin")

            }
        }).catch(e => reject(e.message as string))
      }).catch(e => reject(e.message as string));
    }).catch(e => reject(e.message as string));
  })
};

export const verifyPersistance =  () => {
  console.log("verifying bro")
  return new Promise<void>((resolve, reject) => {
    if(!auth.currentUser) {
    console.log("not logged in")
      reject()
      return
    }
    auth.currentUser.getIdTokenResult().then(u => {
    console.log("logged in checking admin")
      u.claims.admin ? resolve() : reject()
    })
  })
}