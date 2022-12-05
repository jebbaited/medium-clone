export const postImgSrc = (image: string | null): string => {
  return image
    ? `http://test-blog-api.ficuslife.com${image}`
    : 'https://tl.rulate.ru/i/book/19/10/18925.jpg';
};
