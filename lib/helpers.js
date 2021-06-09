const yaml = require('js-yaml');
const fs = require('fs');
const github = require('@actions/github');
const path = require('path');

function getOwners(path) {
  const ownersFile = fs.readFileSync(path + '/OWNERS');
  const obj = yaml.load(ownersFile, {encoding: 'utf-8'});
  return obj;
}

function getOwnersAliases(path) {
  const aliasesFile = fs.readFileSync(path + '/OWNERS_ALIASES');
  return yaml.load(aliasesFile, {encoding: 'utf-8'});
}

function getApprovers(owners) {
  if (!owners.approvers) {
    throw new Error('no approvers');
  } else if (owners.approvers.length <= 0) {
    throw new Error('approvers is empty');
  }
  return owners.approvers
}

function getUsersOfAlias(ownersAliases, alias) {
  if (!ownersAliases.aliases) {
    throw new Error('no aliases');
  } // TODO - return error if alias does not exist
  return ownersAliases.aliases[alias];
}

function getUserIsApprover(user, workspace) {
  const aliases = getOwnersAliases(workspace);
  const owners = getOwners(workspace);
  const approvers = getApprovers(owners);
  const usersThatCanApprove = approvers
    .map(alias => getUsersOfAlias(aliases, alias))
    .reduce((acc, arr) => acc.concat(arr))
  return usersThatCanApprove.indexOf(user) > -1;
}

module.exports = {
  getOwners: getOwners,
  getOwnersAliases: getOwnersAliases,
  getApprovers: getApprovers,
  getUsersOfAlias: getUsersOfAlias,
  getUserIsApprover: getUserIsApprover,
}




