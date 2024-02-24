import { useState } from "react";
import { PostsState, addNewPost } from "./postSlice";

import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { User, selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";

const AddPostForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<number>();
  const [addRequestStatus, setAddRequestStatus] = useState(PostsState.idle);
  const users = useAppSelector(selectAllUsers);

  const onTitleChanged = (e: React.FormEvent<HTMLInputElement>) =>
    setTitle(e.currentTarget.value);
  const onContentChanged = (e: React.FormEvent<HTMLTextAreaElement>) =>
    setContent(e.currentTarget.value);
  const onAuthorChanged = (e: React.FormEvent<HTMLSelectElement>) =>
    setUserId(Number(e.currentTarget.value));
  const canSave =
    [title, content, userId].every(Boolean) &&
    addRequestStatus == PostsState.idle;

  const onSavePostClicked = () => {
    if (canSave && userId) {
      try {
        setAddRequestStatus(PostsState.pending);
        dispatch(
          addNewPost({
            title,
            body: content,
            userId,
          })
        ).unwrap();
        setTitle("");
        setContent("");
        navigate("/");
      } catch (err) {
        console.log("failed to save post", err);
      } finally {
        setAddRequestStatus(PostsState.idle);
      }
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
      <h2>Add a New Post</h2>
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
      </form>
    </section>
  );
};

export default AddPostForm;
