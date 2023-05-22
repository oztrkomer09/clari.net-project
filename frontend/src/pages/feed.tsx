import { FormEvent, useEffect, useState } from "react";
import { IPost, NextPageWithLayout } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import axios from "@/axios";
import Head from "next/head";
import Post from "@/components/Post";

const Feed: NextPageWithLayout = () => {
  const { authorized } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postText, setPostText] = useState("");

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = () => {
    axios.get("/api/posts").then((response) => {
      setPosts(response.data);
    });
  };

  const post = (e: FormEvent) => {
    e.preventDefault();

    axios.post("/api/posts", { title: postText }).then((response) => {
      if (response.data.success) {
        setPostText("");
        getPosts();
      }
    });
  };

  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <div>
        {authorized && (
          <form className="message-area" onSubmit={post}>
            <input
              type="text"
              className="message-input"
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            {postText !== "" && (
              <button className="btn reply-submit">Post</button>
            )}
          </form>
        )}
        <div className="messages">
          {posts.map((post) => (
            <Post key={post._id} post={post} getPosts={getPosts} />
          ))}
        </div>
      </div>
    </>
  );
};

Feed.authorization = true;

export default Feed;
