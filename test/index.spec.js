const should = require('should')
const statify = require('../index.js')

describe('statify', function () {
  // After parentComponent.setState was called, it will reveal what parameter the parent setState function will be called with.
  let setStateResult = null
  const parentComponent = {state: {id1: {prop1: 'prop1', prop2: 'prop2'}}, setState: function setState(func) {setStateResult = func(this.state)}}
  const simpleStateless = (props, context) => ({props, context})
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
})
