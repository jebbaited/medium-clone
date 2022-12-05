import { IAllPosts, IPost } from '../types/types';
import axios from './axios';

export const postAPI = {
  async newPost(
    title: string,
    description: string,
    fullText: string
  ): Promise<IPost> {
    const response = await axios.post(`/posts`, {
      title,
      description,
      fullText,
    });
    return response.data;
  },

  async getAllPosts(
    limitForLastPosts: string | number | null,
    skip: string | null,
    userId: string,
    search?: string
  ): Promise<IAllPosts> {
    const response = await axios.get('/posts', {
      params: {
        postedBy: userId || '',
        limit: limitForLastPosts || 10,
        skip: skip || 0,
        search: search || null,
      },
    });
    return response.data;
  },
  async getPostsById(id: string): Promise<IPost> {
    const response = await axios.get(`/posts/${id}`);
    return response.data;
  },
  async deletePostById(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/posts/${id}`);
    return response.data;
  },
  async updatePostById(
    id: string,
    title: string,
    fullText: string,
    description: string
  ): Promise<IPost> {
    const response = await axios.patch(`/posts/${id}`, {
      title,
      fullText,
      description,
    });
    return response.data;
  },
  async updatePostImageById(id: string, image: File): Promise<IPost> {
    const formData = new FormData();
    formData.append('image', image);
    const response = await axios.put(`/posts/upload/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  async setLikeForPost(id: string): Promise<{ message: string }> {
    const response = await axios.put(`/posts/like/${id}`);
    return response.data;
  },
};
