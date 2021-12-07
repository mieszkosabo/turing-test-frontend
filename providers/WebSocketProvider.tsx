import React, { createContext, useEffect } from 'react';
import { createConnection } from '../hooks/useEvaluatorState';
import { Subject } from 'rxjs';

const connection = createConnection();

const ProxySubject = new Subject();
export const WebsocketContext = createContext({
    connection: ProxySubject,
    sendMsg: (msg: any) => {}
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode}) => {
  useEffect(() => {
      connection?.subscribe((msg) => {
          ProxySubject.next(msg);
      })
  }, []);
  return (
    <WebsocketContext.Provider value={{ connection: ProxySubject, sendMsg: (msg) => connection?.next(msg) }}>
      {children}
    </WebsocketContext.Provider>
  );
};