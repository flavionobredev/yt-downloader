export type JobState = "pending" | "processing" | "downloading" | "finished" | "failed";


export interface Job {
  url: string;
  state: JobState;
  progress: number;
  videoTitle: string;
  logStatus: string;
  destination: string;
  convert(): void;
  download(): void;
}