const { Octokit } = require("octokit");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const getWorkflowRunDetails = async ({ repo, owner, runId }) => {
  const res = await octokit.rest.actions.listJobsForWorkflowRun({
    owner,
    repo,
    run_id: runId,
  });
  return res.data;
};

getWorkflowRunDetails({
  repo: "",
});
