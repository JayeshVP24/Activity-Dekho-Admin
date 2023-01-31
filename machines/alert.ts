import { ActorRefFrom, assign, createMachine } from "xstate";

type AlertEvents =
    | { type: "ALERT", msg: string }

type AlertContext = {
    alertMsg?: string
}

const AlertMachine = 
/** @xstate-layout N4IgpgJg5mDOIC5QEMA2YBOAXAdASwDsA3PWPAI3QGIBBAGQFEAlAFQG0AGAXUVAAcA9mSx4BBXiAAeiAIwBmGTgAcANiUAWOQE4tAJjkBWFXKUAaEAE9ZJnAo5y5urepnOHKgL4fzaTLhJklGBUkrBYyFhgOMgAZpEYABRyHCkAlFS+2DgBFOicPEgggsKi4oXSCAC0Mrq6OOpaBvrqujIA7BwqBgZy5lYIMurqOFodoypORqr2Xt4gBAIQcBKZWBLFeCJiEhXVHfWNza0dXT19iNU4KdddKW1aHA1KXj7oWYQ5QetCm6U7iOozJZEKoDjpGuoVG0HEpdAYXiBVtlSLkwN8SttyogVIparpVA98bpbipzghdOo2jgDJoVMZdG1aiotFDZh4gA */
createMachine({
    predictableActionArguments: true,
    id: "alert",
    schema: {
        events: {} as AlertEvents,
        context: {} as AlertContext
    },
    tsTypes: {} as import("./alert.typegen").Typegen0,

    states: {
        invisible: {
            on: {
                ALERT: {
                    target: "visible",
                    actions: "addAlertMsgToContext"
                }
            }
        },

        visible: {
            after: {
                "3000": {
                    target: "invisible",
                    actions: "clearAlertMsgFromContext"
                }
            }
        }
    },

    initial: "invisible"
}, {
    actions: {
        addAlertMsgToContext: assign({
            alertMsg: (_, event) => event.msg
        }),
        clearAlertMsgFromContext: assign({
            alertMsg: (_) => undefined
        })
    }
})

export default AlertMachine;

export type AlertActor = ActorRefFrom<typeof AlertMachine>;
