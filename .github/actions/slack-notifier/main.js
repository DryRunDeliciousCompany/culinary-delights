const core = require('@actions/core');
const github = require('@actions/github');
const axios = require("axios");

var getColor = function (status) {
  const COLOR = {
    // success: "#198754",
    // failure: "#bb2d3b",
    // cancelled: "#0dcaf0",
    // skipped: "#ffca2c",
    // none: "#6c757d"
    success: "good",
    failure: "danger",
  };
  return COLOR[status] || ""
};

const SLACK_WEBHOOK_URL = core.getInput("slack-webhook-url") || process.env.SLACK_WEBHOOK_URL || "";
const SLACK_MESSAGE_STATUS = core.getInput("slack-message-status") || "none";
const SLACK_MESSAGE_COLOR = getColor(core.getInput("slack-message-color") || SLACK_MESSAGE_STATUS);
const SLACK_MESSAGE_TITLE = core.getInput("slack-message-title") || process.env.GITHUB_WORKFLOW || "";
const SLACK_MESSAGE_BODY = core.getInput("slack-message-body") || SLACK_MESSAGE_STATUS;

const {
  GITHUB_REPOSITORY,
  GITHUB_SERVER_URL,
  GITHUB_RUN_ID
} = process.env;

(async () => {
  try {
    var res = await axios.request({
      method: "post",
      url: SLACK_WEBHOOK_URL,
      headers: {
        "content-type": "application/json"
      },
      data: {
        "attachments": [
          {
            "color": SLACK_MESSAGE_COLOR,
            "blocks": [
              {
                "type": "header",
                "text": {
                  "type": "plain_text",
                  "text": SLACK_MESSAGE_TITLE,
                  "emoji": true
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
                }
              },
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": SLACK_MESSAGE_BODY
                }
              }
            ]
          }
        ]
      }
    });
    console.log(res.statusText || "OK");
  } catch (err) {
    console.log(err);
    core.setFailed(err.message);
  }
})();
