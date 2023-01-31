import { adminAuth, adminFiredb } from "@/config/firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

const addClub = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const club = req.body.club as NewClubType | undefined;
    console.log(req.body)
    if (!club) {
      res.status(400).json({ message: "Missing club" });
      return;
    }
    if (!club.email || !club.password || !club.name || !club.fullName) {
      res
        .status(400)
        .json({ message: "Missing email or password or name or fullname" });
      return;
    }
    let error: string | undefined = undefined,
      message: string = "";

    const data: ClubType | null = await adminAuth
      .createUser({
        email: club.email,
        displayName: club.name,
        password: club.password,
        photoURL: club.photoUrl,
        disabled: false,
      })
      .then(async (user) => {
        return await adminFiredb
          .collection("clubs")
          .doc(user.uid)
          .set(club)
          .then((c) => {
            message = "Successfull: Club " + club.name + " added";
            console.log(message);
            delete club.password;
            return {
              id: user.uid,
              ...club,
            };
          })
          .catch((err) => {
            error = err.message;
            return null;
          });
      })
      .catch((err) => {
        error = err.message;
        return null;
      });

    if (error) {
      res.status(500).json({ message: error });
      return;
    }
    res.status(200).json({
      message,
      club: data,
    });
    return;
  }
  res.status(401).json({ message: "Unauthorized" });
};

export default addClub;
