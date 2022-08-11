const core = require('@actions/core');
const github = require('@actions/github');
const {getUserIsApprover} = require('./lib/helpers');

(async () => {

  // const actor = 'username';
  // const repo = 'repo';
  // const org = 'org';
  const { actor, repo, org } = github.context;
  console.log(actor, repo, org);
  try {
    const isApprover = await getUserIsApprover(org, repo, actor);
    if (!isApprover) {
      core.setFailed(`${actor} is not an approver`);
    } else return true
  } catch (error) {
    core.setFailed(error.message);
  }
})();

