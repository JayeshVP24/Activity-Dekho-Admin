import { auth } from "@/config/firebase";
import { actions, ActorRefFrom, assign, createMachine } from "xstate";

 interface AuthContext {
    loggedIn: boolean,
    errorMsg?: string
}

type AuthEvent =
    | {type: "LOGIN", email: string, password: string}
    | {type: "LOGOUT"}
    | {type: "error.platform.verifyadmin", data: string}
    | {type: "VERIFY_PERSISTANCE"}

type AuthServices = {
    verifyAdmin: {
        data: void | string
    },
    verifyPersistance: {
        data: void | string
    }
}


const AuthMachine = 
/** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgYgDIHkBxfAVQBUBtABgF1FQAHAe1gEt1WmA7ekAD0QBaAIwAOAKwA6AGwAmAJyiFVAOwr5KsQGYANCACeQ4fMnC54+ectVRwlbIC+DvWizYAagFEASgEkAYgCaAPoACj4Ayr4RZACCAHIAwp7UdEggzGwc3LwCCIIKKpJUihZaWvIK4lTCeoYIwmaSKlqitgAsFeIqStLCTi4YmJIANkxQMBD4GHhEvvGpvJnsnDzpedJFCloq4hby8u2yttJ1iGbCxVTXYhYlFY7OIK7DAG5gAE6sAGb6rFxQWIQAC2-2wEG4YEk-1eTAA1lD3l9fsgQf9Fulltk1qA8iJupJZLIVFRpNItNJ2hZtmcEJ0TN0zJSqEdxMJZOIBs8hpIkT8-gCgaCuNhPh8mB9JAwRsh0N8JcDeZ9+ajhRjGCwVjl1ohiVRJFpiaISeJpOJ2rsqbTZKoZNc5PYtOJZBVRFyXkrkQKoKFPmxYOhkFwAMZgcGQ6FcWEIz38hh+1gBoOh9UZTXY3JCHayUyiTqyI4klryWoGRBaGyEzbSFntGztMRup4evm-f4+hNJkNhsUSqUyuUK2O-eMff2B7uprGrTP5dmXSrm9qiUmyaQHYzW2011didrk3YtJxPLhMCBwXgvJbpmc6-LteRaA3CPYtC3lTSWWkiUkyOR9FpqyJURpHdHkxgmSBpnQa8slvXFEAfGRREsI4SkLUQnXEWlykkFcORfHpyXNF1OWbHlW29IV-lgrUcX4RDLmNG1qxXB8nRA2kGy2FDxGNW4CzIwYsFGcZJl8ejp21BC5xdUwS00MQzTUdojhwisDXJKg13sA4OQ5MCRMo9tfTHRMJ1DWiMzvQRVKkLQX26LR3x2YxTjLBo81zY0djZaoS2OY8HCAA */
createMachine({
    predictableActionArguments: true,
    id: "auth",

    schema: {
        events: {} as AuthEvent,
        context: {} as AuthContext,
        services: {} as AuthServices
    },

    context: {
        errorMsg: undefined,
        loggedIn: false,
    },

    tsTypes: {} as import("./auth.typegen").Typegen0,

    states: {
        loggedOut: {
            on: {
                LOGIN: "verifyingAdmin"
            },

            entry: "setLoggedInFalse"
        },

        verifyingAdmin: {
            invoke: {
                src: "verifyAdmin",
                id: "verifyadmin",
                onDone: {
                    target: "loggedIn",
                    actions: "setLoggedInTrue"
                },
                onError: {
                    target: "loggedOut",
                    actions: "addErrorMsgToContext"
                }
            }
        },

        loggedIn: {},
        verifyingPersistance: {
            invoke: {
                src: "verifyPersistance",
                id: "verifypersistance",
                onDone: {
                    target: "loggedIn",
                    actions: "setLoggedInTrue"
                },
                onError: {
                    target: "loggedOut",
                }
            }
        }
    },

    initial: "verifyingPersistance",

    on: {
        LOGOUT: {
            target: ".loggedOut",
            actions: "logout"
        },
        VERIFY_PERSISTANCE: ".verifyingPersistance"
    }
}, {
    actions: {
        addErrorMsgToContext:  assign({
            errorMsg: (_, event) => event.data
        }),
        setLoggedInTrue: assign({
            loggedIn: true
        }),
        setLoggedInFalse: assign({
            loggedIn: false
        }),
        logout: () => {
            auth.signOut()
        }
    }
})

export default AuthMachine

export type AuthActor = ActorRefFrom<typeof AuthMachine>