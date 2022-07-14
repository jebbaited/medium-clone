import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { imgSrc } from '../../helpers/chooseAvatarImage';

export const Header = () => {
  const currentUser = useSelector((state) => state.user.user);
  const currentPage = useSelector((state) => state.posts.pageNumber);

  const path = currentPage === 1 ? '/' : `/page-${currentPage}`;

  return (
    <nav className="flex items-center justify-end flex-wrap bg-white-500 py-2 px-4 h-14 max-w-screen-2xl">
      <div className="flex items-center w-auto text-base">
        <div>
          <Link to={path}>
            <p className="headerText">Home</p>
          </Link>
        </div>
        {currentUser ? (
          <div className="flex">
            <Link to="/createPost">
              <p className="headerText">New Post</p>
            </Link>
            <Link to="/settings">
              <p className="headerText">Settings</p>
            </Link>
            <Link to={'/profile/' + currentUser.name} className="flex">
              <img src={imgSrc(currentUser)} className="smallAvatar" />
              <p className="headerText">{currentUser.name}</p>
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/login">
              <p className="headerText">Sign In</p>
            </Link>

            <Link to="/register">
              <p className="headerText">Sign Up</p>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
