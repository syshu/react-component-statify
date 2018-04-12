/// <reference types="react" />
/**
 * @example const Statified = statify(this)(sampleStatelessComponent); <Statified path={path} />
 * @param {React.Component} parent? is passed for it's state and setState property for storing output components state.
 * @param {StatelessComponent<{setState: Function, [prop]: any}>} input will receive a setState property, use it to update it's state.
 * @returns {StatelessComponent<{id: string, [prop]: any}>} The output for use.
 */
import React from 'react';
declare function statify(parent: React.Component): (input: React.StatelessComponent<{
    setState: Function;
}>) => React.StatelessComponent<{
    path: string | symbol;
}>;
export default statify;
