import { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { NextPageWithLayout, IUser } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import Head from "next/head";
import LeftSideEditModal from "@/components/LeftSideEditModal";
import RightSideEditModal from "@/components/RightSideEditModal";
import ConnectionButton from "@/components/ConnectionButton";
import Avatar from "@/components/Avatar";
import axios from "@/axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { AiFillPhone, AiFillInstagram, AiFillEdit } from "react-icons/ai";
import { HiMail } from "react-icons/hi";

interface Props {
  user: IUser;
}

const Profile: NextPageWithLayout<Props> = ({ user }) => {
  const { user: signedUser, authorized, login } = useAuth();
  const [leftSideModalOpen, setLeftSideModalOpen] = useState(false);
  const [rightSideEditModal, setRightSideModalOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [showAvatarIcon, setShowAvatarIcon] = useState(false);
  const router = useRouter();

  const currentUser = signedUser._id === user._id;

  useEffect(() => {
    if (authorized && !currentUser) {
      axios
        .get("/api/connection", { params: { userId: user._id } })
        .then((response) => {
          if (response.data.success) {
            setConnectionStatus(response.data.success.status);
          }
        });
    }
  }, [authorized, currentUser]);

  const openLeftSideModal = () => {
    setLeftSideModalOpen(true);
  };

  const closeLeftSideModal = () => {
    setLeftSideModalOpen(false);
  };

  const openRightSideModal = () => {
    setRightSideModalOpen(true);
  };

  const closeRightSideModal = () => {
    setRightSideModalOpen(false);
  };

  const openAvatar = () => {
    if (currentUser) {
      setShowAvatarIcon(true);
    }
  };

  const closeAvatar = () => {
    if (currentUser) {
      setShowAvatarIcon(false);
    }
  };

  const changeAvatar = () => {
    if (showAvatarIcon) {
      const input = document.createElement("input");
      input.type = "file";

      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;

        if (target.files?.length) {
          const formData = new FormData();

          formData.append("file", target.files![0]);

          axios.post("/api/changeAvatar", formData).then((response) => {
            if (response.data.error) {
              toast.error(response.data.error);
            } else if (response.data.success) {
              toast.success(response.data.success.message);
              login(response.data.success.token);
              router.reload();
            }
          });
        }
      };

      input.click();
    }
  };

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      {currentUser && (
        <LeftSideEditModal
          isOpen={leftSideModalOpen}
          onRequestClose={closeLeftSideModal}
          user={user}
        />
      )}
      {currentUser && (
        <RightSideEditModal
          isOpen={rightSideEditModal}
          onRequestClose={closeRightSideModal}
          user={user}
        />
      )}
      <div className="profile-area">
        <div className="profile-left">
          <div
            onClick={changeAvatar}
            onMouseEnter={openAvatar}
            onMouseLeave={closeAvatar}
            className="profile-pic"
            style={showAvatarIcon ? { background: "grey" } : {}}
          >
            {!showAvatarIcon ? (
              <Avatar user={user} />
            ) : (
              <AiFillEdit size={50} />
            )}
          </div>
          <h2 className="profile-name">
            {user.company ? user.company : `${user.firstName} ${user.lastName}`}
          </h2>
          <h4>{user.slug}</h4>
          <ConnectionButton
            connectionStatus={connectionStatus}
            setConnectionStatus={setConnectionStatus}
            userId={user._id}
          />
          {authorized && !currentUser && (
            <Link href={`/chat/${user.slug}`} className="btn chat-btn">
              Chat
            </Link>
          )}
          <div className="contact-area">
            <div className="contacts">
              <div className="contact">
                <AiFillPhone size={30} />
                <p>{user.phone || "not specified"}</p>
              </div>
              <div className="contact">
                <HiMail size={30} />
                <p>{user.email}</p>
              </div>
              <div className="contact">
                <AiFillInstagram size={30} />
                <p>{user.instagram ? "@" + user.instagram : "not specified"}</p>
              </div>
              {currentUser && (
                <div className="edit-pencil" onClick={openLeftSideModal}>
                  <AiFillEdit size={30} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="profile-right">
          <div className="content" style={{ height: "200px" }}>
            <div className="content-top">
              <p className="content-heading">About</p>
              <br />
              {currentUser && (
                <div className="edit-pencil" onClick={openRightSideModal}>
                  <AiFillEdit size={30} />
                </div>
              )}
            </div>
            <div
              className="content-bottom"
              style={{ overflow: "scroll", overflowWrap: "break-word" }}
            >
              <p>{user.about}</p>
            </div>
          </div>
          <div className="content">
            <div className="content-top">
              <p className="content-heading">Interests</p>
            </div>
            <div className="content-bottom">
              <ul style={{ display: "flex", gap: "5px" }}>
                {user.interests.map((interest) => (
                  <li key={interest._id as string}>
                    <p>
                      <span className="profile-singleword-bg">
                        {interest.name}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="content">
            <div className="content-top">
              <p className="content-heading">Skills</p>
            </div>
            <div className="content-bottom">
              <ul style={{ display: "flex", gap: "5px" }}>
                {user.skills.map((skill) => (
                  <li key={skill._id as string}>
                    <p>
                      <span className="profile-singleword-bg">
                        {skill.name}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="content">
            <div className="content-top">
              <p className="content-heading">Education</p>
            </div>
            <div className="content-bottom">
              <ul>
                {user.education.map((item) => (
                  <li key={item._id as string}>
                    {item.name} - {new Date(item.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="content">
            <div className="content-top">
              <p className="content-heading">Experience</p>
            </div>
            <div className="content-bottom">
              <ul>
                {user.experiences.map((experience) => (
                  <li key={experience._id as string}>
                    {experience.name} -{" "}
                    {new Date(experience.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  let user;

  try {
    user = await axios.get("/api/user", { params });
  } catch (e) {
    return { notFound: true };
  }

  if (!user.data) {
    return { notFound: true };
  }

  return {
    props: { user: user.data },
  };
};

export default Profile;
