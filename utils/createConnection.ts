import { webSocket } from "rxjs/webSocket";
import { SERVER_PORT } from "../consts";

export const createConnection = () =>
  typeof window !== "undefined"
    ? webSocket(`ws://localhost:${SERVER_PORT}`)
    : null;
