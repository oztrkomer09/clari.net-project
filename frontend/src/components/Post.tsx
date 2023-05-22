import { useState, KeyboardEvent, Dispatch, SetStateAction } from "react";
import { useAuth } from "@/hooks/useAuth";
import { IPost, IReply } from "@/types";
import axios from "@/axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaComments } from "react-icons/fa";

interface Props {
  post: IPost;
  getPosts: () => void;
}

const Post = ({ post, getPosts }: Props) => {
  const { user, authorized } = useAuth();
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replies, setReplies] = useState<IReply[]>([]);

  const createLiker = (type: string) => {
    return () => {
      if (!authorized) {
        toast.error(`You need to login to ${type} a post`);
        return;
      }

      axios
        .post("/api/likePost", { postId: post._id, type })
        .then((response) => {
          if (response.data.success) {
            getPosts();
          }
        });
    };
  };

  const removePost = () => {
    if (window.confirm("Are you sure you want to delete your post?")) {
      axios.post("/api/removePost", { postId: post._id }).then((response) => {
        if (response.data.success) {
          toast.success(response.data.success);
          getPosts();
        }
      });
    }
  };

  const getReplies = () => {
    axios
      .get("/api/replies", { params: { postId: post._id } })
      .then((response) => {
        setLoadingReplies(false);
        setReplies(response.data);
      });
  };

  const reply = (e: KeyboardEvent) => {
    if (e.key.includes("Enter") && replyText) {
      axios
        .post("/api/replies", { postId: post._id, title: replyText })
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.success.message);
            setReplyText("");
            getReplies();
          }
        });
    }
  };

  const replySubmit = () => {
    if (replyText) {
      axios
        .post("/api/replies", { postId: post._id, title: replyText })
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.success.message);
            setReplyText("");
            getReplies();
          }
        });
    }
  };

  const removeReply = (id: string) => {
    if (window.confirm("Are you sure you want to delete your reply?")) {
      axios.post("/api/removeReply", { replyId: id }).then((response) => {
        if (response.data.success) {
          toast.success(response.data.success);
          getReplies();
        }
      });
    }
  };

  const toggleReplies = () => {
    if (showReplies) {
      setShowReplies(false);
    } else {
      setShowReplies(true);
      setLoadingReplies(true);
      getReplies();
    }
  };

  return (
    <div className="post" style={{ position: "relative" }}>
      {post.user?._id === user._id && (
        <div onClick={removePost} className="post-remover">
          <i className="fa fa-x"></i>
        </div>
      )}
      <Link href={`/profile/${post.user?.slug}`} className="profile">
        <Avatar className="fa-xl" user={post.user} style={{ color: "unset" }} />
      </Link>
      <div className="infos">
        <Link href={`/profile/${post.user?.slug}`}>
          <h4 className="name">{post.user?.slug}</h4>
        </Link>
        <div className="description">
          <p>{post.title}</p>
        </div>
        <div className="transactions">
          {post.likeCount}
          <div
            onClick={createLiker("like")}
            className={`like ${post.userLike?.type === "like" ? "active" : ""}`}
          >
            <AiFillLike size={20} />
          </div>
          {post.dislikeCount}
          <div
            onClick={createLiker("dislike")}
            className={`disslike ${
              post.userLike?.type === "dislike" ? "active" : ""
            }`}
          >
            <AiFillDislike size={20} />
          </div>
          {replies.length ? replies.length : post.replies!.length}
          <div onClick={toggleReplies} className="add-comment">
            <FaComments size={20} />
          </div>
        </div>
        {authorized && (
          <div className="reply-input">
            <input
              className="reply-post"
              type="text"
              placeholder="Reply to this post..."
              value={replyText}
              onKeyUp={reply}
              onChange={(e) => setReplyText(e.target.value)}
            />
            {replyText && (
              <button className="reply-submit" onClick={replySubmit}>
                Submit
              </button>
            )}
          </div>
        )}
        {showReplies && !loadingReplies && (
          <div>
            {replies.length ? (
              replies.map((reply) => (
                <div key={reply._id} className="single-reply">
                  <div style={{ display: "flex" }}>
                    <Link href={`/profile/${reply.user?.slug}`}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "1px solid black",
                          borderRadius: "50%",
                        }}
                      >
                        <Avatar
                          user={reply.user}
                          style={{ color: "unset", border: "5px solid black" }}
                        />
                      </div>
                    </Link>
                    <div className="reply-header">
                      <Link href={`/profile/${reply.user?.slug}`}>
                        <h3
                          style={{
                            fontSize: "14px",
                            marginLeft: "10px",
                          }}
                          className="name"
                        >
                          {reply.user.slug}
                        </h3>
                      </Link>
                      {reply.user._id === user._id && (
                        <i
                          className="fa-solid fa-trash reply-remove"
                          onClick={() => removeReply(reply._id)}
                        ></i>
                      )}
                    </div>
                  </div>

                  <p
                    style={{
                      padding: "5px",
                      overflowWrap: "break-word",
                      fontSize: "14px",
                    }}
                  >
                    {reply.title}
                  </p>
                </div>
              ))
            ) : (
              <p>there are no replies for this post</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
