# Local storage save

* Status: being evaluated <!-- optional -->
* Deciders: Pietro, James <!-- optional -->
* Date: 2018-11-20 <!-- optional -->


## Context and Problem Statement

It be good to be able to save in local storage as the user is editing the text. 
Tome things to define
- Is this done inside the component? or does the component return the data and the parent component handles saving to local storage?
- how to be able to save multiple transcript for the same editor? eg with a unique id?
- perhaps adding time stamps to the saving for versioning?
- When loading transcript from server, if it's in local storage should resume from that one instead?
- ignoring multi users scenarios for now.

How often to save
- save button?
- save on each new char?
- save on time interval?

## Decision Drivers <!-- optional -->

* simple to reason around 
* [driver 2, e.g., a force, facing concern, …]
* … <!-- numbers of drivers can vary -->

## Considered Options

* inside component TimedTextEditor
* outside React TranscriptEditor component 

## Decision Outcome

- Save inside component TimedTextEditor
- No save button for local storage
- Save on each new char | switch to timer if it effects performance for users 
- using url of media as id to save to local storage 
- add time stamps 
- When loading transcript from server, if it's in local storage should resume from that one instead


[See separate ADR for saving to server.](./2018-11-20-save-to-server.md)