import axios from 'axios';
import { getItem } from '../helpers/persistanceStorage';

axios.defaults.baseURL = 'http://test-blog-api.ficuslife.com/api/v1';

axios.interceptors.request.use((config) => {
  const token = getItem('accessToken');
  const authToken = token ? `Token ${token}` : '';
  config.headers.Authorization = authToken;
  return config;
});

export default axios;
