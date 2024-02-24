import { Post, ReactionsType, reactionAdded } from "./postSlice";
import { useAppDispatch } from "../../app/hooks";
const reactionEmoji = {
  [ReactionsType.thumbsUp]: "👍",
  [ReactionsType.wow]: "😮",
  [ReactionsType.heart]: "❤️",
  [ReactionsType.rocket]: "🚀",
  [ReactionsType.coffee]: "☕",
};
const ReactionButtons = ({ post }: { post: Post }) => {
  const dispatch = useAppDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() =>
          dispatch(
            reactionAdded({
              id: post.id,
              reaction: name as ReactionsType,
            })
          )
        }
      >
        {emoji} {post.reactions && post.reactions[name as ReactionsType]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
export default ReactionButtons;
