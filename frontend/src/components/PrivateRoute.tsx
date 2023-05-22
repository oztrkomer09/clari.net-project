import { ReactElement } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "./Layout";

interface Props {
  children: ReactElement;
}

const PrivateRoute = ({ children }: Props) => {
  const router = useRouter();
  const { authorized } = useAuth();

  if (!authorized) {
    return (
      <Layout>
        <div className="not-permitted">
          <h2>You have to login to view this page!</h2>
          <Link href="/login">
            <button className="reply-submit">Login</button>
          </Link>
        </div>
      </Layout>
    );
  }

  return children;
};

export default PrivateRoute;
