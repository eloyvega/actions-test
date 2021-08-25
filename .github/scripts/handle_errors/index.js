const { Octokit } = require("octokit");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

console.log(process.env.GITHUB_TOKEN);
console.log(process.env.OWNER);
console.log(process.env.REPO);
console.log(process.env.RUN_ID);

const getFailedStep = async (repo, owner, runId) => {
  try {
    const res = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
    });
    workflowRunDetails = res.data;
    console.log(workflowRunDetails);
    for (const job of workflowRunDetails.jobs) {
      if (job.conclusion === "success") {
        console.log("name");
        continue;
      }
      console.log("found");
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
  console.log(failedStep);
  console.log(stepAllowlist);
};

main({
  repo: process.env.REPO,
  owner: process.env.OWNER,
  runId: process.env.RUN_ID,
  stepAllowlist: process.env.STEP_ALLOWLIST.split(","),
});