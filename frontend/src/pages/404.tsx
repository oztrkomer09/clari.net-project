import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="not-found-wrapper">
      <img src="/giphy.gif" alt="" />
      <h1
        style={{
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          animationDuration: "1s",
          fontSize: "50px",
        }}
      >
        404
      </h1>
      <p style={{ textAlign: "center", marginBottom: "10px" }}>
        Sometimes life doesn't give us what we desire. So just rewind your vinyl
        and go back to{" "}
        <Link href={"/"} className="not-found-link">
          Home
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
