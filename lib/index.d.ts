/// <reference types="react" />
import * as React from 'react';
/**
 *
 * @param {React.Component} parent It's the parent component providing it's state for output component to store state.
 * @returns {(wrapped: React.ComponentType<{setState: Function}>) => React.StatelessComponent<path: string|srting[]>} A function for generating a props-binded-to-parent-state component.
 */
export declare function statifyWith(parent: React.Component): (wrapped: React.ComponentType<{
    setState: Function;
}>) => React.StatelessComponent<{
    path?: string | string[];
    [prop: string]: any;
}>;
/**
 *
 * @param {React.ComponentType<{setState: Function}>} wrapped It is passed for it's state and setState property for storing output components state.
 * @returns {React.StatelessComponent<path: string|srting[]>} It's the output component which receives a path prop.
 */
declare function statify(wrapped: React.ComponentType<{
    setState: Function;
}>): React.StatelessComponent<{
    path?: string | string[];
    [prop: string]: any;
}>;
export default statify;
