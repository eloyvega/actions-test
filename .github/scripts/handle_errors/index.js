const { Octokit } = require("octokit");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

console.log(process.env.GITHUB_TOKEN);
console.log(process.env.OWNER);
console.log(process.env.REPO);
console.log(process.env.RUN_ID);

const getWorkflowRunDetails = async ({ repo, owner, runId }) => {
  try {
    const res = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
    });
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

getWorkflowRunDetails({
  repo: process.env.REPO,
  owner: process.env.OWNER,
  runId: process.env.RUN_ID,
});
