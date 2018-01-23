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
        // if(nextState.page !== i) {
        //     hideNode(page.node);
        // }
        (0, _utils.resetNode)(page.node);
        (0, _utils.resetNode)(page.background);
        if (nextState.page > i) {
            page.node.classList.add(_constants.CLASSNAMES.PAST);
            page.background.classList.add(_constants.CLASSNAMES.PAST);
            if (nextState.page - 1 === i) {
                page.node.classList.add(_constants.CLASSNAMES.PREVIOUS);
                page.background.classList.add(_constants.CLASSNAMES.PREVIOUS);
            }
        }
        if (nextState.page === i) {
            page.node.classList.add(_constants.CLASSNAMES.CURRENT);
            page.background.classList.add(_constants.CLASSNAMES.CURRENT);
        }
        if (nextState.page < i) {
            page.node.classList.add(_constants.CLASSNAMES.FUTURE);
            page.background.classList.add(_constants.CLASSNAMES.FUTURE);
            if (nextState.page + 1 === i) {
                page.node.classList.add(_constants.CLASSNAMES.NEXT);
                page.background.classList.add(_constants.CLASSNAMES.NEXT);
            }
        }
    });
    // showNode(nextState.pages[nextState.page].node);
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
        page.parts && page.parts.forEach(function (part) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9yZW5kZXIuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7OztBQUVBLElBQU0sMkJBQTJCLFlBQU0sQUFDbkM7V0FBQSxBQUFPLFNBQVMsWUFBVyxBQUV2Qjs7Z0JBQUEsQUFBUSxJQUFJLEtBQUEsQUFBSyxNQUFNLEtBQUEsQUFBSyxhQUFoQixBQUFXLEFBQWtCLHFCQUE3QixBQUFrRCxLQUE5RCxBQUFZLEFBQXVELEFBQ3RFO0FBSEQsQUFJQTtXQUFBLEFBQU8sUUFBUSxvQkFBQSxBQUFNLEtBQXJCLEFBQWUsQUFBVyxBQUM3QjtBQU5ELEFBQWdDLENBQUE7O0FBUWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDVmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7T0FBSSxLQUFLLFNBQUEsQUFBUyxjQUFsQixBQUFTLEFBQXVCLEFBQzdCO0FBQ0g7T0FBRyxDQUFILEFBQUksSUFBSSxPQUFPLFFBQUEsQUFBUSxzRUFBUixBQUEyRSxNQUFsRixBQUVSOztpQkFBTyxBQUFPLE9BQU8sT0FBQSxBQUFPLDRCQUFyQjtZQUFpRCxBQUNoRCxBQUNOO2dCQUFVLE9BQUEsQUFBTyxPQUFQLEFBQWMsd0JBRm5CLEFBQWlELEFBRTVDLEFBQTRCO0FBRmdCLEFBQ3RELElBREssRUFBUCxBQUFPLEFBR0gsQUFDSjtBQVREOztrQkFXZSxFQUFFLE0sQUFBRjs7Ozs7Ozs7O0FDZGY7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRWUsdUJBQ1AsQUFDTjtPQUFBLEFBQUssUUFBUSxPQUFBLEFBQU8sT0FBUCxBQUFjLHlCQUFrQixLQUFBLEFBQUsscUJBQWxELEFBQWEsQUFDYjtPQUFBLEFBQUssTUFBTCxBQUFXLFFBQVgsQUFBbUIsVUFBVSxLQUE3QixBQUE2QixBQUFLLEFBQ2xDO2lDQUFtQixLQUFuQixBQUF3QixBQUN4QjtPQUFBLEFBQUssQUFFTDs7U0FBQSxBQUFPLGlCQUFQLEFBQXdCLGNBQWMsS0FBQSxBQUFLLGlCQUFMLEFBQXNCLEtBQTVELEFBQXNDLEFBQTJCLE9BQWpFLEFBQXdFLEFBQ3hFO1dBQUEsQUFBUyxpQkFBVCxBQUEwQixXQUFXLEtBQUEsQUFBSyxjQUFMLEFBQW1CLEtBQXhELEFBQXFDLEFBQXdCLE9BQTdELEFBQW9FLEFBRXBFOztTQUFBLEFBQU8sQUFDUDtBQVhhLEFBWWQ7QUFaYyx5Q0FZNkI7TUFBN0IsQUFBNkIsMkZBQzFDOztNQUFJLFlBQVksV0FBaEIsQUFDQTtnQkFBTyxBQUFPLE9BQVAsQUFBYyxJQUFJLEtBQWxCLEFBQXVCO1NBQ3ZCLFVBQUEsQUFBVSxPQUFWLEFBQWlCLElBQWpCLEFBQXFCLElBQUksVUFBQSxBQUFVLFFBQVEsY0FBQSxBQUFjLE1BQWhDLEFBQXNDLFNBQVMsY0FBQSxBQUFjLE1BQWQsQUFBb0IsU0FBbkUsQUFBNEUsSUFBSSxVQUQzRSxBQUNxRixBQUN6SDtTQUFNLGNBQUEsQUFBYyxNQUFNLFVBQXBCLEFBQThCLE1BQTlCLEFBQW9DLFFBQVEsVUFBQSxBQUFVLFdBQVYsQUFBcUIsSUFBckIsQUFBeUIsSUFBSSxVQUFBLEFBQVUsUUFBUSxjQUFBLEFBQWMsTUFBTSxVQUFwQixBQUE4QixNQUE5QixBQUFvQyxNQUF0RCxBQUE0RCxTQUFTLGNBQUEsQUFBYyxNQUFNLFVBQXBCLEFBQThCLE1BQTlCLEFBQW9DLE1BQXBDLEFBQTBDLFNBQS9HLEFBQXdILElBQUksVUFBck0sQUFBK00sT0FGdE4sQUFBTyxBQUE4QixBQUV3TCxBQUU3TjtBQUpxQyxBQUNwQyxHQURNO0FBZE0sQUFtQmQ7QUFuQmMsK0NBbUJJLEFBQ2pCO09BQUEsQUFBSyxRQUFRLEtBQWIsQUFBYSxBQUFLLEFBQ2xCO09BQUEsQUFBSyxBQUNMO0FBdEJhLEFBdUJkO0FBdkJjLHFDQXVCRDtjQUNaOzs0QkFBQSxBQUFlLFFBQVEsY0FBTSxBQUM1QjtTQUFBLEFBQUssTUFBTCxBQUFXLFFBQVgsQUFBbUIsUUFBUSxlQUFPLEFBQ2pDO1FBQUEsQUFBSSxpQkFBSixBQUFxQixJQUFJLGFBQUssQUFDN0I7U0FBRyxFQUFBLEFBQUUsV0FBVyxDQUFDLENBQUMsNEJBQUEsQUFBaUIsUUFBUSxFQUEzQyxBQUFrQixBQUEyQixVQUFVLEFBQ3ZEO1dBQUssSUFBQSxBQUFJLGFBQWEsMkJBQWpCLEFBQWlDLGVBQWpDLEFBQWdELFNBQXJELEFBQThELEFBQzlEO0FBSEQsQUFJQTtBQUxELEFBTUE7QUFQRCxBQVFBO0FBaENhLEFBaUNkO0FBakNjLHVDQUFBLEFBaUNBLEdBQUU7TUFDZjs7TUFBTSxzRUFDSixxQkFESSxBQUNNLGtCQUFPLEFBQUU7UUFBQSxBQUFLLEFBQWE7QUFEakMsc0NBRUoscUJBRkksQUFFTSxtQkFBUSxBQUFFO1FBQUEsQUFBSyxBQUFTO0FBRjlCLE1BQU4sQUFJQTtNQUFHLGNBQWMsRUFBakIsQUFBRyxBQUFnQixVQUFVLGNBQWMsRUFBZCxBQUFnQixTQUFoQixBQUF5QixLQUF6QixBQUE4QixBQUMzRDtBQXZDYSxBQXdDZDtBQXhDYywyQkF3Q04sQUFDUDswQkFBVyxLQUFYLEFBQWdCLEFBQ2hCOzBCQUFXLEtBQVgsQUFBZ0IsQUFDaEI7NkJBQWMsS0FBZCxBQUFtQixBQUNuQjtPQUFBLEFBQUssQUFDTDtBQUNBO0FBOUNhLEFBK0NkO0FBL0NjLG1DQStDRixBQUNYO01BQUcsS0FBQSxBQUFLLE1BQUwsQUFBVyxNQUFNLEtBQUEsQUFBSyxNQUF0QixBQUE0QixNQUEvQixBQUFxQyxVQUFVLEtBQUEsQUFBSyxNQUFMLEFBQVcsTUFBTSxLQUFBLEFBQUssTUFBdEIsQUFBNEIsTUFBNUIsQUFBa0MsQUFDakY7TUFBRyw0QkFBZ0IsS0FBbkIsQUFBRyxBQUFxQixRQUFRLEtBQUEsQUFBSyxNQUFMLEFBQVcsTUFBTSxLQUFBLEFBQUssTUFBdEIsQUFBNEIsTUFBNUIsQUFBa0MsTUFBTSxLQUFBLEFBQUssTUFBN0MsQUFBbUQsTUFBbkQsQUFBeUQsQUFDekY7QUFsRGEsQUFtRGQ7QUFuRGMsK0JBbURKLEFBQ1Q7TUFBRyx3QkFBWSxLQUFmLEFBQUcsQUFBaUIsUUFBUSxBQUU1Qjs7TUFBRyxLQUFBLEFBQUssTUFBTCxBQUFXLE1BQU0sS0FBQSxBQUFLLE1BQXRCLEFBQTRCLE1BQTVCLEFBQWtDLE1BQWxDLEFBQXdDLFNBQXhDLEFBQWlELEtBQU0sS0FBQSxBQUFLLE1BQUwsQUFBVyxTQUFYLEFBQW9CLFNBQVMsS0FBQSxBQUFLLE1BQUwsQUFBVyxPQUFsRyxBQUF5RyxHQUFJLEtBQUEsQUFBSyxRQUFRLE9BQUEsQUFBTyxPQUFQLEFBQWMsSUFBSSxLQUFsQixBQUF1QixPQUFPLEVBQUUsTUFBTSxLQUFBLEFBQUssTUFBTCxBQUFXLE9BQTNLLEFBQTZHLEFBQWEsQUFBOEIsQUFBMEIsVUFDN0ssSUFBRyxLQUFBLEFBQUssTUFBTCxBQUFXLE1BQU0sS0FBQSxBQUFLLE1BQXRCLEFBQTRCLE1BQTVCLEFBQWtDLE1BQWxDLEFBQXdDLFNBQXhDLEFBQWlELEtBQUssS0FBQSxBQUFLLE1BQUwsQUFBVyxTQUFwRSxBQUE2RSxHQUFHLEtBQUEsQUFBSyxRQUFRLE9BQUEsQUFBTyxPQUFQLEFBQWMsSUFBSSxLQUFsQixBQUF1QixPQUFPLEVBQUUsTUFBN0gsQUFBZ0YsQUFBYSxBQUE4QixBQUFRLGNBQ25JLEtBQUEsQUFBSyxRQUFRLE9BQUEsQUFBTyxPQUFQLEFBQWMsSUFBSSxLQUFsQixBQUF1QixPQUFPLEVBQUUsTUFBTSxLQUFBLEFBQUssTUFBTCxBQUFXLE9BQW5CLEFBQTBCLEdBQUcsTUFBTSxLQUFBLEFBQUssTUFBTCxBQUFXLE1BQU0sS0FBQSxBQUFLLE1BQUwsQUFBVyxPQUE1QixBQUFtQyxHQUFuQyxBQUFzQyxNQUF0QyxBQUE0QyxTQUExSCxBQUFhLEFBQThCLEFBQXdGLEFBRXhJOzs4QkFBZ0IsS0FBaEIsQUFBcUIsQUFDckI7QUEzRGEsQUE0RGQ7QUE1RGMsdUJBNERSLEFBQ0w7TUFBRyx1QkFBVyxLQUFkLEFBQUcsQUFBZ0IsUUFBUSxBQUUzQjs7TUFBRyxLQUFBLEFBQUssTUFBTCxBQUFXLE1BQU0sS0FBQSxBQUFLLE1BQXRCLEFBQTRCLE1BQTVCLEFBQWtDLE1BQWxDLEFBQXdDLFNBQXhDLEFBQWlELEtBQUssS0FBQSxBQUFLLE1BQUwsQUFBVyxPQUFYLEFBQWtCLElBQUksS0FBQSxBQUFLLE1BQUwsQUFBVyxNQUFNLEtBQUEsQUFBSyxNQUF0QixBQUE0QixNQUE1QixBQUFrQyxNQUFqSCxBQUF1SCxRQUFPLEFBQzdIO09BQUcsS0FBQSxBQUFLLE1BQUwsQUFBVyxTQUFkLEFBQXVCLE9BQU8sS0FBQSxBQUFLLFFBQVEsT0FBQSxBQUFPLE9BQVAsQUFBYyxJQUFJLEtBQWxCLEFBQXVCLE9BQU8sRUFBRSxNQUEzRSxBQUE4QixBQUFhLEFBQThCLEFBQVEsVUFDNUUsS0FBQSxBQUFLLFFBQVEsT0FBQSxBQUFPLE9BQVAsQUFBYyxJQUFJLEtBQWxCLEFBQXVCLE9BQU8sRUFBRSxNQUFNLEtBQUEsQUFBSyxNQUFMLEFBQVcsT0FBOUQsQUFBYSxBQUE4QixBQUEwQixBQUMxRTtBQUhELFNBR08sQUFDTjtRQUFBLEFBQUssUUFBUSxPQUFBLEFBQU8sT0FBUCxBQUFjLElBQUksS0FBbEIsQUFBdUIsT0FBTyxFQUFFLE1BQU0sS0FBQSxBQUFLLE1BQUwsQUFBVyxPQUFuQixBQUEwQixHQUFHLE1BQXhFLEFBQWEsQUFBOEIsQUFBbUMsQUFDOUU7QUFFRDs7OEJBQWdCLEtBQWhCLEFBQXFCLEFBQ3JCO0FBdkVhLEFBd0VkO0FBeEVjLHFCQUFBLEFBd0VULFdBQVUsQUFDZDtPQUFBLEFBQUssZUFBUSxBQUFPLE9BQVAsQUFBYyxJQUFJLEtBQWxCLEFBQXVCO1NBQzdCLFVBQUEsQUFBVSxTQUFWLEFBQW1CLFFBQVEsVUFBQSxBQUFVLE9BQU8sS0FBQSxBQUFLLE1BQUwsQUFBVyxNQUF2RCxBQUE2RCxTQUFTLFVBQXRFLEFBQWdGLE9BQU8sS0FBQSxBQUFLLE1BRHhELEFBQzhELEFBQ3hHO1NBQU0sVUFBQSxBQUFVLE9BQU8sS0FBQSxBQUFLLE1BQUwsQUFBVyxNQUFNLFVBQWpCLEFBQTJCLE1BQTNCLEFBQWlDLE1BQWxELEFBQXdELFNBQVMsVUFBakUsQUFBMkUsT0FBTyxLQUFBLEFBQUssY0FGOUYsQUFBYSxBQUE4QixBQUVpRSxBQUU1RztBQUoyQyxBQUMxQyxHQURZOzhCQUlHLEtBQWhCLEFBQXFCLEFBRXJCO0EsQUEvRWE7QUFBQSxBQUNkOzs7Ozs7OztBQ0xNLElBQU07VUFBYSxBQUNoQixBQUNOO1VBRnNCLEFBRWhCLEFBQ047UUFIc0IsQUFHbEIsQUFDSjtrQkFKc0IsQUFJUixBQUNkO1lBTHNCLEFBS2QsQUFDUjthQU5zQixBQU1iLEFBQ1Q7VUFQc0IsQUFPaEIsQUFDTjtZQVJzQixBQVFkLEFBQ1I7Y0FUc0IsQUFTWixBQUNWO1VBVnNCLEFBVWhCLEFBQ047WUFYc0IsQUFXZCxBQUNSO3NCQVpHLEFBQW1CLEFBWUo7QUFaSSxBQUN0Qjs7QUFjRyxJQUFNO2lCQUFrQixBQUNkLEFBQ2I7cUJBRjJCLEFBRVYsQUFDakI7Y0FIRyxBQUF3QixBQUdqQjtBQUhpQixBQUMzQjs7QUFLRyxJQUFNO1dBQVksQUFDZCxBQUNQO1dBRnFCLEFBRWQsQUFDUDtTQUhxQixBQUdoQixBQUNMO1VBSnFCLEFBSWYsQUFDTjtXQUxxQixBQUtkLEFBQ1A7VUFORyxBQUFrQixBQU1mO0FBTmUsQUFDckI7O0FBUUcsSUFBTSwwQ0FBaUIsQ0FBQSxBQUFDLFNBQXhCLEFBQXVCLEFBQVU7O0FBRWpDLElBQU0sOENBQW1CLENBQUEsQUFBQyxJQUExQixBQUF5QixBQUFLOztBQUU5QixJQUFNO1VBQWdCLEFBQ25CLEFBQ047VUFGeUIsQUFFbkIsQUFDTjtXQUhHLEFBQXNCLEFBR2xCO0FBSGtCLEFBQ3pCOzs7Ozs7Ozs7VUNuQ1csQUFDTCxBQUNUO2FBRmMsQUFFRixBQUNaO1csQUFIYyxBQUdKO0FBSEksQUFDZDs7Ozs7Ozs7OztBQ0REOztBQUNBOztBQUVPLElBQU0sa0NBQWEsU0FBYixBQUFhLHNCQUFhLEFBQ25DO2NBQUEsQUFBVSxNQUFWLEFBQWdCLFFBQVEsVUFBQSxBQUFDLE1BQUQsQUFBTyxHQUFNLEFBQ2pDO0FBQ0E7QUFDQTtBQUNBOzhCQUFVLEtBQVYsQUFBZSxBQUNmOzhCQUFVLEtBQVYsQUFBZSxBQUNmO1lBQUcsVUFBQSxBQUFVLE9BQWIsQUFBb0IsR0FBRSxBQUNsQjtpQkFBQSxBQUFLLEtBQUwsQUFBVSxVQUFWLEFBQW9CLElBQUksc0JBQXhCLEFBQW1DLEFBQ25DO2lCQUFBLEFBQUssV0FBTCxBQUFnQixVQUFoQixBQUEwQixJQUFJLHNCQUE5QixBQUF5QyxBQUN6QztnQkFBRyxVQUFBLEFBQVUsT0FBVixBQUFpQixNQUFwQixBQUEwQixHQUFHLEFBQ3pCO3FCQUFBLEFBQUssS0FBTCxBQUFVLFVBQVYsQUFBb0IsSUFBSSxzQkFBeEIsQUFBbUMsQUFDbkM7cUJBQUEsQUFBSyxXQUFMLEFBQWdCLFVBQWhCLEFBQTBCLElBQUksc0JBQTlCLEFBQXlDLEFBQzVDO0FBQ0o7QUFDRDtZQUFHLFVBQUEsQUFBVSxTQUFiLEFBQXNCLEdBQUcsQUFDckI7aUJBQUEsQUFBSyxLQUFMLEFBQVUsVUFBVixBQUFvQixJQUFJLHNCQUF4QixBQUFtQyxBQUNuQztpQkFBQSxBQUFLLFdBQUwsQUFBZ0IsVUFBaEIsQUFBMEIsSUFBSSxzQkFBOUIsQUFBeUMsQUFDNUM7QUFDRDtZQUFHLFVBQUEsQUFBVSxPQUFiLEFBQW9CLEdBQUcsQUFDbkI7aUJBQUEsQUFBSyxLQUFMLEFBQVUsVUFBVixBQUFvQixJQUFJLHNCQUF4QixBQUFtQyxBQUNuQztpQkFBQSxBQUFLLFdBQUwsQUFBZ0IsVUFBaEIsQUFBMEIsSUFBSSxzQkFBOUIsQUFBeUMsQUFDekM7Z0JBQUcsVUFBQSxBQUFVLE9BQVYsQUFBaUIsTUFBcEIsQUFBMEIsR0FBRyxBQUN6QjtxQkFBQSxBQUFLLEtBQUwsQUFBVSxVQUFWLEFBQW9CLElBQUksc0JBQXhCLEFBQW1DLEFBQ25DO3FCQUFBLEFBQUssV0FBTCxBQUFnQixVQUFoQixBQUEwQixJQUFJLHNCQUE5QixBQUF5QyxBQUM1QztBQUNKO0FBQ0o7QUExQkQsQUEyQkE7QUFDSDtBQTdCTTs7QUErQkEsSUFBTSxrQ0FBYSxTQUFiLEFBQWEsc0JBQWEsQUFDbkM7ZUFBQSxBQUFXLEFBQ1g7UUFBRyxVQUFBLEFBQVUsU0FBYixBQUFzQixPQUFPLEFBRTdCOztjQUFBLEFBQVUsTUFBTSxVQUFoQixBQUEwQixNQUExQixBQUFnQyxNQUFoQyxBQUFzQyxRQUFRLFVBQUEsQUFBQyxNQUFELEFBQU8sR0FBTSxBQUN2RDtZQUFHLFVBQUEsQUFBVSxRQUFiLEFBQXFCLEdBQUcsQUFDcEI7aUNBQVMsS0FBVCxBQUFjLEFBQ2pCO0FBQ0o7QUFKRCxBQUtIO0FBVE07O0FBV1AsSUFBTSxhQUFhLFNBQWIsQUFBYSxrQkFBUyxBQUN4QjtVQUFBLEFBQU0sTUFBTixBQUFZLFFBQVEsVUFBQSxBQUFDLE1BQUQsQUFBTyxHQUFNLEFBQzdCO2FBQUEsQUFBSyxjQUFTLEFBQUssTUFBTCxBQUFXLFFBQVEsZ0JBQVEsQUFDckM7aUNBQVMsS0FBVCxBQUFjLEFBQ2pCO0FBRkQsQUFBYyxBQUdqQixTQUhpQjtBQURsQixBQUtIO0FBTkQ7O0FBUU8sSUFBTSx3Q0FBZ0IsU0FBaEIsQUFBZ0IscUJBQVMsQUFDbEM7UUFBRyxNQUFBLEFBQU0sUUFBTixBQUFjLFdBQWpCLEFBQTRCLEdBQUcsQUFDL0I7VUFBQSxBQUFNLFFBQU4sQUFBYyxRQUFRLGVBQU8sQUFDekI7WUFBRyx3QkFBSCxBQUFHLEFBQVksUUFBUSxNQUFBLEFBQU0sUUFBTixBQUFjLEdBQWQsQUFBaUIsYUFBakIsQUFBOEIsWUFBckQsQUFBdUIsQUFBMEMsaUJBQzVELElBQUcsTUFBQSxBQUFNLFFBQU4sQUFBYyxHQUFkLEFBQWlCLGFBQXBCLEFBQUcsQUFBOEIsYUFBYSxNQUFBLEFBQU0sUUFBTixBQUFjLEdBQWQsQUFBaUIsZ0JBQWpCLEFBQWlDLEFBRXBGOztZQUFHLHVCQUFILEFBQUcsQUFBVyxRQUFRLE1BQUEsQUFBTSxRQUFOLEFBQWMsR0FBZCxBQUFpQixhQUFqQixBQUE4QixZQUFwRCxBQUFzQixBQUEwQyxpQkFDM0QsSUFBRyxNQUFBLEFBQU0sUUFBTixBQUFjLEdBQWQsQUFBaUIsYUFBcEIsQUFBRyxBQUE4QixhQUFhLE1BQUEsQUFBTSxRQUFOLEFBQWMsR0FBZCxBQUFpQixnQkFBakIsQUFBaUMsQUFDdkY7QUFORCxBQU9IO0FBVE07O0FBV0EsSUFBTSxrQ0FBYSxTQUFiLEFBQWEsc0JBQWEsQUFBRSxDQUFsQzs7Ozs7Ozs7OztBQ2hFUDs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxPQUFNLEFBQUUsQ0FBckI7O0FBRU8sSUFBTSw0Q0FBa0IsU0FBbEIsQUFBa0IsdUJBQVMsQUFDcEM7UUFBSSxNQUFKLEFBQVUsQUFFVjs7UUFBRyxNQUFBLEFBQU0sUUFBVCxBQUFpQixHQUFHLE9BQVEsTUFBQSxBQUFNLE9BQWQsQUFBcUIsQUFDekM7UUFBSSxNQUFBLEFBQU0sUUFBTixBQUFjLEtBQUssTUFBQSxBQUFNLFNBQTdCLEFBQXNDLE9BQU8sT0FBTyxPQUFPLE1BQUEsQUFBTSxPQUFwQixBQUFPLEFBQW9CLEFBRXhFOztXQUFBLEFBQU8sU0FBUCxBQUFnQixPQUFoQixBQUF1QixBQUMxQjtBQVBNOztBQVNBLElBQU0sOENBQW1CLFNBQW5CLEFBQW1CLG1CQUFNLEFBQ2xDO1FBQUksUUFBUSxPQUFBLEFBQU8sU0FBUCxBQUFnQixLQUFoQixBQUFxQixNQUFyQixBQUEyQixHQUEzQixBQUE4QixNQUExQyxBQUFZLEFBQXFDLEFBRWpEOzs7Y0FDVSxTQUFTLE1BQVQsQUFBUyxBQUFNLElBQWYsQUFBbUIsTUFBTSxTQUFTLE1BQVQsQUFBUyxBQUFNLElBQWYsQUFBbUIsTUFBNUMsQUFBa0QsSUFEckQsQUFDeUQsQUFDNUQ7Y0FBTSxTQUFTLE1BQVQsQUFBUyxBQUFNLElBQWYsQUFBbUIsTUFBTSxTQUFTLE1BQVQsQUFBUyxBQUFNLElBQWYsQUFBbUIsTUFBNUMsQUFBa0QsSUFGNUQsQUFBTyxBQUV5RCxBQUVuRTtBQUpVLEFBQ0g7QUFKRDs7QUFTQSxJQUFNLGdDQUFZLFNBQVosQUFBWSxnQkFBUSxBQUM3QjtTQUFBLEFBQUssVUFBTCxBQUFlLE9BQU8sc0JBQXRCLEFBQWlDLEFBQ2pDO1NBQUEsQUFBSyxVQUFMLEFBQWUsT0FBTyxzQkFBdEIsQUFBaUMsQUFDakM7U0FBQSxBQUFLLFVBQUwsQUFBZSxPQUFPLHNCQUF0QixBQUFpQyxBQUNqQztTQUFBLEFBQUssVUFBTCxBQUFlLE9BQU8sc0JBQXRCLEFBQWlDLEFBQ2pDO1NBQUEsQUFBSyxVQUFMLEFBQWUsT0FBTyxzQkFBdEIsQUFBaUMsQUFDcEM7QUFOTTs7QUFRQSxJQUFNLDhCQUFXLFNBQVgsQUFBVyxlQUFRLEFBQzVCO0FBQ0E7U0FBQSxBQUFLLFVBQUwsQUFBZSxPQUFPLHNCQUF0QixBQUFpQyxBQUNqQztTQUFBLEFBQUssVUFBTCxBQUFlLElBQUksc0JBQW5CLEFBQThCLEFBQ2pDO0FBSk07O0FBTUEsSUFBTSw4QkFBVyxTQUFYLEFBQVcsZUFBUSxBQUM1QjtBQUNBO1NBQUEsQUFBSyxVQUFMLEFBQWUsSUFBSSxzQkFBbkIsQUFBOEIsQUFDOUI7U0FBQSxBQUFLLFVBQUwsQUFBZSxPQUFPLHNCQUF0QixBQUFpQyxBQUNwQztBQUpNOztBQU1BLElBQU0sa0RBQXFCLFNBQXJCLEFBQXFCLDBCQUFTLEFBQ3ZDO1FBQUksc0JBQXNCLEVBQUEsQUFBRSxPQUFPLEVBQUUsT0FBTyxzQkFBNUMsQUFBMEIsQUFBUyxBQUFvQixBQUN2RDtVQUFBLEFBQU0sTUFBTixBQUFZLFFBQVEsZ0JBQVEsQUFDeEI7NEJBQUEsQUFBb0IsWUFBWSxLQUFBLEFBQUssY0FBYyxFQUFBLEFBQUUsT0FBTyxFQUFDLE9BQU8sc0JBQUEsQUFBVyxHQUFYLEFBQWMsUUFBZCxBQUFzQixPQUExRixBQUFtRCxBQUFTLEFBQVEsQUFBNkIsQUFDakc7QUFDSDtBQUhELEFBSUE7VUFBQSxBQUFNLE1BQU4sQUFBWSxHQUFaLEFBQWUsS0FBZixBQUFvQixXQUFwQixBQUErQixXQUEvQixBQUEwQyxhQUExQyxBQUF1RCxxQkFBcUIsTUFBQSxBQUFNLE1BQU4sQUFBWSxHQUFaLEFBQWUsS0FBZixBQUFvQixXQUFoRyxBQUEyRyxBQUM5RztBQVBNOztBQVNBLElBQU0sa0NBQWEsU0FBYixBQUFhLGtCQUFBO1dBQVMsTUFBQSxBQUFNLE9BQU4sQUFBYSxNQUFNLE1BQUEsQUFBTSxNQUF6QixBQUErQixXQUFXLE1BQUEsQUFBTSxNQUFNLE1BQVosQUFBa0IsTUFBbEIsQUFBd0IsTUFBeEIsQUFBOEIsV0FBOUIsQUFBeUMsS0FBSyxNQUFBLEFBQU0sT0FBTixBQUFhLE1BQU0sTUFBQSxBQUFNLE1BQU0sTUFBWixBQUFrQixNQUFsQixBQUF3QixNQUF6RixBQUErRixVQUFVLENBQUMsTUFBQSxBQUFNLE1BQU0sTUFBWixBQUFrQixNQUEvSyxBQUFTLEFBQTRLO0FBQXhNOztBQUVBLElBQU0sb0NBQWMsU0FBZCxBQUFjLG1CQUFBO1dBQVMsTUFBQSxBQUFNLFNBQU4sQUFBZSxNQUFNLE1BQUEsQUFBTSxNQUFNLE1BQVosQUFBa0IsTUFBbEIsQUFBd0IsTUFBeEIsQUFBOEIsV0FBOUIsQUFBeUMsS0FBSyxNQUFBLEFBQU0sU0FBbEYsQUFBUyxBQUFrRjtBQUEvRzs7QUFFQSxJQUFNLDRDQUFrQixTQUFsQixBQUFrQix1QkFBQTtXQUFTLE1BQUEsQUFBTSxTQUFOLEFBQWUsU0FBUyxNQUFBLEFBQU0sTUFBTSxNQUFaLEFBQWtCLE1BQWxCLEFBQXdCLE1BQXhCLEFBQThCLFdBQXRELEFBQWlFLEtBQUssTUFBQSxBQUFNLE1BQU0sTUFBWixBQUFrQixNQUFsQixBQUF3QixNQUFNLE1BQTlCLEFBQW9DLE1BQW5ILEFBQXlIO0FBQWpKOztBQUVQLElBQU0sSUFBSSxTQUFKLEFBQUksRUFBQSxBQUFDLFVBQUQsQUFBVyxZQUFlLEFBQ2hDO1FBQUksT0FBTyxTQUFBLEFBQVMsY0FBcEIsQUFBVyxBQUF1QixBQUNsQztTQUFJLElBQUosQUFBUSxRQUFSLEFBQWdCLFlBQVk7YUFBQSxBQUFLLGFBQUwsQUFBa0IsTUFBTSxXQUFwRCxBQUE0QixBQUF3QixBQUFXO0FBQy9ELFlBQUEsQUFBTyxBQUNWO0FBSkQ7O0FBTU8sSUFBTSw2Q0FBZSxBQUFPLE9BQVAsQUFDSTtjQUdXLEFBQUcsTUFBSCxBQUFTLEtBQUssU0FBQSxBQUFTLHVCQUFxQixzQkFBNUMsQUFBYyxBQUF5QyxPQUF2RCxBQUFnRSxPQUFPLFVBQUEsQUFBQyxPQUFELEFBQVEsTUFBUjs0Q0FBQSxBQUFxQjtrQkFBTyxBQUNoRyxBQUNOO3dCQUFZLEtBQUEsQUFBSyxvQkFBa0Isc0JBQXZCLEFBQWtDLE1BQVEsS0FBQSxBQUFLLG9CQUFrQixzQkFBakUsQUFBMEMsQUFBa0MsTUFGYyxBQUVOLEFBQ2hHO3NCQUFVLEtBQUEsQUFBSyxhQUFhLDJCQUFsQixBQUFrQyx3QkFBc0IsQUFBRTs0QkFBVSxLQUFBLEFBQUssYUFBYSwyQkFBNUIsQUFBVSxBQUFrQyxXQUE1QyxBQUF5RCxLQUF6RCxBQUE4RCxBQUFRO0FBQWxGLGFBQUEsQ0FBQSxBQUFtRixLQUFqSSxBQUE4QyxBQUF3RixRQUgxQyxBQUdrRCxBQUN4SjtzQkFBTyxBQUFHLE1BQUgsQUFBUyxLQUFLLEtBQUEsQUFBSyx1QkFBcUIsc0JBQXhDLEFBQWMsQUFBcUMsT0FBbkQsQUFBNEQsWUFBUyxBQUFHLE1BQUgsQUFBUyxLQUFLLEtBQUEsQUFBSyx1QkFBcUIsc0JBQXhDLEFBQWMsQUFBcUMsT0FBbkQsQUFBNEQsT0FBTyxVQUFBLEFBQUMsT0FBRCxBQUFRLE1BQVI7b0RBQUEsQUFBcUI7MEJBQU8sQUFDakssQUFDTjs4QkFBVSxLQUFBLEFBQUssYUFBYSwyQkFBbEIsQUFBa0Msd0JBQXVCLEFBQUU7b0NBQVUsS0FBQSxBQUFLLGFBQWEsMkJBQTVCLEFBQVUsQUFBa0MsV0FBNUMsQUFBeUQsS0FBekQsQUFBOEQsQUFBUTtBQUFuRixxQkFBQSxDQUFBLEFBQW9GLEtBQWxJLEFBQThDLEFBQXlGLFFBRk4sQUFBNEIsQUFFZDtBQUZjLEFBQ3ZLO0FBRHdFLGFBQUEsRUFBckUsQUFBcUUsQUFHeEUsR0FIRyxHQUptRSxBQUE0QixBQU81RjtBQVA0RixBQUN0RztBQURHLEtBQUEsRUFEWCxBQUNXLEFBUUgsQUFDSjthQUFTLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsdUJBQXFCLDJCQUE5QixBQUE4QyxrQkFBNUQsTUFBQSxBQUFpRixPQUFPLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsdUJBQXFCLDJCQUE5QixBQUE4QyxjQWIxTCxBQUFxQixBQUdJLEFBVWEsQUFBd0Y7QUFWckcsQUFDSSxDQUpSIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBQYWdlcyBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIHdpbmRvdy50ZXN0Rm4gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLXBhZ2UtcGFyYW1zJykpLmpvaW4oJyAnKSk7XG4gICAgfTtcbiAgICB3aW5kb3cuUGFnZXMgPSBQYWdlcy5pbml0KCcuanMtcGFnZXMnKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdGxldCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsKTtcbiAgICAvL2xldCBlbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cdGlmKCFlbCkgcmV0dXJuIGNvbnNvbGUud2FybihgUGFnZXMgbm90IGluaXRpYWxpc2VkLCBubyBlbGVtZW50cyBmb3VuZCBmb3IgdGhlIHNlbGVjdG9yICcke3NlbH0nYCk7XG4gICAgXG5cdHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0cm9vdDogZWwsXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0fSkuaW5pdCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiaW1wb3J0IHsgQ0xBU1NOQU1FUywgSU5JVElBTF9TVEFURSwgREFUQV9BVFRSSUJVVEVTLCBUUklHR0VSX0VWRU5UUywgVFJJR0dFUl9LRVlDT0RFUywgS0VZX0NPREVTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaW5pdGlhbFN0YXRlLCByZWFkU3RhdGVGcm9tVVJMLCB3cml0ZVN0YXRlVG9VUkwsIGlzRmlyc3RJdGVtLCBpc0xhc3RJdGVtLCBleHRyYWN0QmFja2dyb3VuZHMsIHBhcnRIYXNDYWxsYmFjayB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgcmVuZGVyUGFnZSwgcmVuZGVyUGFydCwgcmVuZGVyQnV0dG9ucyB9IGZyb20gJy4vcmVuZGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBpbml0aWFsU3RhdGUsIHRoaXMuc3RhdGVGcm9tSGFzaChpbml0aWFsU3RhdGUpKTtcblx0XHR0aGlzLnN0YXRlLmJ1dHRvbnMubGVuZ3RoICYmIHRoaXMuaW5pdEJ1dHRvbnMoKTtcblx0XHRleHRyYWN0QmFja2dyb3VuZHModGhpcy5zdGF0ZSk7XG5cdFx0dGhpcy5yZW5kZXIoKTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5oYW5kbGVIYXNoQ2hhbmdlLmJpbmQodGhpcyksIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKTtcblx0XHRcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0c3RhdGVGcm9tSGFzaChwcmV2aW91c1N0YXRlID0gaW5pdGlhbFN0YXRlKXtcblx0XHRsZXQgY2FuZGlkYXRlID0gcmVhZFN0YXRlRnJvbVVSTCgpO1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XG5cdFx0XHRwYWdlOiBjYW5kaWRhdGUucGFnZSA8IDAgPyAwIDogY2FuZGlkYXRlLnBhZ2UgPj0gcHJldmlvdXNTdGF0ZS5wYWdlcy5sZW5ndGggPyBwcmV2aW91c1N0YXRlLnBhZ2VzLmxlbmd0aCAtIDEgOiBjYW5kaWRhdGUucGFnZSxcblx0XHRcdHBhcnQ6IHByZXZpb3VzU3RhdGUucGFnZXNbY2FuZGlkYXRlLnBhZ2VdLnBhcnRzID8gY2FuZGlkYXRlLm5leHRQYXJ0IDwgMCA/IDAgOiBjYW5kaWRhdGUucGFydCA+PSBwcmV2aW91c1N0YXRlLnBhZ2VzW2NhbmRpZGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGggPyBwcmV2aW91c1N0YXRlLnBhZ2VzW2NhbmRpZGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGggLSAxIDogY2FuZGlkYXRlLnBhcnQgOiBmYWxzZSxcblx0XHR9KTtcblx0fSxcblx0aGFuZGxlSGFzaENoYW5nZSgpe1xuXHRcdHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlRnJvbUhhc2goKTtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHR9LFxuXHRpbml0QnV0dG9ucygpe1xuXHRcdFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuXHRcdFx0dGhpcy5zdGF0ZS5idXR0b25zLmZvckVhY2goYnRuID0+IHtcblx0XHRcdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuXHRcdFx0XHRcdGlmKGUua2V5Q29kZSAmJiAhflRSSUdHRVJfS0VZQ09ERVMuaW5kZXhPZihlLktleUNvZGUpKSByZXR1cm47XG5cdFx0XHRcdFx0dGhpc1tidG4uaGFzQXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5CVVRUT05fTkVYVCkgPyAnbmV4dCcgOiAncHJldmlvdXMnXSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVLZXlEb3duKGUpe1xuXHRcdGNvbnN0IGtleURpY3Rpb25hcnkgPSB7XG5cdFx0XHRbS0VZX0NPREVTLkxFRlRdKCl7IHRoaXMucHJldmlvdXMoKTsgfSxcblx0XHRcdFtLRVlfQ09ERVMuUklHSFRdKCl7IHRoaXMubmV4dCgpOyB9XG5cdFx0fTtcblx0XHRpZihrZXlEaWN0aW9uYXJ5W2Uua2V5Q29kZV0pIGtleURpY3Rpb25hcnlbZS5rZXlDb2RlXS5jYWxsKHRoaXMpO1xuXHR9LFxuXHRyZW5kZXIoKXtcblx0XHRyZW5kZXJQYWdlKHRoaXMuc3RhdGUpO1xuXHRcdHJlbmRlclBhcnQodGhpcy5zdGF0ZSk7XG5cdFx0cmVuZGVyQnV0dG9ucyh0aGlzLnN0YXRlKTtcblx0XHR0aGlzLnBvc3RSZW5kZXIoKTtcblx0XHQvLyByZW5kZXJCdXR0b25zKHRoaXMuc3RhdGU7XG5cdH0sXG5cdHBvc3RSZW5kZXIoKXtcblx0XHRpZih0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uY2FsbGJhY2spIHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5jYWxsYmFjaygpO1xuXHRcdGlmKHBhcnRIYXNDYWxsYmFjayh0aGlzLnN0YXRlKSkgdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnBhcnRzW3RoaXMuc3RhdGUucGFydF0uY2FsbGJhY2soKTtcblx0fSxcblx0cHJldmlvdXMoKXtcblx0XHRpZihpc0ZpcnN0SXRlbSh0aGlzLnN0YXRlKSkgcmV0dXJuO1xuXHRcdFxuXHRcdGlmKHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGggPiAwICYmICh0aGlzLnN0YXRlLnBhcnQgIT09IGZhbHNlICYmIHRoaXMuc3RhdGUucGFydCA+IDApKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBwYXJ0OiB0aGlzLnN0YXRlLnBhcnQgLSAxfSk7XG5cdFx0ZWxzZSBpZih0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0ucGFydHMubGVuZ3RoID4gMCAmJiB0aGlzLnN0YXRlLnBhcnQgPT09IDApIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhcnQ6IGZhbHNlIH0pO1xuXHRcdGVsc2UgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgcGFnZTogdGhpcy5zdGF0ZS5wYWdlIC0gMSwgcGFydDogdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2UgLSAxXS5wYXJ0cy5sZW5ndGggLSAxIH0pO1xuXHRcdFxuXHRcdHdyaXRlU3RhdGVUb1VSTCh0aGlzLnN0YXRlKTtcblx0fSxcblx0bmV4dCgpe1xuXHRcdGlmKGlzTGFzdEl0ZW0odGhpcy5zdGF0ZSkpIHJldHVybjtcblxuXHRcdGlmKHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGggPiAwICYmIHRoaXMuc3RhdGUucGFydCArIDEgPCB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0ucGFydHMubGVuZ3RoKXtcblx0XHRcdGlmKHRoaXMuc3RhdGUucGFydCA9PT0gZmFsc2UpIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhcnQ6IDAgfSk7XG5cdFx0XHRlbHNlIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhcnQ6IHRoaXMuc3RhdGUucGFydCArIDEgfSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhZ2U6IHRoaXMuc3RhdGUucGFnZSArIDEsIHBhcnQ6IGZhbHNlIH0pO1xuXHRcdH1cblxuXHRcdHdyaXRlU3RhdGVUb1VSTCh0aGlzLnN0YXRlKTtcblx0fSxcblx0Z29UbyhuZXh0U3RhdGUpe1xuXHRcdHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XG5cdFx0XHRwYWdlOiBuZXh0U3RhdGUucGFnZSAhPT0gbnVsbCAmJiBuZXh0U3RhdGUucGFnZSA8IHRoaXMuc3RhdGUucGFnZXMubGVuZ3RoID8gbmV4dFN0YXRlLnBhZ2UgOiB0aGlzLnN0YXRlLnBhZ2UsXG5cdFx0XHRwYXJ0OiBuZXh0U3RhdGUucGFydCA8IHRoaXMuc3RhdGUucGFnZXNbbmV4dFN0YXRlLnBhZ2VdLnBhcnRzLmxlbmd0aCA/IG5leHRTdGF0ZS5wYXJ0IDogdGhpcy5zdGF0ZUZyb21IYXNoLnBhcnRcblx0XHR9KTtcblx0XHR3cml0ZVN0YXRlVG9VUkwodGhpcy5zdGF0ZSk7XG5cdFx0XG5cdH1cbn07IiwiZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7XG4gICAgUEFHRTogJ2pzLXBhZ2UnLFxuICAgIFBBUlQ6ICdqcy1wYWdlX19wYXJ0JyxcbiAgICBCRzogJ2pzLXBhZ2VfX2JnJyxcbiAgICBCR19DT05UQUlORVI6ICdwYWdlX19iZ3MnLFxuICAgIEhJRERFTjogJ2hpZGRlbicsXG4gICAgQ1VSUkVOVDogJ2N1cnJlbnQnLFxuICAgIFBBU1Q6ICdwYXN0JyxcbiAgICBGVVRVUkU6ICdmdXR1cmUnLFxuICAgIFBSRVZJT1VTOiAncHJldmlvdXMnLFxuICAgIE5FWFQ6ICduZXh0JyxcbiAgICBCVVRUT046ICdqcy1wYWdlX19idG4nLFxuICAgIEJVVFRPTl9DT05UQUlORVI6ICdwYWdlX19idG4tY29udGFpbmVyJyxcbn07XG5cbmV4cG9ydCBjb25zdCBEQVRBX0FUVFJJQlVURVMgPSB7XG4gICAgQlVUVE9OX05FWFQ6ICdkYXRhLXBhZ2UtbmV4dCcsXG4gICAgQlVUVE9OX1BSRVZJT1VTOiAnZGF0YS1wYWdlLXByZXZpb3VzJyxcbiAgICBDQUxMQkFDSzogJ2RhdGEtcGFnZS1jYWxsYmFjaydcbn07XG5cbmV4cG9ydCBjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgU1BBQ0U6IDMyLFxuICAgIEVOVEVSOiAxMyxcbiAgICBUQUI6IDksXG4gICAgTEVGVDogMzcsXG4gICAgUklHSFQ6IDM5LFxuICAgIERPV046IDQwXG59O1xuXG5leHBvcnQgY29uc3QgVFJJR0dFUl9FVkVOVFMgPSBbJ2NsaWNrJywgJ2tleWRvd24nXTtcblxuZXhwb3J0IGNvbnN0IFRSSUdHRVJfS0VZQ09ERVMgPSBbMTMsIDMyXTtcblxuZXhwb3J0IGNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gICAgcGFnZTogZmFsc2UsXG4gICAgcGFydDogZmFsc2UsXG4gICAgcGFnZXM6IGZhbHNlXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcblx0YnV0dG9uczogdHJ1ZSxcblx0bmF2aWdhdGlvbjogZmFsc2UsXG5cdGNhbGxiYWNrOiBudWxsXG59OyIsImltcG9ydCB7IENMQVNTTkFNRVMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyByZXNldE5vZGUsIGhpZGVOb2RlLCBzaG93Tm9kZSwgaXNGaXJzdEl0ZW0sIGlzTGFzdEl0ZW0gfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IHJlbmRlclBhZ2UgPSBuZXh0U3RhdGUgPT4ge1xuICAgIG5leHRTdGF0ZS5wYWdlcy5mb3JFYWNoKChwYWdlLCBpKSA9PiB7XG4gICAgICAgIC8vIGlmKG5leHRTdGF0ZS5wYWdlICE9PSBpKSB7XG4gICAgICAgIC8vICAgICBoaWRlTm9kZShwYWdlLm5vZGUpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHJlc2V0Tm9kZShwYWdlLm5vZGUpO1xuICAgICAgICByZXNldE5vZGUocGFnZS5iYWNrZ3JvdW5kKTtcbiAgICAgICAgaWYobmV4dFN0YXRlLnBhZ2UgPiBpKXtcbiAgICAgICAgICAgIHBhZ2Uubm9kZS5jbGFzc0xpc3QuYWRkKENMQVNTTkFNRVMuUEFTVCk7XG4gICAgICAgICAgICBwYWdlLmJhY2tncm91bmQuY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLlBBU1QpO1xuICAgICAgICAgICAgaWYobmV4dFN0YXRlLnBhZ2UgLSAxID09PSBpKSB7XG4gICAgICAgICAgICAgICAgcGFnZS5ub2RlLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5QUkVWSU9VUyk7XG4gICAgICAgICAgICAgICAgcGFnZS5iYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5QUkVWSU9VUyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgICAgIGlmKG5leHRTdGF0ZS5wYWdlID09PSBpKSB7XG4gICAgICAgICAgICBwYWdlLm5vZGUuY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLkNVUlJFTlQpO1xuICAgICAgICAgICAgcGFnZS5iYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICAgICAgfVxuICAgICAgICBpZihuZXh0U3RhdGUucGFnZSA8IGkpIHtcbiAgICAgICAgICAgIHBhZ2Uubm9kZS5jbGFzc0xpc3QuYWRkKENMQVNTTkFNRVMuRlVUVVJFKTtcbiAgICAgICAgICAgIHBhZ2UuYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKENMQVNTTkFNRVMuRlVUVVJFKTtcbiAgICAgICAgICAgIGlmKG5leHRTdGF0ZS5wYWdlICsgMSA9PT0gaSkge1xuICAgICAgICAgICAgICAgIHBhZ2Uubm9kZS5jbGFzc0xpc3QuYWRkKENMQVNTTkFNRVMuTkVYVCk7XG4gICAgICAgICAgICAgICAgcGFnZS5iYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5ORVhUKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIHNob3dOb2RlKG5leHRTdGF0ZS5wYWdlc1tuZXh0U3RhdGUucGFnZV0ubm9kZSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVuZGVyUGFydCA9IG5leHRTdGF0ZSA9PiB7XG4gICAgcmVzZXRQYXJ0cyhuZXh0U3RhdGUpO1xuICAgIGlmKG5leHRTdGF0ZS5wYXJ0ID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIFxuICAgIG5leHRTdGF0ZS5wYWdlc1tuZXh0U3RhdGUucGFnZV0ucGFydHMuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuICAgICAgICBpZihuZXh0U3RhdGUucGFydCA+PSBpKSB7XG4gICAgICAgICAgICBzaG93Tm9kZShwYXJ0Lm5vZGUpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5jb25zdCByZXNldFBhcnRzID0gc3RhdGUgPT4ge1xuICAgIHN0YXRlLnBhZ2VzLmZvckVhY2goKHBhZ2UsIGkpID0+IHtcbiAgICAgICAgcGFnZS5wYXJ0cyAmJiBwYWdlLnBhcnRzLmZvckVhY2gocGFydCA9PiB7XG4gICAgICAgICAgICBoaWRlTm9kZShwYXJ0Lm5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJCdXR0b25zID0gc3RhdGUgPT4ge1xuICAgIGlmKHN0YXRlLmJ1dHRvbnMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgc3RhdGUuYnV0dG9ucy5mb3JFYWNoKGJ0biA9PiB7XG4gICAgICAgIGlmKGlzRmlyc3RJdGVtKHN0YXRlKSkgc3RhdGUuYnV0dG9uc1swXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICAgIGVsc2UgaWYoc3RhdGUuYnV0dG9uc1swXS5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHN0YXRlLmJ1dHRvbnNbMF0ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgIGlmKGlzTGFzdEl0ZW0oc3RhdGUpKSBzdGF0ZS5idXR0b25zWzFdLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgZWxzZSBpZihzdGF0ZS5idXR0b25zWzFdLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkgc3RhdGUuYnV0dG9uc1sxXS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgbmF2aWdhdGlvbiA9IG5leHRTdGF0ZSA9PiB7fTsiLCJpbXBvcnQgeyBDTEFTU05BTUVTLCBJTklUSUFMX1NUQVRFLCBEQVRBX0FUVFJJQlVURVMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcblxuZXhwb3J0IGNvbnN0IHdyaXRlU3RhdGVUb1VSTCA9IHByb3BzID0+IHtcbiAgICB2YXIgdXJsID0gJy8nO1xuXG4gICAgaWYocHJvcHMucGFnZSA+PSAwKSB1cmwgKz0gKHByb3BzLnBhZ2UgKyAxKTtcbiAgICBpZiggcHJvcHMucGFydCA+PSAwICYmIHByb3BzLnBhcnQgIT09IGZhbHNlKSB1cmwgKz0gJy8nICsgKHByb3BzLnBhcnQgKyAxKTtcblxuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdXJsO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlYWRTdGF0ZUZyb21VUkwgPSAoKSA9PiB7XG4gICAgbGV0IHBhcnRzID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMikuc3BsaXQoICcvJyApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQocGFydHNbMF0sIDEwKSA/IHBhcnNlSW50KHBhcnRzWzBdLCAxMCkgLSAxIDogMCxcbiAgICAgICAgcGFydDogcGFyc2VJbnQocGFydHNbMV0sIDEwKSA/IHBhcnNlSW50KHBhcnRzWzFdLCAxMCkgLSAxIDogZmFsc2UsXG4gICAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXNldE5vZGUgPSBub2RlID0+IHtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5QQVNUKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5GVVRVUkUpO1xuICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShDTEFTU05BTUVTLlBSRVZJT1VTKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5ORVhUKTtcbn07XG5cbmV4cG9ydCBjb25zdCBoaWRlTm9kZSA9IG5vZGUgPT4ge1xuICAgIC8vbm9kZS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5ISURERU4pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNob3dOb2RlID0gbm9kZSA9PiB7XG4gICAgLy8gbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLkNVUlJFTlQpO1xuICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShDTEFTU05BTUVTLkhJRERFTik7XG59O1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdEJhY2tncm91bmRzID0gc3RhdGUgPT4ge1xuICAgIGxldCBiYWNrZ3JvdW5kQ29udGFpbmVyID0gbignZGl2JywgeyBjbGFzczogQ0xBU1NOQU1FUy5CR19DT05UQUlORVJ9KTtcbiAgICBzdGF0ZS5wYWdlcy5mb3JFYWNoKHBhZ2UgPT4ge1xuICAgICAgICBiYWNrZ3JvdW5kQ29udGFpbmVyLmFwcGVuZENoaWxkKHBhZ2UuYmFja2dyb3VuZCB8fCBuKCdkaXYnLCB7Y2xhc3M6IENMQVNTTkFNRVMuQkcucmVwbGFjZSgnanNfJywgJycpfSkpO1xuICAgICAgICAvL3BhZ2UuYmFja2dyb3VuZCAmJiBwYWdlLm5vZGUucmVtb3ZlQ2hpbGQocGFnZS5iYWNrZ3JvdW5kKTtcbiAgICB9KTtcbiAgICBzdGF0ZS5wYWdlc1swXS5ub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYmFja2dyb3VuZENvbnRhaW5lciwgc3RhdGUucGFnZXNbMF0ubm9kZS5wYXJlbnROb2RlLm5leHRFbGVtZW50U2libGluZyk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNMYXN0SXRlbSA9IHN0YXRlID0+IHN0YXRlLnBhZ2UgKyAxID09PSBzdGF0ZS5wYWdlcy5sZW5ndGggJiYgKHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnBhcnRzLmxlbmd0aCA9PT0gMCB8fCBzdGF0ZS5wYXJ0ICsgMSA9PT0gc3RhdGUucGFnZXNbc3RhdGUucGFnZV0ucGFydHMubGVuZ3RoIHx8ICFzdGF0ZS5wYWdlc1tzdGF0ZS5wYWdlXS5wYXJ0cyk7XG5cbmV4cG9ydCBjb25zdCBpc0ZpcnN0SXRlbSA9IHN0YXRlID0+IHN0YXRlLnBhZ2UgPT09IDAgJiYgKHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnBhcnRzLmxlbmd0aCA9PT0gMCB8fCBzdGF0ZS5wYXJ0ID09PSBmYWxzZSk7XG5cbmV4cG9ydCBjb25zdCBwYXJ0SGFzQ2FsbGJhY2sgPSBzdGF0ZSA9PiBzdGF0ZS5wYXJ0ICE9PSBmYWxzZSAmJiBzdGF0ZS5wYWdlc1tzdGF0ZS5wYWdlXS5wYXJ0cy5sZW5ndGggIT09IDAgJiYgc3RhdGUucGFnZXNbc3RhdGUucGFnZV0ucGFydHNbc3RhdGUucGFydF0uY2FsbGJhY2s7XG5cbmNvbnN0IG4gPSAobm9kZVR5cGUsIGF0dHJpYnV0ZXMpID0+IHtcbiAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZVR5cGUpO1xuICAgIGZvcihsZXQgcHJvcCBpbiBhdHRyaWJ1dGVzKSBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcbiAgICByZXR1cm4gbm9kZTtcbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsU3RhdGUgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSU5JVElBTF9TVEFURSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZXM6IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7Q0xBU1NOQU1FUy5QQUdFfWApKS5yZWR1Y2UoKHBhZ2VzLCBwYWdlKSA9PiBbLi4ucGFnZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHBhZ2UucXVlcnlTZWxlY3RvcihgLiR7Q0xBU1NOQU1FUy5CR31gKSA/IHBhZ2UucXVlcnlTZWxlY3RvcihgLiR7Q0xBU1NOQU1FUy5CR31gKSA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQ0FMTEJBQ0spID8gZnVuY3Rpb24oKXsgd2luZG93W2Ake3BhZ2UuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5DQUxMQkFDSyl9YF0uY2FsbChwYWdlKTsgfS5iaW5kKHBhZ2UpIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydHM6IFtdLnNsaWNlLmNhbGwocGFnZS5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDTEFTU05BTUVTLlBBUlR9YCkpLmxlbmd0aCA/IFtdLnNsaWNlLmNhbGwocGFnZS5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDTEFTU05BTUVTLlBBUlR9YCkpLnJlZHVjZSgocGFydHMsIHBhcnQpID0+IFsuLi5wYXJ0cywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBwYXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogcGFydC5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLkNBTExCQUNLKSA/IGZ1bmN0aW9uKCkgeyB3aW5kb3dbYCR7cGFydC5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLkNBTExCQUNLKX1gXS5jYWxsKHBhcnQpOyB9LmJpbmQocGFydCkgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XSwgW10pIDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dLCBbXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFske0RBVEFfQVRUUklCVVRFUy5CVVRUT05fUFJFVklPVVN9XWApKS5jb25jYXQoW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbJHtEQVRBX0FUVFJJQlVURVMuQlVUVE9OX05FWFR9XWApKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7Il19
