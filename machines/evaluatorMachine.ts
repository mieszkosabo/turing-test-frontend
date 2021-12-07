import { createMachine, assign } from "xstate";
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

type GameEvent = 
    | { type: 'INIT_GAME', code: string }
    | { type: 'GAME_STARTS' }
    | { type: 'GAME_ENDS' }
    | { type: 'ERROR' }
    | { type: 'EXPIRED' }
    | { type: 'MESSAGE_SENT', text: string }
    | { type: 'NEW_MESSAGE', text: string }
    | { type: 'SECOND_PASSED' }

type Message = {
    text: string;
    fromMe: boolean
}

interface EvaluatorMachineContext {
    messages: Message[],
    remainingTime: number; // in seconds
    code: null | string;
}

const GAME_DURATION = 7 * 60; // 7 minutes in seconds

export const evaluatorMachine = createMachine<EvaluatorMachineContext, GameEvent>({
    key: 'evaluatorMachine',
    initial: 'start_screen',
    context: {
        messages: [],
        remainingTime: GAME_DURATION,
        code: null
    },
    states: {
        start_screen: {
            on: {
                INIT_GAME: {
                    target: 'invite_screen',
                    actions: assign({
                        code: (context, event) => event.code
                    })
                }
            }
        },
        invite_screen: {
            on: {
                EXPIRED: {
                    target: 'start_screen',
                    actions: ['expiredAlert']
                },
                GAME_STARTS: 'chat'
            }
        },
        chat: {
            invoke: {
                src: () => interval(1000).pipe(map(() => ({type: 'SECOND_PASSED'})))
            },
            on: {
                ERROR: 'error',
                NEW_MESSAGE: {
                    actions: assign({
                        messages: (context, event) => [...context.messages, { text: event.text, fromMe: false}]
                    })
                },
                GAME_ENDS: {
                    target: 'finish_screen'
                },
                SECOND_PASSED: {
                    actions: assign({
                        remainingTime: (context) => context.remainingTime - 1
                    })
                }
            }
        },
        finish_screen: {},
        error: {}
    }
})