const core = require('@actions/core');
const github = require('@actions/github');
const {getUserIsApprover} = require('./lib/helpers');

try {
  const actor = github.context.actor;
  const isApprover = getUserIsApprover(actor, '.');
  if (!isApprover) {
    core.setFailed('user is not an approver')
  } else {
    return true;
  }
} catch (error) {
  core.setFailed(error.message);
}
