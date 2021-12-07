import { useEffect } from "react"
import { ClientMessage, GameCode } from "../types";

type IUseReconnect = {
    code: GameCode;
    sendMsg: (msg: ClientMessage) => void;
    isEvaluator: boolean;
}

export const useReconnect = ({ code, sendMsg, isEvaluator }: IUseReconnect) => {
    useEffect(() => {
        if (code != null && sendMsg != null) {
            sendMsg({ message: 'RECONNECT', payload: { code, isEvaluator }});
        }
    }, [code, sendMsg, isEvaluator]);
};