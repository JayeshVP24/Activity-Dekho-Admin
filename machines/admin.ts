import { Blob } from "buffer";
import { ActorRefFrom, assign, createMachine } from "xstate";

type AdminContext = {
  stats?: StatsType;
  clubList: ClubType[];
  currentClub?: ClubType;
  errorMsg?: string;
  loading: boolean;
  alertMsg?: string;
  // openNewClubModal: boolean;
  // openEditClubModal: boolean;
};

type AdminEvent =
  | {
      type: "LOAD_DASHBOARD_DATA";
      data: {
        clubList: ClubType[];
        stats: StatsType;
      };
    }
  | {
      type: "ERROR_LOAD_DATA";
      data: string;
    }
  | {
      type: "ADD_CLUB";
    }
  | {
      type: "CLOSE_NEW_CLUB_MODAL";
    }
  | {
      type: "NEWCLUB.SUBMIT";
      data: {
        photo?: File;
        club: NewClubType;
      };
    }
  | {
      type: "EDIT_CLUB";
      data: ClubType;
    }
  | {
      type: "EDITCLUB.SUBMIT";
      data: {
        photo?: File;
        club: ClubType;
      };
    }
  | {
      type: "EDITCLUB.CLOSE_MODAL";
    }
  | {
    type: "CHANGE_PASSWORD",
    data: ClubType
  }
  | {
    type: "CHANGEPASSWORD.CLOSE_MODAL"
  }
  | {
    type: "CHANGEPASSWORD.SUBMIT",
    data: {
      newPassword: string;
      id: string;
    }
  }
  | {
    type: "DELETE_CLUB",
    data: ClubType
  }
  | {
    type: "DELETECLUB.SUBMIT"
  }
  | {
    type: "DELETECLUB.CLOSE_MODAL"
  }
  | {
      type: "error.platform.AddNewClub";
      data: string;
    }
  | {
      type: "error.platform.EditClub";
      data: string;
    }
  | {
      type: "error.platform.ChangePassword";
      data: string;
    }
  | {
      type: "error.platform.DeleteClub";
      data: string;
    }

type AdminServices = {
  AddNewClub: {
    data: {club: ClubType, message: string};
  };
  EditClub: {
    data: {club: ClubType, message: string}
  };
  ChangePassword: {
    data: {success: boolean, message: string};
  };
  DeleteClub: {
    data: { id: string, message: string };
  }
};

const AdminMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMIFsCWA7AdBiANmAMQAyA8gIIAiA+tZQMoASAQlQEp0MAqlA2gAYAuolAAHAPawMAFwySsYkAA9EAFgBsAVhzqA7Ou2HB6wQEYATAGYtAGhABPROe2a9ggBxnrt8zss3AF8gh1RMXHwiYgBRDg5yDloKGnpKPiFRJBApGXlFZTUES01BPXVrfVtBS30ATkFjB2cEOvUcUobrc3VLT0tAz2sQsPRsHGoMWHECZEcAAmpkWAALACNJZAAnCEXkWWRiGjoAYVIAVVZM5Vy5BSVsorNzHD9tWrrzQQbNc2bEEr6V6eQS2fS1ayeIb6EYgcLjSbTWYLJarDbbXZLA6xagASR4tDOl2u2Vu+QeoCK4Je+m830hNU85l8-wQvncbnUdX04M8tO06k8sPhuERMzmezRmx2e2xJ2YlAAcgBxGK0AAKTEYAHVEtQSRJpHcCo9EJpPLp6uozEz9ObDNpWfoajh9MYoY1BTz3sKxrhFWAAO7zE4EACua2IZ3IjDVipi2sJF1YtAAsuQGKQDTkjeTCohunUcOZzG1TMymVDrKzrHVrDgQdZNIZfG4enVfREcAHg6GIxMpuLHNgoPMAGKSLZoYjx7VE1g4RiXVP47Nk+75hAAWgFOG+Bhsgh0mk+AprUNezdL2j5-n6-k74x7IfDaxwlAgEBHL4jxAgijAPAsAAN0kABrQCPwgHs+zWNdcw3U02W0Mo6k0Swai8Zs0L6R0nEQAUXnQ2lbEGawj3UR9-SDH83yg79YOIMAti2SccHFWQADNJzQd9Pxg194LyRDKUQLc+iBAwm0MLlKjqbR5NZCoyj5b4vmkst5KonAYi-WRaJxfF5xwaNYzTDNKCzEQbgQk1RIQcEizcCwtDtWoSmrfDWiLWsKh0Jt3O0cwhVCOE-R0vTaIHJE5m-Ccp0MnhjKXVgVx4ITjQpVREDqC8T0FTR0MsOtNGtJT-BwSwrFMAwql6axtG03S5Ci5r5CwUdGP-LBAOwUCIIiuRYIyvMkJBIFXB0a1XHkus8JabQbz0Wt+l6Iqb3MJrItgwb2s618mJYtiOO4qdduG6zSVsrKihLbli1K6w+i8Vx9D+LzISLC0jAtYK1OvbSThWZAOrAeZ1WWWBA0nCAowVFUYk1RgdT1EyKDM9NMxGkTsoQNwvpqBTyIqTxcssVk6iqhs0NyhpKdqELRi7IGQZgcHIehnZoqHOKeLhpVVSRlGuEXZdV0uw1hLs3HZpwblnQGPlOTQin5OLEp3kMeptFIwHgdB9nYChmGTP1qBvwho3Odh7repA8DAJZ0HLeNnZselooTyBcFaVKt1uSZTyWhLIwG1KEPPkptpNtCkVTdZsGXet+OOotjmYcO1itnY2YuJ4lOYCTmH3Zulwm3cTwdDaOsbGdIOXH8doA5BYj72ZbSxWRSV1mlTF9kOagYlIGIeDVecS83IL2l+XwhlvYwSidUEG18H5mW6SvKNj8LqDAIhZDBnbO9ijrxz5wfh9H5KxfSiWcyl0uEHMO09zrt6zGbXpBQp9QXmfhqyIlh5JYDue8wAHyij1YMsADgQPMH+ACQF+qAV3vvMAF0siS0ypuIwZRmxzyPDYQq7xWTqU8CvHkPJf79FBDHJmCIwEQJ2lA+YMD9hg3gcxLOOd9inV4qg8B6DBJ33XB7DQ7hn5DHQv0WsOtuikNBOQ6ElDqEYW6CEUKWBJAQDgMoEUNkH6bi3JCesUlP6yW1opLyW5mTFi5NyNCXwbzAMZmFLsUQwAGOwUhIK9ZJFaEaI3CodQnTtAaoITC9RcoNWGNvLsx8UTLB7hiWUyAvGjXssYIsJE3ovQiRE+ueNK6vyrHdAwkcO6Di7jEI6Wx0k4yKBaSqbg7S0PIl4WorIQQNkFJImevk2jaWfLBepYjtytj0FUcxdZLHzQBJCS8b0ZLoQiRrIZNEj5VJPqOeKaBRmPy3EyB6th0JBW8IEGsgQw5LPwdaTQsT6HUV7K+PiX5T4jKuoYpCO5yGFV6ApE8M8SysgFLobkpgFK+O8CeLaLUPlYIyTLWx6FfiuEWsVa05MvIlHcFVDCgRAgooUrC-SmyYrDlPrs-Zm5HEdBKCWRa7w2i9BrDrV01VajunBOhLejzdqtT0gxV81KkJON0FYQqkJXA9C1iC0owJrTkWbIVYKdC3HjCdmzIuOwRX2U+C8eWNQJLK00F04KctzQFIBXUEqesE6G1dhAbmyJeZTl1bjL4fQGwDDcJYAwpMqgUyPHobCJEtA2GCHEjVZtE7py5pqtOVsYbutugU4sM1agVHBLWU1XkQ5lEVjQto3hbCNSjaKRhh9hWfO8fZEs5DJEBRkfJXw70Wj8mLLeWk4IAlulAWgqKCTXV7JrYi26Nqek60MBhFCnKulvQ6LefolMvA8n7YIyBNE2FwJTS4QqxYSLSJsC2wpXweh7j5HaKEtIagPnLTgFh26OG7u3FVS0BUIl+38KCfQFNageB0C4hSpMOwaKAA */
  
