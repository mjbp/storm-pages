(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    window.testFn = function () {

        console.log(JSON.parse(this.getAttribute('data-page-params')).join(' '));
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
			part: previousState.pages[candidate.page].parts ? candidate.nextPart < 0 ? 0 : candidate.part >= previousState.pages[candidate.page].parts.length ? previousState.pages[candidate.page].parts.length - 1 : candidate.part : false
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
		(0, _render.renderPart)(this.state);
		(0, _render.renderButtons)(this.state);
		this.postRender();
		// renderButtons(this.state;
	},
	postRender: function postRender() {
		if ((0, _utils.partHasCallback)(this.state)) this.state.pages[this.state.page].parts[this.state.part].callback();

		this.state.pages[this.state.page].callback && this.state.pages[this.state.page].callback();
	},
	previous: function previous() {
		if ((0, _utils.isFirstItem)(this.state)) return;

		if (this.state.pages[this.state.page].parts.length > 0 && this.state.part !== false && this.state.part > 0) this.state = Object.assign({}, this.state, { part: this.state.part - 1 });else if (this.state.pages[this.state.page].parts.length > 0 && this.state.part === 0) this.state = Object.assign({}, this.state, { part: false });else this.state = Object.assign({}, this.state, { page: this.state.page - 1, part: this.state.pages[this.state.page - 1].parts.length - 1 });

		(0, _utils.writeStateToURL)(this.state);
	},
	next: function next() {
		if ((0, _utils.isLastItem)(this.state)) return;

		if (this.state.pages[this.state.page].parts.length > 0 && this.state.part + 1 < this.state.pages[this.state.page].parts.length) {
			if (this.state.part === false) this.state = Object.assign({}, this.state, { part: 0 });else this.state = Object.assign({}, this.state, { part: this.state.part + 1 });
		} else this.state = Object.assign({}, this.state, { page: this.state.page + 1, part: false });

		(0, _utils.writeStateToURL)(this.state);
	},
	goTo: function goTo(nextState) {
		this.state = Object.assign({}, this.state, {
			page: nextState.page !== null && nextState.page < this.state.pages.length ? nextState.page : this.state.page,
			part: nextState.part < this.state.pages[nextState.page].parts.length ? nextState.part : this.stateFromHash.part
		});
		(0, _utils.writeStateToURL)(this.state);

		/*
  {
  	page: X,
  	subpage: X || false
  }
  */
	}
};

},{"./constants":4,"./render":6,"./utils":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CLASSNAMES = exports.CLASSNAMES = {
    PAGE: 'js-page',
    PART: 'js-page__sub',
    HIDDEN: 'hidden',
    CURRENT: 'current',
    BUTTON: 'js-page__btn',
    BUTTON_CONTAINER: 'page__btn-container'
};

var DATA_ATTRIBUTES = exports.DATA_ATTRIBUTES = {
    BUTTON_NEXT: 'data-page-next',
    BUTTON_PREVIOUS: 'data-page-previous',
    CALLBACK: 'data-page-callback'
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
    part: false,
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
exports.navigation = exports.renderButtons = exports.renderPart = exports.renderPage = undefined;

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

var renderPart = exports.renderPart = function renderPart(nextState) {
    resetParts(nextState);
    if (nextState.part === false) return;

    nextState.pages[nextState.page].parts.forEach(function (part, i) {
        if (nextState.part >= i) {
            (0, _utils.showNode)(part.node);
        }
    });
};

var resetParts = function resetParts(state) {
    state.pages.forEach(function (page, i) {
        page.parts.forEach(function (part) {
            (0, _utils.hideNode)(part.node);
        });
    });
};

var renderButtons = exports.renderButtons = function renderButtons(state) {
    if (state.buttons.length === 0) return;
    state.buttons.forEach(function (btn) {
        if ((0, _utils.isFirstItem)(state)) state.buttons[0].setAttribute('disabled', 'disabled');else if (state.buttons[0].hasAttribute('disabled')) state.buttons[0].removeAttribute('disabled');

        if ((0, _utils.isLastItem)(state)) state.buttons[1].setAttribute('disabled', 'disabled');else if (state.buttons[1].hasAttribute('disabled')) state.buttons[1].removeAttribute('disabled');
    });
};

var navigation = exports.navigation = function navigation(nextState) {};

},{"./constants":4,"./utils":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initialState = exports.partHasCallback = exports.isFirstItem = exports.isLastItem = exports.showNode = exports.hideNode = exports.readStateFromURL = exports.writeStateToURL = undefined;

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
    if (props.part >= 0 && props.part !== false) url += '/' + (props.part + 1);

    window.location.hash = url;
};

var readStateFromURL = exports.readStateFromURL = function readStateFromURL() {
    var parts = window.location.hash.slice(2).split('/');

    return {
        page: parseInt(parts[0], 10) ? parseInt(parts[0], 10) - 1 : 0,
        part: parseInt(parts[1], 10) ? parseInt(parts[1], 10) - 1 : false
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
    return state.page + 1 === state.pages.length && (state.pages[state.page].parts.length === 0 || state.part + 1 === state.pages[state.page].parts.length);
};

var isFirstItem = exports.isFirstItem = function isFirstItem(state) {
    return state.page === 0 && (state.pages[state.page].parts.length === 0 || state.part === false);
};

var partHasCallback = exports.partHasCallback = function partHasCallback(state) {
    return state.part !== false && state.pages[state.page].parts[state.part].callback;
};

var initialState = exports.initialState = Object.assign({}, _constants.INITIAL_STATE, {
    pages: [].slice.call(document.querySelectorAll('.' + _constants.CLASSNAMES.PAGE)).reduce(function (pages, page) {
        return [].concat(_toConsumableArray(pages), [{
            node: page,
            callback: page.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK) ? function () {
                page.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK).apply(this, page.getAttribute(_constants.DATA_ATTRIBUTES.PARAMS) ? JSON.parse(page.getAttribute(_constants.DATA_ATTRIBUTES.PARAMS)) : []);
            } : false,
            parts: [].slice.call(page.querySelectorAll('.' + _constants.CLASSNAMES.PART)).reduce(function (parts, part) {
                return [].concat(_toConsumableArray(parts), [{
                    node: part,
                    callback: part.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK) ? function () {
                        window['' + part.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK)].apply(this, part.getAttribute(_constants.DATA_ATTRIBUTES.PARAMS) ? JSON.parse(part.getAttribute(_constants.DATA_ATTRIBUTES.PARAMS)) : []);
                    }.bind(part) : false
                }]);
            }, [])
        }]);
    }, []),
    buttons: [].slice.call(document.querySelectorAll('[' + _constants.DATA_ATTRIBUTES.BUTTON_PREVIOUS + ']')).concat([].slice.call(document.querySelectorAll('[' + _constants.DATA_ATTRIBUTES.BUTTON_NEXT + ']')))
});

},{"./constants":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9yZW5kZXIuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7OztBQUVBLElBQU0sMkJBQTJCLFlBQU0sQUFDbkM7V0FBQSxBQUFPLFNBQVMsWUFBVyxBQUV2Qjs7Z0JBQUEsQUFBUSxJQUFJLEtBQUEsQUFBSyxNQUFNLEtBQUEsQUFBSyxhQUFoQixBQUFXLEFBQWtCLHFCQUE3QixBQUFrRCxLQUE5RCxBQUFZLEFBQXVELEFBQ3RFO0FBSEQsQUFJQTtXQUFBLEFBQU8sUUFBUSxvQkFBQSxBQUFNLEtBQXJCLEFBQWUsQUFBVyxBQUM3QjtBQU5ELEFBQWdDLENBQUE7O0FBUWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDVmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7T0FBSSxLQUFLLFNBQUEsQUFBUyxjQUFsQixBQUFTLEFBQXVCLEFBQzdCO0FBQ0g7T0FBRyxDQUFILEFBQUksSUFB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LDJCQUE1QixBQUFVLEFBQWtDLFdBQTVDLEFBQXlELE1BQXpELEFBQStELE1BQU0sS0FBQSxBQUFLLGFBQWEsMkJBQWxCLEFBQWtDLFVBQVUsS0FBQSxBQUFLLE1BQU0sS0FBQSxBQUFLLGFBQWEsMkJBQXpFLEFBQTRDLEFBQVcsQUFBa0MsV0FBOUosQUFBd0ssQUFBTTtBQUEzTCxxQkFBQSxDQUFBLEFBQTRMLEtBQTFPLEFBQThDLEFBQWlNLFFBRm5MLEFBQTRCLEFBRStKO0FBRi9KLEFBQ2xHO0FBREcsYUFBQSxFQUhtRSxBQUE0QixBQUcvRixBQUdIO0FBTmtHLEFBQ3RHO0FBREcsS0FBQSxFQURYLEFBQ1csQUFPSCxBQUNKO2FBQVMsR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyx1QkFBcUIsMkJBQTlCLEFBQThDLGtCQUE1RCxNQUFBLEFBQWlGLE9BQU8sR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyx1QkFBcUIsMkJBQTlCLEFBQThDLGNBWjFMLEFBQXFCLEFBR0ksQUFTYSxBQUF3RjtBQVRyRyxBQUNJLENBSlIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFBhZ2VzIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgd2luZG93LnRlc3RGbiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04ucGFyc2UodGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFnZS1wYXJhbXMnKSkuam9pbignICcpKTtcbiAgICB9O1xuICAgIHdpbmRvdy5QYWdlcyA9IFBhZ2VzLmluaXQoJy5qcy1wYWdlcycpO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpO1xuICAgIC8vbGV0IGVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0aWYoIWVsKSByZXR1cm4gY29uc29sZS53YXJuKGBQYWdlcyBub3QgaW5pdGlhbGlzZWQsIG5vIGVsZW1lbnRzIGZvdW5kIGZvciB0aGUgc2VsZWN0b3IgJyR7c2VsfSdgKTtcbiAgICBcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRyb290OiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJpbXBvcnQgeyBDTEFTU05BTUVTLCBJTklUSUFMX1NUQVRFLCBEQVRBX0FUVFJJQlVURVMsIFRSSUdHRVJfRVZFTlRTLCBUUklHR0VSX0tFWUNPREVTLCBLRVlfQ09ERVMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBpbml0aWFsU3RhdGUsIHJlYWRTdGF0ZUZyb21VUkwsIHdyaXRlU3RhdGVUb1VSTCwgaXNGaXJzdEl0ZW0sIGlzTGFzdEl0ZW0sIHBhcnRIYXNDYWxsYmFjayB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgcmVuZGVyUGFnZSwgcmVuZGVyUGFydCwgcmVuZGVyQnV0dG9ucyB9IGZyb20gJy4vcmVuZGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBpbml0aWFsU3RhdGUsIHRoaXMuc3RhdGVGcm9tSGFzaChpbml0aWFsU3RhdGUpKTtcblx0XHR0aGlzLnN0YXRlLmJ1dHRvbnMubGVuZ3RoICYmIHRoaXMuaW5pdEJ1dHRvbnMoKTtcblx0XHR0aGlzLnJlbmRlcigpO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhbmRsZUhhc2hDaGFuZ2UuYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdFxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRzdGF0ZUZyb21IYXNoKHByZXZpb3VzU3RhdGUgPSBpbml0aWFsU3RhdGUpe1xuXHRcdGxldCBjYW5kaWRhdGUgPSByZWFkU3RhdGVGcm9tVVJMKCk7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcblx0XHRcdHBhZ2U6IGNhbmRpZGF0ZS5wYWdlIDwgMCA/IDAgOiBjYW5kaWRhdGUucGFnZSA+PSBwcmV2aW91c1N0YXRlLnBhZ2VzLmxlbmd0aCA/IHByZXZpb3VzU3RhdGUucGFnZXMubGVuZ3RoIC0gMSA6IGNhbmRpZGF0ZS5wYWdlLFxuXHRcdFx0cGFydDogcHJldmlvdXNTdGF0ZS5wYWdlc1tjYW5kaWRhdGUucGFnZV0ucGFydHMgPyBjYW5kaWRhdGUubmV4dFBhcnQgPCAwID8gMCA6IGNhbmRpZGF0ZS5wYXJ0ID49IHByZXZpb3VzU3RhdGUucGFnZXNbY2FuZGlkYXRlLnBhZ2VdLnBhcnRzLmxlbmd0aCA/IHByZXZpb3VzU3RhdGUucGFnZXNbY2FuZGlkYXRlLnBhZ2VdLnBhcnRzLmxlbmd0aCAtIDEgOiBjYW5kaWRhdGUucGFydCA6IGZhbHNlLFxuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVIYXNoQ2hhbmdlKCl7XG5cdFx0dGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGVGcm9tSGFzaCgpO1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdH0sXG5cdGluaXRCdXR0b25zKCl7XG5cdFx0VFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG5cdFx0XHR0aGlzLnN0YXRlLmJ1dHRvbnMuZm9yRWFjaChidG4gPT4ge1xuXHRcdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG5cdFx0XHRcdFx0aWYoZS5rZXlDb2RlICYmICF+VFJJR0dFUl9LRVlDT0RFUy5pbmRleE9mKGUuS2V5Q29kZSkpIHJldHVybjtcblx0XHRcdFx0XHR0aGlzW2J0bi5oYXNBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLkJVVFRPTl9ORVhUKSA/ICduZXh0JyA6ICdwcmV2aW91cyddKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGhhbmRsZUtleURvd24oZSl7XG5cdFx0Y29uc3Qga2V5RGljdGlvbmFyeSA9IHtcblx0XHRcdFtLRVlfQ09ERVMuTEVGVF0oKXsgdGhpcy5wcmV2aW91cygpOyB9LFxuXHRcdFx0W0tFWV9DT0RFUy5SSUdIVF0oKXsgdGhpcy5uZXh0KCk7IH1cblx0XHR9O1xuXHRcdGlmKGtleURpY3Rpb25hcnlbZS5rZXlDb2RlXSkga2V5RGljdGlvbmFyeVtlLmtleUNvZGVdLmNhbGwodGhpcyk7XG5cdH0sXG5cdHJlbmRlcigpe1xuXHRcdHJlbmRlclBhZ2UodGhpcy5zdGF0ZSk7XG5cdFx0cmVuZGVyUGFydCh0aGlzLnN0YXRlKTtcblx0XHRyZW5kZXJCdXR0b25zKHRoaXMuc3RhdGUpO1xuXHRcdHRoaXMucG9zdFJlbmRlcigpO1xuXHRcdC8vIHJlbmRlckJ1dHRvbnModGhpcy5zdGF0ZTtcblx0fSxcblx0cG9zdFJlbmRlcigpe1xuXHRcdGlmKHBhcnRIYXNDYWxsYmFjayh0aGlzLnN0YXRlKSkgdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnBhcnRzW3RoaXMuc3RhdGUucGFydF0uY2FsbGJhY2soKTtcblxuXHRcdHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5jYWxsYmFjayAmJiB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uY2FsbGJhY2soKTtcblx0fSxcblx0cHJldmlvdXMoKXtcblx0XHRpZihpc0ZpcnN0SXRlbSh0aGlzLnN0YXRlKSkgcmV0dXJuO1xuXHRcdFxuXHRcdGlmKHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGggPiAwICYmICh0aGlzLnN0YXRlLnBhcnQgIT09IGZhbHNlICYmIHRoaXMuc3RhdGUucGFydCA+IDApKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBwYXJ0OiB0aGlzLnN0YXRlLnBhcnQgLSAxfSk7XG5cdFx0ZWxzZSBpZih0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0ucGFydHMubGVuZ3RoID4gMCAmJiB0aGlzLnN0YXRlLnBhcnQgPT09IDApIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhcnQ6IGZhbHNlIH0pO1xuXHRcdGVsc2UgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgcGFnZTogdGhpcy5zdGF0ZS5wYWdlIC0gMSwgcGFydDogdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2UgLSAxXS5wYXJ0cy5sZW5ndGggLSAxIH0pO1xuXHRcdFxuXHRcdHdyaXRlU3RhdGVUb1VSTCh0aGlzLnN0YXRlKTtcblx0fSxcblx0bmV4dCgpe1xuXHRcdGlmKGlzTGFzdEl0ZW0odGhpcy5zdGF0ZSkpIHJldHVybjtcblxuXHRcdGlmKHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGggPiAwICYmIHRoaXMuc3RhdGUucGFydCArIDEgPCB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0ucGFydHMubGVuZ3RoKXtcblx0XHRcdGlmKHRoaXMuc3RhdGUucGFydCA9PT0gZmFsc2UpIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhcnQ6IDAgfSk7XG5cdFx0XHRlbHNlIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhcnQ6IHRoaXMuc3RhdGUucGFydCArIDEgfSk7XG5cdFx0fSBlbHNlIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhZ2U6IHRoaXMuc3RhdGUucGFnZSArIDEsIHBhcnQ6IGZhbHNlIH0pO1xuXG5cdFx0d3JpdGVTdGF0ZVRvVVJMKHRoaXMuc3RhdGUpO1xuXHR9LFxuXHRnb1RvKG5leHRTdGF0ZSl7XG5cdFx0dGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcblx0XHRcdHBhZ2U6IG5leHRTdGF0ZS5wYWdlICE9PSBudWxsICYmIG5leHRTdGF0ZS5wYWdlIDwgdGhpcy5zdGF0ZS5wYWdlcy5sZW5ndGggPyBuZXh0U3RhdGUucGFnZSA6IHRoaXMuc3RhdGUucGFnZSxcblx0XHRcdHBhcnQ6IG5leHRTdGF0ZS5wYXJ0IDwgdGhpcy5zdGF0ZS5wYWdlc1tuZXh0U3RhdGUucGFnZV0ucGFydHMubGVuZ3RoID8gbmV4dFN0YXRlLnBhcnQgOiB0aGlzLnN0YXRlRnJvbUhhc2gucGFydFxuXHRcdH0pO1xuXHRcdHdyaXRlU3RhdGVUb1VSTCh0aGlzLnN0YXRlKTtcblxuXHRcdC8qXG5cdFx0e1xuXHRcdFx0cGFnZTogWCxcblx0XHRcdHN1YnBhZ2U6IFggfHwgZmFsc2Vcblx0XHR9XG5cdFx0Ki9cblx0fVxufTsiLCJleHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHtcbiAgICBQQUdFOiAnanMtcGFnZScsXG4gICAgUEFSVDogJ2pzLXBhZ2VfX3N1YicsXG4gICAgSElEREVOOiAnaGlkZGVuJyxcbiAgICBDVVJSRU5UOiAnY3VycmVudCcsXG4gICAgQlVUVE9OOiAnanMtcGFnZV9fYnRuJyxcbiAgICBCVVRUT05fQ09OVEFJTkVSOiAncGFnZV9fYnRuLWNvbnRhaW5lcidcbn07XG5cbmV4cG9ydCBjb25zdCBEQVRBX0FUVFJJQlVURVMgPSB7XG4gICAgQlVUVE9OX05FWFQ6ICdkYXRhLXBhZ2UtbmV4dCcsXG4gICAgQlVUVE9OX1BSRVZJT1VTOiAnZGF0YS1wYWdlLXByZXZpb3VzJyxcbiAgICBDQUxMQkFDSzogJ2RhdGEtcGFnZS1jYWxsYmFjaydcbn07XG5cbmV4cG9ydCBjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgU1BBQ0U6IDMyLFxuICAgIEVOVEVSOiAxMyxcbiAgICBUQUI6IDksXG4gICAgTEVGVDogMzcsXG4gICAgUklHSFQ6IDM5LFxuICAgIERPV046IDQwXG59O1xuXG5leHBvcnQgY29uc3QgVFJJR0dFUl9FVkVOVFMgPSBbJ2NsaWNrJywgJ2tleWRvd24nXTtcblxuZXhwb3J0IGNvbnN0IFRSSUdHRVJfS0VZQ09ERVMgPSBbMTMsIDMyXTtcblxuZXhwb3J0IGNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gICAgcGFnZTogZmFsc2UsXG4gICAgcGFydDogZmFsc2UsXG4gICAgcGFnZXM6IGZhbHNlXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcblx0YnV0dG9uczogdHJ1ZSxcblx0bmF2aWdhdGlvbjogZmFsc2UsXG5cdGNhbGxiYWNrOiBudWxsXG59OyIsImltcG9ydCB7IENMQVNTTkFNRVMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBoaWRlTm9kZSwgc2hvd05vZGUsIGlzRmlyc3RJdGVtLCBpc0xhc3RJdGVtIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCByZW5kZXJQYWdlID0gbmV4dFN0YXRlID0+IHtcbiAgICBuZXh0U3RhdGUucGFnZXMuZm9yRWFjaCgocGFnZSwgaSkgPT4ge1xuICAgICAgICBpZihuZXh0U3RhdGUucGFnZSAhPT0gaSkge1xuICAgICAgICAgICAgaGlkZU5vZGUocGFnZS5ub2RlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHNob3dOb2RlKG5leHRTdGF0ZS5wYWdlc1tuZXh0U3RhdGUucGFnZV0ubm9kZSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVuZGVyUGFydCA9IG5leHRTdGF0ZSA9PiB7XG4gICAgcmVzZXRQYXJ0cyhuZXh0U3RhdGUpO1xuICAgIGlmKG5leHRTdGF0ZS5wYXJ0ID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIFxuICAgIG5leHRTdGF0ZS5wYWdlc1tuZXh0U3RhdGUucGFnZV0ucGFydHMuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuICAgICAgICBpZihuZXh0U3RhdGUucGFydCA+PSBpKSB7XG4gICAgICAgICAgICBzaG93Tm9kZShwYXJ0Lm5vZGUpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5jb25zdCByZXNldFBhcnRzID0gc3RhdGUgPT4ge1xuICAgIHN0YXRlLnBhZ2VzLmZvckVhY2goKHBhZ2UsIGkpID0+IHtcbiAgICAgICAgcGFnZS5wYXJ0cy5mb3JFYWNoKHBhcnQgPT4ge1xuICAgICAgICAgICAgaGlkZU5vZGUocGFydC5ub2RlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVuZGVyQnV0dG9ucyA9IHN0YXRlID0+IHtcbiAgICBpZihzdGF0ZS5idXR0b25zLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIHN0YXRlLmJ1dHRvbnMuZm9yRWFjaChidG4gPT4ge1xuICAgICAgICBpZihpc0ZpcnN0SXRlbShzdGF0ZSkpIHN0YXRlLmJ1dHRvbnNbMF0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICBlbHNlIGlmKHN0YXRlLmJ1dHRvbnNbMF0uaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSBzdGF0ZS5idXR0b25zWzBdLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcblxuICAgICAgICBpZihpc0xhc3RJdGVtKHN0YXRlKSkgc3RhdGUuYnV0dG9uc1sxXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICAgIGVsc2UgaWYoc3RhdGUuYnV0dG9uc1sxXS5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHN0YXRlLmJ1dHRvbnNbMV0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IG5hdmlnYXRpb24gPSBuZXh0U3RhdGUgPT4ge307IiwiaW1wb3J0IHsgQ0xBU1NOQU1FUywgSU5JVElBTF9TVEFURSwgREFUQV9BVFRSSUJVVEVTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5jb25zdCBub29wID0gKCkgPT4ge307XG5cbmV4cG9ydCBjb25zdCB3cml0ZVN0YXRlVG9VUkwgPSBwcm9wcyA9PiB7XG4gICAgdmFyIHVybCA9ICcvJztcblxuICAgIGlmKHByb3BzLnBhZ2UgPj0gMCkgdXJsICs9IChwcm9wcy5wYWdlICsgMSk7XG4gICAgaWYoIHByb3BzLnBhcnQgPj0gMCAmJiBwcm9wcy5wYXJ0ICE9PSBmYWxzZSkgdXJsICs9ICcvJyArIChwcm9wcy5wYXJ0ICsgMSk7XG5cbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHVybDtcbn07XG5cbmV4cG9ydCBjb25zdCByZWFkU3RhdGVGcm9tVVJMID0gKCkgPT4ge1xuICAgIGxldCBwYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDIpLnNwbGl0KCAnLycgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHBhZ2U6IHBhcnNlSW50KHBhcnRzWzBdLCAxMCkgPyBwYXJzZUludChwYXJ0c1swXSwgMTApIC0gMSA6IDAsXG4gICAgICAgIHBhcnQ6IHBhcnNlSW50KHBhcnRzWzFdLCAxMCkgPyBwYXJzZUludChwYXJ0c1sxXSwgMTApIC0gMSA6IGZhbHNlLFxuICAgIH07XG59O1xuXG5leHBvcnQgY29uc3QgaGlkZU5vZGUgPSBub2RlID0+IHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xuICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShDTEFTU05BTUVTLkNVUlJFTlQpO1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLkhJRERFTik7XG59O1xuXG5leHBvcnQgY29uc3Qgc2hvd05vZGUgPSBub2RlID0+IHtcbiAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKENMQVNTTkFNRVMuQ1VSUkVOVCk7XG4gICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTTkFNRVMuSElEREVOKTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc0xhc3RJdGVtID0gc3RhdGUgPT4gc3RhdGUucGFnZSArIDEgPT09IHN0YXRlLnBhZ2VzLmxlbmd0aCAmJiAoc3RhdGUucGFnZXNbc3RhdGUucGFnZV0ucGFydHMubGVuZ3RoID09PSAwIHx8IHN0YXRlLnBhcnQgKyAxID09PSBzdGF0ZS5wYWdlc1tzdGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGgpO1xuXG5leHBvcnQgY29uc3QgaXNGaXJzdEl0ZW0gPSBzdGF0ZSA9PiBzdGF0ZS5wYWdlID09PSAwICYmIChzdGF0ZS5wYWdlc1tzdGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGggPT09IDAgfHwgc3RhdGUucGFydCA9PT0gZmFsc2UpO1xuXG5leHBvcnQgY29uc3QgcGFydEhhc0NhbGxiYWNrID0gc3RhdGUgPT4gc3RhdGUucGFydCAhPT0gZmFsc2UgJiYgc3RhdGUucGFnZXNbc3RhdGUucGFnZV0ucGFydHNbc3RhdGUucGFydF0uY2FsbGJhY2tcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxTdGF0ZSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJTklUSUFMX1NUQVRFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlczogW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDTEFTU05BTUVTLlBBR0V9YCkpLnJlZHVjZSgocGFnZXMsIHBhZ2UpID0+IFsuLi5wYWdlcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IHBhZ2UuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5DQUxMQkFDSykgPyBmdW5jdGlvbigpeyBwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQ0FMTEJBQ0spLmFwcGx5KHRoaXMsIHBhZ2UuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5QQVJBTVMpID8gSlNPTi5wYXJzZShwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuUEFSQU1TKSkgOiBbXSkgfSA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRzOiBbXS5zbGljZS5jYWxsKHBhZ2UucXVlcnlTZWxlY3RvckFsbChgLiR7Q0xBU1NOQU1FUy5QQVJUfWApKS5yZWR1Y2UoKHBhcnRzLCBwYXJ0KSA9PiBbLi4ucGFydHMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogcGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IHBhcnQuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5DQUxMQkFDSykgPyBmdW5jdGlvbigpIHsgd2luZG93W2Ake3BhcnQuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5DQUxMQkFDSyl9YF0uYXBwbHkodGhpcywgcGFydC5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLlBBUkFNUykgPyBKU09OLnBhcnNlKHBhcnQuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5QQVJBTVMpKTogW10pOyB9LmJpbmQocGFydCkgOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dLCBbXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFske0RBVEFfQVRUUklCVVRFUy5CVVRUT05fUFJFVklPVVN9XWApKS5jb25jYXQoW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbJHtEQVRBX0FUVFJJQlVURVMuQlVUVE9OX05FWFR9XWApKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7Il19
