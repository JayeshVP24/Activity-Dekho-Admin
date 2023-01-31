import { useActor } from "@xstate/react";
import { useContext, useEffect } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";

const ChangePassword: React.FC = () => {
  const globalService = useContext(GlobalStateContext);
  const [state, send] = useActor(globalService.adminService!);

  return (
    <section>
      <div className="max-h-[40rem] overflow-y-scroll p-2 customScrollbar overflow-x-hidden ">
        <h3 className="text-4xl font-semibold mt-2">Change Password</h3>
        <form
          className="mt-4 flex flex-col gap-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            // const file =e.currentTarget["PHOTO"].files[0] as File
            // console.log(file)
            send({
              type: "CHANGEPASSWORD.SUBMIT",
              data: {
                newPassword: e.currentTarget["PASSWORD"].value,
                id: state.context.currentClub!.id,
              },
            });
          }}
        >
          <span>
            <label htmlFor="PASSWORD" className=" font-medium xl:text-lg ">
              New Password
            </label>

            <input
              required
              name="PASSWORD"
              type="password"
              className="w-full  bg-transparent  py-2 rounded-2xl mt-2 outline-none
          px-4 text-slate-900 placeholder:text-slate-600  font-semibold
          text-lg  transition-all ring-4 focus:ring-orange-400 ring-orange-300
          xl:mt-2 xl:py-2
          "
              placeholder="New Club Password"
            />
          </span>

          {state.context.errorMsg && (
            <span className="bg-red-400 rounded-full px-6 text-sm py-1">
              {state.context.errorMsg}
            </span>
          )}
          <button
            type="submit"
            className="bg-green-400 ring-4 ring-green-200  hover:ring-green-300 w-full mt-4  btnFtrs
        "
          >
            {state.context.loading ? "Loading..." : "🪝 Change Password 🪝"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
