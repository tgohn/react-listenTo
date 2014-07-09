var Mixin = {
	listenTo: function(emitter, evtName, cb) {
		this._listeningTo = this._listeningTo || [];

		this._listeningTo.push({
			cb:      cb,
			evtName: evtName,
			emitter: emitter
		});

		bindEvent(emitter, evtName, cb);

		return this;
	},

	noListenTo: function(emitter, evtName, cb) {
		var listeningTo = this._listeningTo;
		var matches = [];

		if (!listeningTo || !listeningTo.length) return this;

		if (!evtName && !cb) {
			// stop listening to a emitter
			matches = listeningTo.filter(function(record) {
				return record.emitter === emitter;
			});
		}
		else if (!cb) {
			// stop listening to an event of a emitter
			matches = listeningTo.filter(function(record) {
				return record.emitter === emitter
					&& record.evtName === evtName;
			});
		}
		else {
			// stop calling handler of an event of a emitter
			matches = listeningTo.filter(function(record) {
				return record.emitter === emitter
					&& record.evtName === evtName
					&& record.cb === cb
			});
		}

		// unbind all matches
		matches.forEach(function(record) {
			unbindEvent(record.emitter, record.evtName, record.cb);
		});

		// do clean up of this._listeningTo
		matches.forEach(function(record) {
			var index = listeningTo.indexOf(record);
			if (index > -1) listeningTo.splice(index, 1);
		});

		return this;
	},

	componentWillUnmount: function() {
		this._listeningTo.forEach(function(data) {
			unbindEvent(data.emitter, data.evtName, data.cb);
		});

		return this;
	}
};

function bindEvent(emitter, evtName, cb) {
	var methods = ['on', 'addListener', 'addEventListener'];

	// call approriate method
	methods.some(function(method) {
		if (typeof emitter[method] == 'function') {
			emitter[method](evtName, cb);
			return true;
		}
	});
}

function unbindEvent(emitter, evtName, cb) {
	var methods = ['off', 'un', 'removeListener', 'removeEventListener'];

	// call approriate method
	methods.some(function(method) {
		if (typeof emitter[method] == 'function') {
			emitter[method](evtName, cb);
			return true;
		}
	});
}

module.exports = Mixin;
