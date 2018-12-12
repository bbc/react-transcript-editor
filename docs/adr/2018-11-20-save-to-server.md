# Save to server

* Status: accepted
* Deciders: Pietro, James
* Date: 2018-11-20

## Context and Problem Statement

How should the system handle saving the data to a server API end point?
should it be a responsibility fo the component or not?

## Decision Drivers

* easy to reason around
* clean interface
* flexible to integrate and use component on variety of settings
* un-opinionated in regards to the API end point and how to make that request

## Considered Options

* Inside component
* Outside component

## Decision Outcome

- component returns content in default draftJS format or in variety of supported adapters/converters
- saving to server is done outside of the component to allow more flexible integration within other contexts
