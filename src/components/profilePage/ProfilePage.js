import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import axios from '../../api/axios';
import { Post } from '../post/Post';

export const ProfilePage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const user = useSelector((state) => state.user.user);

  //   const [userTest, setUserTest] = useState(null);

  //   const params = useParams();

  //   const getUsers = async () => {
  //     const id = params.name;
  //     console.log(id);
  //     try {
  //       const response = await axios.get(`/users/`);
  //       console.log('users', response);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   useEffect(() => {
  //     getUsers();
  //   }, []);

  const getPostsOfUser = async () => {
    try {
      const response = await axios.get('/posts', {
        params: {
          postedBy: user._id,
        },
      });
      console.log(response.data.data);
      setUserPosts([...response.data.data]);
    } catch (error) {}
  };

  useEffect(() => {
    getPostsOfUser();
  }, [user]);

  return (
    <>
      {user ? (
        <>
          <div className="bg-gray-100 h-56 flex flex-col justify-center">
            <div className="flex flex-col items-center">
              <img
                src={imgSrc(user)}
                className="rounded-full object-cover h-24 w-24 mb-3"
              />
              <h2 className="font-bold">{user.name}</h2>
              <p className="mb-2">{user.details}</p>
            </div>
            <div className="self-end w-1/2">
              <Link to="/settings">
                <button className="border border-gray-400 px-2 py-1 text-gray-400 rounded-md hover:bg-slate-300">
                  Edit Profile Settings
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col justify-center w-1/2 mt-8">
              <p className="mr-10 self-start ml-10">My Posts</p>
              <div className="w-full self-center">
                {userPosts.map((post) => (
                  <Post post={post} key={post._id} />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
