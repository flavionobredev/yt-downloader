import { ConvertFileService } from "./convert-file";
import { DownloadFile } from "./download-file";

type JobState = "pending" | "processing" | "downloading"

export interface Job {
  url: string;
  state: JobState;
  progress: number;
  videoTitle: string;
}

export class VideoToMp3Job implements Job {
  public url: string;
  public state: JobState;
  public progress: number;
  public videoTitle: string;
  public destination: string;
  public downloadFileService: DownloadFile;
  private convertFileService = ConvertFileService;

  
  constructor(job: Partial<Job>) {
    Object.assign(this, job);
    this.downloadFileService = new DownloadFile(this.destination)
  }

  get logStatus() {
    return `${this.videoTitle}: ${this.progress}%`;
  }

  public convert(){
    this.state = 'processing';
    this.convertFileService.requestConversion(this.url, "mp3")

    // TODO: adicionar evento de processamento concluído
  }

  public download(){
    this.state = "downloading";
    this.progress = 0;
    // this.downloadFileService.download(this.url)
  }
}
