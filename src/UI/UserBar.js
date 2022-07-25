import { Link } from 'react-router-dom';
import { imgSrc } from '../helpers/chooseAvatarImage';

export const UserBar = ({ creatorData, dateCreated, likesInfo, putLike }) => {
  const pathToProfile = creatorData.id
    ? `/profile/${creatorData.id}/${creatorData.name}`
    : '/';

  return (
    <div className="flex justify-between mb-1">
      <div className="self-start">
        <div className="flex">
          <Link to={pathToProfile}>
            <div>
              <img
                className="medium-avatar"
                src={
                  creatorData.avatar
                    ? creatorData.avatar
                    : imgSrc('No such user')
                }
              />
            </div>
          </Link>
          <div className="flex flex-col items-start break-all min-w-[100px] ">
            <div className="self-start">
              <Link to={pathToProfile}>
                <p className="text-emerald-500 text-left">
                  {creatorData.name ? creatorData.name : 'Unknown user'}
                </p>
              </Link>
            </div>
            <p className="text-left">{dateCreated}</p>
          </div>
        </div>
      </div>
      <div className="self-center">
        <button
          className={`${
            likesInfo.isLikedByCurrentUser
              ? 'likes-button bg-emerald-500 text-white'
              : 'likes-button'
          }`}
          onClick={putLike}
        >
          <div className="flex justify-center items-center">
            <div>
              <svg
                className="h-4 w-4 lg:h-5 lg:w-5"
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
            <div>{likesInfo.amountOfLikes}</div>
          </div>
        </button>
      </div>
    </div>
  );
};
