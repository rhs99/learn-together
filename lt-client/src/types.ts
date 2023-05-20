import { type } from 'os';

export type Class = {
  name: string;
  _id: string;
};

export type Subject = {
  name: string;
  _id: string;
};

export type Chapter = {
  name: string;
  _id: string;
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
  details: string;
  imageLocations: string[];
  question: string;
  user: User;
  upVote: number;
  downVote: number;
};

export type Question = {
  details: string;
  _id: string;
  tags: Tag[];
  chapter: string;
  imageLocations: string[];
  user: User;
  upVote: number;
  downVote: number;
};
