const {Octokit} = require('octokit')
const core = require('@actions/core');
const octokit = new Octokit({auth: process.env.GITHUB_TOKEN });

function uniq(a) {
  return [...new Set(a)];
}

function teamHasWrite(permission) {
  return permission == 'push';
}

async function getTeamUsers(org, team) {
  const {data} = await octokit.request('GET /orgs/{org}/teams/{team_slug}/members', {
    org: org,
    team_slug: team
  });

  return Promise.resolve(data.map(user => user.login));
}


async function getRepoTeams(org, repo) {
  const {data} = await octokit.request('GET /repos/{org}/{repo}/teams', {
    org: org,
    repo: repo
  });

  return Promise.resolve(data
    .filter(team => teamHasWrite(team.permission))
    .map(team => team.name)
  ).catch(err => { core.setFailed(err) });
}

async function getUserIsApprover(org, repo, user) {
  const repoTeams = await getRepoTeams(org, repo);
  teamsArrays = await Promise.all(
    repoTeams.map(team => getTeamUsers(org, team))
  ).catch((err) => {
    console.error(err)
    core.setFailed(err);
  });

  const allApprovingUsers = teamsArrays
    .reduce((acc, arr) => acc.concat(arr));

  const uniqSetApprovingUsers = uniq(allApprovingUsers);

  return uniqSetApprovingUsers.indexOf(user) != -1;
}


module.exports = {
  getUserIsApprover: getUserIsApprover
}




