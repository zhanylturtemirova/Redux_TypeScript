import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const postAdapter = createEntityAdapter({
  selectId: (post: Post) => post.id,
  sortComparer: (a: Post, b: Post) => b.date.localeCompare(a.date),
});
export enum ReactionsType {
  thumbsUp = "thumbsUp",
  wow = "wow",
  heart = "heart",
  rocket = "rocket",
  coffee = "coffee",
}
export interface Reactions {
  [ReactionsType.thumbsUp]: number;
  [ReactionsType.wow]: number;
  [ReactionsType.heart]: number;
  [ReactionsType.rocket]: number;
  [ReactionsType.coffee]: number;
}
export interface Post {
  body: any;
  id: number;
  title: string;
  content: string;
  userId: number;
  date: string;
  reactions?: Reactions;
}

export interface NewPost {
  body: any;
  title: string;
  userId: number;
}
export interface PostReaction {
  id: number;
  reaction: string;
}

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost: NewPost) => {
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost: Post) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (err) {
      return initialPost;
    }
  }
);
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost: Post) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) return initialPost;
      return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
      if (err instanceof Error) return err.message;
    }
  }
);
export enum PostsState {
  idle = "idle",
  loading = "loading",
  succeded = "succeded",
  failed = "failed",
  pending = "pending",
}
interface IState {
  // posts: Array<Post>;

  status: PostsState;
  error: Error | null | ReferenceError;
  count: number;
}
const initialState: IState = postAdapter.getInitialState({
  status: PostsState.idle,
  error: null,
  count: 0,
});

const postSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    reactionAdded(
      state: any,
      action: PayloadAction<PostReaction & { reaction: ReactionsType }>
    ) {
      const { id: postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost && existingPost.reactions) {
        existingPost.reactions[reaction]++;
      }
    },
    incrementCount(state) {
      state.count = state.count + 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = PostsState.loading;
      })
      .addCase(fetchPosts.fulfilled, (state: any, action) => {
        state.status = PostsState.succeded;
        let min = 1;
        const loadedPosts = action.payload.map((post: Post): Post => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            [ReactionsType.thumbsUp]: 0,
            [ReactionsType.wow]: 0,
            [ReactionsType.heart]: 0,
            [ReactionsType.rocket]: 0,
            [ReactionsType.coffee]: 0,
          };
          return post;
        });
        postAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = PostsState.failed;
        state.error = action.error.message as unknown as ReferenceError;
      })
      .addCase(addNewPost.fulfilled, (state: any, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          [ReactionsType.thumbsUp]: 0,
          [ReactionsType.wow]: 0,
          [ReactionsType.heart]: 0,
          [ReactionsType.rocket]: 0,
          [ReactionsType.coffee]: 0,
        };
        postAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state: any, action) => {
        if (!action.payload?.id) {
          console.log("update could not complete");
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state: any, action) => {
        if (typeof action.payload !== "string" && !action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
      });
  },
});

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postAdapter.getSelectors<RootState>((state: any) => state.posts);
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;

export const getCount = (state: RootState) => state.posts.count;
export const selectPostByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);
export const { reactionAdded, incrementCount } = postSlice.actions;
export default postSlice.reducer;
