export type Class = {
  name: string;
  _id: string;
  subjects: string[];
};

export type Privilege = {
  name: string;
  _id: string;
};

export type Subject = {
  name: string;
  _id: string;
  chapters: string[];
};

export type Chapter = {
  name: string;
  _id: string;
  questionsCount: number;
};

export type User = {
  _id: string;
  userName: string;
  questions?: number;
  answers?: number;
  class?: string;
  upVote?: number;
  downVote?: number;
};

export type Tag = {
  name: string;
  _id: string;
  chapter?: string;
};

export type Answer = {
  _id: string;
  details: any;
  imageLocations: string[];
  question: string;
  userName: string;
  upVote: number;
  downVote: number;
};

export type Question = {
  details: any;
  _id: string;
  tags: Tag[];
  chapter: string;
  imageLocations: string[];
  userName: string;
  upVote: number;
  downVote: number;
  answers: string[];
  isFavourite: boolean;
};

export type Breadcrumb = {
  name: string;
  url: string;
};
