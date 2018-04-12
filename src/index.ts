/**
 * @example const Statified = statify(this)(sampleStatelessComponent); <Statified path={path} />
 * @param {React.Component} parent? is passed for it's state and setState property for storing output components state.
 * @param {StatelessComponent<{setState: Function, [prop]: any}>} input will receive a setState property, use it to update it's state.
 * @returns {StatelessComponent<{id: string, [prop]: any}>} The output for use.
 */

import React from 'react'
import * as _ from 'lodash'

interface State {
  [subState: string]: any
}

function statify (parent: React.Component): (input: React.StatelessComponent<{setState: Function}>) => React.StatelessComponent<{path?: string|string[]}> {
  if (!parent) throw new Error(`Need a parent: React.Component parameter for it's state property, try to pass 'this' in if you are calling it in a lifecycle method of a React.Component.`)
  if (!parent.state || typeof parent.setState !== 'function') throw new TypeError(`The parent parameter need to be a React.Component for it's state property.`)
  return function bindedStatify (stateless: React.StatelessComponent<{setState: Function}>): React.StatelessComponent<{path?: string|string[]}> {
    return function output ({path, ...props}, context: any) {
      function setState (childPartialState: State): void {
        parent.setState((parentState) => (setChildState(parentState, path, childPartialState)))
      }
      return stateless({ setState, ...props, ...getChildState(parent.state, path) }, context)
    }
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