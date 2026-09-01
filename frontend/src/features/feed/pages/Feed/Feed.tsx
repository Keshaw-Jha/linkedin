import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button/Button.tsx";
// import { usePageTitle } from "../../../../hooks/usePageTitle.tsx";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider.tsx";
import classes from "./Feed.module.scss";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.tsx";
import RightSidebar from "../../components/RightSidebar/RightSidebar.tsx";
import Post, { type IPost } from "../../components/Post/Post.tsx";
import { Madal } from "../../components/Modal/Modal.tsx";
import { request } from "../../../../utils/api.ts";
import usePageTitle from "../../../../hooks/usePageTitle.tsx";

export default function Feed() {
  usePageTitle("Feed");
  const [showPostingModal, setShowPostingModal] = useState(false);
  const { user } = useAuthentication();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      await request<IPost[]>({
        endpoint: "/api/v1/feed",
        onSuccess: (data) => setPosts(data),
        onFailure: (error) => setError(error),
      });
    };
    fetchPosts();
  }, []);

  const handlePost = async (content: string, picture: string) =>
    await request<IPost>({
      endpoint: "/api/v1/feed/posts",
      method: "POST",
      body: JSON.stringify({ content, picture }),
      onSuccess: (data) => setPosts([data, ...posts]),
      onFailure: (error) => setError(error),
    });

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <LeftSidebar />
      </div>
      <div className={classes.center}>
        <div className={classes.posting}>
          <button
            onClick={() => {
              navigate(`/profile/${user?.id}`);
            }}>
            <img
              className={`${classes.top} ${classes.avatar}`}
              src={user?.profilePicture || "/avatar.png"}
              alt=""
            />
          </button>
          <Button outline onClick={() => setShowPostingModal(true)}>
            Start a post
          </Button>
          <Madal
            title="Creating a post"
            onSubmit={handlePost}
            showModal={showPostingModal}
            setShowModal={setShowPostingModal}
          />
        </div>
        {error && <div className={classes.error}>{error}</div>}

        <div className={classes.feed}>
          {posts.map((post) => (
            <Post key={post.id} post={post} setPosts={setPosts} />
          ))}
          {posts.length === 0 && (
            <p>
              Start connecting with people to build a feed that matters to you.
            </p>
          )}
        </div>
      </div>
      <div className={classes.right}>
        <RightSidebar />
      </div>
    </div>
  );
}
