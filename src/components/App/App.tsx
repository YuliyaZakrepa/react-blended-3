import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import { fetchPosts } from "../../services/postService";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import {useDebouncedCallback } from "use-debounce";

export default function App() {
  const [page, setPage] = useState (1)
  const [search, setSearch] = useState('')
const {data} = useQuery({
  queryKey: ["posts", search, page],
  queryFn: ()=>fetchPosts(search, page),
  placeholderData: keepPreviousData
})
 

const handleSearch = useDebouncedCallback(
  (search:string)=>{setSearch(search); 
    setPage(1)},
    1000)
  const posts = data?.posts || [];
  const totalPages = data?.totalCount ?Math.ceil(data.totalCount/8) :0;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch}/>
        {totalPages>1 && <Pagination 
        totalPages={totalPages}
        currentPage ={page}
        onPageChange = {setPage} />}
        <button className={css.button}>Create post</button>
      </header>
      {/* <Modal>Передати через children компонент CreatePostForm або EditPostForm</Modal> */}
      {posts.length>0 && <PostList posts={posts}/>}
    </div>
  );
}
