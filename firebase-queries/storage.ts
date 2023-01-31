import { storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadProfilePic = async (name: string, photo: File) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      if (!photo) return reject("No Photo");
      if (photo.size / 1024 / 1024 > 5)
        return reject("Photo size limit is 5MB");
      let profilesRef = ref(
        storage,
        "profiles/" + name + "." + photo.name.split(".")[1]
      );
      console.log("profilesRef: ", profilesRef);
      const photoRef = (await uploadBytes(profilesRef, photo)).ref;
    //   console.log();
      resolve((await getDownloadURL(photoRef)).split("&")[0]);
    } catch (e: any) {
        console.log(e.message); 
      return reject(e);
    }
  });
};
