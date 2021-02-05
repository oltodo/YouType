#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { getInfo, validateID, videoInfo, captionTrack } = require("ytdl-core");
const ora = require("ora");

const { argv } = yargs(hideBin(process.argv)).command("$0 <id>", "Generate or update mocks", yargs => {
  yargs
    .positional("id", {
      describe: "Youtube's video ID",
      type: "string",
    })
    .check(({ id }) => {
      if (!validateID(id)) {
        throw new Error("Provide a valid ID format");
      }

      return true;
    });
});

const { id } = argv;

const rootPath = path.join(__dirname, "..");
const assetsPath = path.join(rootPath, "public/mock");
const dataPath = path.join(rootPath, "api/data");

(async function main() {
  const spinner = ora();

  try {
    spinner.start("Check existing mock");
    const mockExists = fs.existsSync(path.join(assetsPath, id));
    spinner.succeed();

    spinner.start("Fetch video data");
    const data = await getInfo(`${id}`);
    spinner.succeed();

    spinner.start("Saves data");
    fs.writeFileSync(path.join(dataPath, `${id}.json`), JSON.stringify(data));
    spinner.succeed();

    // todo: download assets
  } catch (e) {
    spinner.fail(`${e}`);

    throw e;
  }
})();
