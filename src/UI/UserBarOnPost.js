import { Link } from 'react-router-dom';
import { imgSrc } from '../helpers/chooseAvatarImage';

export const UserBarOnPost = ({
  creatorData,
  dateCreated,
  postLikesInfo,
  putLikeForPost,
}) => {
  return (
    <div className="flex justify-between">
      <div className="self-start">
        <div className="flex">
          <Link to={`/profile/${creatorData.name}`}>
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
              <Link to={`/profile/${creatorData.name}`}>
                <p className="text-emerald-500">
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
            postLikesInfo.isPostLikedByCurrentUser
              ? 'likesButton bg-emerald-500 text-white'
              : 'likesButton'
          }`}
          onClick={putLikeForPost}
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
            <div>{postLikesInfo.amountOfPostLikes}</div>
          </div>
        </button>
      </div>
    </div>
  );
};
