const { Octokit } = require("octokit");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const { failed_jobs_allowlist } = require("./failed-jobs-allowlist");

const getFailedJob = async (repo, owner, runId) => {
  try {
    const res = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
    });
    workflowRunDetails = res.data;
    for (const job of workflowRunDetails.jobs) {
      if (job.conclusion === "failure") {
        return job.name;
      }
    }
  } catch (error) {
    console.log(error);
    throw "Fail at getting workflow run";
  }
};

const main = async ({ repo, owner, runId }) => {
  const failedJob = await getFailedJob(repo, owner, runId);
  if (failed_jobs_allowlist.includes(failedJob)) {
    console.log("Nothing to do");
  }
  console.log("Notify");
  console.log(failed_jobs_allowlist);
};

main({
  repo: process.env.REPO,
  owner: process.env.OWNER,
  runId: process.env.RUN_ID,
});
