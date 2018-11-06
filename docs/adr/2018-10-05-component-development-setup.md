# Component Development Setup  - draft

* Status: **accepted** <!-- optional -->
* Deciders: Pietro, James <!-- optional -->
* Date: 2018-10-05 <!-- optional -->

<!-- Technical Story: [description | ticket/issue URL]  -->

## Context and Problem Statement

<!-- [Describe the context and problem statement, e.g., in free form using two to three sentences. You may want to articulate the problem in form of a question.] -->

Developing a React component to be published as a standalone npm module can pose a few challenges, if it's left as an after thought while using `create-react-app`. Eg identifying the boundaries between the component and the rest of the application.

## Decision Drivers <!-- optional -->

<!-- * [driver 1, e.g., a force, facing concern, …] -->
* A simple and straight forward way to develop a React component 
* Easy to work and update
* Easy to build and package the component
* Close to none learning curve for newcomers to the project.
* Able to see a preview of the component, in a "demo environment"

## Considered Options

* [Storybook](https://storybook.js.org/)
* [Bit](https://bitsrc.io/)
* [`create-component-lib`](https://www.npmjs.com/package/create-component-lib) as explaied in this [blog post](https://hackernoon.com/creating-a-library-of-react-components-using-create-react-app-without-ejecting-d182df690c6b) 


Consulted this article [React tools you need to use in your components development](https://hackernoon.com/tools-you-need-to-use-in-your-react-components-development-26c3de4f81d2)

## Decision Outcome

Storybook and bit, seemed great if you are defining a style guide, and want a tool that gives you a fair bit of functionality to help with that, but they might have a bit of a learning curve, and might put new people off in getting involved if it requires familiarizing with those systems to get up to speed.

`create-component-lib` seemed straight forward to use, simple and transparent in its implementation with the accompanying blog post. It's built on top of create-react-app, and that can used to create demo application to showcase the component in action.

So decided to use `create-component-lib` module.

And updated it to [Create React App 2.0](https://reactjs.org/blog/2018/10/01/create-react-app-v2.html) to be able to use CSS modules. 

As well as updated `babel-cli` to transpile the code of the component, see [notes](../notes/2018-10-05-babel-setup.md) for more details on this setup.


<!-- 
Setup 
```
npm i react react-dom react-scripts  @babel/core @babel/cli @babel/preset-react rimraf --save-dev
```

Package.json to build component 

"build:component": "rimraf dist && NODE_ENV=production babel src/lib --out-dir dist --copy-files --ignore __tests__,spec.js,test.js,__snapshots__",

 -->


 <!-- because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)]. -->


<!-- 
### Positive Consequences

* [e.g., improvement of quality attribute satisfaction, follow-up decisions required, …]
* …

### Negative consequences 

* [e.g., compromising quality attribute, follow-up decisions required, …]
* …

## Pros and Cons of the Options 

### [option 1]

[example | description | pointer to more information | …] 

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]

### [option 2]

[example | description | pointer to more information | …]

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]


### [option 3]

[example | description | pointer to more information | …] 

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]


## Links 

* [Link type] [Link to ADR]  -->