export const imgSrc = (user) => {
  const defaultAvatar =
    'https://desu.shikimori.one/system/users/x160/756353.png?1605088232';
  let imageSrc = '';
  if (user) {
    imageSrc = user.avatar
      ? `http://test-blog-api.ficuslife.com${user.avatar}`
      : defaultAvatar;
  }
  return imageSrc;
};
