import * as React from 'react'
import * as _ from 'lodash'

/**
 * 
 * @param {React.Component} parent It's the parent component providing it's state for output component to store state.
 * @returns {(wrapped: React.ComponentType<{setState: Function}>) => React.StatelessComponent<path: string|srting[]>} A function for generating a props-binded-to-parent-state component.
 */
export function statifyWith (parent: React.Component): (wrapped: React.ComponentType<{setState: Function}>) => React.StatelessComponent<{path?: string|string[], [prop: string]: any}> {
  if (!parent) throw new Error(`Need a parent: React.Component parameter for it's state property, try to pass 'this' in if you are calling it in a lifecycle method of a React.Component.`)
  if (!parent.state || typeof parent.setState !== 'function') throw new TypeError(`The parent parameter need to be a React.Component for it's state property.`)
  return _statify.bind(undefined, parent)
}

/**
 * 
 * @param {React.ComponentType<{setState: Function}>} wrapped It is passed for it's state and setState property for storing output components state.
 * @returns {React.StatelessComponent<path: string|srting[]>} It's the output component which receives a path prop.
 */
function statify (wrapped: React.ComponentType<{setState: Function}>): React.StatelessComponent<{path?: string|string[], [prop: string]: any}> {
  return _statify(this, wrapped)
}

function _statify (parent, Wrapped: React.ComponentType<{setState: Function}>): React.StatelessComponent<{path?: string|string[], [prop: string]: any}> {
  return function output ({path, ...props}, context: any) {
    function setState (childPartialState: React.ComponentState): void {
      parent.setState((parentState) => (setChildState(parentState, path, childPartialState)))
    }
    // return Wrapped({ setState, ...props, ...getChildState(parent.state, path) }, context)
    return <Wrapped {...{setState, ...props, ...getChildState(parent.state, path)}} />
  }
}

function getChildState(state: React.ComponentState, path: string|string[]|undefined) {
  if (path == undefined || path === '' || ((path instanceof Array) && !path.length)) {
    return state
  }
  return _.get(state, path)
}

function setChildState(state: React.ComponentState, path: string|string[]|undefined, childPartialState: React.ComponentState): React.ComponentState {
  if (path == undefined || path === '' || ((path instanceof Array) && !path.length)) {
    return { ...state, ...childPartialState }
  }
  const prevChildState: React.ComponentState|undefined = _.get(state, path)
  const nextChildState: React.ComponentState = { ...prevChildState, ...childPartialState }
  let nextState: React.ComponentState = _.cloneDeep(state)
  _.set(nextState, path, nextChildState)
  return nextState
}

export default statify