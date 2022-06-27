import { existsSync, mkdirSync } from "fs";
import { VideoToMp3Job } from "./video-to-mp3-job";
import { Manager } from "./manager";
import { ExternalAPI } from "./util";

export class Downloader {
  private destination: string;
  private playlistUrl: string;
  private options: Downloader.Options;

  private manager: Manager;

  constructor(playlistUrl: string, dest: string, options: Downloader.Options) {
    this.destination = dest;
    this.playlistUrl = playlistUrl;
    this.options = options;
    this.createDestinationFolder();
    this.manager = new Manager({
      maxConcurrency: this.options.maxConcurrency,
    });
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

    const videos = playlistInfo.videos as string[];
    videos.forEach((video) =>
      this.manager.addJob(
        video,
        new VideoToMp3Job({
          url: video,
          destination: this.destination,
        })
      )
    );

    this.manager.start();
    const logInterval = setInterval(() => {
      if (this.manager.activeJobs.length === 0) {
        clearInterval(logInterval);
      }
      console.clear();
      this.manager.logStatus();
    }, 500);
  }
}

export namespace Downloader {
  export type Options = {
    maxConcurrency: number;
  };
}