/** @xstate-layout N4IgpgJg5mDOIC5QEMIFsCWA7AdBiANmAMQAyA8gIIAiA+tZQMoASAQlQEp0MAqlA2gAYAuolAAHAPawMAFwySsYkAA9EAFgBsAVhzqA7Ou2HB6wQEYATAGYtAGhABPROe2a9ggBxnrt8zss3AF8gh1RMXHwiYgBRDg5yDloKGnpKPiFRJBApGXlFZTUES01BPXVrfVtBS30ATkFjB2cEOvUcUobrc3VLT0tAz2sQsPRsHGoMWHECZEcAAmpkWAALACNJZAAnCEXkWWRiGjoAYVIAVVZM5Vy5BSVsorNzHD9tWrrzQQbNc2bEEr6V6eQS2fS1ayeIb6EYgcLjSbTWYLJarDbbXZLA6xagASR4tDOl2u2Vu+QeoCK4Je+m830hNU85l8-wQvncbnUdX04M8tO06k8sPhuERMzmezRmx2e2xJ2YlAAcgBxGK0AAKTEYAHVEtQSRJpHcCo9EJpPLp6uozEz9ObDNpWfoajh9MYoY1BTz3sKxqKpuKUct1tLMftDtQYqQYjw1USriIbkbyYVENoeh1mZDIfpXODNE7QTghtYflnzJ5NOpfREcIqwAB3eYnAgAVzWxDO5EYasVMW1hIurFoAFlyAxSAacsn7qm2eY6jhzAuzOpmUyodZWaXrMXQZpDL43D06jXxvWmy32xMA8jsFB5gAxSRbNDEPva+M4RiXEf4qdkrOpoIAAtAKODfAYNiCDomifAK25Qq8B4LtofL+P0-hnrgF7Nm2aw4JQEAQPeeHtsQECKGAeBYAAbpIADW1FERAF5XmsAEzialKINY2hlHUmiWDUXgHoJfSOk4aZrh0tRDL0aHWDB1ahHCfp1o2ZEESxpHscQYBbFsL44OKsgAGYvmghHEWx+GcXkQE8aBfRAgY1gHtadSVHU2g+ayFRlHy3xfO5VrfNo2E4DEJGyFpOL4l+XY9qO46UJOiaklxFKqIg4KLm4FhaHatQlFuUmtIupYVDo7klemQqqSKUUxVpN5InMpHPq+8U8F+P6sH+PD2ca2VFHUSFwYKmhCZYXlVuo-n+DglhWKYBhVL0fGRdFcitTt8hYA+emUVg1HYPRTHNXI7HDSmwEgkCrg6Narg+V5kktNoaF6KW-S9DNaHmNtLXsVdB1Hfh+mGcZpkWa+YM3RlhoOdxOUIMu3JLlW1h9F4eZ-OVkKLhaRgWhWwWoZFJwrMgh1gPM6rLLADYvhAnYKiqMSaowOp6jgSVqmOE63Y5aNuMTNS+UpFSeONlisnUK3FoJ40NIrclUzTdMM0zLM7G1gadZZ7NKqq3O81w36-v+SPTijo2IG9ODcs6Ax8pygkKz5S4lO8hj1NotiWJrtMwDrsDM6z-Na1ApGMxHetsydZ10Yx1HU6HYDx5HOwi6jRRwUC4K0lWbrckyZUtMuRjFqU1efIrbRA416kZ9r2eJ9Hodx7rrNQ0ZWwmbM5mWV3dMd6zecO+j7nuJWvlcjjlSgqyy5Vs7tIgkJtIrcykXUGARCyPToNineh1PsbkbRrGfXW0NtuAfnLjMj91olkTeaeArXLOwYvzMkDsJN0+9D5gGPq1A+R9dKQ2TjRC61EoHgLAIjLIyMRpzkFC8WWbQDwCj6B8D6LgvBlB0D0Ka-EjARRbrWJBEDT5gPBnFAyA8h77DhlZOhKC7KPyynOXwi5po+QtKCV2flypN1dL8Nc-hKhDB8qAo+J9IbXxjDERKFBkpCzSlPOcC5dzuSsMYA8ghwRNHKmYjo-QLS-T6AYahqksCSAgHAZQIokz2znCBbMegqgeUXgHcRLQQKvxPHURWhhVxQgUTQ8YUQwAeIwcBdMu5zC0i0I0fw1pSxOnaHxQQIl6jjT4sMWJ-p2pBilBiWUyBEl3ScsYRctJKhfCZAUgplc0yVggpvboK56gLn3reCUMRoZbDqaLIoFplpuDtKCZkBT+j6FZCCYsWCS5ZjaG0SKuF2ITOfqBI8vjQqeW8r5IhxRITIVzCXSwa4ok7M0qfYZjgjavn2dPECTIsa2CEvVBS25Ai1xuQebwWhSmjFrLs-C1kSIXz2ZlTxwEwKeA6FWQIKtfh9NZAKXQ3JTDnPXFoU8ZSwZaQ+XOT4u4hIAK+u8NovRWQlHcCtYSgRjCBGZCUYGu1nkVLeWgClwFBIvBpcuOls1rTy0JoHV0q1ajunzHcnlsVQb7Rge2IVTkvhfR9tNSErgej+xxaUYE2SYJ2l+EyEO7de47C1WjT4LwXY1Bch7As5UNzOzElWEENh0wqUheMNuYcJ76zPh1C+XVBWIqSdqxkxYBhuDubSbknTWgwT0GJZpWh-WaBtaGu1EAx6xwvmGiADqihfCLOKiJFRwSlg9VXHoZQ3b9Egt4Ww1Cg2ikYcozVsb6lox0G-QUvhP7uhWTW1NMEg41Gbj2iYfbIEvIFZWlwvwfrjU7SVN2yzPUNA6Km5clZPhmBhKSrhkDGEarWOumeqKl4ligiK7+5UvgjuMdk9yESvIhBCEAA */
createMachine(
    {
      predictableActionArguments: true,
      id: "admin",
      schema: {
        events: {} as AdminEvent,
        context: {} as AdminContext,
        services: {} as AdminServices,
      },

      tsTypes: {} as import("./admin.typegen").Typegen0,
      context: {
        // openNewClubModal: false,
        // openEditClubModal: false,
        loading: false,
        clubList: [],
        // errorMsg: "error"
      },
      states: {
        idle: {
          on: {
            LOAD_DASHBOARD_DATA: {
              target: "Display Dashboard Data",
              actions: "addDashboardDataToContext",
            },
            ERROR_LOAD_DATA: {
              target: "Display Error",
              actions: "addErrorMsgToContext",
            },
          },
        },

        "Display Dashboard Data": {
          on: {
            ADD_CLUB: {
              target: "New Club",
              // actions: "openNewClubModal",
            },

            EDIT_CLUB: {
              target: "Edit Club",
              actions: ["setCurrentClub",
              //  "openEditClubModal"
              ],
            },

            CHANGE_PASSWORD: {
              target: "Change Password",
              actions: "setCurrentClub"
            },

            DELETE_CLUB: {
              target: "Delete Club",
              actions: "setCurrentClub"
            }
          },

          exit: "unsetAlertMsg",
          entry: "unsetCurrentClub"
        },

        "Display Error": {},

        "New Club": {
          on: {
            CLOSE_NEW_CLUB_MODAL: {
              target: "Display Dashboard Data",
              actions: [
                // "closeNewClubModal",
                 "clearErrorMsgFromContext"],
            },
          },

          states: {
            "Displaying Form": {
              on: {
                "NEWCLUB.SUBMIT": {
                  target: "Adding Club",
                  actions: ["setLoadingTrue", "clearErrorMsgFromContext"],
                },
              },
            },

            "Adding Club": {
              invoke: {
                src: "AddNewClub",
                id: "AddNewClub",
                onDone: {
                  target: "#admin.Display Dashboard Data",
                  actions: [//  "closeNewClubModal"
                  "addNewClubToContext", "setAlertMsg"],
                },
                onError: {
                  target: "Displaying Form",
                  actions: "addErrorMsgToContext",
                },
              },

              exit: "setLoadingFalse",
            },
          },

          initial: "Displaying Form",
        },

        "Edit Club": {
          states: {
            "Displaying Form": {
              on: {
                "EDITCLUB.SUBMIT": {
                  target: "Editing Club",
                  actions: ["setLoadingTrue", "clearErrorMsgFromContext"]
                }
              }
            },

            "Editing Club": {
              invoke: {
                src: "EditClub",
                id: "EditClub",
                onDone: {
                  target: "#admin.Display Dashboard Data",
                  actions: [//  "closeEditClubModal"
                  "editClubListInContext", "setAlertMsg"]
                },
                onError: {
                  target: "Displaying Form",
                  actions: "addErrorMsgToContext"
                }
              },

              exit: "setLoadingFalse"
            }
          },

          initial: "Displaying Form",

          on: {
            "EDITCLUB.CLOSE_MODAL": {
              target: "Display Dashboard Data",
              actions: [// "closeEditClubModal",
              "clearErrorMsgFromContext"],
            },
          },
        },

        "Change Password": {
          states: {
            "Displaying Form": {
              on: {
                "CHANGEPASSWORD.SUBMIT": {
                  target: "Changing Password",
                  actions: ["setLoadingTrue", "clearErrorMsgFromContext"]
                }
              }
            },

            "Changing Password": {
              invoke: {
                src: "ChangePassword",
                id: "ChangePassword",
                onDone: {
                  target: "#admin.Display Dashboard Data",
                  actions: "setAlertMsg"
                },
                onError: {
                  target: "Displaying Form",
                  actions: "addErrorMsgToContext"
                }
              },

              exit: "setLoadingFalse"
            }
          },

          initial: "Displaying Form",

          on: {
            "CHANGEPASSWORD.CLOSE_MODAL": {
              target: "Display Dashboard Data",
              actions: ["clearErrorMsgFromContext"]
            }
          }
        },

        "Delete Club": {
          states: {
            "Displaying Form": {
              on: {
                "DELETECLUB.SUBMIT": {
                  target: "Deleting Club",
                  actions: "setLoadingTrue"
                }
              }
            },

            "Deleting Club": {
              invoke: {
                src: "DeleteClub",
                id: "DeleteClub",
                onDone: {
                  target: "#admin.Display Dashboard Data",
                  actions: ["deleteClubInContext", "setAlertMsg"]
                },
                onError: {
                  target: "Displaying Form",
                  actions: "addErrorMsgToContext"
                }
              },

              exit: "setLoadingFalse"
            }
          },

          initial: "Displaying Form",

          on: {
            "DELETECLUB.CLOSE_MODAL": {
              target: "Display Dashboard Data",
              actions: "clearErrorMsgFromContext"
            }
          }
        }
      },

      initial: "idle",
    },
    {
      actions: {
        // addErrorMsgToContext: assign({
        //   errorMsg: (_, event) => event.error,
        // }),
        addErrorMsgToContext: (context, event) => {
          console.log(event);
          context.errorMsg = event.data;
        },
        clearErrorMsgFromContext: assign({
          errorMsg: (_) => undefined,
        }),
        addDashboardDataToContext: assign({
          stats: (_, event) => event.data.stats,
          clubList: (_, event) => event.data.clubList,
        }),
        // openNewClubModal: assign({
        //   openNewClubModal: (_) => true,
        // }),
        // closeNewClubModal: assign({
        //   openNewClubModal: (_) => false,
        // }),
        setLoadingTrue: assign({
          loading: (_) => true,
        }),
        setLoadingFalse: assign({
          loading: (_) => false,
        }),
        addNewClubToContext: (context, event) => {
          context.clubList.push(event.data.club);
        },
        editClubListInContext: (context, event) => {
          console.log("event in modify: ", event.data )
          const index = context.clubList.findIndex(
            (club) => club.id === event.data.club.id
          );
          context.clubList[index] = event.data.club;
        },
        deleteClubInContext: (context, event) => {
          context.clubList = context.clubList.filter(
            (club) => club.id !== event.data.id
          );
        },
        // openEditClubModal: assign({
        //   openEditClubModal: (_) => true,
        // }),
        // closeEditClubModal: assign({
        //   openEditClubModal: (_) => false,
        // }),
        setCurrentClub: assign({
          currentClub: (_, event) => event.data,
        }),
        unsetCurrentClub: assign({
          currentClub: (_) => undefined,
        }),
        setAlertMsg: assign({
          alertMsg: (_, event) => event.data.message,
        }),
        unsetAlertMsg: assign({
          alertMsg: (_) => undefined,
        })
      },
    }
  );

export default AdminMachine;

export type AdminActor = ActorRefFrom<typeof AdminMachine>;
