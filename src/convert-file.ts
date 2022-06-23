import axios from "axios";

export class ConvertFileService {
  static requestConversion(ytUrl: string, type = "mp3") {
    return axios.get(`https://loader.to/ajax/download.php`, {
      params: {
        format: type,
        url: ytUrl,
      },
    });
  }
}
