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
		(0, _utils.extractBackgrounds)(this.state);
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
		if (this.state.pages[this.state.page].callback) this.state.pages[this.state.page].callback();
		if ((0, _utils.partHasCallback)(this.state)) this.state.pages[this.state.page].parts[this.state.part].callback();
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
		} else {
			this.state = Object.assign({}, this.state, { page: this.state.page + 1, part: false });
		}

		(0, _utils.writeStateToURL)(this.state);
	},
	goTo: function goTo(nextState) {
		this.state = Object.assign({}, this.state, {
			page: nextState.page !== null && nextState.page < this.state.pages.length ? nextState.page : this.state.page,
			part: nextState.part < this.state.pages[nextState.page].parts.length ? nextState.part : this.stateFromHash.part
		});
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
    PART: 'js-page__part',
    BG: 'js-page__bg',
    BG_CONTAINER: 'page__bgs',
    HIDDEN: 'hidden',
    CURRENT: 'current',
    PAST: 'past',
    FUTURE: 'future',
    PREVIOUS: 'previous',
    NEXT: 'next',
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
        (0, _utils.resetNode)(page.node);
        renderNode(page.node, nextState.page, i);
        (0, _utils.resetNode)(page.background);
        renderNode(page.background, nextState.page, i);
    });
};

var renderNode = function renderNode(item, nextSubState, i) {
    if (nextSubState > i) {
        item.classList.add(_constants.CLASSNAMES.PAST);
        if (nextSubState - 1 === i) item.classList.add(_constants.CLASSNAMES.PREVIOUS);
    }
    if (nextSubState === i) item.classList.add(_constants.CLASSNAMES.CURRENT);
    if (nextSubState < i) {
        item.classList.add(_constants.CLASSNAMES.FUTURE);
        if (nextSubState + 1 === i) item.classList.add(_constants.CLASSNAMES.NEXT);
    }
};

var renderPart = exports.renderPart = function renderPart(nextState) {
    resetParts(nextState);
    if (nextState.part === false) return;
    nextState.pages[nextState.page].parts.forEach(function (part, i) {
        renderNode(part.node, nextState.part, i);
    });
};

