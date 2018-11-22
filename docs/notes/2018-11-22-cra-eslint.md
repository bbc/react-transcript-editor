# setting up Create React App with ESLint

Two main reasons
- being able to lint on save with editor of choice
- being able to have a `npm run lint` command to for automated linting check of contributors eg 
     - git pre-commit and pre-push hooks
    - use in continuos integration/deployment settings, eg for PR


install dev dependencies in `package.json`

```json
  "devDependencies": {
    ...
    "eslint": "^5.4.0",
    "eslint-config-airbnb": "^17.1.0",
    "eslint-plugin-import": "^2.14.0",
    "eslint-plugin-jsx-a11y": "^6.1.1",
    "eslint-plugin-react": "^7.11.1",
    ...
```

Then in npm scripts add 

```json
"scripts": {
    ...
    "lint": "eslint --ignore-path .gitignore .",
    "lint-fix": "eslint --ignore-path .gitignore . --fix",
    ...
```

optionally you can add a `.eslintignore` if there's extra files/folder to exclude that are not in the  `.gitignore`.