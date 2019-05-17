# How to prevent unnecessary re-renders  - Draft

Some notes on how to How to prevent unnecessary re-renders in React

## Start here

[React docs - Thinking in React](https://reactjs.org/docs/thinking-in-react.html)

[React JS cheat sheet](https://devhints.io/react)

[SOLID: Part 1 - The Single Responsibility Principle](https://code.tutsplus.com/tutorials/solid-part-1-the-single-responsibility-principle--net-36074)

if want to go deeper in ['the single responsibility principle' read this](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)

>Another wording for the Single Responsibility Principle is:
>
> > Gather together the things that change for the same reasons. Separate those things that change for different reasons.


## States and Props

>State is reserved only for interactivity, that is, data that changes over time. Since this is a static version of the app, you don’t need it.
[from react docs](https://reactjs.org/docs/thinking-in-react.html#step-3-identify-the-minimal-but-complete-representation-of-ui-state)


>Let’s go through each one and figure out which one is state. Simply ask three questions about each piece of data:
>
>1. Is it passed in from a parent via props? If so, it probably isn’t state.
>2. Does it remain unchanged over time? If so, it probably isn’t state.
>3. Can you compute it based on any other state or props in your component? If so, it isn’t state.
[React docs - thinking in react](https://reactjs.org/docs/thinking-in-react.html#step-4-identify-where-your-state-should-live)


>Remember: React is all about one-way data flow down the component hierarchy. It may not be immediately clear which component should own what state. This is often the most challenging part for newcomers to understand, so follow these steps to figure it out:
>
>For each piece of state in your application:

> - Identify every component that renders something based on that state.
> -Find a common owner component (a single component above all the components that need the state in the hierarchy).
> - Either the common owner or another component higher up in the hierarchy should own the state.
> - If you can’t find a component where it makes sense to own the state, create a new component simply for holding the state and add it somewhere in the hierarchy above the common owner component.

[React docs - thinking in react](https://reactjs.org/docs/thinking-in-react.html)


### updating state
updating state is async

>There is one crucial case where it makes sense to use a function over an object: when you update the state depending on the previous state or props. If you don't use a function, the local state management can cause bugs. The React setState() method is asynchronous. React batches setState() calls and executes them eventually. Sometimes, the previous state or props changes between before we can rely on it in our setState() call.
[React book](https://github.com/pietrop/the-road-to-learn-react/blob/master/manuscript/chapter6.md#revisited-setstate)

>With the function approach, the function in setState() is a callback that operates on the state and props at the time of executing the callback function. Even though setState() is asynchronous, with a function it takes the state and props at the time when it is executed.

[React book](https://github.com/pietrop/the-road-to-learn-react/blob/master/manuscript/chapter6.md#revisited-setstate)

## Component Lifecycle 
[react lifecycle methods diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

good to read along side this chapter [Chapter 3 boook -the-road-to-learn-react - Getting Real with APIs ](https://github.com/pietrop/the-road-to-learn-react/blob/master/manuscript/chapter3.md)

## Re-renders


>A React Component works hard. As the user manipulates the state of the application, it may re-render 5, 10, 100 times. Sometimes, that’s a good thing. But if you don’t understand what is causing the re-renders, and whether they are necessary, your app could suffer serious slowdown.
[How to Benchmark React Components: The Quick and Dirty Guide](https://engineering.musefind.com/how-to-benchmark-react-components-the-quick-and-dirty-guide-f595baf1014c)

> A re-render can only be triggered if a component’s state has changed. The state can change from a props change, or from a direct setState change. The component gets the updated state and React decides if it should re-render the component. Unfortunately, by default React is incredibly simplistic and basically re-renders everything all the time.
>Component changed? Re-render. Parent changed? Re-render. Section of props that doesn't actually impact the view changed? Re-render.

[source](https://lucybain.com/blog/2017/react-js-when-to-rerender/)

## Re-render vs re-paint
calling a re-render doesn't mean that React is repainting the DOM.
it means that react it's calling it's diffing algorith to check changes against the virtual dom. it might do that, and still determine that no re-paint is needed. the issue is that calling unecessary re-renders (those when it ends up determine that no change is neeeded) to often, can lead to slower performance. 


>Now, I might be painting an alarming picture of unnecessary work that has been going on right under our noses. One thing to keep in mind is that a render method being called is not the same thing as the DOM ultimately getting updated. There are a few additional steps React takes where the DOM is diffed (aka the previous version compared with the new/current version) to truly see if any changes need to be represented. All of these few additional steps is work, and for more complex apps with a lot of components, there will be many MANY instances of a few additional steps that will start to add up. Some of this is additional work done by React's internals. Some of this additional work is just important things we do in our render methods, for we often have a lot of code there to help generate the appropriate JSX. Rarely is our render method returning a static piece of JSX with no evaluation or calculation happening, so minimizing unnecessary render calls is a good thing!
[source](https://www.kirupa.com/react/avoiding_unnecessary_renders.htm)


## `shouldComponentUpdate`

>By default, shouldComponentUpdate returns true. That’s what causes the “update everything all the time” we saw above. However, you can overwrite shouldComponentUpdate to give it more “smarts” if you need the performance boost. Instead of letting React re-render all the time, you can tell React when you don’t want to trigger a re-render.

[source](https://lucybain.com/blog/2017/react-js-when-to-rerender/)


> Returning false does not prevent child components from re-rendering when their state changes.
...
>We do not recommend doing deep equality checks or using JSON.stringify() in shouldComponentUpdate(). It is very inefficient and will harm performance.
[source - react docs](https://reactjs.org/docs/react-component.html#shouldcomponentupdate)


>This applies to the children’s state but not their props. So if a child component is internally managing some aspect of its state (with a setState of its own), that will still be updated. But if the parent component returns false from shouldComponentUpdate it will not pass the updated props along to its children, and so the children will not re-render, even if their props had updated.

[source](https://lucybain.com/blog/2017/react-js-when-to-rerender/)


>This method only exists as a performance optimization. Do not rely on it to “prevent” a rendering, as this can lead to bugs. Consider using the built-in PureComponent instead of writing shouldComponentUpdate() by hand. PureComponent performs a shallow comparison of props and state, and reduces the chance that you’ll skip a necessary update.
[React docs](https://reactjs.org/docs/react-component.html#shouldcomponentupdate)





[How to Benchmark React Components: The Quick and Dirty Guide](https://engineering.musefind.com/how-to-benchmark-react-components-the-quick-and-dirty-guide-f595baf1014c)

## React Pure components

`PureComponent`

```
import React, { PureComponent } from "react";

class MenuButton extends PureComponent {
...

```

[React pure components](https://reactjs.org/docs/react-api.html#reactpurecomponent)


>Based on the concept of purity in functional programming paradigms, a function is said to be pure if:
>
> - its return value is only determined by its input values.
> - its return value is always the same for the same input values.
>A React component can be considered pure if it renders the same output for the same state and props. For class components like this, React provides the PureComponent base class. Class components that extend the React.PureComponent class are treated as pure components.
>
>Pure components have some performance improvements and render optimizations since React implements the shouldComponentUpdate() method for them with a shallow comparison for props and state.
[source](https://logrocket.com/blog/pure-functional-components/)

---

in a normal component, before it updates,  `shoulComponentUpdate` will fire.
You can add code there to check if you want the component to update.  eg if you return false, it won’t update.

there’s a force update, but if you are using that, you might need to check the logic. 

Pure component → expec to work similar to pure function

- no side effects
- no notification `shouldComponentUpdate`

They are an optimization pattern, faster then ordinary component. (coz don’t fire `shouldComponentUpdate` decide for itself if needs to update)

pure components should include components that “act as pure components”.

used for presentation/read only.

Useful for refactoring, and speeding up for performance. eg if you want it to refresh less often.

from React BBC academy course.
---


>If your React component’s render() function renders the same result given the same props and state, you can use React.PureComponent for a performance boost in some cases.
[React - Pure Component](https://reactjs.org/docs/react-api.html#reactpurecomponent)


## `React.StrictMode`
use `React.StrictMode` to identify components with unsafe lifecycles

>StrictMode is a tool for highlighting potential problems in an application. Like Fragment, StrictMode does not render any visible UI. It activates additional checks and warnings for its descendants.

[React docs - Strict Mode](https://reactjs.org/docs/strict-mode.html)

[Strict mode warnings](https://fb.me/react-strict-mode-warnings)


## Error Handling

error, store it in your local state, and show a message to the user.

[React 16 - error handling](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html)

[why not use try catch ](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html#why-not-use-try--catch)

> Lastly, componentDidCatch(error, info) was introduced in React 16 as a way to catch errors in components. For instance, displaying the sample list in your application works fine, but there could be a time when a list in the local state is set to null by accident (e.g. when fetching the list from an external API, but the request failed and you set the local state of the list to null). It becomes impossible to filter and map the list, because it is null and not an empty list. The component would be broken, and the whole application would fail. Using componentDidCatch(), you can catch the

[source](https://github.com/pietrop/the-road-to-learn-react/blob/master/manuscript/chapter3.md)

[Error boundaries](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html#introducing-error-boundaries)

>A JavaScript error in a part of the UI shouldn’t break the whole app. To solve this problem for React users, React 16 introduces a new concept of an “error boundary”.
>
>Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.
>
> A class component becomes an error boundary if it defines a new lifecycle method called componentDidCatch(error, info)
[React docs](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html#introducing-error-boundaries)


>Where to Place Error Boundaries
>The granularity of error boundaries is up to you. You may wrap top-level route components to display a “Something went wrong” message to the user, just like server-side frameworks often handle crashes. You may also wrap individual widgets in an error boundary to protect them from crashing the rest of the application.
[react docs](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html#where-to-place-error-boundaries)


[`componentDidCatch`](https://reactjs.org/docs/react-component.html#componentdidcatch)


---
in js - try and catch, finally - to manage errors 

in react, do only in event handling.

error boundaries, allows to handle errors in constructor and render. 

`componentDidCatch` is the error handler catch errors in any components, underneath this one in the component hierarchy.
error boundary for anything below it.

does not trap errors in itself, in it’s own component.

generally added to the container.

react defaults was, if somethings goes wrong, render nothing. 
with error boundaries, can narrow down when error occoured 


From react BBC course

---


### Error Handling API requests
[Error Handling - with fetch API](https://github.com/pietrop/the-road-to-learn-react/blob/master/manuscript/chapter3.md#error-handling)

## Loadng

>The initial value of that isLoading property is false. We don't load anything before the App component is mounted. When the request is made, the loading state is set to true. The request will succeed eventually, and you can set the loading state to false.

[Book - loadding...](https://github.com/pietrop/the-road-to-learn-react/blob/master/manuscript/chapter5.md#loading-)

### React.Suspense

>React.Suspense let you specify the loading indicator in case some components in the tree below it are not yet ready to render. Today, lazy loading components is the only use case supported by <React.Suspense>:

[React docs](https://reactjs.org/docs/react-api.html#reactsuspense)

## React events

[events cheat sheet](https://frontarm.com/james-k-nelson/react-events-cheatsheet/)

## Tests

[Tests - book chapter](https://github.com/pietrop/the-road-to-learn-react/blob/master/manuscript/chapter4.md)

## Containment 

[react docs](https://reactjs.org/docs/composition-vs-inheritance.html#containment)


## Sources

- [How does React decide to re-render a component?](https://lucybain.com/blog/2017/react-js-when-to-rerender/)
- [react lifecycle methods diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
[React docs -> Avoid Reconciliation](https://reactjs.org/docs/optimizing-performance.html#avoid-reconciliation)
- [React pure components](https://reactjs.org/docs/react-api.html#reactpurecomponent)


## Actions you can take to improve performance

### `shouldComponentUpdate`

```js
shouldComponentUpdate(nextProps, nextState){
    return false;
}
```

### `PureComponent`
use `PureComponent`

```
import React, { PureComponent } from "react";

class MenuButton extends PureComponent {
...

```

### [` why-did-you-update`](https://github.com/maicki/why-did-you-update)

use ` why-did-you-update` lib to identify unecessary re-renders

```
npm install --save-dev why-did-you-update
```

```js
import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(React);
}
```

[Common Fixing Scenarios](https://github.com/maicki/why-did-you-update#common-fixing-scenarios)

### React DevTools tools profiler

[React docs - Introducing the React Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)

### add a `console.log` in render method
add a `console.log` in render method of component, to see count of how often is called, before and after tweaks

### `React.StrictMode`
use `React.StrictMode` as described above to identify other issues in your code. 

### consider refactoring 
consider refactoring the logic of the app and components to break them into smaller more manageable units.

[source](https://medium.com/dailyjs/react-is-slow-react-is-fast-optimizing-react-apps-in-practice-394176a11fba)

## `getDerivedStateFromProps`

[You Probably Don't Need Derived State](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)


### Blog
- [REACT 16: PREVENT UNNECESSARY RE-RENDERS WITH FUNCTIONAL SETSTATE()
](https://x-team.com/blog/react-render-setstate/)
- [5 Ways to Stop Wasting Renders in React/Redux](https://medium.com/voobans-tech-stories/5-ways-to-stop-wasting-renders-in-react-redux-73b3c5d86f50)
- [Avoiding Unnecessary Renders in React](https://www.kirupa.com/react/avoiding_unnecessary_renders.htm)
- [How to prevent a rerender in React](https://www.robinwieruch.de/react-prevent-rerender-component/)
- [How to Benchmark React Components: The Quick and Dirty Guide](https://engineering.musefind.com/how-to-benchmark-react-components-the-quick-and-dirty-guide-f595baf1014c)
- [Pure Functional Components in React 16.6, Memoizing functional components with the React.memo() API](https://logrocket.com/blog/pure-functional-components/)

### books
- [book - The Road to learn React](https://github.com/the-road-to-learn-react/the-road-to-learn-react)
- [Book - React.js Essentials ](https://github.com/fedosejev/react-essentials)