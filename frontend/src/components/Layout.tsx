import { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import HeaderSearch from "@/components/HeaderSearch";
import useNotificationStore from "@/store/useNotificationStore";
import { AiFillGithub } from "react-icons/ai";
import { HiMail } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";

const Layout = ({ children }: PropsWithChildren) => {
  const { user, authorized, logout: logoutImpl } = useAuth();
  const notificationBadge = useNotificationStore(
    (state) => state.notificationBadge
  );
  const router = useRouter();

  const logout = () => {
    logoutImpl();
    router.push("/");
  };

  return (
    <div className="wrapper">
      <header>
        {authorized ? (
          <>
            <Link href="/" className="header-logo logo-brand">
              <img
                src="/logo.png"
                alt=""
                style={{ width: "50px", height: "50px" }}
              />
              <p>Clari.net</p>
            </Link>
            <HeaderSearch />
            <div className="header-buttons">
              <Link href="/feed" className="navbar-icon">
                <i className="fa-solid fa-feed fa-lg box navbar-box"></i>
                <p>Feed</p>
              </Link>
              <Link href={`/profile/${user.slug}`} className="navbar-icon">
                <i className="fa-solid fa-user fa-lg box navbar-box"></i>
                <p>Profile</p>
              </Link>
              <Link href="/notifications" className="navbar-icon">
                <i
                  className="fa-solid fa-bell fa-lg box navbar-box"
                  style={
                    notificationBadge
                      ? {
                          color: "red",
                          animation:
                            "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                          animationDuration: "1s",
                        }
                      : {}
                  }
                ></i>
                <p>Notif.</p>
              </Link>

              <Link href="/connections" className="navbar-icon">
                <i className="fa-solid fa-user-group fa-lg box navbar-box"></i>
                <p>Conn.</p>
              </Link>

              <Link href="/chat" className="navbar-icon">
                <i className="fa-solid fa-message fa-lg box navbar-box" />
                <p>Chat</p>
              </Link>
              <Link href="/jobs" className="navbar-icon">
                <i className="fa-solid fa-briefcase fa-lg box navbar-box"></i>
                <p>Jobs</p>
              </Link>

              <div
                onClick={logout}
                className="navbar-icon"
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-power-off fa-lg box navbar-box"></i>
                <p>Out</p>
              </div>
            </div>
          </>
        ) : (
          <Link href={"/"}>
            <h1>Clari.net</h1>
          </Link>
        )}
      </header>
      {children}
      <footer>
        <div>
          <h2 style={{ color: "#071a38", fontWeight: "bold" }}>CLARI.NET</h2>
          <p>
            The first decentralized musician cooperation platform. All rights
            reserved ©
          </p>
        </div>
        <div className="footer-contact">
          <div className="footer-contact-item">
            <IoLocationSharp size={25} color={"#071a38"} />
            <p style={{ cursor: "default" }}>Yenibaglar, Eskisehir/TURKEY</p>
          </div>
          <a href="mailto:farukozt09@gmail.com" className="footer-contact-item">
            <HiMail size={25} className="footer-icon" />
            <p>clarinet.net@gmail.com</p>
          </a>
          <a href="" className="footer-contact-item">
            <AiFillGithub size={25} className="footer-icon" />
            <p>Source</p>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
