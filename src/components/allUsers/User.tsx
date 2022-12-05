import React, { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { IUser } from '../../types/types';
import { UserBar } from '../../UI/UserBar';

interface Props {
  userData: IUser;
}

export const User: FC<Props> = ({ userData }) => {
  const [creatorData, setCreatorData] = useState<IUser>({
    name: '',
    avatar: '',
    _id: '',
    profession: '',
  });

  const setUserInfo = useCallback((): void => {
    setCreatorData({
      name: userData.name,
      avatar: imgSrc(userData),
      _id: userData._id,
      profession: userData.profession,
    });
  }, [userData]);

  useEffect(() => {
    setUserInfo();
  }, [setUserInfo]);

  return (
    <>
      <div className="mb-4">
        <UserBar creatorData={creatorData} dateCreated={userData.profession} />
      </div>
    </>
  );
};
