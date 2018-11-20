/**
 * TODO: work oin progress - currently not in use - needs, refactoring
 * Bringing this module in 'react-keyboard-shortcuts'
 * https://github.com/CurtisHumphrey/react-keyboard-shortcuts/blob/master/src/hotkeys.js
 * @todo - remove _. dependency
 * @todo - refactor to allow to update keybooard shortcuts
 * @todo - raise PR for original repo
 */
import React from 'react'
import Mousetrap from 'mousetrap'
// import _ from 'lodash'

Mousetrap.prototype.stopCallback = () => false

const default_options = {
  hot_key_property_name: 'hot_keys',
}

const global_hotkeys = {
}

const hotkey_get_handler = (hotkey) => (e, combo) => {
  const handlers = global_hotkeys[hotkey]
  let propagate = true
  handlers.forEach( ({ handler }) => {
    if (!propagate) return
    propagate = handler(e, combo)
  })
  return propagate
}

const load_hotkeys = (handlers) => {
    // console.log(handlers);
    Object.keys(handlers).map( (response, hotkey) => {
    if (global_hotkeys[hotkey] == null) {
      global_hotkeys[hotkey] = [ response ]
      Mousetrap.bind(hotkey, hotkey_get_handler(hotkey))
    } else {
      global_hotkeys[hotkey].push(response)
    //   global_hotkeys[ hotkey ] = _.sortBy(global_hotkeys[ hotkey ], 'priority').reverse()
    }
  })
}
const unload_hotkeys = (handlers) => {
    Object.keys(handlers).map((response, hotkey) => {
    // _.remove(global_hotkeys[ hotkey ], response)
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
        console.warn(`Component: ${ Component.displayName } did not provide hotkey handlers`)
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
      return <Component ref={ this.on_ref_update } { ...this.props } />
    }
  }

  return HotKeysWrapper
}

export default hotkeys

export const hotkey_display = (shortcut) => {
  const am_mac = window.navigator.appVersion.indexOf('Mac') !== -1;
  if (!am_mac) return shortcut;
  const mac_shortcut = shortcut.replace('alt', 'option')
  return mac_shortcut.replace('meta', '⌘');
}
