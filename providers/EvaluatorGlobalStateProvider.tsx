import React, { createContext } from 'react';
import { useInterpret } from '@xstate/react';
import { evaluatorMachine } from '../machines/evaluatorMachine';

export const GlobalStateContext = createContext({
    evaluatorService: {}
});

export const GlobalStateProvider = ({ children }: { children: React.ReactNode}) => {
  const evaluatorService = useInterpret(evaluatorMachine);

  return (
    <GlobalStateContext.Provider value={{ evaluatorService }}>
      {children}
    </GlobalStateContext.Provider>
  );
};