import React from 'react';
import { useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { getUserByToken, setTheme } from './store/userSlice';
import { getItem } from './helpers/persistanceStorage';

import { LoginPage } from './components/loginPage/LoginPage';
import { RegistrationPage } from './components/registrationPage/RegistrationPage';
import { Header } from './UI/Header';
import { SettingsPage } from './components/settingsPage/SettingsPage';
import { CreatePostPage } from './components/createPostPage/CreatePostPage';
import { HomePage } from './components/homePage/HomePage';
import { ProfilePage } from './components/profilePage/ProfilePage';
import { SinglePostPage } from './components/singlePostPage/SinglePostPage';
import { AllUsers } from './components/allUsers/AllUsers';
import { PostEditorPage } from './components/postEditorPage/PostEditorPage';

import './App.css';
import { KeyStrings } from './types/types';

function App() {
  const userData = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  const getUserCurrentUser = useCallback(() => {
    dispatch(getUserByToken());
  }, [dispatch]);

  const getInitialTheme = (): string => {
    if (window !== undefined && window.localStorage) {
      const storedPrefs = getItem(KeyStrings.currentTheme);
      if (storedPrefs) return storedPrefs;

      if (window.matchMedia('(prefers-color-scheme: dark)').matches)
        return 'dark';
    }
    return 'light';
  };

  useEffect(() => {
    if (!userData && getItem(KeyStrings.accessToken)) {
      getUserCurrentUser();
    }
  }, [getUserCurrentUser, userData]);

  useEffect(() => {
    dispatch(setTheme(getInitialTheme()));
  }, [dispatch]);

  return (
    <div className="App h-min-[100vh] dark:bg-black min-width-640">
      <Header />
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/allUsers" element={<AllUsers />}>
          <Route path="page-:pageNumber" element={<AllUsers />} />
        </Route>
        <Route path="/profile/:userId/:name" element={<ProfilePage />}>
          <Route path="page-:pageNumber" element={<ProfilePage />} />
        </Route>
        <Route path="/createPost" element={<CreatePostPage />} />
        <Route path="/post/:postId/:title" element={<SinglePostPage />}>
          <Route
            path="comments/page-:pageNumber"
            element={<SinglePostPage />}
          />
        </Route>
        <Route path="/post/editor/:id" element={<PostEditorPage />} />
        <Route path="/search=:searchText" element={<HomePage />} />
        <Route path="/" element={<HomePage />}>
          <Route path="page-:pageNumber" element={<HomePage />}>
            <Route path="search=:searchText" element={<HomePage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
