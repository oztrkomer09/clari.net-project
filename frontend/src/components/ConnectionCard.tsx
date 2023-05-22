import { IUser } from "@/types";
import axios from "@/axios";
import toast from "react-hot-toast";
import Avatar from "@/components/Avatar";
import Link from "next/link";

const ConnectionCard = ({
  connection,
  getConnections,
}: {
  connection: IUser;
  getConnections: () => void;
}) => {
  const remove = () => {
    if (window.confirm("Are you sure you want to remove this connection?")) {
      axios
        .post("/api/removeConnection", { userId: connection._id })
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.success.message);
            getConnections();
          }
        });
    }
  };

  return (
    <div className="connection">
      <div className="connection-wrapper">
        <div className="connection-profile">
          <Avatar user={connection} />
        </div>
        <div className="connection-name">
          <Link href={`/profile/${connection.slug}`}>{connection.slug}</Link>
        </div>
        <div className="connection-job">
          <p>{connection.about}</p>
        </div>
      </div>
      <button onClick={remove} className="connection-remove">
        Remove
      </button>
    </div>
  );
};

export default ConnectionCard;
