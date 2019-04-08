# CONTRIBUTING - Draft

This project has a [Code of Conduct](./CODE_OF_CONDUCT.md) that we expect all of our contributors to abide by, please check it out before contributing.

## Contributor license agreement
By submitting code as an individual or as an entity you agree that your code is licensed the same as the [React Transcript Editor](./LICENCE.md).

## Pull requests and branching

1. [Feel free to start by raising an issue](https://github.com/bbc/react-transcript-editor/issues/new?template=feature_request.md) so that others can be aware of areas where there is active development, and if needed we can synchronies the effort.

2. [Fork the repo](https://help.github.com/articles/fork-a-repo/)

3. Before working on a feature **always** create a new branch first. Createa a branch with a meaningful name.
4. Branches should be short lived - consider doing multiple PR breaking down functionalities as opposed to one big change.
5. If you've added code that should be tested, add tests, if you need help with automated testing, feel free to raise an [issue](https://github.com/bbc/react-transcript-editor/issues/new?template=feature_request.md).
6. Ensure the test suite passes.
7. Make sure your code lints.
8. If you've changed APIs, consider [updating the documentation](https://github.com/bbc/react-transcript-editor#documentation) and QA Testing docs.
9. Once the work is complete push the branch up on to GitHub for review. Make sure your branch is up to date with `master` before making a pull request. eg use [`git merge origin/master`](https://git-scm.com/docs/git-merge) or [rebase](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
10. Once a branch has been merged into `master`, delete it.

`master` is rarely committed to directly unless the change is quite trivial or a code review is unnecessary (code formatting or documentation updates for example).

## Code Quality 
- Aim for solutions that are easy to explain and reason around so that others can contribute to it.
- Use meaningfull descriptive variables and function names. eg avoid using `x`,`y`,`z` as variable names.
- Keep lines short 
- Keep functions small and avoid [side effects](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) when possible.
- etc..

See [this blog post for more on this](https://medium.com/mindorks/how-to-write-clean-code-lessons-learnt-from-the-clean-code-robert-c-martin-9ffc7aef870c)

## Contributing checklist

- [ ] Fork the repository
- [ ] Create a branch with a meaningful name
- [ ] Add automated tests where appropriate 
- [ ] Ensure test suite passes (`npm run test`)
- [ ] Make sure your code lints. (`npm run lint`)
- [ ] consider re-factoring for code quality and readability
- [ ] Update documentation and QA docs where appropriate - [see updating the documentation](https://github.com/bbc/react-transcript-editor#documentation)
- [ ] Setup your PR for review 

<!-- 
Good example of contribution guideline

https://reactjs.org/docs/how-to-contribute.html

another example - with more tech details

https://github.com/facebook/create-react-app/blob/master/CONTRIBUTING.md

https://github.com/facebookresearch/wav2letter/blob/master/CONTRIBUTING.md 

https://github.com/hiddentao/fast-levenshtein/blob/master/CONTRIBUTING.md 
 -->
