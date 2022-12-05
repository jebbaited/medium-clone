import React from 'react';
import { useAppSelector } from '../hooks/hooks';
import { NavLink } from 'react-router-dom';

import { imgSrc } from '../helpers/chooseAvatarImage';
import { Switcher } from './Switcher';

export const Header = () => {
  const currentUser = useAppSelector((state) => state.user.user);

  return (
    <>
      <div className="flex justify-start sm:justify-between">
        <div className="self-center">
          <Switcher />
        </div>
        <nav className="flex items-center justify-center flex-wrap bg-white-500 py-2 px-4 h-14 max-w-screen-2xl min-width-640 lg:justify-end">
          <div className="flex items-center w-auto text-base">
            <div>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'active-link dark:text-white '
                    : 'header-text dark:hover:text-slate-200'
                }
              >
                Home
              </NavLink>
            </div>
            {currentUser ? (
              <div className="flex">
                <NavLink
                  to="/allUsers"
                  className={({ isActive }) =>
                    isActive
                      ? 'active-link dark:text-white'
                      : 'header-text dark:hover:text-slate-200'
                  }
                >
                  All Users
                </NavLink>
                <NavLink
                  to="/createPost"
                  className={({ isActive }) =>
                    isActive
                      ? 'active-link dark:text-white'
                      : 'header-text dark:hover:text-slate-200'
                  }
                >
                  New Post
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive
                      ? 'active-link dark:text-white'
                      : 'header-text dark:hover:text-slate-200'
                  }
                >
                  Settings
                </NavLink>
                <NavLink
                  to={`/profile/${currentUser._id}/${currentUser.name}`}
                  className={({ isActive }) =>
                    isActive
                      ? 'flex active-link dark:text-white'
                      : 'flex header-text dark:hover:text-slate-200'
                  }
                >
                  <img
                    src={imgSrc(currentUser)}
                    className="small-avatar"
                    alt="nothing"
                  />
                  {currentUser.name}
                </NavLink>
              </div>
            ) : (
              <div>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? 'active-link dark:text-white'
                      : 'header-text dark:hover:text-slate-200'
                  }
                >
                  Sign In
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? 'active-link dark:text-white'
                      : 'header-text dark:hover:text-slate-200'
                  }
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};
