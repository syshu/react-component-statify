"use strict";
/**
 * @example const Statified = statify(this)(sampleStatelessComponent); <Statified path={path} />
 * @param {React.Component} parent? is passed for it's state and setState property for storing output components state.
 * @param {StatelessComponent<{setState: Function, [prop]: any}>} input will receive a setState property, use it to update it's state.
 * @returns {StatelessComponent<{id: string, [prop]: any}>} The output for use.
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
var _ = require("lodash");
function statify(parent) {
    if (!parent)
        throw new Error("Need a parent: React.Component parameter for it's state property, try to pass 'this' in if you are calling it in a lifecycle method of a React.Component.");
    if (!parent.state || typeof parent.setState !== 'function')
        throw new TypeError("The parent parameter need to be a React.Component for it's state property.");
    return function bindedStatify(stateless) {
        return function output(_a, context) {
            var path = _a.path, props = __rest(_a, ["path"]);
            function setState(childPartialState) {
                parent.setState(function (parentState) { return (setChildState(parentState, path, childPartialState)); });
            }
            return stateless(__assign({ setState: setState }, props, getChildState(parent.state, path)), context);
        };
    };
}
function getChildState(state, path) {
    if (path == undefined || path === '' || ((path instanceof Array) && !path.length)) {
        return state;
    }
    return _.get(state, path);
}
function setChildState(state, path, childPartialState) {
    if (path == undefined || path === '' || ((path instanceof Array) && !path.length)) {
        return __assign({}, state, childPartialState);
    }
    var prevChildState = _.get(state, path);
    var nextChildState = __assign({}, prevChildState, childPartialState);
    var nextState = _.cloneDeep(state);
    _.set(nextState, path, nextChildState);
    return nextState;
}
exports["default"] = statify;
//# sourceMappingURL=index.js.map