import { Post, selectPostById } from "./postSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from "react-router-dom";
import React from "react";
import { useAppSelector } from "../../app/hooks";

interface ImStatelessProps {
  postId: number;
}
const PostsExcerpt = React.memo<ImStatelessProps>(({ postId }) => {
  const post = useAppSelector((state) =>
    selectPostById(state, postId)
  ) as unknown as Post;

  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt"> {post.body.substring(0, 75)}...</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={Number(post.userId)} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
});
export default PostsExcerpt;
