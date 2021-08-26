const { Octokit } = require("octokit");
const PagerDuty = require("@pagerduty/pdjs");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const event = JSON.parse(process.env.EVENT);
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
  console.log(event.id);
  console.log(event.repository.name);
  console.log(event.html_url);
  const res = await PagerDuty.event({
    data: {
      routing_key: process.env.PD_TOKEN,
      event_action: "trigger",
      dedup_key: `${event.id}`,
      payload: {
        summary: "Failure in orange dot workflow",
        source: "GitHub Actions workflow",
        severity: "error",
        component: event.repository.name,
      },
      links: [
        {
          href: event.html_url,
          text: "Workflow run URL",
        },
      ],
    },
  });
  console.log(res);
};

const main = async ({ repo, owner, runId }) => {
  const failedJob = await getFailedJob(repo, owner, runId);
  if (!failed_jobs_allowlist.includes(failedJob)) {
    await createPagerDutyIncident();
  }
};

main({
  repo: event.repository.name,
  owner: event.repository.owner.login,
  runId: event.id,
});
