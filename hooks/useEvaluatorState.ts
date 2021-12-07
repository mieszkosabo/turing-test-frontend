import { useEffect } from "react";
import { webSocket } from 'rxjs/webSocket';


// move to consts
export const PORT = 42420;

export const createConnection = () => (
    typeof window !== 'undefined' 
    ? webSocket(`ws://localhost:${PORT}`)
    : null
);

export const useConnection = ({ send }) => {
    const ws = webSocket(`ws://localhost:${PORT}`);
    const sendToWs = (msg: any) => ws.next(msg);
    useEffect(() => {
        const sub = ws.subscribe((msg) => {
           switch (msg.message) {
               case 'NEW_GAME': {
                    send({ type: 'INIT_GAME', code: msg.payload.code });
                    break;
               }
           
               default:
                   break;
           } 
        });

        return () => {
            sub.unsubscribe();
        }
    }, [send, ws]);

    return { sendToWs };
}