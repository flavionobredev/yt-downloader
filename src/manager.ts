import { Job } from "./types";
import { Commom } from "./util";

export class Manager {
  private jobs = new Map<string, Job>();

  private options: Manager.Options;

  constructor(options: Manager.Options) {
    this.options = options;
  }

  get activeJobs() {
    const running = [] as Job[];
    for (const job of this.jobs.values()) {
      if (["finished", "failed"].includes(job.state)) {
        running.push(job);
      }
    }
    return running;
  }

  start() {
    this.initBatchProcessing();
  }

  private async initBatchProcessing() {
    let index = 0;
    for (const job of this.jobs.values()) {
      index++;
      if (job.state === "pending") {
        job.convert();
        await Commom.sleep(1000);
      }
      if (index % this.options.maxConcurrency === 0) {
        await Commom.sleep(5000);
      }
    }
  }

  addJob(key: string, job: Job) {
    if (job.state !== "pending")
      throw new Error("not possible add a started job");
    this.jobs.set(key, job);
  }

  logStatus() {
    console.log(`STATUS\tTITLE\tPROGRESS`);
    this.jobs.forEach((job) => console.log(job.logStatus));
  }
}

export namespace Manager {
  export type Options = {
    maxConcurrency: number;
  };
}
