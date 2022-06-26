import { ConvertFileService } from "./convert-file";
import { DownloadFile } from "./download-file";
import { StringUtil } from "./util";

type JobState = "pending" | "processing" | "downloading" | "finished";

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

export class VideoToMp3Job implements Job {
  public url!: string;
  public state: JobState = "pending";
  public progress: number = 0;
  public videoTitle!: string;
  public destination!: string;
  private externalPID!: string;
  private downloadUrl!: string;
  public downloadFileService: DownloadFile;
  private convertFileService = ConvertFileService;

  constructor(job: Partial<Job>) {
    Object.assign(this, job);
    this.downloadFileService = new DownloadFile(this.destination);
  }

  private get videoId() {
    return this.url.replace(/.*(watch.*)/g, "$1");
  }

  get logStatus() {
    return `${this.state}\t[${StringUtil.truncate(
      this.videoTitle || this.videoId,
      20
    )}] >>>> ${(this.progress * 100).toFixed(0)}%`;
  }

  public async convert() {
    this.state = "processing";
    const result = await this.convertFileService.requestConversion(
      this.url,
      "mp3"
    );
    if (!result.data.success) {
      throw new Error("Convert failed");
    }
    this.state = "processing";
    this.videoTitle = result.data.title;
    this.externalPID = result.data.id;
    this.checkProgress();
  }

  public download() {
    this.state = "downloading";
    this.progress = 0;
    this.downloadFileService.download(this.downloadUrl);
    this.downloadFileService.on("finished", () => {
      this.state = "finished";
      this.progress = 1;
    });
    this.downloadFileService.on("progress", (progress) => {
      this.progress = progress;
    });
  }

  private checkProgress() {
    const interval = setInterval(async () => {
      const result = await this.convertFileService.checkProgress(
        this.externalPID
      );
      this.progress = result.data.progress / 1000;
      if (result.data.success) {
        clearInterval(interval);
        this.downloadUrl = result.data.download_url;
        this.download();
      }
    }, 1000);
  }
}
