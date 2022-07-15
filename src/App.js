import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';

import './App.css';
import axios from './api/axios';
import { saveUser } from './store/userSlice';
import { getItem } from './helpers/persistanceStorage';
import RegistrationPage from './components/registrationPage/RegistrationPage';
import LoginPage from './components/loginPage/LoginPage';
import { Header } from './components/header/Header';
import { SettingsPage } from './components/settingsPage/SettingsPage';
import { ProfilePage } from './components/profilePage/ProfilePage';
import { HomePage } from './components/homePage/HomePage';
import { CreatePost } from './components/createPost/CreatePost';
import { SinglePostPage } from './components/singlePostPage/SinglePostPage';
import { PostEditorPage } from './components/postEditorPage/PostEditorPage';
import { savePaginationInfo } from './store/postsSlice';

function App() {
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const params = useParams()

  const getUser = async () => {
    try {
      const response = await axios.get('/auth/user');
      dispatch(saveUser(response.data));
    } catch (error) {}
  };

  const getPosts = async () => {
    try {
      const response = await axios.get('/posts');
      dispatch(savePaginationInfo(response.data.pagination));
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData && getItem('accessToken')) {
      getUser();
    }
    getPosts();
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile/:userId/:name" element={<ProfilePage />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/post/:postId/:title" element={<SinglePostPage />} />
        <Route path="/post/editor/:id" element={<PostEditorPage />} />
        <Route path="/page-:pageNumber" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
