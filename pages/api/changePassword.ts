import { adminAuth } from "@/config/firebase-admin";
import { NextApiHandler } from "next";

const changePassword: NextApiHandler = async (req, res) => {
  if (req.method === "PUT") {
    const { id, newPassword } = req.body;
    if (!id || !newPassword) {
      res.status(400).json({ message: "Missing ID or Password" });
      return;
    }
    let error: string | undefined = undefined,
      message: string = "";
    const uid: string | null = await adminAuth
      .updateUser(id, {
        password: newPassword,
      })
      .then((user) => {
        message = `Successfull: Password of user ${user.displayName}`;
        return user.uid;
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
      data: {uid},
    });
    return;
  }
  res.status(401).json({ message: "Unauthorized" });
};

export default changePassword;