import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { imgSrc } from '../../helpers/chooseAvatarImage';

export const Header = () => {
  const currentUser = useSelector((state) => state.user.user);
  const currentPage = useSelector((state) => state.posts.pageNumber);

  const path = currentPage === 1 ? '/' : `/page-${currentPage}`;

  return (
    <nav className="flex items-center justify-end flex-wrap bg-white-500 py-2 px-4 h-14 max-w-screen-2xl min-width-640 ">
      <div className="flex items-center w-auto text-base">
        <div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'active-link' : 'header-text'
            }
          >
            Home
          </NavLink>
        </div>
        {currentUser ? (
          <div className="flex">
            <NavLink
              to="/createPost"
              className={({ isActive }) =>
                isActive ? 'active-link' : 'header-text'
              }
            >
              New Post
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? 'active-link' : 'header-text'
              }
            >
              Settings
            </NavLink>
            <NavLink
              to={`/profile/${currentUser._id}/${currentUser.name}`}
              className={({ isActive }) =>
                isActive ? 'flex active-link' : 'flex header-text'
              }
            >
              <img src={imgSrc(currentUser)} className="small-avatar" />
              {currentUser.name}
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'active-link' : 'header-text'
              }
            >
              Sign In
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? 'active-link' : 'header-text'
              }
            >
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};
