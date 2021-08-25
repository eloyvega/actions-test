const { Octokit } = require("octokit");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

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

const main = async ({ repo, owner, runId, jobFailureAllowlist }) => {
  const failedJob = await getFailedJob(repo, owner, runId);
  if (jobFailureAllowlist.includes(failedJob)) {
    console.log("Nothing to do");
  }
  console.log("Notify");
};

main({
  repo: process.env.REPO,
  owner: process.env.OWNER,
  runId: process.env.RUN_ID,
  jobFailureAllowlist: process.env.JOB_FAILURE_ALLOWLIST.split(","),
});
