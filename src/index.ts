import React from 'react'
import * as _ from 'lodash'

interface State {
  [subState: string]: any
}

/**
 * 
 * @param {React.Component} parent It's the parent component providing it's state for output component to store state.
 * @returns {(wrapped: React.Component<{setState: Function}>) => React.StatelessComponent<path: string|srting[]>} A function for generating a props-binded-to-parent-state component.
 */
export function statifyWith (parent: React.Component): (input: React.StatelessComponent<{setState: Function}>) => React.StatelessComponent<{path?: string|string[]}> {
  if (!parent) throw new Error(`Need a parent: React.Component parameter for it's state property, try to pass 'this' in if you are calling it in a lifecycle method of a React.Component.`)
  if (!parent.state || typeof parent.setState !== 'function') throw new TypeError(`The parent parameter need to be a React.Component for it's state property.`)
  return _statify.bind(undefined, parent)
}

/**
 * 
 * @param {React.StatelessComponent<{setState: Function}>} wrapped It is passed for it's state and setState property for storing output components state.
 * @returns {React.StatelessComponent<path: string|srting[]>} It's the output component which receives a path prop.
 */
function statify (wrapped: React.StatelessComponent<{setState: Function}>): React.StatelessComponent<{path?: string|string[]}> {
  return _statify(this, wrapped)
}

function _statify (parent, stateless: React.StatelessComponent<{setState: Function}>): React.StatelessComponent<{path?: string|string[]}> {
  return function output ({path, ...props}, context: any) {
    function setState (childPartialState: State): void {
      parent.setState((parentState) => (setChildState(parentState, path, childPartialState)))
    }
    return stateless({ setState, ...props, ...getChildState(parent.state, path) }, context)
  }
}

function getChildState(state: State, path: string|string[]|undefined) {
  if (path == undefined || path === '' || ((path instanceof Array) && !path.length)) {
    return state
  }
  return _.get(state, path)
}

function setChildState(state: State, path: string|string[]|undefined, childPartialState: State): State {
  if (path == undefined || path === '' || ((path instanceof Array) && !path.length)) {
    return { ...state, ...childPartialState }
  }
  const prevChildState: State|undefined = _.get(state, path)
  const nextChildState: State = { ...prevChildState, ...childPartialState }
  let nextState: State = _.cloneDeep(state)
  _.set(nextState, path, nextChildState)
  return nextState
}

export default statify