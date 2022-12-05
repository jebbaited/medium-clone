import { IComment } from '../types/types';

const commentsWithFollowedCommentsRecursive = (
  comments: IComment[],
  commentsForComments: IComment[]
): IComment[] => {
  const commentsWithFollowedComments = comments?.map((comment: IComment) => {
    const answers = commentsForComments?.filter(
      (followedComment: IComment) =>
        followedComment.followedCommentID === comment._id
    );
    return answers?.length === 0
      ? { ...comment, answers: null }
      : {
          ...comment,
          answers: commentsWithFollowedCommentsRecursive(
            answers?.reverse(),
            commentsForComments
          ),
        };
  });
  return commentsWithFollowedComments;
};

export const findCommentsRecursive = (rawComments: IComment[]): IComment[] => {
  const comments = rawComments?.filter(
    (comment: IComment) => comment.followedCommentID === null
  );

  const commentsForComments = rawComments?.filter(
    (comment: IComment) => comment.followedCommentID !== null
  );

  return commentsWithFollowedCommentsRecursive(
    comments,
    commentsForComments
  ).reverse();
};
