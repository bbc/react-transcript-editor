# Keyboard Shortcuts in React

# React components communication strategy

* Status: being evaluated <!-- optional -->
* Deciders: Pietro <!-- optional -->
* Date: 2018-10-12 <!-- when the decision was last updated] optional -->


## Context and Problem Statement

Deciding how to implement customizable keyboard shortcuts in React.

## Decision Drivers <!-- optional -->

* Simple and straightforward way to reason around adding global keyboard shortcuts to a React app
* Possibility for user to customize keyboard shortcuts with their own preferences.


## Considered Options

- Mouse trap
- Doing it manually (setting event listeners on keys manually - search for blog post)
- draftJs events
- Elliot oTranscribe 
- React keyboard shortcut lib

## Decision Outcome

<!-- Chosen option: "[option 1]", because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)]. -->

Still evaluating, leaning torwards _React keyboard shortcut lib_. Possibly briging code inside app for re-factor and better integration, eg possibility to update the shortcuts.

<!-- ### Positive Consequences 

* [e.g., improvement of quality attribute satisfaction, follow-up decisions required, …]
* …

### Negative consequences 

* [e.g., compromising quality attribute, follow-up decisions required, …]
* … -->

## Pros and Cons of the Options <!-- optional -->

### MouseTrap

[MouseTrap](https://craig.is/killing/mice ) - [npm](https://www.npmjs.com/package/react-mousetrap)


- Good, popular library for handling keyboard shortcuts, used it before in autoEdit2

- Bad, DraftJs does not seem to recognize mouse trap shortcuts 



### Vanilla JS

[Blog post](https://hackernoon.com/add-keyboard-shortcuts-to-your-web-app-ba358016ff05) - [JS keyboard shortcuts key codes](https://css-tricks.com/snippets/javascript/javascript-keycodes/)

[stackoverlow - how to detect if multiple keys are pressed at once using javascript](https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript)
- Good, granular control 

- Bad, need to ensure cross browser compatibility 
- Bad, possibly solving a problem that has already been solved



```js
 keyboard shortcuts 
    // cross browser compatibility https://medium.com/@uistephen/keyboardevent-key-for-cross-browser-key-press-check-61dbad0a067a
    document.onkeydown = (evt) =>{
      // Escape key
      if(evt.keyCode === 27){
        this.playMedia();
      }
      if(evt.keyCode ===  91 && evt.keyCode === 75){
        console.log('set timecode');
      }
    }
```

```js
componentDidMount(){
    const self = this;
     // explained here
    // https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript
    // TODO: should remove in component un-mount?
 const map = {}; // You could also use an array
    onkeydown = onkeyup = function(e){
        // e = e || event; // to deal with IE
        map[ e.keyCode ] = e.type == 'keydown';
        /* insert conditional here */
        // Jump to Timecode  - command + k
        if( (map[ 91 ] && map[ 75 ])){ // 91 Command Key - 75 k key
          console.log('promptSetCurrentTime')
          self.promptSetCurrentTime();
          map[ 91 ] = true;
          map[ 75 ] = false;
        }
        //Play/Payuse - esc 
        if( map[ 27 ]){ // 91 Command Key - 75 k key
          console.log('playMedia')
          self.playMedia();
          map[ 27 ] = false;
        }
        // Speed Up - increase playbackRate -  ctrl + 3 | f3
        if( (map[ 17 ] && map[ 51 ])){ //ctrl 17 - 3 key 51
          console.log('Speed Up - increase playbackRate')

          console.log(map)
          map[ 17 ] = true;
          map[ 51 ] = false;
        }
        // Speed Down - Decrease playbackRate - ctrl + 4 | f4
        if( (map[ 17 ] && map[ 52 ])){ //ctrl 17 -  4 key 52
          console.log('Speed Down - Decrease playbackRate ')

          console.log(map)
          map[ 17 ] = true;
          map[ 52 ] = false;
        }

        // RollBack Down - ctrl + 5 | f5
        if( (map[ 17 ] && map[ 53 ])){ //ctrl 17 - 5 key  53
          console.log('rollBack')
          self.rollBack();
          console.log(map)
          map[ 17 ] = true;
          map[ 53 ] = false;
        }
        // show hide shortcuts - ctrl + /
        if( (map[ 17 ] && map[ 191 ])){ //ctrl 17 - forward slash / key  191
          console.log('show hide shortcuts')
      
          console.log(map)
          map[ 17 ] = true;
          map[ 191 ] = false;
        }
        //  save (local+server?) - ctrl + s

        // Skip Forward? - ctrl + 1

        // Skip Backward?- ctrl + 2

    }
```


### DraftJS

[DraftJs events issue](https://github.com/facebook/draft-js/issues/1549) - [DraftJS Key bindings](https://draftjs.org/docs/advanced-topics-key-bindings)


* Good, would integrate more closely with TimedEditor

* Bad, the keyboard shortcuts need to mostly trigger the MediaPlayer component, so extra wiring plumbing would be needed to connect the two

### oTranscribe 

Worth looking at how oTranscribe implemented costumizable keyboard shortcuts 


### React keyboard shortcut lib


[npm](https://www.npmjs.com/package/react-keyboard-shortcuts)
 - [Repo code ](https://github.com/CurtisHumphrey/react-keyboard-shortcuts/blob/master/src/hotkeys.js]

* Good, seems like a straigth forward implementation 
* Good, uses MouseTrap under the hood

* Bad, does not seem to allow to update keyboard shortcuts once component instantiated

[`react-keyboard-shortcuts` - `hotkeys.js`](https://github.com/CurtisHumphrey/react-keyboard-shortcuts/blob/master/src/hotkeys.js)


```js
import React from 'react'
import Mousetrap from 'mousetrap'
import _ from 'lodash'

Mousetrap.prototype.stopCallback = () => false

const default_options = {
  hot_key_property_name: 'hot_keys',
}

const global_hotkeys = {
}

const hotkey_get_handler = (hotkey) => (e, combo) => {
  const handlers = global_hotkeys[hotkey]
  let propagate = true
  _.forEach(handlers, ({handler}) => {
    if (!propagate) return
    propagate = handler(e, combo)
  })
  return propagate
}

const load_hotkeys = (handlers) => {
  _.forEach(handlers, (response, hotkey) => {
    if (global_hotkeys[hotkey] == null) {
      global_hotkeys[hotkey] = [response]
      Mousetrap.bind(hotkey, hotkey_get_handler(hotkey))
    } else {
      global_hotkeys[hotkey].push(response)
      global_hotkeys[hotkey] = _.sortBy(global_hotkeys[hotkey], 'priority').reverse()
    }
  })
}
const unload_hotkeys = (handlers) => {
  _.forEach(handlers, (response, hotkey) => {
    _.remove(global_hotkeys[hotkey], response)
    if (global_hotkeys[hotkey].length === 0) {
      global_hotkeys[hotkey] = null
      Mousetrap.unbind(hotkey)
    }
  })
}

export const hotkeys = (Component, overwrites = {}) => {
  const options = {
    ...default_options,
    ...overwrites,
  }

  class HotKeysWrapper extends React.PureComponent {
    componentDidMount () {
      const handlers = this.wrapped_component[options.hot_key_property_name]
      if (handlers == null) {
        console.warn(`Component: ${Component.displayName} did not provide hotkey handlers`)
        return
      }
      load_hotkeys(handlers)
    }
    componentWillUnmount () {
      const handlers = this.wrapped_component[options.hot_key_property_name]
      if (handlers == null) return
      unload_hotkeys(handlers)
    }

    getWrappedComponent = () => this.wrapped_component

    on_ref_update = (ref) => {
      this.wrapped_component = ref
    }

    render () {
      return <Component ref={this.on_ref_update} {...this.props} />
    }
  }

  return HotKeysWrapper
}

export default hotkeys

export const hotkey_display = (shortcut) => {
  const am_mac = window.navigator.appVersion.indexOf('Mac') !== -1
  if (!am_mac) return shortcut
  let mac_shortcut = shortcut.replace('alt', 'option')
  return mac_shortcut.replace('meta', '⌘')
}
```