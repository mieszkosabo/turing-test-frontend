
export type GameMessage = {
  text: string;
  fromEvaluator: boolean;
};

export type GameCode = string;

export type ServerMessage =
  | {
      message: "NEW_GAME";
      payload: {
        code: GameCode;
      };
    }
  | {
      message: "GAME_START";
      payload: {
        withMachine?: boolean;
      };
    }
  | {
      message: "NEW_MESSAGE";
      payload: {
        text: string;
      };
    }
  | {
      message: "GAME_END";
      payload: {
        wasMachine: boolean;
      };
    }
  | {
      message: "MESSAGE_HISTORY";
      payload: {
        messages: GameMessage[];
      };
    };

export type ClientMessage =
  | {
      message: "INIT";
      payload: {
        withHuman?: boolean;
      };
    }
  | {
      message: "JOIN";
      payload: {
        code: GameCode;
      };
    }
  | {
      message: "MESSAGE";
      payload: {
        code: GameCode;
        text: string;
        fromEvaluator: boolean;
      };
    }
  | {
      message: "RECONNECT";
      payload: {
        code: GameCode;
        isEvaluator: boolean;
      };
    };
