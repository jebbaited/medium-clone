import React, { useCallback, useEffect, useState, FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useParams } from 'react-router';
import { SubmitHandler, useForm } from 'react-hook-form';

import { imgSrc } from '../../helpers/chooseAvatarImage';

import { Button } from '../../UI/Button';
import { ButtonForCommentSection } from '../../UI/ButtonForCommentSection';
import { Loader } from '../../UI/Loader';
import { Textarea } from '../../UI/Textarea';
import {
  createComment,
  deleteCommentById,
  getAllCommentsByPostId,
  updateCommentById,
} from '../../store/commentsSlice';
import { usePagination } from '../../hooks/usePagination';
import { PaginationBar } from '../../UI/PaginationBar';
import validateRules from '../../helpers/validateRules';
import { IComment } from '../../types/types';
import { SingleComment } from './SingleComment';

interface Props {
  commentIdToReply?: string;
  isReplied?: boolean;
  answers?: IComment[];
  isShowComments?: boolean;
}

interface ICommentFormData {
  comment: string;
}

export const CommentsSection: FC<Props> = ({
  commentIdToReply,
  isReplied,
  answers,
  isShowComments,
}) => {
  const [showPagination, setShowPagination] = useState<boolean>(false);
  const [commentsToShow, setCommentsToShow] = useState<IComment[]>(null);

  const params = useParams();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.user);
  const commentsFromStore = useAppSelector(
    (state) => state.comments.commentsForPost
  );
  const lastPageNumber = useAppSelector(
    (state) => state.comments.lastPageNumber
  );

  const {
    page,
    disableNextButton,
    disableBackButton,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  } = usePagination(lastPageNumber);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<ICommentFormData>({
    mode: 'onChange',
  });

  const checkAllComments = useCallback((): void => {
    if (commentsFromStore?.length > 10) {
      const skip = 10;
      const lastCommentsQuantity =
        skip - (lastPageNumber * skip - commentsFromStore?.length);
      setShowPagination(true);

      if (+params.pageNumber === lastPageNumber) {
        setCommentsToShow([
          ...commentsFromStore.slice(
            (+params.pageNumber - 1) * skip,
            +params.pageNumber * skip - lastCommentsQuantity
          ),
        ]);
        return;
      }

      if (params.pageNumber === undefined) {
        setCommentsToShow([...commentsFromStore.slice(0, skip - 1)]);
        return;
      }

      setCommentsToShow([
        ...commentsFromStore.slice(
          (+params.pageNumber - 1) * skip,
          +params.pageNumber * skip
        ),
      ]);

      return;
    }
    setCommentsToShow([...commentsFromStore]);
  }, [commentsFromStore, lastPageNumber, params.pageNumber]);

  const getAllComments = useCallback((): void => {
    const commentsForPostFromStore = commentsFromStore.filter(
      (comment: IComment) => comment.postID === params.postId
    );
    if (commentsForPostFromStore.length > 0) {
      return;
    }
    dispatch(getAllCommentsByPostId({ id: params.postId }));
  }, [dispatch, commentIdToReply, params.postId]);

  const addNewComment = useCallback(
    (newCommentText: string): void => {
      dispatch(
        createComment({ id: params.postId, newCommentText, commentIdToReply })
      );
      resetField('comment');
    },
    [dispatch, params.postId, commentIdToReply]
  );

  const deleteComment = useCallback(
    (commentId: string): void => {
      dispatch(deleteCommentById(commentId));
    },
    [dispatch]
  );

  const saveChangesAfterEditing = useCallback(
    (commentId: string, text: string): void => {
      dispatch(updateCommentById({ commentId, text }));
    },
    [dispatch]
  );

  const cancel = () => {
    resetField('comment');
  };

  const handleNewComment: SubmitHandler<ICommentFormData> = (
    formData
  ): void => {
    addNewComment(formData.comment);
  };

  const buttonDisabled: boolean = !!Object.keys(errors).length;

  useEffect(() => {
    if (!isShowComments) getAllComments();
  }, [isShowComments, getAllComments]);

  useEffect(() => {
    setShowPagination(false);
    checkAllComments();
  }, [isShowComments, checkAllComments]);

  return (
    <>
      {!commentsToShow ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-center">
            <div className={isShowComments ? 'w-full' : 'w-1/2'}>
              {!isReplied && currentUser && (
                <form onSubmit={handleSubmit(handleNewComment)}>
                  <div className="flex justify-start w-full mt-5">
                    <img
                      src={imgSrc(currentUser)}
                      className="small-avatar"
                      alt="nothing"
                    />
                    <div className="w-full">
                      <Textarea
                        id="commentField"
                        rows={isShowComments ? '2' : '3'}
                        name="comment"
                        placeholder="Leave a comment..."
                        register={{
                          ...register(
                            'comment',
                            validateRules.commentValidateRules
                          ),
                        }}
                        errorMessage={errors}
                      />
                      <div className="flex justify-end items-center">
                        <div className="mr-1">
                          <ButtonForCommentSection
                            onClick={handleSubmit(() => cancel())}
                            className="text-base"
                          >
                            Cancel
                          </ButtonForCommentSection>
                        </div>
                        <div>
                          <Button
                            className={
                              isShowComments ? 'px-1 py-1 text-sm' : ''
                            }
                            disabled={buttonDisabled}
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div
            className={`flex flex-col items-center ${
              isShowComments ? 'mt-5' : ''
            }`}
          >
            <div className={isShowComments ? 'w-full ml-20' : 'w-1/2'}>
              <div
                className={`flex flex-col items-left ${
                  isShowComments ? 'w-3/4' : 'w-1/2'
                }`}
              >
                <div className="flex flex-col items-left w-full">
                  {!commentsToShow.length && (
                    <div className="h-[100vh]">
                      <p className="text-left">There is no comments yet...</p>
                    </div>
                  )}
                  {!isShowComments
                    ? commentsToShow?.map((comment: IComment) => (
                        <div key={comment._id}>
                          <SingleComment
                            commentData={comment}
                            deleteComment={deleteComment}
                            saveChanges={saveChangesAfterEditing}
                            isReplied={isReplied}
                            isUserLoggedIn={currentUser === null ? false : true}
                          />
                        </div>
                      ))
                    : answers?.map((comment: IComment) => (
                        <div key={comment._id}>
                          <SingleComment
                            commentData={comment}
                            deleteComment={deleteComment}
                            saveChanges={saveChangesAfterEditing}
                            isReplied={isReplied}
                          />
                        </div>
                      ))}

                  {showPagination && !isShowComments && (
                    <PaginationBar
                      page={page}
                      firstPage={firstPage}
                      prevPage={prevPage}
                      nextPage={nextPage}
                      lastPage={lastPage}
                      disableBackButton={disableBackButton}
                      disableNextButton={disableNextButton}
                      lastPageNumber={lastPageNumber}
                      isNavigateThroughtComments={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
