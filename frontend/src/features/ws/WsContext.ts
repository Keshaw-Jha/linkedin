import type { CompatClient } from "@stomp/stompjs";
import { createContext, useContext } from "react";

export const WsContext = createContext<CompatClient | null>(null);

export const useWebSocket = () => useContext(WsContext);
