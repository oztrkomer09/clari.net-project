import { useEffect, useState } from "react";
import { INotification, NextPageWithLayout } from "@/types";
import Head from "next/head";
import axios from "@/axios";
import Avatar from "@/components/Avatar";
import useNotificationStore from "@/store/useNotificationStore";
import Link from "next/link";

const Notifications: NextPageWithLayout = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const setNotificationBadge = useNotificationStore(
    (state) => state.setNotificationBadge
  );

  useEffect(() => {
    setNotificationBadge(false);
    getNotifications();
  }, []);

  const getNotifications = () => {
    axios.get("api/notifications").then((res) => {
      setNotifications(res.data);
    });
  };

  const createConnectionAction = (connectionId: string, status: boolean) => {
    return () => {
      axios
        .post("/api/changeConnectionStatus", { connectionId, status })
        .then((response) => {
          getNotifications();
        });
    };
  };

  return (
    <>
      <Head>
        <title>Notifications</title>
      </Head>
      <div className="notification-area">
        <h3 style={{ color: "black" }}>Notifications</h3>
        <div className="notifications">
          {notifications.map((notification) => (
            <div className="notification">
              <div className="notification-profile">
                <Link href={`/profile/${notification.connectionUser.slug}`}>
                  <div className="notification-profile-radius">
                    {notification.type === "connection" && (
                      <Avatar
                        user={notification.connectionUser}
                        style={{ color: "white" }}
                      />
                    )}
                  </div>
                </Link>
                <div className="notification-desc">{notification.title}</div>
              </div>
              {notification.type === "connection" && (
                <div className="notification-transactions">
                  <div
                    onClick={createConnectionAction(notification.typeId, true)}
                    style={{ cursor: "pointer" }}
                    className="yes"
                  >
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div
                    onClick={createConnectionAction(notification.typeId, false)}
                    style={{ cursor: "pointer" }}
                    className="no"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

Notifications.authorization = true;

export default Notifications;
