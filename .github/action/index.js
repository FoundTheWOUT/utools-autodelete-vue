const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

const token = core.getInput("token");
const octokit = github.getOctokit(token);
const { owner, repo } = github.context.repo;

try {
  (async () => {
    // `who-to-greet` input defined in action metadata file
    const file = core.getInput("file");
    let fileJSON = JSON.parse(fs.readFileSync(file));
    let newVersion = fileJSON.version.trim();
    core.info(`get new Version ${newVersion}`);

    // fetch tags list
    let oldTags = await octokit.repos.listTags({
      owner,
      repo,
    });
    oldTags = oldTags.data;

    // check tag whether exist or not
    for (const tag of oldTags) {
      if (tag.name === newVersion) {
        core.info("version already exist!");
        return;
      }
    }
    core.info("get ready to create tag!");

    // create tag
    const newTag = await octokit.git.createTag({
      owner,
      repo,
      tag: newVersion,
      message: `Version ${newVersion}`,
      object: process.env.GITHUB_SHA,
      type: "commit",
    });

    // push tag
    try {
      await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/tags/${newTag.data.tag}`,
        sha: newTag.data.sha,
      });
      core.info("createRef");
    } catch (e) {
      core.warning({
        owner,
        repo,
        ref: `refs/tags/${newTag.data.tag}`,
        sha: newTag.data.sha,
      });
      throw e;
    }
  })();
} catch (error) {
  core.error(error.message);
}
