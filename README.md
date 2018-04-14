# Brief
Stateless components are not really stateless, they host their states in parent components' state or redux store state, this library gives you convinience to connect to parent components' state.
## Brief Comparison
Usually: `<ChildComponent id={id1} name={this.state.data[id1].name} description={this.state.data[id1].description} changeName={this.changeName.bind(this)} changeDescription={this.changeDescription.bind(this)} />`, and implement 'changeName' and 'changeDescription' as well if the ChildComponent has e.g. `<input>`s to change those fields.

With statify: `<StatifiedChildComponent path={['data', id1]} />`, also, no need to have any 'changeName' or 'changeDescription', it provides a `setState` prop to wrapped component, it sets parent's 'state.data[id1]' as it is an independent state.

# Interfaces
## Importing
```
import statify, { statifyWith } from 'react-component-statify'
```
or
```
const statify = require('react-component-statify')
const { statifyWith } = require('react-component-statify')
```
## Usage
### `statify` & `statifyWith`
Two ways to use statify.
`statify` has an unbinded context `this` pointing to the parent component instance, place it in parent component's prototype or bind it.
```
class UserContainer extends React.Component {
  ...
}
UserContainer.prototype.statify = statify
```

```
constructor (props, context) {
  ...
  const BindedComponent = this.statify(SomeComponent)
}
```
Or use `statifyWith` like below:
```
const BindedComponent = statifyWith(this)(SomeComponent)
```

### binded component
```
<BindedComponent path='bindedComponent1'>