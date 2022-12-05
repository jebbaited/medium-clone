/* Функция для подсчета параметра 'skip' в запросе '/posts'.
  Позволяет узнать сколько "лишних" постов содержится в параметре "total", чтобы 
  в итоге подсчитать выводимое количество на первую страницу и далее.

  Пример:
  total: 482, limit: 10, lastPageNumber: 49, currentPage: 40

  Имеем 49 страниц в итоге: total / limit с округлением вверх.
  Далее считаю количество постов, которые являются лишними (total - последняя страница * limit): 482 - 49 * 10 = -8
  Т.е. 8 постов лишние и на последней странице будут отображены только 2 поста. А для этого необходимо сдвинуть на эти 2 поста
  остальные запросы, чтобы отображать по 10 постов на странице в т.ч. и на первой.

  Далее вычисляется проскаемое количество постов на основе вышеприведенного.
  10 * 40 - (10 - (-8)) = 400 - 18 = 382
  Т.е. при переходе на 40-ю страницу в запросе поле skip будет заполнено значением 382
*/

export const countPostsSkip = (
  currentPage: number,
  lastPageNumber: number | string,
  total: number | string,
  limit: number | string
): string => {
  let skip = null;
  const additionalPost = +total - +limit * +lastPageNumber;
  skip = +limit * currentPage - (+limit - additionalPost);
  if (skip < 0) {
    skip = 0;
    return skip.toString();
  }
  return skip.toString();
};
