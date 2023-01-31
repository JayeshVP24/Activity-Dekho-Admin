
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.AddNewClub": { type: "done.invoke.AddNewClub"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.ChangePassword": { type: "done.invoke.ChangePassword"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.DeleteClub": { type: "done.invoke.DeleteClub"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.EditClub": { type: "done.invoke.EditClub"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.AddNewClub": { type: "error.platform.AddNewClub"; data: unknown };
"error.platform.ChangePassword": { type: "error.platform.ChangePassword"; data: unknown };
"error.platform.DeleteClub": { type: "error.platform.DeleteClub"; data: unknown };
"error.platform.EditClub": { type: "error.platform.EditClub"; data: unknown };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "AddNewClub": "done.invoke.AddNewClub";
"ChangePassword": "done.invoke.ChangePassword";
"DeleteClub": "done.invoke.DeleteClub";
"EditClub": "done.invoke.EditClub";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: "AddNewClub" | "ChangePassword" | "DeleteClub" | "EditClub";
        };
        eventsCausingActions: {
          "addDashboardDataToContext": "LOAD_DASHBOARD_DATA";
"addErrorMsgToContext": "ERROR_LOAD_DATA" | "error.platform.AddNewClub" | "error.platform.ChangePassword" | "error.platform.DeleteClub" | "error.platform.EditClub";
"addNewClubToContext": "done.invoke.AddNewClub";
"clearErrorMsgFromContext": "CHANGEPASSWORD.CLOSE_MODAL" | "CHANGEPASSWORD.SUBMIT" | "CLOSE_NEW_CLUB_MODAL" | "DELETECLUB.CLOSE_MODAL" | "EDITCLUB.CLOSE_MODAL" | "EDITCLUB.SUBMIT" | "NEWCLUB.SUBMIT";
"deleteClubInContext": "done.invoke.DeleteClub";
"editClubListInContext": "done.invoke.EditClub";
"setAlertMsg": "done.invoke.AddNewClub" | "done.invoke.ChangePassword" | "done.invoke.DeleteClub" | "done.invoke.EditClub";
"setCurrentClub": "CHANGE_PASSWORD" | "DELETE_CLUB" | "EDIT_CLUB";
"setLoadingFalse": "CHANGEPASSWORD.CLOSE_MODAL" | "CLOSE_NEW_CLUB_MODAL" | "DELETECLUB.CLOSE_MODAL" | "EDITCLUB.CLOSE_MODAL" | "done.invoke.AddNewClub" | "done.invoke.ChangePassword" | "done.invoke.DeleteClub" | "done.invoke.EditClub" | "error.platform.AddNewClub" | "error.platform.ChangePassword" | "error.platform.DeleteClub" | "error.platform.EditClub" | "xstate.stop";
"setLoadingTrue": "CHANGEPASSWORD.SUBMIT" | "DELETECLUB.SUBMIT" | "EDITCLUB.SUBMIT" | "NEWCLUB.SUBMIT";
"unsetAlertMsg": "ADD_CLUB" | "CHANGE_PASSWORD" | "DELETE_CLUB" | "EDIT_CLUB" | "xstate.stop";
"unsetCurrentClub": "CHANGEPASSWORD.CLOSE_MODAL" | "CLOSE_NEW_CLUB_MODAL" | "DELETECLUB.CLOSE_MODAL" | "EDITCLUB.CLOSE_MODAL" | "LOAD_DASHBOARD_DATA" | "done.invoke.AddNewClub" | "done.invoke.ChangePassword" | "done.invoke.DeleteClub" | "done.invoke.EditClub";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "AddNewClub": "NEWCLUB.SUBMIT";
"ChangePassword": "CHANGEPASSWORD.SUBMIT";
"DeleteClub": "DELETECLUB.SUBMIT";
"EditClub": "EDITCLUB.SUBMIT";
        };
        matchesStates: "Change Password" | "Change Password.Changing Password" | "Change Password.Displaying Form" | "Delete Club" | "Delete Club.Deleting Club" | "Delete Club.Displaying Form" | "Display Dashboard Data" | "Display Error" | "Edit Club" | "Edit Club.Displaying Form" | "Edit Club.Editing Club" | "New Club" | "New Club.Adding Club" | "New Club.Displaying Form" | "idle" | { "Change Password"?: "Changing Password" | "Displaying Form";
"Delete Club"?: "Deleting Club" | "Displaying Form";
"Edit Club"?: "Displaying Form" | "Editing Club";
"New Club"?: "Adding Club" | "Displaying Form"; };
        tags: never;
      }
  