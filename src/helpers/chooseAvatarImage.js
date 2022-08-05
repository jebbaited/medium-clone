export const imgSrc = (user) => {
  if (user === 'No such user') {
    return 'https://thumbs.dreamstime.com/b/delete-user-line-icon-remove-account-outline-logo-illust-illustration-linear-pictogram-isolated-white-90235767.jpg';
  }

  if (user) {
    return user.avatar
      ? `http://test-blog-api.ficuslife.com${user.avatar}`
      : 'https://desu.shikimori.one/system/users/x160/756353.png?1605088232';
  }
};
