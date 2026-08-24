import { Stomp, type CompatClient } from "@stomp/stompjs";
import { useEffect, useState, type ReactNode } from "react";
import { WsContext } from "./WsContext";

export interface WebSocketContextProviderProps {
  children: ReactNode;
}

export const WebSocketContextProvider = ({
  children,
}: WebSocketContextProviderProps) => {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);

  useEffect(() => {
    const client = Stomp.client(`ws://localhost:8080/ws`);
    client.connect(
      {},
      () => {
        console.log("Connected to WebSocket");
        setStompClient(client);
      },
      (error: unknown) => {
        console.error("Error connecting to WebSocket: ", error);
      },
    );

    return () => {
      if (client.connected) {
        client.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
  }, []);

  return (
    <WsContext.Provider value={stompClient}>{children}</WsContext.Provider>
  );
};
