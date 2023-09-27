export interface IResponse {
  message: string;
  status: string;
  data: Data;
}

export interface Data {
  videos: Video[];
}

export interface Video {
  baseUrl: string;
  name: string;
  source: Processed;
  processed: Processed;
}

export interface Processed {
  url: string;
  meta: string;
}
