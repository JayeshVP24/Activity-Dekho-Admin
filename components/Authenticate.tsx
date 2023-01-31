import { useActor } from "@xstate/react";
import { useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";

const Authenticate = () => {
  const globalService = useContext(GlobalStateContext);

  const [state, send] = useActor(globalService.authService!);
  return (
    <section className="mx-10">
      <div className="max-w-xl mx-auto bg-green-300 p-8 lg:p-12 rounded-2xl" >
        <h3 className="text-3xl font-semibold  mb-4 ">Login 🔐 </h3>

        <form
          className="flex flex-col gap-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            send({
              type: "LOGIN",
              email: e.currentTarget["EMAIL"].value,
              password: e.currentTarget["PASSWORD"].value,
            });
          }}
        >
          <span>
            <label htmlFor="EMAIL" className=" font-medium xl:text-lg ">
              Email
            </label>
            <input
              type="email"
              name="EMAIL"
              required
              placeholder="Enter Email"
              className="w-full border-2 border-orange-400 bg-transparent  py-2 rounded-2xl mt-2 outline-none
                  pl-4 text-slate-900 placeholder:text-slate-600  font-semibold
                  text-lg  transition-all focus:ring-4 focus:ring-orange-200 
                  xl:mt-4 xl:py-2"
            />
          </span>
          <span>
            <label htmlFor="PASSWORD" className=" font-medium xl:text-lg ">
              Password
            </label>
            <input
              type="password"
              name="PASSWORD"
              required
              placeholder="Enter Password"
              className="w-full border-2 border-orange-400 bg-transparent  py-2 rounded-2xl mt-2 outline-none
                  pl-4 text-slate-900 placeholder:text-slate-600  font-semibold
                  text-lg  transition-all focus:ring-4 focus:ring-orange-200 
                  xl:mt-4 xl:py-2"
            />
          </span>
          <button
            type="submit"
            className="bg-blue-400 ring-4 ring-blue-200  hover:ring-blue-300 w-full mt-6 btnFtrs
                  "
          >
            {state.matches("verifyingAdmin") ? (
              <svg className="loader" viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
            ) : (
              "🚀 Login 🚀"
            )}
          </button>
          {state.context.errorMsg && (
            <span className="">{state.context.errorMsg}</span>
          )}
        </form>
      </div>
    </section>
  );
};

export default Authenticate;
