import { Delta } from 'quill';

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
  details: Delta;
  imageLocations: string[];
  question: string;
  userName: string;
  upVote: number;
  downVote: number;
};

export type Question = {
  details: Delta;
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

// API and Error types
export type ApiError = {
  message: string;
  status?: number;
  data?: unknown;
};

export type HttpError = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
};

export type DonationInfo = {
  donor: string;
  amount: number;
  dateOfDonation: string;
  method: string;
  transactionID: string;
  contactInfo: string;
};

export type PaymentMethod = {
  _id: string;
  name: string;
  accountNumber?: string;
  details?: string;
};
