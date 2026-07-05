import css from "./PostList.module.css";
import type { Post } from "../../types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../services/postService";
import toast from "react-hot-toast";
interface PostListProps {
  posts: Post[];
  onSelect: (post: Post) => void;
}
export default function PostList({ posts, onSelect }: PostListProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      toast.success("Post deleted successfully!");
    },
  });
  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li className={css.listItem} key={post.id}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button className={css.edit} onClick={() => onSelect(post)}>
              Edit
            </button>
            <button className={css.delete} onClick={() => mutation.mutate(post.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
