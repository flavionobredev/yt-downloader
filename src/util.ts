import axios from "axios";
import { FILE_CONVERTER_URL, GET_PLAYLIST_INFO } from "./constants";

export namespace Commom {
  export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export namespace DownloaderUtil {
  export function getFilenameByHeader(header: string) {
    return decodeURIComponent(
      escape(header.replace(/.*filename="(.+)"/g, "$1"))
    );
  }

  export function log(message: string, options?: { truncLen: number }) {
    const maxSize = options?.truncLen ? options.truncLen : 15;
    return message.length > maxSize
      ? `${message.substring(0, maxSize)}...`
      : message + " ".repeat(maxSize + 3 - message.length);
  }

  export function makeProgressBar(percent: number) {
    return (
      "|" +
      "=".repeat(Math.floor(percent * 10)) +
      ">" +
      " ".repeat(10 - Math.floor(percent * 10)) +
      "|" +
      (percent * 100).toFixed(0) +
      "%"
    );
  }
}

export class ExternalAPI {
  public static async getVideos(playlistUrl: string) {
    return (
      await axios.get(GET_PLAYLIST_INFO, {
        params: {
          url: playlistUrl,
        },
      })
    ).data;
  }

  public static requestConversion(ytUrl: string, type = "mp3") {
    return axios.get<RequestConversionResponse>(
      `${FILE_CONVERTER_URL}/download.php`,
      {
        params: {
          format: type,
          url: ytUrl,
        },
      }
    );
  }

  public static checkProgress(externalPID: string) {
    return axios.get<CheckProgressResult>(
      `${FILE_CONVERTER_URL}/progress.php`,
      {
        params: {
          id: externalPID,
        },
      }
    );
  }
}

type RequestConversionResponse = {
  success: boolean;
  id: string;
  content: string;
  title: string;
};

type CheckProgressResult = {
  success: number;
  progress: number;
  download_url: string;
  text: "Finished" | "Initialising";
};
