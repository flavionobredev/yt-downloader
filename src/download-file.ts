import axios from "axios";
import EventEmitter from "events";
import { createWriteStream } from "fs";
import { DownloaderUtil } from "./util";

export class DownloadFile extends EventEmitter {
  private destination: string;

  constructor(dest: string) {
    super()
    this.destination = dest;
  }

  public async download(url: string) {
    const stream = await axios.get(url, {
      responseType: "stream",
      headers: {
        "x-personal-use": true,
      },
    });
    const filename = DownloaderUtil.getFilenameByHeader(
      stream.headers["content-disposition"]
    );
    console.log(stream.headers);
    let downloaded = 0;
    stream.data.pipe(createWriteStream(`${this.destination}/${filename}`));
    stream.data.on("data", (chunk: string) => {
      downloaded = downloaded + chunk.length;
      // console.log(`percent: ${chunk.length/Number(stream.headers["content-length"])}`);
      console.log(
        `percent: ${downloaded / Number(stream.headers["content-length"])}`
      );
    });
    stream.data.on("end", () => {
      console.log(`download from "${filename}" has completed`);
    });
  }
}
