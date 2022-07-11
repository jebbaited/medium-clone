export const imgSrc = (user) => {
  const defaultAvatar =
    'https://desu.shikimori.one/system/users/x160/756353.png?1605088232';
  const deletedUser =
    'https://thumbs.dreamstime.com/b/delete-user-line-icon-remove-account-outline-logo-illust-illustration-linear-pictogram-isolated-white-90235767.jpg';
  let imageSrc = '';

  if (user === 'No such user') {
    imageSrc = deletedUser;
    return imageSrc;
  }

  if (user) {
    imageSrc = user.avatar
      ? `http://test-blog-api.ficuslife.com${user.avatar}`
      : defaultAvatar;
  }
  return imageSrc;
};
