import { useState } from "react";
import {
  PostsState,
  updatePost,
  selectPostById,
  deletePost,
} from "./postSlice";

import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { User, selectAllUsers } from "../users/usersSlice";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../app/store";

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useAppSelector((state: RootState) => {
    return selectPostById(state, Number(postId));
  });
  const users = useAppSelector(selectAllUsers);

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.body || "");
  const [userId, setUserId] = useState<number | undefined | string>(
    post?.userId
  );
  const [requestStatus, setRequestStatus] = useState(PostsState.idle);

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const onTitleChanged = (e: React.FormEvent<HTMLInputElement>) =>
    setTitle(e.currentTarget.value);
  const onContentChanged = (e: React.FormEvent<HTMLTextAreaElement>) =>
    setContent(e.currentTarget.value);
  const onAuthorChanged = (e: React.FormEvent<HTMLSelectElement>) =>
    setUserId(Number(e.currentTarget.value));
  const canSave =
    [title, content, userId].every(Boolean) && requestStatus == PostsState.idle;

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus(PostsState.pending);
        dispatch(
          updatePost({
            id: post.id,
            title: title,
            body: content,
            userId: Number(userId) || post.userId,
            reactions: post.reactions,
            content: "",
            date: "",
          })
        ).unwrap();
        setTitle("");
        setContent("");
        setUserId("");
        setUserId("");
        navigate(`/post/${post.id}`);
      } catch (err) {
        console.log("failed to save post", err);
      } finally {
        setRequestStatus(PostsState.idle);
      }
    }
  };
  const onDeletePostClick = () => {
    try {
      setRequestStatus(PostsState.pending);
      dispatch(deletePost({ id: post.id })).unwrap();
      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (err) {
      console.log("failed to delete post ", err);
    } finally {
      setRequestStatus(PostsState.idle);
    }
  };
  const userOptions = Array.isArray(users)
    ? users.map((user: User) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))
    : [];
  return (
    <section>
      <h2> Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select
          name=""
          id="postAuthor"
          value={userId}
          onChange={onAuthorChanged}
          defaultValue={post.userId}
        >
          <option value=""></option>
          {userOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button onClick={onSavePostClicked} type="button" disabled={!canSave}>
          Save Post
        </button>
        <button onClick={onDeletePostClick} type="button">
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
