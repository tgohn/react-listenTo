# React-listenTo

react-listenTo is a [React](http://facebook.github.io/react/)
[mixin](http://facebook.github.io/react/docs/reusable-components.html#mixins)
that provides:

- `listenTo(emitter, eventName, cb)` method to your component
- `noListenTo(emitter, [eventName , [cb]]` method to your component
- automatically unbind all event listener when the component [unmount](http://facebook.github.io/react/docs/component-specs.html#unmounting-componentwillunmount)


## Usage

With `listenTo()` we can break down the React's `props` passing chain smaller.
This help us structure the components easier.

```javascript
var video = require('video-player');
var listenTo = require('react-listenTo');

var FastForwardButton = React.createClass({
	mixins: [listnTo],

	componentDidMount: function() {
		this.listenTo(video, 'playbackRate', this.updatePlaybackRate);
	},

	updatePlaybackRate: function(val) {
		this.setState({playbackRate: val});
	},

	render: function() {...}
});
```

## Under the hood

`listenTo` tries its best work with all the common event emmitters. When
listen to events from an emmiter, the method will try and guess for common
listening API: `[on, attachEvent, addEventListener]`.

```
DOM element
node EventEmitter
backbone Model and Collection
...
```

The same idea applies for `noListenTo` method.

When component unmount, it will also automatically call `noListenTo` to all
event handlers attached through `listenTo`. So external event emmitter will not
keep reference to yours anymore.
