# Analytics

* Status: being evaluated
* Deciders: Pietro, Luke, James
* Date: 2018-12-06

## Context and Problem Statement

It be great to be able to track some component level analytics in a way that is agnostic to the tracking provider (eg piwik/[matomo](https://developer.matomo.org/api-reference/tracking-javascript#using-the-tracker-object), google analytics etc..)

## Decision Drivers

* easy to reason around
* clean interface
* flexible to integrate with variety of analytics providers
* un-opinionated in regards to the API end point and how to make that request

## Considered Options

1. [npm analytics](https://www.npmjs.com/package/analytics) module.
> This is a pluggable event driven analytics library designed to work with any third party analytics tool.

2. Making one from scratch - a class that takes in an option and handles the logic to call the end points

3. just raise events to the top parent component - see [notes here](../notes/2018-12-06-analytics-raise-events.md) then parent component can decide how to handle depending on the library in use for analytics.

## Decision Outcome


Option 3 - as suggested by Luke, raise event to parent component.


## Other

- [Working With Events in React](https://css-tricks.com/working-with-events-in-react/)