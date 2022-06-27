import { DownloadFile } from "./download-file";
import { Job, JobState } from "./types";
import { DownloaderUtil, ExternalAPI } from "./util";

export class VideoToMp3Job implements Job {
  public url!: string;
  public state: JobState = "pending";
  public progress: number = 0;
  public videoTitle!: string;
  public destination!: string;
  private externalPID!: string;
  private downloadUrl!: string;
  public downloadFileService: DownloadFile;

  constructor(job: Partial<Job>) {
    Object.assign(this, job);
    this.downloadFileService = new DownloadFile(this.destination);
  }

  private get videoId() {
    return this.url.replace(/.*(watch.*)/g, "$1");
  }

  get logStatus() {
    return (
      DownloaderUtil.log(this.state) +
      "\t" +
      DownloaderUtil.log(this.videoTitle || this.videoId, { truncLen: 30 }) +
      "\t" +
      DownloaderUtil.makeProgressBar(this.progress)
    );
  }

  public async convert() {
    this.state = "processing";
    const result = await ExternalAPI.requestConversion(this.url, "mp3");
    if (!result.data.success) {
      this.state = "failed";
      return;
    }
    this.videoTitle = result.data.title;
    this.externalPID = result.data.id;
    this.checkProgress();
  }

  public download() {
    this.state = "downloading";
    this.progress = 0;
    this.downloadFileService.on("finished", () => {
      this.state = "finished";
      this.progress = 1;
    });
    this.downloadFileService.on("progress", (progress) => {
      this.progress = progress;
    });
    this.downloadFileService.download(this.downloadUrl);
  }

  private checkProgress() {
    const interval = setInterval(async () => {
      const result = await ExternalAPI.checkProgress(this.externalPID);
      this.progress = result.data.progress / 1000;
      if (result.data.success) {
        this.downloadUrl = result.data.download_url;
        this.progress = 1;
        clearInterval(interval);
        return 
      }
    }, 1000);
  }
}
