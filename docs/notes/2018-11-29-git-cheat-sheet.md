# Git Cheat Sheet

## git create branch from un-staged changes
```
git checkout -b new_branch_name
```

## checkout pull request locally
```
git fetch origin pull/ID/head:BRANCHNAME
```

## git pull from remote to override local changes

```
git fetch origin
```
```
git reset --hard origin/master
```

## Git pull remote branch locally
```
git fetch origin
```
```
git checkout --track origin/<remote_branch_name>
```

## git push local branch to remote
```
git checkout -b <branch>
```
```
git push -u origin <branch>
```

## Git merge master to update branch
```
git checkout <branch>
```
```
git merge master 
```

or [merging vs rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing )


## to view previous commits  

```
git log 
```
## to add to previous commit 

### If have not pushed

```
git commit --amend
```
- [Changing a commit message](https://help.github.com/articles/changing-a-commit-message/)
- [rewriting history blog post](https://robots.thoughtbot.com/git-interactive-rebase-squash-amend-rewriting-history
)


### if you have pushed 
if you have pushed already same as above but you can force a push to amend remote as well 

```
git push -f 
```
