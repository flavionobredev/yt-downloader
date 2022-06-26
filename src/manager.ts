import { Job } from "./job";
import { Commom } from "./util";

type Options = {
  maxConcurrency: number;
};

export class Manager {
  private jobs = new Map<string, Job>();

  private options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  get activeJobs() {
    const running = [] as Job[];
    for(const job of this.jobs.values()){
      if(job.state !== "finished"){
        running.push(job)
      }
    }
    return running;
  }

  start(){
    this.initBatchProcessing();
  }

  private async initBatchProcessing(){
    let index = 0;
    for(const job of this.jobs.values()){
      index++;
      console.log('iniciando job', job.url, job.state)
      if(job.state === "pending"){
        job.convert();
        await Commom.sleep(1000)
      }
      if(index % this.options.maxConcurrency === 0){
        await Commom.sleep(5000)
      }
    }    
  }

  addJob(key: string, job: Job) {
    if (job.state !== "pending")
      throw new Error("not possible add a started job");
    this.jobs.set(key, job);
  }

  logStatus() {
    this.jobs.forEach((job) => console.log(job.logStatus));
  }

}
