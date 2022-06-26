import axios from "axios";
import { GET_PLAYLIST_INFO } from "./constants";

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
}

export namespace StringUtil {
  export function truncate(str: string, maxLength: number) {
    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
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
}
