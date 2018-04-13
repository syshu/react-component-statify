require('should')
const rewire = require('rewire')
const statify = require('../index.js').statifyWith
const statifyScript = rewire('../lib')
const setChildState = statifyScript.__get__('setChildState')
const getChildState = statifyScript.__get__('getChildState')
const statifyMethod = require('../index.js')

describe('getChildState', function () {
  it('with the path of 2 layers', function () {
    getChildState({a: {aa: {aaa: 1, aab: 2}}}, 'a.aa')
    .should.containDeep({aaa: 1, aab: 2})
  })
  it('with no path', function () {
    getChildState({a: 1, b:2}, undefined)
    .should.containDeep({a: 1, b: 2})
  })
  it('with empty string path', function () {
    getChildState({a: 1, b:2}, '')
    .should.containDeep({a: 1, b: 2})
  })
  it('with empty array path', function () {
    getChildState({a: 1, b:2}, [])
    .should.containDeep({a: 1, b: 2})
  })
})

describe('setChildState', function () {
  it('with the path of 1 layer', function () {
    setChildState({a: {aa: 1, ab: 2}}, 'a', {ab: 3, ac: 4})
    .should.containDeep({a: {aa: 1, ab: 3, ac: 4}})
  })
  it('replaces child substate totally', function () {
    setChildState({a: {aa: {aaa: 1, aab: 2}}}, 'a', {aa: {aaa: 3}})
    .should.containDeep({a: {aa: {aaa: 3, aab: undefined}}})
  })
  it(`doesn't affect other path properties`, function () {
    setChildState({a: {aa: 1}, b: {ba: 2}}, 'a', {aa: 3})
    .should.containDeep({a: {aa: 3}, b: {ba: 2}})
  })
  it(`without path`, function () {
    setChildState({a: 1, b: 2}, undefined, {b: 3, c: 4})
    .should.containDeep({a:1, b:3, c:4})
  })
  it(`with the path of 2 layers`, function () {
    setChildState({a: {aa: {aaa: 1, aab: 2}}}, ['a', 'aa'], {aab: 3, aac: 4})
    .should.containDeep({a: {aa: {aaa: 1, aab: 3, aac: 4}}})
  })
  it(`with the path of 2 layers (dot-splitted form string)`, function () {
    setChildState({a: {aa: {aaa: 1, aab: 2}}}, 'a.aa', {aab: 3, aac: 4})
    .should.containDeep({a: {aa: {aaa: 1, aab: 3, aac: 4}}})
  })
})

// After parentComponent.setState was called, it will reveal what parameter the parent setState function will be called with.
const parentComponent = {state: {id1: {prop1: 'prop1', prop2: 'prop2'}}, setState}
const simpleStateless = (props, context) => ({props, context})
let setStateResult = null
function setState (func) {setStateResult = func(this.state)}
describe('statify', function () {
  let output = null
  it('outputs a stateless component', function () {
    output = statify(parentComponent)(simpleStateless)
    output.should.be.a.Function()
  })
  it(`gets parent's state for it's prop`, function () {
    output({path: 'id1'})
    .should.containDeep({
      props: {
        prop1: 'prop1',
        prop2: 'prop2',
      }
    })
  })
  it(`gets parent's state to cover it's own default prop`, function () {
    output({path: 'id1', prop2: 'defaultprop2', prop3: 'defaultprop3'})
    .should.containDeep({
      props: {
        prop1: 'prop1',
        prop2: 'prop2',
        prop3: 'defaultprop3',
      }
    })
  })
  it(`has setState function`, function () {
    output({path: 'id1'}).props
    .should.have.property('setState').which.is.a.Function()
  })
  it(`'s setState function works well`, function () {
    output({path: 'id1'}).props.setState({prop1: 'modified1', prop3: 'newlyAdded3'})
    setStateResult.should.containDeep({
      id1: {
        prop1: 'modified1',
        prop2: 'prop2',
        prop3: 'newlyAdded3',
      }
    })
  })
  describe('deep path', function () {
    const parentComponent = { state: {a: {aa: {aaa: 1, aab: 2}}}, setState }
    const outputStateless = statify(parentComponent)(simpleStateless)
    it('child states is proper', function () {
      outputStateless({path: 'a.aa'})
      .should.containDeep({props: { aaa: 1, aab: 2 }})
    })
    it('child setState works properly', function () {
      outputStateless({path: 'a.aa'}).props.setState({aab: 3, aac: 4})
      setStateResult.should.containDeep({a: {aa: {aaa: 1, aab: 3, aac: 4}}})
    })
  })
  describe('root path', function () {
    const parentComponent = { state: {a: 1, b: 2}, setState }
    const outputStateless = statify(parentComponent)(simpleStateless)
    it('child states is proper', function () {
      outputStateless({})
      .should.containDeep({props: {a: 1, b: 2}})
    })
    it('child setState works properly', function () {
      outputStateless({}).props.setState({ b: 3, c: 4 })
      setStateResult.should.containDeep({ a: 1, b: 3, c: 4})
    })
  })
})

describe('statify method', function () {
  const statify = statifyMethod.bind({ state: {a: {aa: 1, ab: 2 }}, setState })
  it('getChildState', function () {
    statify(simpleStateless)({path: 'a'})
    .should.containDeep({props: {aa: 1, ab: 2}})
  })
  it('setChildState', function () {
    statify(simpleStateless)({path: 'a'}).props.setState({ab: 3, ac: 4})
    setStateResult.should.containDeep({a: {aa: 1, ab: 3, ac: 4}})
  })
})