export enum KeyStrings {
  accessToken = 'accessToken',
  currentTheme = 'current-theme',
}

export interface IUser {
  _id?: string;
  email?: string;
  name?: string;
  avatar?: string;
  extra_details?: string;
  skills?: string;
  profession?: string;
  details?: string;
  dateCreated?: string;
}

export interface IPaginationFromResponse {
  limit: string;
  skip: string;
  total: string;
}

export interface IPaginationTForRequest {
  lastPageNumber: number | string;
  total: number | string;
  limit: number | string;
}

export interface IAllUsers {
  pagination: IPaginationFromResponse;
  data: IUser[];
}

export interface IPost {
  _id: string;
  title: string;
  fullText: string;
  description: string;
  dateCreated: string;
  image?: string;
  likes: string[];
  postedBy: string;
}

export interface IAllPosts {
  pagination: IPaginationFromResponse;
  data: IPost[];
}

export interface IComment {
  _id: string;
  commentedBy: string;
  followedCommentID: string;
  postID: string;
  text: string;
  dateCreated: string;
  likes: string[];
}

export interface ILikeInfo {
  isLikedByCurrentUser: boolean;
  amountOfLikes: number;
}

export interface IToken {
  data: {
    token: string;
  };
}
