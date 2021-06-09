const core = require('@actions/core');
const github = require('@actions/github');
const {getUserIsApprover} = require('./lib/index');

try {
  const actor = github.context.actor;
  return getUserIsApprover(actor, './');
} catch (error) {
  core.setFailed(error.message);
}
