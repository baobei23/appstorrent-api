export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface Programs {
  _id: string;
  title: string;
  version: string;
  img: string;
  category: string[];
  url: string;
  size: string;
}

export interface ProgramDetails extends Omit<Programs, "url"> {
  posters: string[];
  developer: string;
  interface_language: string;
  activation: string;
  compatibility: string;
  architecture: string;
  note: string;
  downloads: DownloadLink[];
  previous_version: DownloadLink[];
  description: string[];
  newFeatures: string;
  officialSite: string;
  faq: Paragraph[];
}

export interface Paragraph {
  title: string;
  content: string;
}

export interface DownloadLink {
  type: string;
  link: string;
}

export interface Games extends Omit<Programs, "version"> {}

export interface GameDetails
  extends Omit<ProgramDetails, "compatibility" | "note" | "newFeatures"> {
  releaseDate: string;
  tested: string;
  requirements: string[];
}

export interface ISetOfCategory {
  parameter: string;
  name: string;
  url: string;
}
