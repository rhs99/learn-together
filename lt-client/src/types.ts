export type Class = {
  name: string;
  _id: string;
  subjects: string[];
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
};

export type Tag = {
  name: string;
  _id: string;
  chapter: string;
};

export type Answer = {
  _id: string;
  details: any;
  imageLocations: string[];
  question: string;
  user: User;
  upVote: number;
  downVote: number;
};

export type Question = {
  details: any;
  _id: string;
  tags: Tag[];
  chapter: string;
  imageLocations: string[];
  user: User;
  upVote: number;
  downVote: number;
  answers: string[];
};
