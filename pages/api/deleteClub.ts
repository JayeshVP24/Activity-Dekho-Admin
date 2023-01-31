import { adminAuth, adminFiredb } from "@/config/firebase-admin";
import { NextApiHandler } from "next";

const deleteClub: NextApiHandler = async (req, res) => {
  if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ message: "Missing ID or Password" });
      return;
    }
    let error: string | undefined = undefined,
      message: string = "";
    await adminAuth
      .deleteUser(id)
      .then(async () => {
        await adminFiredb
          .collection("clubs")
          .doc(id)
          .delete()
          .then(() => {
            message = `Successfull: Club with ID ${id} Deleted`;
          })
          .catch((err) => {
            error = err.message;
          });
      })
      .catch((err) => {
        error = err.message;
      });
    if (error) {
      res.status(500).json({ message: error });
      return;
    }
    res.status(200).json({
      message,
      id,
    });
    return;
  }
  res.status(401).json({ message: "Unauthorized" });
};

export default deleteClub;
