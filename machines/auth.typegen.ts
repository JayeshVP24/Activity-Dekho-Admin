
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.verifyadmin": { type: "done.invoke.verifyadmin"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.verifypersistance": { type: "done.invoke.verifypersistance"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.verifyadmin": { type: "error.platform.verifyadmin"; data: unknown };
"error.platform.verifypersistance": { type: "error.platform.verifypersistance"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "verifyAdmin": "done.invoke.verifyadmin";
"verifyPersistance": "done.invoke.verifypersistance";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: "verifyAdmin" | "verifyPersistance";
        };
        eventsCausingActions: {
          "addErrorMsgToContext": "error.platform.verifyadmin";
"logout": "LOGOUT";
"setLoggedInFalse": "LOGOUT" | "error.platform.verifyadmin" | "error.platform.verifypersistance";
"setLoggedInTrue": "done.invoke.verifyadmin" | "done.invoke.verifypersistance";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "verifyAdmin": "LOGIN";
"verifyPersistance": "VERIFY_PERSISTANCE" | "xstate.init";
        };
        matchesStates: "loggedIn" | "loggedOut" | "verifyingAdmin" | "verifyingPersistance";
        tags: never;
      }
  