# Brief
Stateless components are not really stateless, they host their states in parent components' state or redux store state, this library gives you convinience to connect to parent components' state.
## Brief Comparison
### The way you use stateless component usually:
```
/* ChildStatelessComponent.jsx */

export default ({ id, name, description, changeName, changeDescription }) => (
  <div>
    <span>id={id}</span>
    <input value={name} onChange={({ target }) => {changeName(id, target.value)}} />
    <input value={description} onChange={({ target }) => {changeDescription(id, target.value)}} />
  </div>
)
```
Use parameter props.changeName and props.changeDescription to change state.
```
/* ParentComponentClass.jsx */

class ParentComponentClass extends React.Component {
  ...

  render () {
    return (
      <...>
        <ChildStatelessComponent
          id={id1}
          name={this.state.data[id1].name}
          description={this.state.data[id1].description}
          changeName={this.changeName.bind(this)}
          changeDescription={this.changeDescription.bind(this)}
        />
      </...>
    )
  }
}
```
And to implement changeName and changeDescription method.
### With statify:
```
/* ChildStatelessComponent.jsx */

export default ({ id, name, description, setState }) => (
  <div>
    <span>id={id}</span>
    <input value={name} onChange={({ target }) => {setState({name: target.value})}} />
    <input value={description} onChange={({ target }) => {setState({description: target.value})}} />
  </div>
)

/* ParentComponentClass.jsx */

class ParentComponentClass extends React.Component {
  ...

  render () {
    const ChildStatelessComponent = this.ChildStatelessComponent
    return (
      <...>
        // Automatically sync the component's props with parent's state[id1]
        <StatifiedChildStatelessComponent path={id1} />
      </...>
    )
  }
}
```
The stateless component's props was binded to parent component's state[id1], and provides a props.setState function to operate parent's state[id1].

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