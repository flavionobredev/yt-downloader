import axios from "axios";
import { GET_PLAYLIST_INFO } from "./constants";

export namespace DownloaderUtil {
  export function getFilenameByHeader(header: string) {
    return decodeURIComponent(
      escape(header.replace(/.*filename="(.+)"/g, "$1"))
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
}
