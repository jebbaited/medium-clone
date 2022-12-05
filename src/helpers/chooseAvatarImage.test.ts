import { IUser } from '../types/types';
import { imgSrc } from './chooseAvatarImage';

const user: IUser = {
  _id: 'dfhg43h33j4lgi5nwe9h5',
  email: 'someEmail@gmail.com',
  name: 'myname',
  avatar:
    '/users/612cae78ae32c13081a6af5e/1afed7b46b838c17f68589ee31e9a7a3.jpeg',
  extra_details: '',
  skills: 'string',
  profession: '',
  details: '',
  dateCreated: '2021-08-30T10:23:03.389Z',
};
const userWithoutAvatar: IUser = {
  _id: 'dfhg43h33j4lgi5nwe9h5',
  email: 'someEmail@gmail.com',
  name: 'myname',
  extra_details: '',
  skills: 'string',
  profession: '',
  details: '',
  dateCreated: '2021-08-30T10:23:03.389Z',
};

describe('imgSrc', () => {
  test('User does not exist', () => {
    expect(imgSrc('No such user')).toBe(
      'https://thumbs.dreamstime.com/b/delete-user-line-icon-remove-account-outline-logo-illust-illustration-linear-pictogram-isolated-white-90235767.jpg'
    );
  });
  test('User avatar exists', () => {
    expect(imgSrc(user)).toBe(
      `http://test-blog-api.ficuslife.com${user.avatar}`
    );
  });
  test('User without avatar', () => {
    expect(imgSrc(userWithoutAvatar)).toBe(
      'https://desu.shikimori.one/system/users/x160/756353.png?1605088232'
    );
  });
});
