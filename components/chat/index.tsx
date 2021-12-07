import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useReconnect } from '../../hooks/useReconnect'
import { WebsocketContext } from '../../providers/WebSocketProvider'
import { GameMessage, ServerMessage } from '../../types'

export type IChat = {
    isEvaluator: boolean;
}

export const Chat = ({ isEvaluator }: IChat) => {
  const { connection, sendMsg } = useContext(WebsocketContext);
  const router = useRouter();
  const code = router.query.code as string;
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  useReconnect({ code, sendMsg, isEvaluator });
  useEffect(() => {
    const sub = connection!.subscribe((msg) => {
        console.log(msg);
      const message = msg as ServerMessage;
      if (message.message === 'NEW_MESSAGE') {
        setMessages((msgs) => [...msgs, { text: message.payload.text, fromEvaluator: !isEvaluator}])
      } else if (message.message === 'MESSAGE_HISTORY') {
          setMessages(message.payload.messages);
      } else if (message.message === 'GAME_END') {
          const { wasMachine } = message.payload;
          router.push(`/finish?wasMachine=${wasMachine}&isEvaluator=${isEvaluator}`);
      }

    });

    return () => sub.unsubscribe();
  }, [router, code, connection, isEvaluator]);

  const onSend = (text: string) => {
      const msg = { message: 'MESSAGE', payload: { code, fromEvaluator: isEvaluator, text }};
      setMessages((msgs) => [...msgs, { text, fromEvaluator: isEvaluator }]);
      sendMsg(msg);
  }

  return (
    <div>
      Chat
      <div style={{ display: 'flex', flexDirection: 'column'}}>
          { messages.map(({ text, fromEvaluator }, idx) => (
              <div key={idx}>{text}</div>
          ))}
      </div>
      <form onSubmit={(e) => {
          e.preventDefault();
          onSend(inputVal);
          setInputVal('');
      }}>
            <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
            <button type="submit">Send Msg</button>
        </form>
    </div>
  );
}

