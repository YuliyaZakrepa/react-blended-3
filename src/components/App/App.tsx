import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import { fetchPosts } from "../../services/postService";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import { Toaster } from "react-hot-toast";

import css from "./App.module.css";
import { useDebouncedCallback } from "use-debounce";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import type { Post } from "../../types/post";
import EditPostForm from "../EditPostForm/EditPostForm";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const { data } = useQuery({
    queryKey: ["posts", search, page],
    queryFn: () => fetchPosts(search, page),
    placeholderData: keepPreviousData,
  });

  const handleSearch = useDebouncedCallback((search: string) => {
    setSearch(search);
    setPage(1);
  }, 1000);
  const posts = data?.posts || [];
  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / 8) : 0;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <button
          className={css.button}
          onClick={() => {
            setIsModalOpen(true);
            setIsCreatePost(true);
          }}
        >
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {isCreatePost && <CreatePostForm onClose={() => setIsModalOpen(false)} />}
          {isEditPost && (
            <EditPostForm
              post={editPost}
              onClose={() => {
                setEditPost(null);
                setIsModalOpen(false);
                setIsEditPost(false);
              }}
            />
          )}
        </Modal>
      )}
      {posts.length > 0 && (
        <PostList
          posts={posts}
          onSelect={(post: Post) => {
            setEditPost(post);
            setIsModalOpen(true);
            setIsEditPost(true);
          }}
        />
      )}
      <Toaster />
    </div>
  );
}
