import { webSocket } from "rxjs/webSocket";
import { SERVER_PORT } from "../consts";

const url =
  process.env.NODE_ENV === "development"
    ? `ws://localhost:${SERVER_PORT}`
    : process.env.SERVER_URL;

if (typeof url !== "string") {
  throw new Error(`Backend url is not a string! ${url}`);
}

export const createConnection = () =>
  typeof window !== "undefined" ? webSocket(url) : null;
