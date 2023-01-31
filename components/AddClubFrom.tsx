import { useActor } from "@xstate/react";
import { useContext, useEffect } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";

const AddClubForm: React.FC = () => {
  const globalService = useContext(GlobalStateContext);
  const [state, send] = useActor(globalService.adminService!);


  return (
    <section>
      <div className="max-h-[40rem] overflow-y-scroll p-2 customScrollbar overflow-x-hidden ">
        <h3 className="text-4xl font-semibold mt-2">Add New Event</h3>
        <form
          className="mt-4 flex flex-col gap-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            // const file =e.currentTarget["PHOTO"].files[0] as File
            // console.log(file)
            send({
              type: "NEWCLUB.SUBMIT",
              data: {
                photo: e.currentTarget["PHOTO"].files[0] as File || undefined,
                club: {
                  name: e.currentTarget["NAME"].value,
                  email: e.currentTarget["EMAIL"].value,
                  fullName: e.currentTarget["FULLNAME"].value,
                  password: e.currentTarget["PASSWORD"].value,
                },
              },
            });
          }}
        >
          <span>
            <label htmlFor="FULLNAME" className=" font-medium xl:text-lg ">
              Full Name
            </label>
            <input
              required
              name="FULLNAME"
              className="w-full  bg-transparent  py-2 rounded-2xl mt-2 outline-none
          px-4 text-slate-900 placeholder:text-slate-600  font-semibold
          text-lg  transition-all ring-4 focus:ring-orange-400 ring-orange-300
          xl:mt-2 xl:py-2
          "
              placeholder="Club Full Name"
            />
          </span>
          <span>
            <label htmlFor="NAME" className=" font-medium xl:text-lg ">
              Short Name
            </label>
            <input
              required
              name="NAME"
              className="w-full  bg-transparent  py-2 rounded-2xl mt-2 outline-none
          px-4 text-slate-900 placeholder:text-slate-600  font-semibold
          text-lg  transition-all ring-4 focus:ring-orange-400 ring-orange-300
          xl:mt-2 xl:py-2
          "
              placeholder="Club Short Name"
            />
          </span>
          <span>
            <label htmlFor="EMAIL" className=" font-medium xl:text-lg ">
              Email
            </label>

            <input
              required
              name="EMAIL"
              type="email"
              className="w-full  bg-transparent  py-2 rounded-2xl mt-2 outline-none
          px-4 text-slate-900 placeholder:text-slate-600  font-semibold
          text-lg  transition-all ring-4 focus:ring-orange-400 ring-orange-300
          xl:mt-2 xl:py-2
          "
              placeholder="Club Email"
            />
          </span>
          <span>
            <label htmlFor="PASSWORD" className=" font-medium xl:text-lg ">
              Password
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
              placeholder="Club Password"
            />
          </span>

          <span>
            <label className=" font-medium xl:text-lg " htmlFor="PHOTO">
              Upload Profile Picture
            </label>
            <input
              type="file"
              name="PHOTO"
              className="text-slate-900 file:mr-2 text-sm file:bg-transparent file:border-solid
            file:border-orange-300 file:border-4 file:rounded-2xl file:px-4 file:py-2 mt-1 block "
              accept="image/*"
            />
          </span>
          {state.context.errorMsg && (
            <span className="bg-red-400 rounded-full px-6 text-sm py-1" >{state.context.errorMsg}</span>
          )}
          <button
            type="submit"
            className="bg-green-400 ring-4 ring-green-200  hover:ring-green-300 w-full mt-4  btnFtrs
        "
          >
            { state.context.loading ? "Loading..." : "🚀 Add Event 🚀"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddClubForm;
