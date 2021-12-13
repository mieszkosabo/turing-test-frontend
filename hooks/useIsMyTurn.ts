import { useState } from "react";

export const useIsMyTurn = (initialValue: boolean) => {
  const [isMyTurn, setIsMyTurn] = useState<boolean>(initialValue);

  return {
    isMyTurn,
    iMoved: () => setIsMyTurn(false),
    theyMoved: () => setIsMyTurn(true),
  };
};
