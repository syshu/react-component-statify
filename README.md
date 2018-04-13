# Brief
Without statify:
### `CustomStatelessComponent.jsx`


# Interfaces
## Importing
```
import statify, { statifyWith } from 'react-component-statify
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