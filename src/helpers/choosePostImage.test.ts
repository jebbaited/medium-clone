import { postImgSrc } from './choosePostImage';

describe('postImgSrc', () => {
  test('Img from the server', () => {
    expect(postImgSrc('some_img')).toBe(
      'http://test-blog-api.ficuslife.comsome_img'
    );
    expect(postImgSrc('http://test-blog-api.ficuslife.comsome_img')).toMatch(
      'http://test-blog-api.ficuslife.com'
    );
  });
  test('Post without img', () => {
    expect(postImgSrc(null)).toBe(
      'https://tl.rulate.ru/i/book/19/10/18925.jpg'
    );
  });
});
