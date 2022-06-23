import { Job } from "./job";

export class Manager {
  private jobs = new Map<string, Job>();

  constructor() {}

  addJob(key: string, job: Job) {
    if (job.state !== "pending")
      throw new Error("not possible to add a started job");
    this.jobs.set(key, job);
  }
}
