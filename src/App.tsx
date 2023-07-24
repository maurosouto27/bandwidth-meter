import { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// https://wicg.github.io/netinfo/#example-1
// https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API

const internetSpeed = () => {
  const connectionSpeed = navigator.connection?.downlink;
  if (connectionSpeed! > 1) return `${connectionSpeed} Mbps`;
  return `${connectionSpeed! * 1024} Kbps`;
};

const LOW_CONNECTION_THRESHOLD = 3; // Mbps
const CONNECTION_MESSAGES = {
  online: "You are back online.",
  lowConnection: "Your internet connection is low.",
  offline: "Connection lost.",
};

const BandwidthMeter = () => {
  const wasOnline = useRef(navigator.onLine);

  useEffect(() => {
    const browserInfo = navigator.userAgent;
    if (!browserInfo.includes("Chrome")) {
      return;
    }
    const notifyUser = () => {
      const { onLine, connection } = navigator;
      const { downlink } = connection!;

      if (onLine) {
        if (downlink! < LOW_CONNECTION_THRESHOLD) {
          toast.warn(CONNECTION_MESSAGES.lowConnection, {
            toastId: "connectionLow",
          });
        } else if (!wasOnline.current) {
          toast.success(CONNECTION_MESSAGES.online, {
            toastId: "connectionStablished",
          });
          wasOnline.current = true;
        }
      } else {
        toast.error(CONNECTION_MESSAGES.offline, {
          toastId: "connectionLost",
        });
        wasOnline.current = false;
      }
    };

    navigator.connection?.addEventListener("change", notifyUser);

    return () => {
      navigator.connection?.removeEventListener("change", notifyUser);
    };
  }, []);

  return <ToastContainer position="top-center" />;
};

function App() {
  return <BandwidthMeter />;
}

export default App;
