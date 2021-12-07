import React, { createContext, useEffect } from 'react';
import { Subject } from 'rxjs';
import { createConnection } from '../utils/createConnection';

const ws = createConnection();

const ProxySubject = new Subject();
export const WebsocketContext = createContext({
    connection: ProxySubject,
    sendMsg: (msg: any) => {}
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode}) => {
  useEffect(() => {
      const sub = ws!.subscribe((msg) => {
          ProxySubject.next(msg);
      });

      return () => {
        sub.unsubscribe();
      }
  }, []);

  return (
    <WebsocketContext.Provider value={{ connection: ProxySubject, sendMsg: (msg) => ws?.next(msg) }}>
      {children}
    </WebsocketContext.Provider>
  );
};