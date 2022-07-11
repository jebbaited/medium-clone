import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from './api/axios';
import './App.css';

import RegistrationPage from './components/registrationPage/RegistrationPage';
import LoginPage from './components/loginPage/LoginPage';
import { Header } from './components/header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { saveUser } from './store/userSlice';
import { getItem } from './helpers/persistanceStorage';
import { SettingsPage } from './components/settingsPage/SettingsPage';
import { ProfilePage } from './components/profilePage/ProfilePage';
import { HomePage } from './components/homePage/HomePage';

function App() {
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const response = await axios.get('/auth/user');
      dispatch(saveUser(response.data));
    } catch (error) {}
  };

  useEffect(() => {
    if (!userData && getItem('accessToken')) {
      getUser();
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile/:name" element={<ProfilePage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
