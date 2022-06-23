import { existsSync, mkdirSync } from "fs";
import { DownloadFile } from "./download-file";
import { Job } from "./job";
import { ExternalAPI } from "./util";

type Options = {
  maxConcurrency: number;
};

export class Downloader {
  private destination: string;
  private playlistUrl: string;
  private downloadFile: DownloadFile;
  private options: Options;

  private jobs = new Map<string, Job>()

  constructor(playlistUrl: string, dest: string, options: Options) {
    this.destination = dest;
    this.playlistUrl = playlistUrl;
    this.options = options;
    this.createDestinationFolder();
    this.downloadFile = new DownloadFile(this.destination);
  }

  private createDestinationFolder(): void {
    if (!existsSync(this.destination)) {
      mkdirSync(this.destination, { recursive: true });
    }
  }

  public async init(): Promise<void> {
    const playlistInfo = await ExternalAPI.getVideos(this.playlistUrl);

    if (!playlistInfo.status) {
      throw new Error(
        "Get playlist info failed. Please check if playlist is public."
      );
    }

    const videos = playlistInfo.videos;

    // this.downloadFile.download(videos[0]);

    // console.log(videos);
  }
}
