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

export type Tags = {
  name: string;
  _id: string;
  chapter: string;
};

export type Question = {
  details: string;
  _id: string;
  tags: Partial<Tags>[];
  chapter: string;
  imageLocations: string[];
};
