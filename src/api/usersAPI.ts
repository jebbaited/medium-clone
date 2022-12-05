import { IAllUsers, IUser } from '../types/types';
import axios from './axios';

export const usersAPI = {
  async postUser(
    email: string,
    password: string,
    name: string
  ): Promise<IUser> {
    const response = await axios.post('/users', { email, password, name });
    return response.data;
  },
  async getAllUsers(
    limitForLastUsers: string | number,
    skip: number
  ): Promise<IAllUsers> {
    const response = await axios.get(`/users`, {
      params: {
        limit: limitForLastUsers || 20,
        skip: skip || 0,
      },
    });
    return response.data;
  },
  async getUserById(id: string): Promise<IUser> {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  },
  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  },
  async patchUserById(
    id: string,
    name: string,
    details: string
  ): Promise<IUser> {
    const response = await axios.patch(`/users/${id}`, { name, details });
    return response.data;
  },
  async updateAvatar(id: string, avatar: File): Promise<IUser> {
    const formData = new FormData();
    formData.append('avatar', avatar);
    const response = await axios.put(`/users/upload/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
