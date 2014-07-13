var listenTo       = require('../listenTo');
var EventEmitter   = require('events').EventEmitter;
var React          = require('react');
var ReactTestUtils = require('react/lib/ReactTestUtils');
var assert         = require('assert');
var sinon          = require('sinon');

describe('listenTo - browser', function() {
	var TestComp;

	beforeEach(function() {
		TestComp = React.createClass({
			mixins: [listenTo],
			render: function() {
				return React.DOM.div('test component')
			}
		});
	});

	describe('#listenTo', function() {
		it('can attach event handler to DOM element', function(done) {
			var comp = TestComp();
			comp = ReactTestUtils.renderIntoDocument(comp);

			comp.listenTo(document, 'dong', function() {
				done()
			});

			var event = document.createEvent('Event');
			event.initEvent('dong', true, true);
			document.dispatchEvent(event);
		});

		it('can attach event handler to EventEmitter', function(done) {
			var emitter = new EventEmitter();
			var comp = TestComp();
			comp = ReactTestUtils.renderIntoDocument(comp);

			comp.listenTo(emitter, 'ding', function(arg) {
				assert.equal(arg, 1);
				done();
			});

			emitter.emit('ding', 1);
		});
	});

	describe('#noListenTo', function() {
		var spy, emitter, comp;

		beforeEach(function() {
			spy = sinon.spy();
			emitter = new EventEmitter();
			comp = TestComp();
			comp = ReactTestUtils.renderIntoDocument(comp);
		});

		it('can remove specific attached handler', function(done) {
			comp.listenTo(emitter, 'ding', spy);
			comp.noListenTo(emitter, 'ding', spy);

			emitter.emit('ding');

			setTimeout(function() {
				assert.ok(!spy.called);
				done();
			}, 100);
		});

		it('can remove all attached handler of a emitter\'s specific event', function(done) {
			comp.listenTo(emitter, 'ding', spy);
			comp.listenTo(emitter, 'ding', spy);
			comp.noListenTo(emitter, 'ding');

			emitter.emit('ding');

			setTimeout(function() {
				assert.ok(!spy.called);
				done();
			}, 100);
		});

		it('can remove all attached handlers of a emitter', function(done) {
			comp.listenTo(emitter, 'ding', spy);
			comp.listenTo(emitter, 'dong', spy);
			comp.noListenTo(emitter);

			emitter.emit('ding');
			emitter.emit('dong');

			setTimeout(function() {
				assert.ok(!spy.called);
				done();
			}, 100);
		});
	});

	describe('on component unmounted', function() {
		var spy, emitter, comp;

		beforeEach(function(done) {
			spy = sinon.spy();
			emitter = new EventEmitter();
			comp = TestComp();
			React.renderComponent(comp, document.body, function() {
				comp = this;
				done();
			});
		});

		it('should remove all attached handlers', function() {
			comp.listenTo(emitter, 'ding', spy);
			comp.listenTo(emitter, 'dong', spy);

			React.unmountComponentAtNode(document.body);

			emitter.emit('ding');
			emitter.emit('dong');

			assert.ok(!spy.called);
		});
	});
});
