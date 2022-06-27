import { join } from "path";
import { Downloader } from "./downloader";

const flags = {
  playlist: "--playlist=",
  playlistName: "--name=",
  maxConcurrency: "--max-concurrency=",
};

function bootstap() {
  const playlistUrlArg = process.argv.find((arg) =>
    arg.startsWith(flags.playlist)
  );
  if (!playlistUrlArg) {
    throw new Error(
      "Error: Playlist (--playlist) is not provided. Please provide a playlist url."
    );
  }
  const playlistUrl = playlistUrlArg.split(flags.playlist)[1];
  const playlistName = getPlaylistName();
  const downloader = new Downloader(
    playlistUrl,
    join(__dirname, "..", "downloads", playlistName),
    {
      maxConcurrency: getMaxConcurrency(),
    }
  );

  downloader.init();
}

function getMaxConcurrency() {
  const concurrencyString = process.argv.find((arg) =>
    arg.startsWith(flags.maxConcurrency)
  );
  return concurrencyString ? Number(concurrencyString.split("=")[1]) : 1;
}

function getPlaylistName() {
  const playlistNameArg = process.argv.find((arg) =>
    arg.startsWith(flags.playlistName)
  );
  return playlistNameArg
    ? playlistNameArg.split("=")[1]
    : `Playlist ${new Date()
        .toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/(\/|\s|:)/g, "-")}`;
}

bootstap();
