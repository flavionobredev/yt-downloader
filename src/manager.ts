import { Job } from "./types";
import { Commom, DownloaderUtil } from "./util";

export class Manager {
  private jobs = new Map<string, Job>();

  private options: Manager.Options;

  constructor(options: Manager.Options) {
    this.options = options;
  }

  get activeJobs() {
    const running = [] as Job[];
    for (const job of this.jobs.values()) {
      if (!["finished", "failed"].includes(job.state)) {
        running.push(job);
      }
    }
    return running;
  }

  public start() {
    this.initBatchProcessing();
    this.initBatchDownloading();
  }

  public addJob(key: string, job: Job) {
    if (job.state !== "pending")
      throw new Error("not possible add a started job");
    this.jobs.set(key, job);
  }

  public logStatus() {
    console.log(
      DownloaderUtil.log("STATUS"),
      "\t" + DownloaderUtil.log("TITLE", { truncLen: 30 }),
      "\t" + DownloaderUtil.log("PROGRESS")
    );
    this.jobs.forEach((job) => console.log(job.logStatus));
  }

  private async initBatchProcessing() {
    let index = 0;
    for (const job of this.jobs.values()) {
      index++;
      if (job.state === "pending") {
        job.convert();
        await Commom.sleep(800);
      }
      if (index % this.options.maxConcurrency === 0) {
        await Commom.sleep(7000);
      }
    }
  }

  private async initBatchDownloading() {
    const downloadInterval = setInterval(() => {
      if (this.activeJobs.length === 0) {
        clearInterval(downloadInterval);
        return 
      }

      if (
        this.activeJobs.filter((job) => job.state === "downloading").length >=
        this.options.maxConcurrency
      ) {
        return;
      }

      const job = this.activeJobs.find(
        (job) => job.state === "processing" && job.progress === 1
      );
      if (job) job.download();
    }, 200);
  }
}

export namespace Manager {
  export type Options = {
    maxConcurrency: number;
  };
}
