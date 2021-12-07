import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { WebsocketContext } from '../providers/WebSocketProvider'
import { ServerMessage } from '../types'

const Home: NextPage = () => {
  const { connection, sendMsg } = useContext(WebsocketContext);
  const router = useRouter();
  useEffect(() => {
    if (!connection) return;
    const sub = connection.subscribe((msg) => {
      const message = msg as ServerMessage;
      if (message.message === 'NEW_GAME') {
        router.push(`/invite/${message.payload.code}`);
      }
    });

    return () => sub.unsubscribe();
  }, [router, connection]);

  return (
    <div>
      Elo
      <button onClick={() => sendMsg({ message: 'INIT', payload: { withHuman: true }})}>Click to start</button>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
