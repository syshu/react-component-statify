/**
 * @example const Statified = statify(this)(sampleStatelessComponent); <Statified path={path} />
 * @param {React.Component} parent? is passed for it's state and setState property for storing output components state.
 * @param {StatelessComponent<{setState: Function, [prop]: any}>} input will receive a setState property, use it to update it's state.
 * @returns {StatelessComponent<{id: string, [prop]: any}>} The output for use.
 */

import React from 'react'

function statify (parent: React.Component): (input: React.StatelessComponent<{setState: Function}>) => React.StatelessComponent<{path: string|symbol}> {
  if (!parent) throw new Error(`Need a parent: React.Component parameter for it's state property, try to pass 'this' in if you are calling it in a lifecycle method of a React.Component.`)
  if (!parent.state || typeof parent.setState !== 'function') throw new TypeError(`The parent parameter need to be a React.Component for it's state property.`)
  return function bindedStatify (stateless: React.StatelessComponent<{setState: Function}>): React.StatelessComponent<{path: string|symbol}> {
    return function output ({path, ...props}, context: any) {
      function setState (itemSubStateMap: {[itemSubState: string]: any}): void {
        parent.setState((parentState) => ({[path]: { ...parentState[path], ...itemSubStateMap }}))
      }
      if (path == undefined) throw new Error(`Need an path prop to keep it's state in parent.state[id].`)
      return stateless({ setState, ...props, ...parent.state[path] }, context)
    }
  }
}

export default statify
