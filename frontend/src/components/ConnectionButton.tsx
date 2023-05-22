import axios from "@/axios";

interface Props {
  connectionStatus: string | null;
  setConnectionStatus: (value: string | null) => void;
  userId: string;
}

const ConnectionButton = ({
  connectionStatus,
  setConnectionStatus,
  userId,
}: Props) => {
  const onClick = () => {
    if (connectionStatus === "not_connected") {
      axios.post("/api/connections", { userId }).then((response) => {
        if (response.data.success) {
          setConnectionStatus("requested");
        }
      });
    } else if (connectionStatus === "pending_request") {
      axios
        .post("/api/changeConnectionStatus", { userId, status: true })
        .then((response) => {
          if (response.data.success) {
            setConnectionStatus("connected");
          }
        });
    }
  };

  if (connectionStatus === "not_connected") {
    return (
      <button onClick={onClick} className="btn reply-submit">
        Make a connection
      </button>
    );
  }

  if (connectionStatus === "connected") {
    return <button className="btn reply-submit">Connected</button>;
  }

  if (connectionStatus === "requested") {
    return <button className="btn reply-submit">Requested</button>;
  }

  if (connectionStatus === "pending_request") {
    return (
      <button onClick={onClick} className="btn reply-submit">
        Approve Connection Request
      </button>
    );
  }

  return null;
};

export default ConnectionButton;
