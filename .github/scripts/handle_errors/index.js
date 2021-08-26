const { Octokit } = require("octokit");
const PagerDuty = require("@pagerduty/pdjs");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const event = JSON.parse(process.env.EVENT);
console.log(event.artifacts_url);

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

const createPagerDutyIncident = async () => {
  const res = await PagerDuty.event({
    data: {
      routing_key: "",
      event_action: "trigger",
      dedup_key: "test_incident_2_88f520",
      payload: {
        summary: "Test Event V2",
        source: "test-source",
        severity: "error",
      },
    },
  });
  console.log(res);
};

const main = async ({ repo, owner, runId }) => {
  const failedJob = await getFailedJob(repo, owner, runId);
  if (failed_jobs_allowlist.includes(failedJob)) {
    console.log("Nothing to do");
    return;
  }
  console.log("Notify");
  // await createPagerDutyIncident();
  console.log(failed_jobs_allowlist);
};

main({
  repo: process.env.REPO,
  owner: process.env.OWNER,
  runId: process.env.RUN_ID,
});
