const {
  getOwners,
  getActor,
  getUserIsApprover,
  getOwnersAliases,
  getApprovers,
  getUsersOfAlias,
  getCommands
} = require('./helpers');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');
const githubWorkspace = path.join(__dirname, '../test-files');


describe('owners file parsing', () => {

  const noApprovers = {reviewers: ["infra-leads", "infra-contributors", "security-engineering-leads"]};
  const emptyApprovers = {
    approvers: [],
    reviewers: ["infra-leads", "infra-contributors", "security-engineering-leads"]
  };

  const validOwnersJson = {
    approvers: [
      "infra-leads",
      "security-engineering-leads"
    ],
    reviewers: [
      "infra-leads",
      "infra-contributors",
      "security-engineering-leads"
    ]
  };

  const validOwnersAliasesJson = {
    aliases: {
      "infra-contributors": [
        "a8789",
        "ap428",
        "dc288"
      ],
      "infra-leads": [
        "a6277",
        "ap775"
      ],
      "security-engineering-leads": [
        "ap483",
        "a9618",
        "a9075"
      ]
    }
  };

  it('should fail when there are no approvers', () => {
    // In jest, when we want to catch an error we have to use an IIFE to "catch" it
    // https://developer.mozilla.org/en-US/docs/Glossary/IIFE
    // Otherwise, the actual test run will throw the error, err'ing the test runner itself.
    expect(() => {getApprovers(noApprovers)}).toThrowError()
    expect(() => {getApprovers(emptyApprovers)}).toThrowError()
  });

  it('should read the OWNERS file', () => {
    expect(getOwners(githubWorkspace)).toEqual(validOwnersJson)
  });


  it('should read the OWNERS_ALIASES file', () => {
    expect(getOwnersAliases(githubWorkspace)).toEqual(validOwnersAliasesJson);
  });

  it('should get users of an alias from OWNERS_ALIASES', () => {
    const ownersAliases = getOwnersAliases(githubWorkspace);
    expect(getUsersOfAlias(ownersAliases, 'infra-leads')).toEqual(['a6277', 'ap775']);
  });

  it('should return true if user is an owner', () => {
    expect(getUserIsApprover('a6277', githubWorkspace)).toEqual(true);
    expect(getUserIsApprover('a77', githubWorkspace)).toEqual(false);
  });

  it('should throw an error when aliases are not present', () => {
    expect(() => {getUsersOfAlias({}, 'infra-leads')}).toThrowError()
  });

  it('getOwners + getApprovers should return the owners from the file', () => {
    const owners = getOwners(githubWorkspace);
    expect(getApprovers(owners)).toEqual(["infra-leads", "security-engineering-leads"]);
  });



})


