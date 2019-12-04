# QA Test Plan: React Transcript Editor

Last updated: _26th August 2019_     
version: _>=1.0.6_

This doc provides a lightweight set of steps and checklists for manual QA test. This should be done before every major release.

_The assumption underlying this doc is that anyone, even without technical skills, should be able to conduct QA testing._

## Overview
React Transcript Editor it's a react component, to make transcribing audio and video easier and faster. Please see project repository the Github [README](https://github.com/bbc/react-transcript-editor/blob/master/README.md) page,for an overview of what the component does and how it works (https://github.com/bbc/react-transcript-editor). 

<!-- Here is a video demo of the  main use case: https://youtu.be/4z143-nJlzs.  -->

## Where to test:
<!-- _URL of where testing should be performed (staging, sandbox)_ -->

The app can be tested using the demo application at 
https://bbc.github.io/react-transcript-editor/

For updating the the demo app with latest version of the component [see these instructions](https://github.com/bbc/react-transcript-editor#build---demo)

## Where to log bugs: 
<!-- _Provide link to Fogbugz, Github, Trello, etc. Also include to whom the bugs should be assigned (if applicable)._ -->

If you find any bugs or issues, please [open an issue in Github](https://github.com/bbc/react-transcript-editor/issues/new?template=bug_report.md) label it as 'QA Testing' and assign it to [@jamesdools](https://github.com/jamesdools).

If it's connect to one or more of the QA steps listed below make a note of the corresponding number.

For things like typos feel free to directly do a PR with the changes.

## Browsers/devices: 
By default we aim for the component to work on the following version of the following browsers and devices.

- [ ] Desktop - Mac - Chrome
- [ ] Desktop - Windows - Chrome
- [ ] Desktop - Windows - Internet Explore _(Because of BBC users)_

Other browsers and devices are not part of out core effort but we welcome feedback.
When you raise an issue please indicate the operating system, device, and browser.

---

## Items to test

There are 5 main parts for QA testing

0. [Component Interface](0-component-interface.md)
1. [Player Controls](1-player-controls.md)
2. [Timed Text Editor](2-timed-text-editor.md) 
3. [Settings](3-settings.md)
4. [Keyboard Shortcuts](4-keyboard-shortcuts.md)
5. [Analytics](5-analytics.md)

 see each section for more details.
