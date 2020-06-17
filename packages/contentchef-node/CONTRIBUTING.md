# Contributing

Unicorn 🦄! Thank you for helping us make this project great and being a part of the Content Chef community. 
Here are a few guidelines that will help you along the way.

## Pull requests

When in doubt, keep your pull requests small. 
To give a PR the best chance of getting accepted, don't bundle more than one feature or bug fix per pull request. 
It's always best to create two smaller PRs than one big one.

### Branch Structure

All stable releases are tagged ([view tags](https://github.com/ContentChef/contentchef-node/tags)).
At any given time, `master` represents the latest production version of the library.
Hotfix or patched releases are prepared on an independent branch.

### How to increase the chance of being accepted?

We will only accept a pull request for which all tests pass. Make sure the following is true:
- The branch is not behind master.
- If a feature is being added:
   - It includes relevant tests.
   - If this is a common use case, considered adding an example to the documentation.
- If a bug is being fixed, test cases that fail without the fix are included.

## Getting started

Please create a new branch from an up to date master on your fork. 

1. Fork this repository on Github
2. Clone your fork to your local machine `git clone git@github.com:<yourname>/contentchef-node.git`
3. Create a branch `git checkout -b my-topic-branch`
4. Make your changes, lint, then push to to GitHub with `git push --set-upstream origin my-topic-branch`.
5. Visit GitHub and make your pull request.

If you have an existing local repository, please update it before you start, to minimise the chance of merge conflicts.
```sh
git remote add upstream git@github.com:ContentChef/contentchef-node.git
git checkout master
git pull upstream master
git checkout -b my-topic-branch
npm i
```

### Coding style

Please follow the coding style of the project. contentchef-node uses tslint, so if possible, enable linting in your editor to get real-time feedback. 
The linting rules can be run manually with the following command `npm run lint`.

## Roadmap

To get a sense of where contentchef-node is heading, or for ideas on where you could contribute, take a look at the [ROADMAP](https://github.com/ContentChef/contentchef-node/blob/master/ROADMAP.md).

## License

By contributing your code to the ContentChef/contentchef-node GitHub repository, you agree to license your contribution under the MIT license.