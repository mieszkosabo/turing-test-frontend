import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useReconnect } from '../../hooks/useReconnect'
import { WebsocketContext } from '../../providers/WebSocketProvider'
import { ServerMessage } from '../../types'

const Join: NextPage = () => {
  const { connection, sendMsg } = useContext(WebsocketContext);
  const router = useRouter();
  const code = router.query.code as string;
  useReconnect({ code, sendMsg, isEvaluator: false });
  useEffect(() => {
    const sub = connection!.subscribe((msg) => {
      const message = msg as ServerMessage;
      if (message.message === 'GAME_START') {
          const { withMachine } = message.payload;
          if (withMachine) {
              router.push(`/snake/${code}`);
          } else {
              router.push(`/chat-human/${code}`);
          }
      }
    });

    return () => sub.unsubscribe();
  }, [router, code, connection]);

  return (
    <div>
      JOIN
      <div>{code}</div>
      <button onClick={() => sendMsg({ message: 'JOIN', payload: { code }})}>Click to join</button>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Join), { ssr: false });
