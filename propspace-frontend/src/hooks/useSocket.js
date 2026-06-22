import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * BP #2 — Memory Cleanup:
 * Opens one socket connection, registers the provided event handlers, and on
 * unmount removes every listener AND disconnects the socket. Without this
 * teardown, navigating between pages would stack dead listeners and leak
 * open connections.
 *
 * `handlers` must be a stable reference (wrap it in useMemo in the caller),
 * otherwise the effect re-subscribes on every render.
 */
export default function useSocket(handlers) {
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    const entries = Object.entries(handlers);
    entries.forEach(([event, fn]) => socket.on(event, fn));

    return () => {
      entries.forEach(([event, fn]) => socket.off(event, fn));
      socket.disconnect();
    };
  }, [handlers]);
}
