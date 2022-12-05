import { IComment } from '../types/types';
import axios from './axios';

export const commentsAPI = {
  async getCommentsByPostId(id: string): Promise<IComment[]> {
    const response = await axios.get(`/comments/post/${id}`);
    return response.data;
  },

  async createNewComment(
    id: string,
    newCommentText: string,
    commentIdToReply: string
  ): Promise<IComment> {
    const response = await axios.post(`/comments/post/${id}`, {
      text: newCommentText,
      followedCommentID: commentIdToReply ? commentIdToReply : null,
    });
    return response.data;
  },
  async deleteCommentById(id: string): Promise<string> {
    const response = await axios.delete(`/comments/${id}`);
    return response.data;
  },
  async updateCommentById(id: string, text: string): Promise<IComment> {
    const response = await axios.patch(`/comments/${id}`, {
      text,
    });
    return response.data;
  },
  async setLikeForComment(id: string): Promise<{ message: string }> {
    const response = await axios.put(`/comments/like/${id}`);
    return response.data;
  },
};
