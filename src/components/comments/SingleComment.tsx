import React, { useCallback, useEffect, useState, FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';

import { CommentsSection } from './CommentsSection';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { timeFromNow } from '../../helpers/convertDate';
import { ButtonForCommentSection } from '../../UI/ButtonForCommentSection';
import { Loader } from '../../UI/Loader';
import { Textarea } from '../../UI/Textarea';
import { UserBar } from '../../UI/UserBar';
import { commentsAPI } from '../../api/commentsAPI';
import { getUserById } from '../../store/userSlice';
import validateRules from '../../helpers/validateRules';
import { ILikeInfo, IUser } from '../../types/types';

interface Props {
  commentData: any;
  deleteComment: (commentId: string) => void;
  saveChanges: (commentId: string, text: string) => void;
  isReplied?: boolean;
  isUserLoggedIn?: boolean;
}

interface IEditCommentFormData {
  editComment: string;
}

export const SingleComment: FC<Props> = ({
  commentData,
  deleteComment,
  saveChanges,
  isReplied,
  isUserLoggedIn,
}) => {
  const [creatorOfCommentData, setCreatorOfCommentData] = useState<IUser>({
    name: '',
    avatar: '',
    _id: '',
  });
  const [commentLikesInfo, setCommentLikesInfo] = useState<ILikeInfo>({
    isLikedByCurrentUser: false,
    amountOfLikes: 0,
  });
  const [dateCommentCreated, setDateCommentCreated] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(true);
  const [isShowComments, setSsShowComments] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.user);
  const allUsers = useAppSelector((state) => state.user.allUsers);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<IEditCommentFormData>({
    mode: 'onChange',
    defaultValues: {
      editComment: commentData.text,
    },
  });

  const findCurrentUserLikesForComment = useCallback(
    (likesOfAllUsers: string[]): boolean =>
      currentUser && likesOfAllUsers.includes(currentUser._id),
    [currentUser]
  );

  const getCommentCreator = useCallback((): void => {
    const commentCreatorFromStore = allUsers.filter(
      (user: IUser) => user._id === commentData.commentedBy
    );
    if (commentCreatorFromStore.length > 0) {
      setCreatorOfCommentData({
        name: commentCreatorFromStore[0].name,
        avatar: imgSrc(commentCreatorFromStore[0]),
        _id: commentCreatorFromStore[0]._id,
      });
      return;
    }
    dispatch(getUserById(commentData.commentedBy));
  }, [commentData, allUsers, dispatch]);

  const setLikeForComment = useCallback(async (): Promise<void> => {
    if (currentUser) {
      try {
        await commentsAPI.setLikeForComment(commentData._id);
        setCommentLikesInfo({
          isLikedByCurrentUser: !commentLikesInfo.isLikedByCurrentUser,
          amountOfLikes: commentLikesInfo.isLikedByCurrentUser
            ? commentLikesInfo.amountOfLikes - 1
            : commentLikesInfo.amountOfLikes + 1,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [
    commentData._id,
    commentLikesInfo.amountOfLikes,
    commentLikesInfo.isLikedByCurrentUser,
    currentUser,
  ]);

  const setInitialStates = useCallback((): void => {
    setDateCommentCreated(timeFromNow(commentData.dateCreated));
    setCommentLikesInfo({
      isLikedByCurrentUser: findCurrentUserLikesForComment(commentData.likes),
      amountOfLikes: commentData.likes.length,
    });
  }, [findCurrentUserLikesForComment, commentData]);

  const editComment = (): void => {
    setIsEditing(!isEditing);
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
    resetField('editComment');
  };

  const saveAndCancel = (editedText: string): void => {
    saveChanges(commentData._id, editedText);
    setIsEditing(false);
  };

  const replyClicked = (): void => {
    setIsReplying(!isReplying);
    setSsShowComments(true);
  };

  const showComments = (): void => {
    if (commentData.answers) {
      setSsShowComments(!isShowComments);
      setIsReplying(true);
    }
  };

  const handleEditingComment: SubmitHandler<IEditCommentFormData> = (
    formData
  ): void => {
    saveAndCancel(formData.editComment);
  };

  useEffect(() => {
    getCommentCreator();
    setInitialStates();
  }, [getCommentCreator, setInitialStates]);

  return (
    <>
      {!creatorOfCommentData && <Loader />}

      <div className="mb-4 flex flex-col">
        <UserBar
          creatorData={creatorOfCommentData}
          dateCreated={dateCommentCreated}
          likesInfo={commentLikesInfo}
          putLike={setLikeForComment}
        />

        {isEditing ? (
          <form onSubmit={handleSubmit(handleEditingComment)}>
            <div className="flex justify-start w-full mt-5 mb-3">
              <div className="w-full">
                <Textarea
                  id="editCommentField"
                  rows="2"
                  name="editComment"
                  placeholder="Leave a comment..."
                  register={{
                    ...register(
                      'editComment',
                      validateRules.commentValidateRules
                    ),
                  }}
                  errorMessage={errors}
                />
                <div className="flex justify-end mb-1">
                  <ButtonForCommentSection
                    onClick={handleSubmit(() => cancelEditing())}
                  >
                    Cancel
                  </ButtonForCommentSection>

                  <ButtonForCommentSection>Save</ButtonForCommentSection>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <p className="break-words text-left text-black mb-1 min-width-23 dark:text-gray-400">
            {commentData.text}
          </p>
        )}
        {currentUser?._id === commentData.commentedBy && !isEditing ? (
          <>
            <div className="flex justify-between">
              <div className="flex">
                <ButtonForCommentSection onClick={replyClicked}>
                  Reply
                </ButtonForCommentSection>

                <ButtonForCommentSection
                  onClick={showComments}
                  disabled={!commentData.answers}
                >
                  Comments({commentData.answers?.length || 0})
                </ButtonForCommentSection>
              </div>

              <div className="flex">
                <ButtonForCommentSection onClick={editComment}>
                  Edit
                </ButtonForCommentSection>

                <ButtonForCommentSection
                  onClick={() => deleteComment(commentData._id)}
                >
                  Delete
                </ButtonForCommentSection>
              </div>
            </div>
          </>
        ) : (
          <div className="text-start">
            <ButtonForCommentSection
              onClick={replyClicked}
              disabled={!isUserLoggedIn}
            >
              Reply
            </ButtonForCommentSection>

            <ButtonForCommentSection
              onClick={showComments}
              disabled={!commentData.answers}
            >
              Comments({commentData.answers?.length || 0})
            </ButtonForCommentSection>
          </div>
        )}
        {isShowComments ? (
          <div className="w-full">
            <CommentsSection
              commentIdToReply={commentData._id}
              isReplied={isReplying}
              isShowComments={isShowComments}
              answers={commentData.answers}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};
