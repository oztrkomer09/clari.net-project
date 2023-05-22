import Head from "next/head";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import Link from "next/link";

function Home() {
  const { authorized } = useAuth();
  const router = useRouter();

  if (!authorized) {
    return (
      <>
        <Head>
          <title>Clari.net</title>
        </Head>
        <div className="video-wrapper">
          <video autoPlay muted loop className="bg-video">
            <source src="/background.mp4" type="video/mp4" />
          </video>

          <div className="landing">
            <div className="landing-left-side">
              <img src="/logo.png" className="landing-logo" alt="" />
              <div className="brand-content">
                <h3>
                  The first decentralized logic based musician cooperation
                  platform.
                </h3>
                <h4>Join now for free!</h4>
              </div>
            </div>
            <div className="landing-right-side">
              <Link href={"/login"} className="landing-right-button">
                Login
              </Link>

              <Link href={"/sign-up"} className="landing-right-button">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    router.push("/feed");
  }
}

export default Home;
