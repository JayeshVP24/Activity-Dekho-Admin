import { useActor } from "@xstate/react";
import Image from "next/image";
import { useContext, useEffect } from "react";
import AvatarGenerator from "./AvatarGenerator";
import { GlobalStateContext } from "./GlobalStateProvider";

const DeleteConfirmation: React.FC = () => {
  const globalService = useContext(GlobalStateContext);
  const [state, send] = useActor(globalService.adminService!);

  //   useEffect(() => {
  //     console.log(state.context.currentClub)
  //   },[state.context.currentClub])
  return (
    <section>
      <div className="max-h-[40rem] overflow-y-scroll p-2 customScrollbar overflow-x-hidden ">
        <h3 className="text-4xl font-semibold mt-2">Delete Club {state.context.currentClub?.name} </h3>
        <p className="text-xl font-semibold mt-2">Are you sure? <br />This will delete all the events of this club </p>
        <span className="flex gap-8 mt-4">
          <button className="bg-green-400 ring-4 ring-green-200  hover:ring-green-300 w-full mt-4  btnFtrs "
          onClick={() => {
            send("DELETECLUB.CLOSE_MODAL")
          }}
          >
            Cancel
          </button>
          <button className="bg-red-400 ring-4 ring-red-200  hover:ring-red-300 w-full mt-4  btnFtrs"
          onClick={() => {
            send({type: "DELETECLUB.SUBMIT"})
          }}
          >
            {state.context.loading ? "Loading..." : "Delete Club"}
          </button>
        </span>
      </div>
    </section>
  );
};

export default DeleteConfirmation;
