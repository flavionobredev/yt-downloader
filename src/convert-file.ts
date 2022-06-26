import axios from "axios";

export class ConvertFileService {
  static requestConversion(ytUrl: string, type = "mp3") {
    return axios.get<RequestConversionResponse>(
      `https://loader.to/ajax/download.php`,
      {
        params: {
          format: type,
          url: ytUrl,
        },
      }
    );
  }

  static checkProgress(externalPID: string) {
    return axios.get<CheckProgressResult>("https://loader.to/ajax/progress.php", {
      params: {
        id: externalPID,
      },
    });
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
