import { IComment } from '../types/types';
import { findCommentsRecursive } from './recursiveComments';

const commentFirst: IComment = {
  _id: '612f99dbc46d5405b355d8de',
  commentedBy: '612dfff0c46d5405b35529d2',
  followedCommentID: null,
  postID: '612cb4af902cf330b086a365',
  text: 'and this is my first comment',
  dateCreated: '2021-09-01T15:18:51.859Z',
  likes: ['612cb18e902cf330b086a25b', '612de7d3c46d5405b35520e1'],
};
const commentSecond: IComment = {
  _id: '612f99dbc46d5405b355d823',
  commentedBy: '612dfff0c46d5405b35529d2',
  followedCommentID: '612f99dbc46d5405b355d8de',
  postID: '612cb4af902cf330b086a365',
  text: 'and this is my second comment',
  dateCreated: '2021-09-01T15:20:51.859Z',
  likes: ['612cb18e902cf330b086a25b', '612de7d3c46d5405b35520e1'],
};
const commentThird: IComment = {
  _id: '612f99dbc46d5405b355d845',
  commentedBy: '612dfff0c46d5405b35529d2',
  followedCommentID: '612f99dbc46d5405b355d8de',
  postID: '612cb4af902cf330b086a365',
  text: 'and this is my third comment',
  dateCreated: '2021-09-01T15:30:51.859Z',
  likes: ['612cb18e902cf330b086a25b', '612de7d3c46d5405b35520e1'],
};

const commentsArray: IComment[] = [commentFirst, commentSecond, commentThird];

const commentWithAnswers = {
  _id: '612f99dbc46d5405b355d8de',
  answers: [
    {
      _id: '612f99dbc46d5405b355d845',
      answers: null,
      commentedBy: '612dfff0c46d5405b35529d2',
      followedCommentID: '612f99dbc46d5405b355d8de',
      postID: '612cb4af902cf330b086a365',
      text: 'and this is my third comment',
      dateCreated: '2021-09-01T15:30:51.859Z',
      likes: ['612cb18e902cf330b086a25b', '612de7d3c46d5405b35520e1'],
    },
    {
      _id: '612f99dbc46d5405b355d823',
      answers: null,
      commentedBy: '612dfff0c46d5405b35529d2',
      followedCommentID: '612f99dbc46d5405b355d8de',
      postID: '612cb4af902cf330b086a365',
      text: 'and this is my second comment',
      dateCreated: '2021-09-01T15:20:51.859Z',
      likes: ['612cb18e902cf330b086a25b', '612de7d3c46d5405b35520e1'],
    },
  ],
  commentedBy: '612dfff0c46d5405b35529d2',
  followedCommentID: null,
  postID: '612cb4af902cf330b086a365',
  text: 'and this is my first comment',
  dateCreated: '2021-09-01T15:18:51.859Z',
  likes: ['612cb18e902cf330b086a25b', '612de7d3c46d5405b35520e1'],
};

describe('findCommentsRecursive', () => {
  test('Right data', () => {
    expect(findCommentsRecursive).toBeDefined();
    expect(findCommentsRecursive(commentsArray)).toEqual([commentWithAnswers]);
    expect(findCommentsRecursive(commentsArray)).not.toContain(commentSecond);
    expect(findCommentsRecursive(commentsArray)).not.toContain(commentThird);
  });
});
