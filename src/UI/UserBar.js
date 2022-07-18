import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { imgSrc } from '../helpers/chooseAvatarImage';

export const UserBar = ({ creatorData, dateCreated, likesInfo, putLike }) => {
  const currentPage = useSelector((state) => state.posts.pageNumber);
  const pathToProfile = creatorData.id
    ? `/profile/${creatorData.id}/${creatorData.name}`
    : `/page-${currentPage}`;

  return (
    <div className="flex justify-between">
      <div className="self-start">
        <div className="flex">
          <Link to={pathToProfile}>
            <div>
              <img
                className="mediumAvatar"
                src={
                  creatorData.avatar
                    ? creatorData.avatar
                    : imgSrc('No such user')
                }
              />
            </div>
          </Link>
          <div className="flex flex-col items-start">
            <div className="self-start">
              <Link to={pathToProfile}>
                <p className="text-emerald-500 text-left">
                  {creatorData.name ? creatorData.name : 'Unknown user'}
                </p>
              </Link>
            </div>
            <p>{dateCreated}</p>
          </div>
        </div>
      </div>
      <div className="self-end">
        <button
          className={`${
            likesInfo.isPostLikedByCurrentUser
              ? 'likesButton bg-emerald-500 text-white'
              : 'likesButton'
          }`}
          onClick={putLike}
        >
          <div className="flex justify-center">
            <div>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div>{likesInfo.amountOfPostLikes}</div>
          </div>
        </button>
      </div>
    </div>
  );
};
