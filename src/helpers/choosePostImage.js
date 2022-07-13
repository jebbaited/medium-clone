export const postImgSrc = (image) => {
  const defaultImage = 'https://tl.rulate.ru/i/book/19/10/18925.jpg';

  let imageSrc = '';

  imageSrc = image
    ? `http://test-blog-api.ficuslife.com${image}`
    : defaultImage;

  return imageSrc;
};
