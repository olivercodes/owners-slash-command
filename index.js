const core = require('@actions/core');
const github = require('@actions/github');
const {getUserIsApprover} = require('./lib/helpers');

(async () => {

  // const actor = 'username';
  // const repo = 'repo';
  // const org = 'org';
  const { actor, repo } = github.context;
  try {
    const isApprover = await getUserIsApprover(repo.owner, repo.repo, actor);
    if (!isApprover) {
      core.setFailed(`${actor} is not an approver`);
    } else return true
  } catch (error) {
    core.setFailed(error.message);
  }
})();

