import { IToken, IUser } from '../types/types';
import axios from './axios';

export const authAPI = {
  async getUserByToken(): Promise<IUser> {
    const response = await axios.get('/auth/user');
    return response && response.data;
  },

  async postAuth(email: string, password: string): Promise<IToken> {
    const response = await axios.post('/auth', { email, password });
    return response;
  },
};
