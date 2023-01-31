import { adminAuth } from "@/config/firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

const setAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Process a POST request
    const { email, key, admin } = req.body;
    console.log({ email, key, admin });
    if (!email || !key || admin === undefined) {
      res.status(400).json({ message: "Missing email, key, or admin" });
      return;
    }
    console.log(req.body);
    console.log(process.env.ADMIN_KEY);
    if (key !== process.env.ADMIN_KEY) {
      res.status(401).json({ message: "Invalid key" });
      return;
    }
    let error: string | undefined = undefined,
      message: string = "";
    await adminAuth
      .getUserByEmail(email)
      .then((user) => {
        adminAuth
          .setCustomUserClaims(user.uid, { admin })
          .then(() => {
            message = "User " + user.email + " is set to admin: " + admin;
            console.log(message);
            res.status(200).json({ message });
          })
          .catch((errorMsg) => {
            console.log("user unable to make admin");
            error = errorMsg.message;
          });
      })
      .catch((errorMsg) => {
        console.log("user not found");
        error = errorMsg.message;
      });
    if (error) {
      res.status(500).json({ err: error });
      return;
    }
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
};

export default setAdmin;
