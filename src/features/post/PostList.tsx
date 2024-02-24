import {
  selectPostIds,
  getPostsError,
  getPostsStatus,
  PostsState,
} from "./postSlice";
import { useAppSelector } from "../../app/hooks";
import PostsExcerpt from "./PostsExcerpt";

import { ReactNode } from "react";

const PostList = () => {
  const orderedPostIds = useAppSelector(selectPostIds);
  const postsStatus = useAppSelector(getPostsStatus);
  const postsError = useAppSelector(getPostsError);

  let content: any = <p></p>;
  if (postsStatus === PostsState.loading) {
    content = <p>Loading...</p>;
  } else if (postsStatus === PostsState.succeded) {
    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (postsStatus === PostsState.failed) {
    content = <p>{postsError as ReactNode}</p>;
  }

  return <section>{content}</section>;
};

export default PostList;
