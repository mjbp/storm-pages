(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    window.testFn = function (test) {
        console.log('here');
        console.log(test);
    };
    window.Pages = _component2.default.init('.js-pages');
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
    onDOMContentLoadedTasks.forEach(function (fn) {
        return fn();
    });
});

},{"./libs/component":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
			value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : { default: obj };
}

var init = function init(sel, opts) {
			var el = document.querySelector(sel);
			//let els = Array.from(document.querySelectorAll(sel));
			if (!el) return console.warn('Pages not initialised, no elements found for the selector \'' + sel + '\'');

			return Object.assign(Object.create(_componentPrototype2.default), {
						root: el,
						settings: Object.assign({}, _defaults2.default, opts)
			}).init();
};

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _constants = require('./constants');

var _utils = require('./utils');

var _render = require('./render');

function _defineProperty(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
	} else {
		obj[key] = value;
	}return obj;
}

exports.default = {
	init: function init() {
		this.state = Object.assign({}, _utils.initialState, this.stateFromHash(_utils.initialState));
		this.state.buttons.length && this.initButtons();
		this.render();

		window.addEventListener('hashchange', this.handleHashChange.bind(this), false);
		document.addEventListener('keydown', this.handleKeyDown.bind(this), false);

		return this;
	},
	stateFromHash: function stateFromHash() {
		var previousState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _utils.initialState;

		var candidate = (0, _utils.readStateFromURL)();
		return Object.assign({}, this.state, {
			page: candidate.page < 0 ? 0 : candidate.page >= previousState.pages.length ? previousState.pages.length - 1 : candidate.page,
			subpage: previousState.pages[candidate.page].subpages ? candidate.nextSubpage < 0 ? 0 : candidate.subpage >= previousState.pages[candidate.page].subpages.length ? previousState.pages[candidate.page].subpages.length - 1 : candidate.subpage : false
		});
	},
	handleHashChange: function handleHashChange() {
		this.state = this.stateFromHash();
		this.render();
	},
	initButtons: function initButtons() {
		var _this = this;

		_constants.TRIGGER_EVENTS.forEach(function (ev) {
			_this.state.buttons.forEach(function (btn) {
				btn.addEventListener(ev, function (e) {
					if (e.keyCode && !~_constants.TRIGGER_KEYCODES.indexOf(e.KeyCode)) return;
					_this[btn.hasAttribute(_constants.DATA_ATTRIBUTES.BUTTON_NEXT) ? 'next' : 'previous']();
				});
			});
		});
	},
	handleKeyDown: function handleKeyDown(e) {
		var _keyDictionary;

		var keyDictionary = (_keyDictionary = {}, _defineProperty(_keyDictionary, _constants.KEY_CODES.LEFT, function () {
			this.previous();
		}), _defineProperty(_keyDictionary, _constants.KEY_CODES.RIGHT, function () {
			this.next();
		}), _keyDictionary);
		if (keyDictionary[e.keyCode]) keyDictionary[e.keyCode].call(this);
	},
	render: function render() {
		(0, _render.renderPage)(this.state);
		(0, _render.renderSubpage)(this.state);
		this.postRender();
		// renderButtons(this.state;
	},
	postRender: function postRender() {
		this.state.subpage !== false && this.state.pages[this.state.page].subpages[this.state.subpage].callback && this.state.pages[this.state.page].subpages[this.state.subpage].callback();

		this.state.pages[this.state.page].callback && this.state.pages[this.state.page].callback();
	},
	previous: function previous() {
		if ((0, _utils.isFirstItem)(this.state)) return;

		if (this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage !== false && this.state.subpage > 0) this.state = Object.assign({}, this.state, { subpage: this.state.subpage - 1 });else if (this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage === 0) this.state = Object.assign({}, this.state, { subpage: false });else this.state = Object.assign({}, this.state, { page: this.state.page - 1, subpage: this.state.pages[this.state.page - 1].subpages.length - 1 });

		(0, _utils.writeStateToURL)(this.state);
	},
	next: function next() {
		if ((0, _utils.isLastItem)(this.state)) return;

		if (this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage + 1 < this.state.pages[this.state.page].subpages.length) {
			if (this.state.subpage === false) this.state = Object.assign({}, this.state, { subpage: 0 });else this.state = Object.assign({}, this.state, { subpage: this.state.subpage + 1 });
		} else this.state = Object.assign({}, this.state, { page: this.state.page + 1, subpage: false });

		(0, _utils.writeStateToURL)(this.state);
	}
};

},{"./constants":4,"./render":6,"./utils":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CLASSNAMES = exports.CLASSNAMES = {
    PAGE: 'js-page',
    SUB_PAGE: 'js-page__sub',
    HIDDEN: 'hidden',
    CURRENT: 'current',
    BUTTON: 'js-page__btn',
    BUTTON_CONTAINER: 'page__btn-container'
};

var DATA_ATTRIBUTES = exports.DATA_ATTRIBUTES = {
    BUTTON_NEXT: 'data-page-next',
    BUTTON_PREVIOUS: 'data-page-previous',
    CALLBACK: 'data-page-callback',
    PARAMS: 'data-page-params'
};

var KEY_CODES = exports.KEY_CODES = {
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40
};

var TRIGGER_EVENTS = exports.TRIGGER_EVENTS = ['click', 'keydown'];

var TRIGGER_KEYCODES = exports.TRIGGER_KEYCODES = [13, 32];

var INITIAL_STATE = exports.INITIAL_STATE = {
    page: false,
    subpage: false,
    pages: false
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	buttons: true,
	navigation: false,
	callback: null
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.navigation = exports.renderSubpage = exports.renderPage = undefined;

var _constants = require('./constants');

var _utils = require('./utils');

var renderPage = exports.renderPage = function renderPage(nextState) {
    nextState.pages.forEach(function (page, i) {
        if (nextState.page !== i) {
            (0, _utils.hideNode)(page.node);
        }
    });
    (0, _utils.showNode)(nextState.pages[nextState.page].node);
};

var renderSubpage = exports.renderSubpage = function renderSubpage(nextState) {
    resetSubpages(nextState);
    if (nextState.subpage === false) return;

    nextState.pages[nextState.page].subpages.forEach(function (subpage, i) {
        if (nextState.subpage >= i) {
            (0, _utils.showNode)(subpage.node);
        }
    });
};

var resetSubpages = function resetSubpages(state) {
    state.pages.forEach(function (page, i) {
        page.subpages.forEach(function (subpage) {
            (0, _utils.hideNode)(subpage.node);
        });
    });
};

var navigation = exports.navigation = function navigation(nextState) {};

},{"./constants":4,"./utils":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initialState = exports.isFirstItem = exports.isLastItem = exports.showNode = exports.hideNode = exports.readStateFromURL = exports.writeStateToURL = undefined;

var _constants = require('./constants');

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

var noop = function noop() {};

var writeStateToURL = exports.writeStateToURL = function writeStateToURL(props) {
    var url = '/';

    if (props.page >= 0) url += props.page + 1;
    if (props.subpage >= 0 && props.subpage !== false) url += '/' + (props.subpage + 1);

    window.location.hash = url;
};

var readStateFromURL = exports.readStateFromURL = function readStateFromURL() {
    var parts = window.location.hash.slice(2).split('/');

    return {
        page: parseInt(parts[0], 10) ? parseInt(parts[0], 10) - 1 : 0,
        subpage: parseInt(parts[1], 10) ? parseInt(parts[1], 10) - 1 : false
    };
};

var hideNode = exports.hideNode = function hideNode(node) {
    node.setAttribute('hidden', 'hidden');
    node.classList.remove(_constants.CLASSNAMES.CURRENT);
    node.classList.add(_constants.CLASSNAMES.HIDDEN);
};

var showNode = exports.showNode = function showNode(node) {
    node.removeAttribute('hidden');
    node.classList.add(_constants.CLASSNAMES.CURRENT);
    node.classList.remove(_constants.CLASSNAMES.HIDDEN);
};

var isLastItem = exports.isLastItem = function isLastItem(state) {
    return state.page + 1 === state.pages.length && (state.pages[state.page].subpages.length === 0 || state.subpage + 1 === state.pages[state.page].subpages.length);
};

var isFirstItem = exports.isFirstItem = function isFirstItem(state) {
    return state.page === 0 && (state.pages[state.page].subpages.length === 0 || state.subpage === false);
};

var initialState = exports.initialState = Object.assign({}, _constants.INITIAL_STATE, {
    pages: [].slice.call(document.querySelectorAll('.' + _constants.CLASSNAMES.PAGE)).reduce(function (pages, page) {
        return [].concat(_toConsumableArray(pages), [{
            node: page,
            callback: page.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK) ? function () {
                page.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK).apply(this, page.getAttribute(_constants.DATA_ATTRIBUTES.PARAMS) ? JSON.parse(page.getAttribute(_constants.DATA_ATTRIBUTES.PARAMS)) : []);
            } : false,
            subpages: [].slice.call(page.querySelectorAll('.' + _constants.CLASSNAMES.SUB_PAGE)).reduce(function (subpages, subpage) {
                return [].concat(_toConsumableArray(subpages), [{
                    node: subpage,
                    callback: subpage.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK) ? function () {
                        window[subpage.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK)].apply(this, subpage.getAttribute(_constants.DATA_ATTRIBUTES.PARAMS) ? JSON.parse(subpage.getAttribute(_constants.DATA_ATTRIBUTES.PARAMS)) : []);
                    } : false
                }]);
            }, [])
        }]);
    }, []),
    buttons: [].slice.call(document.querySelectorAll('[' + _constants.DATA_ATTRIBUTES.BUTTON_NEXT + ']')).concat([].slice.call(document.querySelectorAll('[' + _constants.DATA_ATTRIBUTES.BUTTON_PREVIOUS + ']')))
});

},{"./constants":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9yZW5kZXIuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7OztBQUVBLElBQU0sMkJBQTJCLFlBQU0sQUFDbkM7V0FBQSxBQUFPLFNBQVMsVUFBQSxBQUFDLE1BQVMsQUFDdEI7Z0JBQUEsQUFBUSxJQUFSLEFBQVksQUFDWjtnQkFBQSxBQUFRLElBQVIsQUFBWSxBQUNmO0FBSEQsQUFJQTtXQUFBLEFBQU8sUUFBUSxvQkFBQSxBQUFNLEtBQXJCLEFBQWUsQUFBVyxBQUM3QjtBQU5ELEFBQWdDLENBQUE7O0FBUWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDVmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7T0FBSSxLQUFLLFNBQUEsQUFBUyxjQUFsQixBQUFTLEFBQXVCLEFBQzdCO0FBQ0g7T0FBRyxDQUFILEFBQUksSUFBSSxPQUFPLFFBQUEsQUFBUSxzRUFBUixBQUEyRSxNQUFs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QkFBL0UsQUFBK0MsQUFBVyxBQUFxQyxXQUFsSyxBQUE2SyxBQUNoTDtBQUZTLHFCQUFBLEdBRm1FLEFBQXFDLEFBSTlHO0FBSjhHLEFBQ2xIO0FBRE0sYUFBQSxFQUhnRSxBQUE0QixBQUc1RixBQUtOO0FBUmtHLEFBQ3RHO0FBREcsS0FBQSxFQURYLEFBQ1csQUFTSCxBQUNKO2FBQVMsR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyx1QkFBcUIsMkJBQTlCLEFBQThDLGNBQTVELE1BQUEsQUFBNkUsT0FBTyxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLHVCQUFxQiwyQkFBOUIsQUFBOEMsa0JBZHRMLEFBQXFCLEFBR0ksQUFXYSxBQUFvRjtBQVhqRyxBQUNJLENBSlIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFBhZ2VzIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgd2luZG93LnRlc3RGbiA9ICh0ZXN0KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoZXJlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRlc3QpO1xuICAgIH07XG4gICAgd2luZG93LlBhZ2VzID0gUGFnZXMuaW5pdCgnLmpzLXBhZ2VzJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgLy9sZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRpZighZWwpIHJldHVybiBjb25zb2xlLndhcm4oYFBhZ2VzIG5vdCBpbml0aWFsaXNlZCwgbm8gZWxlbWVudHMgZm91bmQgZm9yIHRoZSBzZWxlY3RvciAnJHtzZWx9J2ApO1xuICAgIFxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdHJvb3Q6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCB7IENMQVNTTkFNRVMsIElOSVRJQUxfU1RBVEUsIERBVEFfQVRUUklCVVRFUywgVFJJR0dFUl9FVkVOVFMsIFRSSUdHRVJfS0VZQ09ERVMsIEtFWV9DT0RFUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGluaXRpYWxTdGF0ZSwgcmVhZFN0YXRlRnJvbVVSTCwgd3JpdGVTdGF0ZVRvVVJMLCBpc0ZpcnN0SXRlbSwgaXNMYXN0SXRlbSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgcmVuZGVyUGFnZSwgcmVuZGVyU3VicGFnZSB9IGZyb20gJy4vcmVuZGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBpbml0aWFsU3RhdGUsIHRoaXMuc3RhdGVGcm9tSGFzaChpbml0aWFsU3RhdGUpKTtcblx0XHR0aGlzLnN0YXRlLmJ1dHRvbnMubGVuZ3RoICYmIHRoaXMuaW5pdEJ1dHRvbnMoKTtcblx0XHR0aGlzLnJlbmRlcigpO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhbmRsZUhhc2hDaGFuZ2UuYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdFxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRzdGF0ZUZyb21IYXNoKHByZXZpb3VzU3RhdGUgPSBpbml0aWFsU3RhdGUpe1xuXHRcdGxldCBjYW5kaWRhdGUgPSByZWFkU3RhdGVGcm9tVVJMKCk7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcblx0XHRcdHBhZ2U6IGNhbmRpZGF0ZS5wYWdlIDwgMCA/IDAgOiBjYW5kaWRhdGUucGFnZSA+PSBwcmV2aW91c1N0YXRlLnBhZ2VzLmxlbmd0aCA/IHByZXZpb3VzU3RhdGUucGFnZXMubGVuZ3RoIC0gMSA6IGNhbmRpZGF0ZS5wYWdlLFxuXHRcdFx0c3VicGFnZTogcHJldmlvdXNTdGF0ZS5wYWdlc1tjYW5kaWRhdGUucGFnZV0uc3VicGFnZXMgPyBjYW5kaWRhdGUubmV4dFN1YnBhZ2UgPCAwID8gMCA6IGNhbmRpZGF0ZS5zdWJwYWdlID49IHByZXZpb3VzU3RhdGUucGFnZXNbY2FuZGlkYXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA/IHByZXZpb3VzU3RhdGUucGFnZXNbY2FuZGlkYXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCAtIDEgOiBjYW5kaWRhdGUuc3VicGFnZSA6IGZhbHNlLFxuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVIYXNoQ2hhbmdlKCl7XG5cdFx0dGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGVGcm9tSGFzaCgpO1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdH0sXG5cdGluaXRCdXR0b25zKCl7XG5cdFx0VFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG5cdFx0XHR0aGlzLnN0YXRlLmJ1dHRvbnMuZm9yRWFjaChidG4gPT4ge1xuXHRcdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG5cdFx0XHRcdFx0aWYoZS5rZXlDb2RlICYmICF+VFJJR0dFUl9LRVlDT0RFUy5pbmRleE9mKGUuS2V5Q29kZSkpIHJldHVybjtcblx0XHRcdFx0XHR0aGlzW2J0bi5oYXNBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLkJVVFRPTl9ORVhUKSA/ICduZXh0JyA6ICdwcmV2aW91cyddKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGhhbmRsZUtleURvd24oZSl7XG5cdFx0Y29uc3Qga2V5RGljdGlvbmFyeSA9IHtcblx0XHRcdFtLRVlfQ09ERVMuTEVGVF0oKXsgdGhpcy5wcmV2aW91cygpOyB9LFxuXHRcdFx0W0tFWV9DT0RFUy5SSUdIVF0oKXsgdGhpcy5uZXh0KCk7IH1cblx0XHR9O1xuXHRcdGlmKGtleURpY3Rpb25hcnlbZS5rZXlDb2RlXSkga2V5RGljdGlvbmFyeVtlLmtleUNvZGVdLmNhbGwodGhpcyk7XG5cdH0sXG5cdHJlbmRlcigpe1xuXHRcdHJlbmRlclBhZ2UodGhpcy5zdGF0ZSk7XG5cdFx0cmVuZGVyU3VicGFnZSh0aGlzLnN0YXRlKTtcblx0XHR0aGlzLnBvc3RSZW5kZXIoKTtcblx0XHQvLyByZW5kZXJCdXR0b25zKHRoaXMuc3RhdGU7XG5cdH0sXG5cdHBvc3RSZW5kZXIoKXtcblx0XHQodGhpcy5zdGF0ZS5zdWJwYWdlICE9PSBmYWxzZSAmJiB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uc3VicGFnZXNbdGhpcy5zdGF0ZS5zdWJwYWdlXS5jYWxsYmFjaykgJiYgdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnN1YnBhZ2VzW3RoaXMuc3RhdGUuc3VicGFnZV0uY2FsbGJhY2soKTtcblxuXHRcdHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5jYWxsYmFjayAmJiB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uY2FsbGJhY2soKTtcblx0fSxcblx0cHJldmlvdXMoKXtcblx0XHRpZihpc0ZpcnN0SXRlbSh0aGlzLnN0YXRlKSkgcmV0dXJuO1xuXHRcdFxuXHRcdGlmKHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5zdWJwYWdlcy5sZW5ndGggPiAwICYmICh0aGlzLnN0YXRlLnN1YnBhZ2UgIT09IGZhbHNlICYmIHRoaXMuc3RhdGUuc3VicGFnZSA+IDApKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBzdWJwYWdlOiB0aGlzLnN0YXRlLnN1YnBhZ2UgLSAxfSk7XG5cdFx0ZWxzZSBpZih0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoID4gMCAmJiB0aGlzLnN0YXRlLnN1YnBhZ2UgPT09IDApIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHN1YnBhZ2U6IGZhbHNlIH0pO1xuXHRcdGVsc2UgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgcGFnZTogdGhpcy5zdGF0ZS5wYWdlIC0gMSwgc3VicGFnZTogdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2UgLSAxXS5zdWJwYWdlcy5sZW5ndGggLSAxIH0pO1xuXHRcdFxuXHRcdHdyaXRlU3RhdGVUb1VSTCh0aGlzLnN0YXRlKTtcblx0fSxcblx0bmV4dCgpe1xuXHRcdGlmKGlzTGFzdEl0ZW0odGhpcy5zdGF0ZSkpIHJldHVybjtcblxuXHRcdGlmKHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5zdWJwYWdlcy5sZW5ndGggPiAwICYmIHRoaXMuc3RhdGUuc3VicGFnZSArIDEgPCB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoKXtcblx0XHRcdGlmKHRoaXMuc3RhdGUuc3VicGFnZSA9PT0gZmFsc2UpIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHN1YnBhZ2U6IDAgfSk7XG5cdFx0XHRlbHNlIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHN1YnBhZ2U6IHRoaXMuc3RhdGUuc3VicGFnZSArIDEgfSk7XG5cdFx0fSBlbHNlIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhZ2U6IHRoaXMuc3RhdGUucGFnZSArIDEsIHN1YnBhZ2U6IGZhbHNlIH0pO1xuXG5cdFx0d3JpdGVTdGF0ZVRvVVJMKHRoaXMuc3RhdGUpO1xuXHR9XG59OyIsImV4cG9ydCBjb25zdCBDTEFTU05BTUVTID0ge1xuICAgIFBBR0U6ICdqcy1wYWdlJyxcbiAgICBTVUJfUEFHRTogJ2pzLXBhZ2VfX3N1YicsXG4gICAgSElEREVOOiAnaGlkZGVuJyxcbiAgICBDVVJSRU5UOiAnY3VycmVudCcsXG4gICAgQlVUVE9OOiAnanMtcGFnZV9fYnRuJyxcbiAgICBCVVRUT05fQ09OVEFJTkVSOiAncGFnZV9fYnRuLWNvbnRhaW5lcidcbn07XG5cbmV4cG9ydCBjb25zdCBEQVRBX0FUVFJJQlVURVMgPSB7XG4gICAgQlVUVE9OX05FWFQ6ICdkYXRhLXBhZ2UtbmV4dCcsXG4gICAgQlVUVE9OX1BSRVZJT1VTOiAnZGF0YS1wYWdlLXByZXZpb3VzJyxcbiAgICBDQUxMQkFDSzogJ2RhdGEtcGFnZS1jYWxsYmFjaycsXG4gICAgUEFSQU1TOiAnZGF0YS1wYWdlLXBhcmFtcydcbn07XG5cbmV4cG9ydCBjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgU1BBQ0U6IDMyLFxuICAgIEVOVEVSOiAxMyxcbiAgICBUQUI6IDksXG4gICAgTEVGVDogMzcsXG4gICAgUklHSFQ6IDM5LFxuICAgIERPV046IDQwXG59O1xuXG5leHBvcnQgY29uc3QgVFJJR0dFUl9FVkVOVFMgPSBbJ2NsaWNrJywgJ2tleWRvd24nXTtcblxuZXhwb3J0IGNvbnN0IFRSSUdHRVJfS0VZQ09ERVMgPSBbMTMsIDMyXTtcblxuZXhwb3J0IGNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gICAgcGFnZTogZmFsc2UsXG4gICAgc3VicGFnZTogZmFsc2UsXG4gICAgcGFnZXM6IGZhbHNlXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcblx0YnV0dG9uczogdHJ1ZSxcblx0bmF2aWdhdGlvbjogZmFsc2UsXG5cdGNhbGxiYWNrOiBudWxsXG59OyIsImltcG9ydCB7IENMQVNTTkFNRVMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBoaWRlTm9kZSwgc2hvd05vZGUgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IHJlbmRlclBhZ2UgPSBuZXh0U3RhdGUgPT4ge1xuICAgIG5leHRTdGF0ZS5wYWdlcy5mb3JFYWNoKChwYWdlLCBpKSA9PiB7XG4gICAgICAgIGlmKG5leHRTdGF0ZS5wYWdlICE9PSBpKSB7XG4gICAgICAgICAgICBoaWRlTm9kZShwYWdlLm5vZGUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgc2hvd05vZGUobmV4dFN0YXRlLnBhZ2VzW25leHRTdGF0ZS5wYWdlXS5ub2RlKTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJTdWJwYWdlID0gbmV4dFN0YXRlID0+IHtcbiAgICByZXNldFN1YnBhZ2VzKG5leHRTdGF0ZSk7XG4gICAgaWYobmV4dFN0YXRlLnN1YnBhZ2UgPT09IGZhbHNlKSByZXR1cm47XG4gICAgXG4gICAgbmV4dFN0YXRlLnBhZ2VzW25leHRTdGF0ZS5wYWdlXS5zdWJwYWdlcy5mb3JFYWNoKChzdWJwYWdlLCBpKSA9PiB7XG4gICAgICAgIGlmKG5leHRTdGF0ZS5zdWJwYWdlID49IGkpIHtcbiAgICAgICAgICAgIHNob3dOb2RlKHN1YnBhZ2Uubm9kZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmNvbnN0IHJlc2V0U3VicGFnZXMgPSBzdGF0ZSA9PiB7XG4gICAgc3RhdGUucGFnZXMuZm9yRWFjaCgocGFnZSwgaSkgPT4ge1xuICAgICAgICBwYWdlLnN1YnBhZ2VzLmZvckVhY2goc3VicGFnZSA9PiB7XG4gICAgICAgICAgICBoaWRlTm9kZShzdWJwYWdlLm5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBuYXZpZ2F0aW9uID0gbmV4dFN0YXRlID0+IHt9OyIsImltcG9ydCB7IENMQVNTTkFNRVMsIElOSVRJQUxfU1RBVEUsIERBVEFfQVRUUklCVVRFUyB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuXG5leHBvcnQgY29uc3Qgd3JpdGVTdGF0ZVRvVVJMID0gcHJvcHMgPT4ge1xuICAgIHZhciB1cmwgPSAnLyc7XG5cbiAgICBpZihwcm9wcy5wYWdlID49IDApIHVybCArPSAocHJvcHMucGFnZSArIDEpO1xuICAgIGlmKCBwcm9wcy5zdWJwYWdlID49IDAgJiYgcHJvcHMuc3VicGFnZSAhPT0gZmFsc2UpIHVybCArPSAnLycgKyAocHJvcHMuc3VicGFnZSArIDEpO1xuXG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSB1cmw7XG59O1xuXG5leHBvcnQgY29uc3QgcmVhZFN0YXRlRnJvbVVSTCA9ICgpID0+IHtcbiAgICBsZXQgcGFydHMgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgyKS5zcGxpdCggJy8nICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwYWdlOiBwYXJzZUludChwYXJ0c1swXSwgMTApID8gcGFyc2VJbnQocGFydHNbMF0sIDEwKSAtIDEgOiAwLFxuICAgICAgICBzdWJwYWdlOiBwYXJzZUludChwYXJ0c1sxXSwgMTApID8gcGFyc2VJbnQocGFydHNbMV0sIDEwKSAtIDEgOiBmYWxzZSxcbiAgICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGhpZGVOb2RlID0gbm9kZSA9PiB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5ISURERU4pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNob3dOb2RlID0gbm9kZSA9PiB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLkNVUlJFTlQpO1xuICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShDTEFTU05BTUVTLkhJRERFTik7XG59O1xuXG5leHBvcnQgY29uc3QgaXNMYXN0SXRlbSA9IHN0YXRlID0+IHN0YXRlLnBhZ2UgKyAxID09PSBzdGF0ZS5wYWdlcy5sZW5ndGggJiYgKHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA9PT0gMCB8fCBzdGF0ZS5zdWJwYWdlICsgMSA9PT0gc3RhdGUucGFnZXNbc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlyc3RJdGVtID0gc3RhdGUgPT4gc3RhdGUucGFnZSA9PT0gMCAmJiAoc3RhdGUucGFnZXNbc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoID09PSAwIHx8IHN0YXRlLnN1YnBhZ2UgPT09IGZhbHNlKTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxTdGF0ZSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJTklUSUFMX1NUQVRFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlczogW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDTEFTU05BTUVTLlBBR0V9YCkpLnJlZHVjZSgocGFnZXMsIHBhZ2UpID0+IFsuLi5wYWdlcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IHBhZ2UuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5DQUxMQkFDSykgPyBmdW5jdGlvbigpeyBwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQ0FMTEJBQ0spLmFwcGx5KHRoaXMsIHBhZ2UuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5QQVJBTVMpID8gSlNPTi5wYXJzZShwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuUEFSQU1TKSkgOiBbXSkgfSA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnBhZ2VzOiBbXS5zbGljZS5jYWxsKHBhZ2UucXVlcnlTZWxlY3RvckFsbChgLiR7Q0xBU1NOQU1FUy5TVUJfUEFHRX1gKSkucmVkdWNlKChzdWJwYWdlcywgc3VicGFnZSkgPT4gWy4uLnN1YnBhZ2VzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IHN1YnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBzdWJwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQ0FMTEJBQ0spID8gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd1tzdWJwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQ0FMTEJBQ0spXS5hcHBseSh0aGlzLCBzdWJwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuUEFSQU1TKSA/IEpTT04ucGFyc2Uoc3VicGFnZS5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLlBBUkFNUykpIDogW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XSwgW10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XSwgW10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbJHtEQVRBX0FUVFJJQlVURVMuQlVUVE9OX05FWFR9XWApKS5jb25jYXQoW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbJHtEQVRBX0FUVFJJQlVURVMuQlVUVE9OX1BSRVZJT1VTfV1gKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApOyJdfQ==
