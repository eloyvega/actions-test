const { Octokit } = require("octokit");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const getFailedStep = async (repo, owner, runId) => {
  try {
    const res = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
    });
    workflowRunDetails = res.data;
    for (const job of workflowRunDetails.jobs) {
      if (job.conclusion === "success") {
        continue;
      }
      for (const step of job.steps) {
        if (step.conclusion === "failure") {
          return step.name;
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw "Fail at getting workflow run";
  }
};

const main = async ({ repo, owner, runId, stepAllowlist }) => {
  const failedStep = await getFailedStep(repo, owner, runId);
  if (stepAllowlist.includes(failedStep)) {
    console.log("Nothing to do");
  }
  console.log("Notify");
};

main({
  repo: process.env.REPO,
  owner: process.env.OWNER,
  runId: process.env.RUN_ID,
  stepAllowlist: process.env.STEP_ALLOWLIST.split(","),
});
