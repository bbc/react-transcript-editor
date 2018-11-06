# Babel Setup 

While setting up `create-react-app` as a way to build a React component as [described in adr notes](../adr/2018-10-05-component-development-setup.md) I've run into a [transpiling issue as described here](https://github.com/aakashns/create-component-lib/issues/1). So here's a few notes on the fix.

To get setup with babel for transpiling component you need 

## CLI + Core

To transpile you need to add [`@babel/core` `@babel/cli`](https://babeljs.io/docs/en/babel-cli) see docs for more info.
 
```
npm install @babel/core @babel/cli --save-dev
```

## Presets
For the React presents you can use the official once by adding [@babel/preset-react](https://babeljs.io/docs/en/next/babel-preset-react.html), see docs for more info.

```
npm install @babel/preset-react --save-dev
```

And make sure `.babeblrc` preset is setup as follows

```json
{
	"presets": [
		"@babel/preset-react"
	]
}
```


