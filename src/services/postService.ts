import axios from "axios";
import type {Post} from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";


export const fetchPosts = async (searchText: string, page:number):Promise<{posts:Post[], totalCount:number}> => {
    const response = await axios.get<Post[]>("/posts", {params:{q:searchText, _page:page, _limit:8}})
const totalCount = response.headers['x-total-count']
    return {posts:response.data, totalCount}
};

export const createPost = async (newPost) => {};

export const editPost = async (newDataPost) => {};

export const deletePost = async (postId) => {};
