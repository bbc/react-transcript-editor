# Save to server

* Status: being evaluated <!-- optional -->
* Deciders: Pietro, James <!-- optional -->
* Date: 2018-11-20 <!-- optional -->

## Context and Problem Statement

How should the system handle saving the data to a server API end point? 
should it be a responsability fo the component or not?

## Decision Drivers <!-- optional -->

* easy to reason around
* clean interface
* flexible to integrate and use component on variery of settings
* un-opinionated in regards to the API end point and how to make that request 

## Considered Options

* Inside component
* Outside component 

## Decision Outcome

- component returns content in default draftJS format or in variety of supported adapters/converters 
- saving to server is done outside of the component to allow more flexible integration within other contexts