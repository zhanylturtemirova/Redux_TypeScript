import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";

const PostAuthor = ({ userId }: { userId: number }) => {
  const users = useAppSelector(selectAllUsers);
  const author = users.find((user) => Number(user.id) === userId);

  return <span> by {author ? author.name : "Unknown author"} </span>;
};

export default PostAuthor;
