

Thought it might be useful to note here for future reference, when the blog post was written it showed how to ignore files using babel 6. However with babel 7 the syntax for ignoring files from the CLI has changed slightly, 
- still uses the glob format
- it needs to be in between brakets `'`
- comma separated for multiple instances, but without spaces
- avoid using `--copy-files` as this includes non transpiled files.

See example below of the npm script I use in `package.json` - `npm run build:component`
```sh
  "build:component": "rimraf dist && NODE_ENV=production babel src/lib  --out-dir dist --ignore '**/*__tests__,**/*.spec.js,**/*.test.js,**/*__snapshots__,**/*.sample.js,**/*.sample.json,/**/example-usage.js'" ,
```

[rimraf](https://github.com/isaacs/rimraf)

problem is that there is a bug in babel 7, that if you add `--copy-files` then ignore flag doesn't work. 
This means that either you ignore the files like test etc.. or you skip adding non js files such as css or json. 

there might be plugin loaders workaround to add css and json but tbc 