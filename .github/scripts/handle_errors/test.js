const PagerDuty = require("@pagerduty/pdjs");

const createPagerDutyIncident = async () => {
  try {
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
    console.log("si");
    console.log(res);
  } catch (error) {
    console.log("no");
    console.log(error);
  }
};

const main = async () => {
  await createPagerDutyIncident();
};

main();