var resetParts = function resetParts(state) {
    state.pages.forEach(function (page, i) {
        page.parts && page.parts.forEach(function (part) {
            (0, _utils.resetNode)(part.node);
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
exports.initialState = exports.partHasCallback = exports.isFirstItem = exports.isLastItem = exports.extractBackgrounds = exports.showNode = exports.hideNode = exports.resetNode = exports.readStateFromURL = exports.writeStateToURL = undefined;

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

var resetNode = exports.resetNode = function resetNode(node) {
    node.classList.remove(_constants.CLASSNAMES.CURRENT);
    node.classList.remove(_constants.CLASSNAMES.PAST);
    node.classList.remove(_constants.CLASSNAMES.FUTURE);
    node.classList.remove(_constants.CLASSNAMES.PREVIOUS);
    node.classList.remove(_constants.CLASSNAMES.NEXT);
};

var hideNode = exports.hideNode = function hideNode(node) {
    //node.setAttribute('hidden', 'hidden');
    node.classList.remove(_constants.CLASSNAMES.CURRENT);
    node.classList.add(_constants.CLASSNAMES.HIDDEN);
};

var showNode = exports.showNode = function showNode(node) {
    // node.removeAttribute('hidden');
    node.classList.add(_constants.CLASSNAMES.CURRENT);
    node.classList.remove(_constants.CLASSNAMES.HIDDEN);
};

var extractBackgrounds = exports.extractBackgrounds = function extractBackgrounds(state) {
    var backgroundContainer = n('div', { class: _constants.CLASSNAMES.BG_CONTAINER });
    state.pages.forEach(function (page) {
        backgroundContainer.appendChild(page.background || n('div', { class: _constants.CLASSNAMES.BG.replace('js_', '') }));
        //page.background && page.node.removeChild(page.background);
    });
    state.pages[0].node.parentNode.parentNode.insertBefore(backgroundContainer, state.pages[0].node.parentNode.nextElementSibling);
};

var isLastItem = exports.isLastItem = function isLastItem(state) {
    return state.page + 1 === state.pages.length && (state.pages[state.page].parts.length === 0 || state.part + 1 === state.pages[state.page].parts.length || !state.pages[state.page].parts);
};

var isFirstItem = exports.isFirstItem = function isFirstItem(state) {
    return state.page === 0 && (state.pages[state.page].parts.length === 0 || state.part === false);
};

var partHasCallback = exports.partHasCallback = function partHasCallback(state) {
    return state.part !== false && state.pages[state.page].parts.length !== 0 && state.pages[state.page].parts[state.part].callback;
};

var n = function n(nodeType, attributes) {
    var node = document.createElement(nodeType);
    for (var prop in attributes) {
        node.setAttribute(prop, attributes[prop]);
    }return node;
};

var initialState = exports.initialState = Object.assign({}, _constants.INITIAL_STATE, {
    pages: [].slice.call(document.querySelectorAll('.' + _constants.CLASSNAMES.PAGE)).reduce(function (pages, page) {
        return [].concat(_toConsumableArray(pages), [{
            node: page,
            background: page.querySelector('.' + _constants.CLASSNAMES.BG) ? page.querySelector('.' + _constants.CLASSNAMES.BG) : false,
            callback: page.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK) ? function () {
                window['' + page.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK)].call(page);
            }.bind(page) : false,
            parts: [].slice.call(page.querySelectorAll('.' + _constants.CLASSNAMES.PART)).length ? [].slice.call(page.querySelectorAll('.' + _constants.CLASSNAMES.PART)).reduce(function (parts, part) {
                return [].concat(_toConsumableArray(parts), [{
                    node: part,
                    callback: part.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK) ? function () {
                        window['' + part.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK)].call(part);
                    }.bind(part) : false
                }]);
            }, []) : false
        }]);
    }, []),
    buttons: [].slice.call(document.querySelectorAll('[' + _constants.DATA_ATTRIBUTES.BUTTON_PREVIOUS + ']')).concat([].slice.call(document.querySelectorAll('[' + _constants.DATA_ATTRIBUTES.BUTTON_NEXT + ']')))
});

},{"./constants":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9yZW5kZXIuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7OztBQUVBLElBQU0sMkJBQTJCLFlBQU0sQUFDbkM7V0FBQSxBQUFPLFNBQVMsWUFBVyxBQUV2Qjs7Z0JBQUEsQUFBUSxJQUFJLEtBQUEsQUFBSyxNQUFNLEtBQUEsQUFBSyxhQUFoQixBQUFXLEFBQWtCLHFCQUE3QixBQUFrRCxLQUE5RCxBQUFZLEFBQXVELEFBQ3RFO0FBSEQsQUFJQTtXQUFBLEFBQU8sUUFBUSxvQkFBQSxBQUFNLEtBQXJCLEFBQWUsQUFBVyxBQUM3QjtBQU5ELEFBQWdDLENBQUE7O0FBUWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDVmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7T0FBSSxLQUFLLFNBQUEsQUFBUyxjQUFsQixBQUFTLEFBQXVCLEFBQzdCO0FBQ0g7T0FBRyxDQUFILEFBQUksSUFB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QUN2SztBQUR3RSxhQUFBLEVBQXJFLEFBQXFFLEFBR3hFLEdBSEcsR0FKbUUsQUFBNEIsQUFPNUY7QUFQNEYsQUFDdEc7QUFERyxLQUFBLEVBRFgsQUFDVyxBQVFILEFBQ0o7YUFBUyxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLHVCQUFxQiwyQkFBOUIsQUFBOEMsa0JBQTVELE1BQUEsQUFBaUYsT0FBTyxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLHVCQUFxQiwyQkFBOUIsQUFBOEMsY0FiMUwsQUFBcUIsQUFHSSxBQVVhLEFBQXdGO0FBVnJHLEFBQ0ksQ0FKUiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUGFnZXMgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICB3aW5kb3cudGVzdEZuID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1wYWdlLXBhcmFtcycpKS5qb2luKCcgJykpO1xuICAgIH07XG4gICAgd2luZG93LlBhZ2VzID0gUGFnZXMuaW5pdCgnLmpzLXBhZ2VzJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgLy9sZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRpZighZWwpIHJldHVybiBjb25zb2xlLndhcm4oYFBhZ2VzIG5vdCBpbml0aWFsaXNlZCwgbm8gZWxlbWVudHMgZm91bmQgZm9yIHRoZSBzZWxlY3RvciAnJHtzZWx9J2ApO1xuICAgIFxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdHJvb3Q6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCB7IENMQVNTTkFNRVMsIElOSVRJQUxfU1RBVEUsIERBVEFfQVRUUklCVVRFUywgVFJJR0dFUl9FVkVOVFMsIFRSSUdHRVJfS0VZQ09ERVMsIEtFWV9DT0RFUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGluaXRpYWxTdGF0ZSwgcmVhZFN0YXRlRnJvbVVSTCwgd3JpdGVTdGF0ZVRvVVJMLCBpc0ZpcnN0SXRlbSwgaXNMYXN0SXRlbSwgZXh0cmFjdEJhY2tncm91bmRzLCBwYXJ0SGFzQ2FsbGJhY2sgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHJlbmRlclBhZ2UsIHJlbmRlclBhcnQsIHJlbmRlckJ1dHRvbnMgfSBmcm9tICcuL3JlbmRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpIHtcblx0XHR0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgaW5pdGlhbFN0YXRlLCB0aGlzLnN0YXRlRnJvbUhhc2goaW5pdGlhbFN0YXRlKSk7XG5cdFx0dGhpcy5zdGF0ZS5idXR0b25zLmxlbmd0aCAmJiB0aGlzLmluaXRCdXR0b25zKCk7XG5cdFx0ZXh0cmFjdEJhY2tncm91bmRzKHRoaXMuc3RhdGUpO1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMuaGFuZGxlSGFzaENoYW5nZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdHN0YXRlRnJvbUhhc2gocHJldmlvdXNTdGF0ZSA9IGluaXRpYWxTdGF0ZSl7XG5cdFx0bGV0IGNhbmRpZGF0ZSA9IHJlYWRTdGF0ZUZyb21VUkwoKTtcblx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xuXHRcdFx0cGFnZTogY2FuZGlkYXRlLnBhZ2UgPCAwID8gMCA6IGNhbmRpZGF0ZS5wYWdlID49IHByZXZpb3VzU3RhdGUucGFnZXMubGVuZ3RoID8gcHJldmlvdXNTdGF0ZS5wYWdlcy5sZW5ndGggLSAxIDogY2FuZGlkYXRlLnBhZ2UsXG5cdFx0XHRwYXJ0OiBwcmV2aW91c1N0YXRlLnBhZ2VzW2NhbmRpZGF0ZS5wYWdlXS5wYXJ0cyA/IGNhbmRpZGF0ZS5uZXh0UGFydCA8IDAgPyAwIDogY2FuZGlkYXRlLnBhcnQgPj0gcHJldmlvdXNTdGF0ZS5wYWdlc1tjYW5kaWRhdGUucGFnZV0ucGFydHMubGVuZ3RoID8gcHJldmlvdXNTdGF0ZS5wYWdlc1tjYW5kaWRhdGUucGFnZV0ucGFydHMubGVuZ3RoIC0gMSA6IGNhbmRpZGF0ZS5wYXJ0IDogZmFsc2UsXG5cdFx0fSk7XG5cdH0sXG5cdGhhbmRsZUhhc2hDaGFuZ2UoKXtcblx0XHR0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZUZyb21IYXNoKCk7XG5cdFx0dGhpcy5yZW5kZXIoKTtcblx0fSxcblx0aW5pdEJ1dHRvbnMoKXtcblx0XHRUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcblx0XHRcdHRoaXMuc3RhdGUuYnV0dG9ucy5mb3JFYWNoKGJ0biA9PiB7XG5cdFx0XHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdFx0XHRpZihlLmtleUNvZGUgJiYgIX5UUklHR0VSX0tFWUNPREVTLmluZGV4T2YoZS5LZXlDb2RlKSkgcmV0dXJuO1xuXHRcdFx0XHRcdHRoaXNbYnRuLmhhc0F0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQlVUVE9OX05FWFQpID8gJ25leHQnIDogJ3ByZXZpb3VzJ10oKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0aGFuZGxlS2V5RG93bihlKXtcblx0XHRjb25zdCBrZXlEaWN0aW9uYXJ5ID0ge1xuXHRcdFx0W0tFWV9DT0RFUy5MRUZUXSgpeyB0aGlzLnByZXZpb3VzKCk7IH0sXG5cdFx0XHRbS0VZX0NPREVTLlJJR0hUXSgpeyB0aGlzLm5leHQoKTsgfVxuXHRcdH07XG5cdFx0aWYoa2V5RGljdGlvbmFyeVtlLmtleUNvZGVdKSBrZXlEaWN0aW9uYXJ5W2Uua2V5Q29kZV0uY2FsbCh0aGlzKTtcblx0fSxcblx0cmVuZGVyKCl7XG5cdFx0cmVuZGVyUGFnZSh0aGlzLnN0YXRlKTtcblx0XHRyZW5kZXJQYXJ0KHRoaXMuc3RhdGUpO1xuXHRcdHJlbmRlckJ1dHRvbnModGhpcy5zdGF0ZSk7XG5cdFx0dGhpcy5wb3N0UmVuZGVyKCk7XG5cdFx0Ly8gcmVuZGVyQnV0dG9ucyh0aGlzLnN0YXRlO1xuXHR9LFxuXHRwb3N0UmVuZGVyKCl7XG5cdFx0aWYodGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLmNhbGxiYWNrKSB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uY2FsbGJhY2soKTtcblx0XHRpZihwYXJ0SGFzQ2FsbGJhY2sodGhpcy5zdGF0ZSkpIHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5wYXJ0c1t0aGlzLnN0YXRlLnBhcnRdLmNhbGxiYWNrKCk7XG5cdH0sXG5cdHByZXZpb3VzKCl7XG5cdFx0aWYoaXNGaXJzdEl0ZW0odGhpcy5zdGF0ZSkpIHJldHVybjtcblx0XHRcblx0XHRpZih0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0ucGFydHMubGVuZ3RoID4gMCAmJiAodGhpcy5zdGF0ZS5wYXJ0ICE9PSBmYWxzZSAmJiB0aGlzLnN0YXRlLnBhcnQgPiAwKSkgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgcGFydDogdGhpcy5zdGF0ZS5wYXJ0IC0gMX0pO1xuXHRcdGVsc2UgaWYodGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnBhcnRzLmxlbmd0aCA+IDAgJiYgdGhpcy5zdGF0ZS5wYXJ0ID09PSAwKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBwYXJ0OiBmYWxzZSB9KTtcblx0XHRlbHNlIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhZ2U6IHRoaXMuc3RhdGUucGFnZSAtIDEsIHBhcnQ6IHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlIC0gMV0ucGFydHMubGVuZ3RoIC0gMSB9KTtcblx0XHRcblx0XHR3cml0ZVN0YXRlVG9VUkwodGhpcy5zdGF0ZSk7XG5cdH0sXG5cdG5leHQoKXtcblx0XHRpZihpc0xhc3RJdGVtKHRoaXMuc3RhdGUpKSByZXR1cm47XG5cblx0XHRpZih0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0ucGFydHMubGVuZ3RoID4gMCAmJiB0aGlzLnN0YXRlLnBhcnQgKyAxIDwgdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnBhcnRzLmxlbmd0aCl7XG5cdFx0XHRpZih0aGlzLnN0YXRlLnBhcnQgPT09IGZhbHNlKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBwYXJ0OiAwIH0pO1xuXHRcdFx0ZWxzZSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBwYXJ0OiB0aGlzLnN0YXRlLnBhcnQgKyAxIH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBwYWdlOiB0aGlzLnN0YXRlLnBhZ2UgKyAxLCBwYXJ0OiBmYWxzZSB9KTtcblx0XHR9XG5cblx0XHR3cml0ZVN0YXRlVG9VUkwodGhpcy5zdGF0ZSk7XG5cdH0sXG5cdGdvVG8obmV4dFN0YXRlKXtcblx0XHR0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xuXHRcdFx0cGFnZTogbmV4dFN0YXRlLnBhZ2UgIT09IG51bGwgJiYgbmV4dFN0YXRlLnBhZ2UgPCB0aGlzLnN0YXRlLnBhZ2VzLmxlbmd0aCA/IG5leHRTdGF0ZS5wYWdlIDogdGhpcy5zdGF0ZS5wYWdlLFxuXHRcdFx0cGFydDogbmV4dFN0YXRlLnBhcnQgPCB0aGlzLnN0YXRlLnBhZ2VzW25leHRTdGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGggPyBuZXh0U3RhdGUucGFydCA6IHRoaXMuc3RhdGVGcm9tSGFzaC5wYXJ0XG5cdFx0fSk7XG5cdFx0d3JpdGVTdGF0ZVRvVVJMKHRoaXMuc3RhdGUpO1xuXHRcdFxuXHR9XG59OyIsImV4cG9ydCBjb25zdCBDTEFTU05BTUVTID0ge1xuICAgIFBBR0U6ICdqcy1wYWdlJyxcbiAgICBQQVJUOiAnanMtcGFnZV9fcGFydCcsXG4gICAgQkc6ICdqcy1wYWdlX19iZycsXG4gICAgQkdfQ09OVEFJTkVSOiAncGFnZV9fYmdzJyxcbiAgICBISURERU46ICdoaWRkZW4nLFxuICAgIENVUlJFTlQ6ICdjdXJyZW50JyxcbiAgICBQQVNUOiAncGFzdCcsXG4gICAgRlVUVVJFOiAnZnV0dXJlJyxcbiAgICBQUkVWSU9VUzogJ3ByZXZpb3VzJyxcbiAgICBORVhUOiAnbmV4dCcsXG4gICAgQlVUVE9OOiAnanMtcGFnZV9fYnRuJyxcbiAgICBCVVRUT05fQ09OVEFJTkVSOiAncGFnZV9fYnRuLWNvbnRhaW5lcicsXG59O1xuXG5leHBvcnQgY29uc3QgREFUQV9BVFRSSUJVVEVTID0ge1xuICAgIEJVVFRPTl9ORVhUOiAnZGF0YS1wYWdlLW5leHQnLFxuICAgIEJVVFRPTl9QUkVWSU9VUzogJ2RhdGEtcGFnZS1wcmV2aW91cycsXG4gICAgQ0FMTEJBQ0s6ICdkYXRhLXBhZ2UtY2FsbGJhY2snXG59O1xuXG5leHBvcnQgY29uc3QgS0VZX0NPREVTID0ge1xuICAgIFNQQUNFOiAzMixcbiAgICBFTlRFUjogMTMsXG4gICAgVEFCOiA5LFxuICAgIExFRlQ6IDM3LFxuICAgIFJJR0hUOiAzOSxcbiAgICBET1dOOiA0MFxufTtcblxuZXhwb3J0IGNvbnN0IFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJ107XG5cbmV4cG9ydCBjb25zdCBUUklHR0VSX0tFWUNPREVTID0gWzEzLCAzMl07XG5cbmV4cG9ydCBjb25zdCBJTklUSUFMX1NUQVRFID0ge1xuICAgIHBhZ2U6IGZhbHNlLFxuICAgIHBhcnQ6IGZhbHNlLFxuICAgIHBhZ2VzOiBmYWxzZVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGJ1dHRvbnM6IHRydWUsXG5cdG5hdmlnYXRpb246IGZhbHNlLFxuXHRjYWxsYmFjazogbnVsbFxufTsiLCJpbXBvcnQgeyBDTEFTU05BTUVTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgcmVzZXROb2RlLCBoaWRlTm9kZSwgc2hvd05vZGUsIGlzRmlyc3RJdGVtLCBpc0xhc3RJdGVtIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCByZW5kZXJQYWdlID0gbmV4dFN0YXRlID0+IHtcbiAgICBuZXh0U3RhdGUucGFnZXMuZm9yRWFjaCgocGFnZSwgaSkgPT4ge1xuICAgICAgICByZXNldE5vZGUocGFnZS5ub2RlKTtcbiAgICAgICAgcmVuZGVyTm9kZShwYWdlLm5vZGUsIG5leHRTdGF0ZS5wYWdlLCBpKTtcbiAgICAgICAgcmVzZXROb2RlKHBhZ2UuYmFja2dyb3VuZCk7XG4gICAgICAgIHJlbmRlck5vZGUocGFnZS5iYWNrZ3JvdW5kLCBuZXh0U3RhdGUucGFnZSwgaSk7XG4gICAgfSk7XG59O1xuXG5jb25zdCByZW5kZXJOb2RlID0gKGl0ZW0sIG5leHRTdWJTdGF0ZSwgaSkgPT4ge1xuICAgIGlmKG5leHRTdWJTdGF0ZSA+IGkpe1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5QQVNUKTtcbiAgICAgICAgaWYobmV4dFN1YlN0YXRlIC0gMSA9PT0gaSkgaXRlbS5jbGFzc0xpc3QuYWRkKENMQVNTTkFNRVMuUFJFVklPVVMpO1xuICAgIH0gXG4gICAgaWYobmV4dFN1YlN0YXRlID09PSBpKSBpdGVtLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICBpZihuZXh0U3ViU3RhdGUgPCBpKSB7XG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLkZVVFVSRSk7XG4gICAgICAgIGlmKG5leHRTdWJTdGF0ZSArIDEgPT09IGkpIGl0ZW0uY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLk5FWFQpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJQYXJ0ID0gbmV4dFN0YXRlID0+IHtcbiAgICByZXNldFBhcnRzKG5leHRTdGF0ZSk7XG4gICAgaWYobmV4dFN0YXRlLnBhcnQgID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIG5leHRTdGF0ZS5wYWdlc1tuZXh0U3RhdGUucGFnZV0ucGFydHMuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuICAgICAgICByZW5kZXJOb2RlKHBhcnQubm9kZSwgbmV4dFN0YXRlLnBhcnQsIGkpO1xuICAgIH0pO1xufTtcblxuY29uc3QgcmVzZXRQYXJ0cyA9IHN0YXRlID0+IHtcbiAgICBzdGF0ZS5wYWdlcy5mb3JFYWNoKChwYWdlLCBpKSA9PiB7XG4gICAgICAgIHBhZ2UucGFydHMgJiYgcGFnZS5wYXJ0cy5mb3JFYWNoKHBhcnQgPT4ge1xuICAgICAgICAgICAgcmVzZXROb2RlKHBhcnQubm9kZSk7XG4gICAgICAgICAgICBoaWRlTm9kZShwYXJ0Lm5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJCdXR0b25zID0gc3RhdGUgPT4ge1xuICAgIGlmKHN0YXRlLmJ1dHRvbnMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgc3RhdGUuYnV0dG9ucy5mb3JFYWNoKGJ0biA9PiB7XG4gICAgICAgIGlmKGlzRmlyc3RJdGVtKHN0YXRlKSkgc3RhdGUuYnV0dG9uc1swXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICAgIGVsc2UgaWYoc3RhdGUuYnV0dG9uc1swXS5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHN0YXRlLmJ1dHRvbnNbMF0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgIGlmKGlzTGFzdEl0ZW0oc3RhdGUpKSBzdGF0ZS5idXR0b25zWzFdLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgZWxzZSBpZihzdGF0ZS5idXR0b25zWzFdLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkgc3RhdGUuYnV0dG9uc1sxXS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgbmF2aWdhdGlvbiA9IG5leHRTdGF0ZSA9PiB7fTsiLCJpbXBvcnQgeyBDTEFTU05BTUVTLCBJTklUSUFMX1NUQVRFLCBEQVRBX0FUVFJJQlVURVMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcblxuZXhwb3J0IGNvbnN0IHdyaXRlU3RhdGVUb1VSTCA9IHByb3BzID0+IHtcbiAgICB2YXIgdXJsID0gJy8nO1xuXG4gICAgaWYocHJvcHMucGFnZSA+PSAwKSB1cmwgKz0gKHByb3BzLnBhZ2UgKyAxKTtcbiAgICBpZiggcHJvcHMucGFydCA+PSAwICYmIHByb3BzLnBhcnQgIT09IGZhbHNlKSB1cmwgKz0gJy8nICsgKHByb3BzLnBhcnQgKyAxKTtcblxuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdXJsO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlYWRTdGF0ZUZyb21VUkwgPSAoKSA9PiB7XG4gICAgbGV0IHBhcnRzID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMikuc3BsaXQoICcvJyApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQocGFydHNbMF0sIDEwKSA/IHBhcnNlSW50KHBhcnRzWzBdLCAxMCkgLSAxIDogMCxcbiAgICAgICAgcGFydDogcGFyc2VJbnQocGFydHNbMV0sIDEwKSA/IHBhcnNlSW50KHBhcnRzWzFdLCAxMCkgLSAxIDogZmFsc2UsXG4gICAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXNldE5vZGUgPSBub2RlID0+IHtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5QQVNUKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5GVVRVUkUpO1xuICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShDTEFTU05BTUVTLlBSRVZJT1VTKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5ORVhUKTtcbn07XG5cbmV4cG9ydCBjb25zdCBoaWRlTm9kZSA9IG5vZGUgPT4ge1xuICAgIC8vbm9kZS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5ISURERU4pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNob3dOb2RlID0gbm9kZSA9PiB7XG4gICAgLy8gbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLkNVUlJFTlQpO1xuICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShDTEFTU05BTUVTLkhJRERFTik7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEJhY2tncm91bmRzID0gc3RhdGUgPT4ge1xuICAgIGxldCBiYWNrZ3JvdW5kQ29udGFpbmVyID0gbignZGl2JywgeyBjbGFzczogQ0xBU1NOQU1FUy5CR19DT05UQUlORVJ9KTtcbiAgICBzdGF0ZS5wYWdlcy5mb3JFYWNoKHBhZ2UgPT4ge1xuICAgICAgICBiYWNrZ3JvdW5kQ29udGFpbmVyLmFwcGVuZENoaWxkKHBhZ2UuYmFja2dyb3VuZCB8fCBuKCdkaXYnLCB7Y2xhc3M6IENMQVNTTkFNRVMuQkcucmVwbGFjZSgnanNfJywgJycpfSkpO1xuICAgICAgICAvL3BhZ2UuYmFja2dyb3VuZCAmJiBwYWdlLm5vZGUucmVtb3ZlQ2hpbGQocGFnZS5iYWNrZ3JvdW5kKTtcbiAgICB9KTtcbiAgICBzdGF0ZS5wYWdlc1swXS5ub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYmFja2dyb3VuZENvbnRhaW5lciwgc3RhdGUucGFnZXNbMF0ubm9kZS5wYXJlbnROb2RlLm5leHRFbGVtZW50U2libGluZyk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNMYXN0SXRlbSA9IHN0YXRlID0+IHN0YXRlLnBhZ2UgKyAxID09PSBzdGF0ZS5wYWdlcy5sZW5ndGggJiYgKHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnBhcnRzLmxlbmd0aCA9PT0gMCB8fCBzdGF0ZS5wYXJ0ICsgMSA9PT0gc3RhdGUucGFnZXNbc3RhdGUucGFnZV0ucGFydHMubGVuZ3RoIHx8ICFzdGF0ZS5wYWdlc1tzdGF0ZS5wYWdlXS5wYXJ0cyk7XG5cbmV4cG9ydCBjb25zdCBpc0ZpcnN0SXRlbSA9IHN0YXRlID0+IHN0YXRlLnBhZ2UgPT09IDAgJiYgKHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnBhcnRzLmxlbmd0aCA9PT0gMCB8fCBzdGF0ZS5wYXJ0ID09PSBmYWxzZSk7XG5cbmV4cG9ydCBjb25zdCBwYXJ0SGFzQ2FsbGJhY2sgPSBzdGF0ZSA9PiBzdGF0ZS5wYXJ0ICE9PSBmYWxzZSAmJiBzdGF0ZS5wYWdlc1tzdGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGggIT09IDAgJiYgc3RhdGUucGFnZXNbc3RhdGUucGFnZV0ucGFydHNbc3RhdGUucGFydF0uY2FsbGJhY2s7XG5cbmNvbnN0IG4gPSAobm9kZVR5cGUsIGF0dHJpYnV0ZXMpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZVR5cGUpO1xuICAgIGZvcihsZXQgcHJvcCBpbiBhdHRyaWJ1dGVzKSBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsU3RhdGUgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSU5JVElBTF9TVEFURSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZXM6IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7Q0xBU1NOQU1FUy5QQUdFfWApKS5yZWR1Y2UoKHBhZ2VzLCBwYWdlKSA9PiBbLi4ucGFnZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHBhZ2UucXVlcnlTZWxlY3RvcihgLiR7Q0xBU1NOQU1FUy5CR31gKSA/IHBhZ2UucXVlcnlTZWxlY3RvcihgLiR7Q0xBU1NOQU1FUy5CR31gKSA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQ0FMTEJBQ0spID8gZnVuY3Rpb24oKXsgd2luZG93W2Ake3BhZ2UuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5DQUxMQkFDSyl9YF0uY2FsbChwYWdlKTsgfS5iaW5kKHBhZ2UpIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydHM6IFtdLnNsaWNlLmNhbGwocGFnZS5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDTEFTU05BTUVTLlBBUlR9YCkpLmxlbmd0aCA/IFtdLnNsaWNlLmNhbGwocGFnZS5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDTEFTU05BTUVTLlBBUlR9YCkpLnJlZHVjZSgocGFydHMsIHBhcnQpID0+IFsuLi5wYXJ0cywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBwYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogcGFydC5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLkNBTExCQUNLKSA/IGZ1bmN0aW9uKCkgeyB3aW5kb3dbYCR7cGFydC5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLkNBTExCQUNLKX1gXS5jYWxsKHBhcnQpOyB9LmJpbmQocGFydCkgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XSwgW10pIDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dLCBbXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFske0RBVEFfQVRUUklCVVRFUy5CVVRUT05fUFJFVklPVVN9XWApKS5jb25jYXQoW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbJHtEQVRBX0FUVFJJQlVURVMuQlVUVE9OX05FWFR9XWApKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7Il19
