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
		(0, _render.renderButtons)(this.state);
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
exports.navigation = exports.renderButtons = exports.renderSubpage = exports.renderPage = undefined;

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

var renderButtons = exports.renderButtons = function renderButtons(state) {
    state.buttons.forEach(function (btn) {
        //disable/enable
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
                        window['' + subpage.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK)].call(this);
                    }.bind(subpage) : false
                }]);
            }, [])
        }]);
    }, []),
    buttons: [].slice.call(document.querySelectorAll('[' + _constants.DATA_ATTRIBUTES.BUTTON_NEXT + ']')).concat([].slice.call(document.querySelectorAll('[' + _constants.DATA_ATTRIBUTES.BUTTON_PREVIOUS + ']')))
});

},{"./constants":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9yZW5kZXIuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7OztBQUVBLElBQU0sMkJBQTJCLFlBQU0sQUFDbkM7V0FBQSxBQUFPLFNBQVMsWUFBVyxBQUN2QjtnQkFBQSxBQUFRLElBQUksS0FBQSxBQUFLLE1BQU0sS0FBQSxBQUFLLGFBQWhCLEFBQVcsQUFBa0IscUJBQTdCLEFBQWtELEtBQTlELEFBQVksQUFBdUQsQUFDdEU7QUFGRCxBQUdBO1dBQUEsQUFBTyxRQUFRLG9CQUFBLEFBQU0sS0FBckIsQUFBZSxBQUFXLEFBQzdCO0FBTEQsQUFBZ0MsQ0FBQTs7QUFPaEMsSUFBRyxzQkFBSCxBQUF5QixlQUFRLEFBQU8saUJBQVAsQUFBd0Isb0JBQW9CLFlBQU0sQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDtBQUFwRyxDQUFBOzs7Ozs7Ozs7QUNUakM7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxBQUFPLEtBQUEsQUFBQyxLQUFELEFBQU0sTUFBUyxBQUMzQjtPQUFJLEtBQUssU0FBQSxBQUFTLGNBQWxCLEFBQVMsQUFBdUIsQUFDN0I7QUFDSDtPQUFHLENBQUgsQUFBSSxJQUFJ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QXJCLEFBQXFDLHdCQUF1QixBQUFFO29DQUFVLFFBQUEsQUFBUSxhQUFhLDJCQUEvQixBQUFVLEFBQXFDLFdBQS9DLEFBQTRELEtBQTVELEFBQWlFLEFBQVE7QUFBdEYscUJBQUEsQ0FBQSxBQUF1RixLQUF4SSxBQUFpRCxBQUE0RixXQUYxRSxBQUFxQyxBQUVnRDtBQUZoRCxBQUNsSDtBQURNLGFBQUEsRUFIZ0UsQUFBNEIsQUFHNUYsQUFHTjtBQU5rRyxBQUN0RztBQURHLEtBQUEsRUFEWCxBQUNXLEFBT0gsQUFDSjthQUFTLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsdUJBQXFCLDJCQUE5QixBQUE4QyxjQUE1RCxNQUFBLEFBQTZFLE9BQU8sR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyx1QkFBcUIsMkJBQTlCLEFBQThDLGtCQVp0TCxBQUFxQixBQUdJLEFBU2EsQUFBb0Y7QUFUakcsQUFDSSxDQUpSIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBQYWdlcyBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIHdpbmRvdy50ZXN0Rm4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5wYXJzZSh0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1wYWdlLXBhcmFtcycpKS5qb2luKCcgJykpO1xuICAgIH07XG4gICAgd2luZG93LlBhZ2VzID0gUGFnZXMuaW5pdCgnLmpzLXBhZ2VzJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgLy9sZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRpZighZWwpIHJldHVybiBjb25zb2xlLndhcm4oYFBhZ2VzIG5vdCBpbml0aWFsaXNlZCwgbm8gZWxlbWVudHMgZm91bmQgZm9yIHRoZSBzZWxlY3RvciAnJHtzZWx9J2ApO1xuICAgIFxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdHJvb3Q6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCB7IENMQVNTTkFNRVMsIElOSVRJQUxfU1RBVEUsIERBVEFfQVRUUklCVVRFUywgVFJJR0dFUl9FVkVOVFMsIFRSSUdHRVJfS0VZQ09ERVMsIEtFWV9DT0RFUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGluaXRpYWxTdGF0ZSwgcmVhZFN0YXRlRnJvbVVSTCwgd3JpdGVTdGF0ZVRvVVJMLCBpc0ZpcnN0SXRlbSwgaXNMYXN0SXRlbSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgcmVuZGVyUGFnZSwgcmVuZGVyU3VicGFnZSwgcmVuZGVyQnV0dG9ucyB9IGZyb20gJy4vcmVuZGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBpbml0aWFsU3RhdGUsIHRoaXMuc3RhdGVGcm9tSGFzaChpbml0aWFsU3RhdGUpKTtcblx0XHR0aGlzLnN0YXRlLmJ1dHRvbnMubGVuZ3RoICYmIHRoaXMuaW5pdEJ1dHRvbnMoKTtcblx0XHR0aGlzLnJlbmRlcigpO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhbmRsZUhhc2hDaGFuZ2UuYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdFxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRzdGF0ZUZyb21IYXNoKHByZXZpb3VzU3RhdGUgPSBpbml0aWFsU3RhdGUpe1xuXHRcdGxldCBjYW5kaWRhdGUgPSByZWFkU3RhdGVGcm9tVVJMKCk7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcblx0XHRcdHBhZ2U6IGNhbmRpZGF0ZS5wYWdlIDwgMCA/IDAgOiBjYW5kaWRhdGUucGFnZSA+PSBwcmV2aW91c1N0YXRlLnBhZ2VzLmxlbmd0aCA/IHByZXZpb3VzU3RhdGUucGFnZXMubGVuZ3RoIC0gMSA6IGNhbmRpZGF0ZS5wYWdlLFxuXHRcdFx0c3VicGFnZTogcHJldmlvdXNTdGF0ZS5wYWdlc1tjYW5kaWRhdGUucGFnZV0uc3VicGFnZXMgPyBjYW5kaWRhdGUubmV4dFN1YnBhZ2UgPCAwID8gMCA6IGNhbmRpZGF0ZS5zdWJwYWdlID49IHByZXZpb3VzU3RhdGUucGFnZXNbY2FuZGlkYXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA/IHByZXZpb3VzU3RhdGUucGFnZXNbY2FuZGlkYXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCAtIDEgOiBjYW5kaWRhdGUuc3VicGFnZSA6IGZhbHNlLFxuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVIYXNoQ2hhbmdlKCl7XG5cdFx0dGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGVGcm9tSGFzaCgpO1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdH0sXG5cdGluaXRCdXR0b25zKCl7XG5cdFx0VFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG5cdFx0XHR0aGlzLnN0YXRlLmJ1dHRvbnMuZm9yRWFjaChidG4gPT4ge1xuXHRcdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG5cdFx0XHRcdFx0aWYoZS5rZXlDb2RlICYmICF+VFJJR0dFUl9LRVlDT0RFUy5pbmRleE9mKGUuS2V5Q29kZSkpIHJldHVybjtcblx0XHRcdFx0XHR0aGlzW2J0bi5oYXNBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLkJVVFRPTl9ORVhUKSA/ICduZXh0JyA6ICdwcmV2aW91cyddKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGhhbmRsZUtleURvd24oZSl7XG5cdFx0Y29uc3Qga2V5RGljdGlvbmFyeSA9IHtcblx0XHRcdFtLRVlfQ09ERVMuTEVGVF0oKXsgdGhpcy5wcmV2aW91cygpOyB9LFxuXHRcdFx0W0tFWV9DT0RFUy5SSUdIVF0oKXsgdGhpcy5uZXh0KCk7IH1cblx0XHR9O1xuXHRcdGlmKGtleURpY3Rpb25hcnlbZS5rZXlDb2RlXSkga2V5RGljdGlvbmFyeVtlLmtleUNvZGVdLmNhbGwodGhpcyk7XG5cdH0sXG5cdHJlbmRlcigpe1xuXHRcdHJlbmRlclBhZ2UodGhpcy5zdGF0ZSk7XG5cdFx0cmVuZGVyU3VicGFnZSh0aGlzLnN0YXRlKTtcblx0XHRyZW5kZXJCdXR0b25zKHRoaXMuc3RhdGUpO1xuXHRcdHRoaXMucG9zdFJlbmRlcigpO1xuXHRcdC8vIHJlbmRlckJ1dHRvbnModGhpcy5zdGF0ZTtcblx0fSxcblx0cG9zdFJlbmRlcigpe1xuXHRcdCh0aGlzLnN0YXRlLnN1YnBhZ2UgIT09IGZhbHNlICYmIHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5zdWJwYWdlc1t0aGlzLnN0YXRlLnN1YnBhZ2VdLmNhbGxiYWNrKSAmJiB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uc3VicGFnZXNbdGhpcy5zdGF0ZS5zdWJwYWdlXS5jYWxsYmFjaygpO1xuXG5cdFx0dGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLmNhbGxiYWNrICYmIHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5jYWxsYmFjaygpO1xuXHR9LFxuXHRwcmV2aW91cygpe1xuXHRcdGlmKGlzRmlyc3RJdGVtKHRoaXMuc3RhdGUpKSByZXR1cm47XG5cdFx0XG5cdFx0aWYodGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA+IDAgJiYgKHRoaXMuc3RhdGUuc3VicGFnZSAhPT0gZmFsc2UgJiYgdGhpcy5zdGF0ZS5zdWJwYWdlID4gMCkpIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHN1YnBhZ2U6IHRoaXMuc3RhdGUuc3VicGFnZSAtIDF9KTtcblx0XHRlbHNlIGlmKHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5zdWJwYWdlcy5sZW5ndGggPiAwICYmIHRoaXMuc3RhdGUuc3VicGFnZSA9PT0gMCkgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgc3VicGFnZTogZmFsc2UgfSk7XG5cdFx0ZWxzZSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBwYWdlOiB0aGlzLnN0YXRlLnBhZ2UgLSAxLCBzdWJwYWdlOiB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZSAtIDFdLnN1YnBhZ2VzLmxlbmd0aCAtIDEgfSk7XG5cdFx0XG5cdFx0d3JpdGVTdGF0ZVRvVVJMKHRoaXMuc3RhdGUpO1xuXHR9LFxuXHRuZXh0KCl7XG5cdFx0aWYoaXNMYXN0SXRlbSh0aGlzLnN0YXRlKSkgcmV0dXJuO1xuXG5cdFx0aWYodGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA+IDAgJiYgdGhpcy5zdGF0ZS5zdWJwYWdlICsgMSA8IHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5zdWJwYWdlcy5sZW5ndGgpe1xuXHRcdFx0aWYodGhpcy5zdGF0ZS5zdWJwYWdlID09PSBmYWxzZSkgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgc3VicGFnZTogMCB9KTtcblx0XHRcdGVsc2UgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgc3VicGFnZTogdGhpcy5zdGF0ZS5zdWJwYWdlICsgMSB9KTtcblx0XHR9IGVsc2UgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgcGFnZTogdGhpcy5zdGF0ZS5wYWdlICsgMSwgc3VicGFnZTogZmFsc2UgfSk7XG5cblx0XHR3cml0ZVN0YXRlVG9VUkwodGhpcy5zdGF0ZSk7XG5cdH1cbn07IiwiZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7XG4gICAgUEFHRTogJ2pzLXBhZ2UnLFxuICAgIFNVQl9QQUdFOiAnanMtcGFnZV9fc3ViJyxcbiAgICBISURERU46ICdoaWRkZW4nLFxuICAgIENVUlJFTlQ6ICdjdXJyZW50JyxcbiAgICBCVVRUT046ICdqcy1wYWdlX19idG4nLFxuICAgIEJVVFRPTl9DT05UQUlORVI6ICdwYWdlX19idG4tY29udGFpbmVyJ1xufTtcblxuZXhwb3J0IGNvbnN0IERBVEFfQVRUUklCVVRFUyA9IHtcbiAgICBCVVRUT05fTkVYVDogJ2RhdGEtcGFnZS1uZXh0JyxcbiAgICBCVVRUT05fUFJFVklPVVM6ICdkYXRhLXBhZ2UtcHJldmlvdXMnLFxuICAgIENBTExCQUNLOiAnZGF0YS1wYWdlLWNhbGxiYWNrJyxcbiAgICBQQVJBTVM6ICdkYXRhLXBhZ2UtcGFyYW1zJ1xufTtcblxuZXhwb3J0IGNvbnN0IEtFWV9DT0RFUyA9IHtcbiAgICBTUEFDRTogMzIsXG4gICAgRU5URVI6IDEzLFxuICAgIFRBQjogOSxcbiAgICBMRUZUOiAzNyxcbiAgICBSSUdIVDogMzksXG4gICAgRE9XTjogNDBcbn07XG5cbmV4cG9ydCBjb25zdCBUUklHR0VSX0VWRU5UUyA9IFsnY2xpY2snLCAna2V5ZG93biddO1xuXG5leHBvcnQgY29uc3QgVFJJR0dFUl9LRVlDT0RFUyA9IFsxMywgMzJdO1xuXG5leHBvcnQgY29uc3QgSU5JVElBTF9TVEFURSA9IHtcbiAgICBwYWdlOiBmYWxzZSxcbiAgICBzdWJwYWdlOiBmYWxzZSxcbiAgICBwYWdlczogZmFsc2Vcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRidXR0b25zOiB0cnVlLFxuXHRuYXZpZ2F0aW9uOiBmYWxzZSxcblx0Y2FsbGJhY2s6IG51bGxcbn07IiwiaW1wb3J0IHsgQ0xBU1NOQU1FUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGhpZGVOb2RlLCBzaG93Tm9kZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgcmVuZGVyUGFnZSA9IG5leHRTdGF0ZSA9PiB7XG4gICAgbmV4dFN0YXRlLnBhZ2VzLmZvckVhY2goKHBhZ2UsIGkpID0+IHtcbiAgICAgICAgaWYobmV4dFN0YXRlLnBhZ2UgIT09IGkpIHtcbiAgICAgICAgICAgIGhpZGVOb2RlKHBhZ2Uubm9kZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBzaG93Tm9kZShuZXh0U3RhdGUucGFnZXNbbmV4dFN0YXRlLnBhZ2VdLm5vZGUpO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlclN1YnBhZ2UgPSBuZXh0U3RhdGUgPT4ge1xuICAgIHJlc2V0U3VicGFnZXMobmV4dFN0YXRlKTtcbiAgICBpZihuZXh0U3RhdGUuc3VicGFnZSA9PT0gZmFsc2UpIHJldHVybjtcbiAgICBcbiAgICBuZXh0U3RhdGUucGFnZXNbbmV4dFN0YXRlLnBhZ2VdLnN1YnBhZ2VzLmZvckVhY2goKHN1YnBhZ2UsIGkpID0+IHtcbiAgICAgICAgaWYobmV4dFN0YXRlLnN1YnBhZ2UgPj0gaSkge1xuICAgICAgICAgICAgc2hvd05vZGUoc3VicGFnZS5ub2RlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuY29uc3QgcmVzZXRTdWJwYWdlcyA9IHN0YXRlID0+IHtcbiAgICBzdGF0ZS5wYWdlcy5mb3JFYWNoKChwYWdlLCBpKSA9PiB7XG4gICAgICAgIHBhZ2Uuc3VicGFnZXMuZm9yRWFjaChzdWJwYWdlID0+IHtcbiAgICAgICAgICAgIGhpZGVOb2RlKHN1YnBhZ2Uubm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlckJ1dHRvbnMgPSBzdGF0ZSA9PiB7XG4gICAgc3RhdGUuYnV0dG9ucy5mb3JFYWNoKGJ0biA9PiB7XG4gICAgICAgIC8vZGlzYWJsZS9lbmFibGVcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBuYXZpZ2F0aW9uID0gbmV4dFN0YXRlID0+IHt9OyIsImltcG9ydCB7IENMQVNTTkFNRVMsIElOSVRJQUxfU1RBVEUsIERBVEFfQVRUUklCVVRFUyB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuXG5leHBvcnQgY29uc3Qgd3JpdGVTdGF0ZVRvVVJMID0gcHJvcHMgPT4ge1xuICAgIHZhciB1cmwgPSAnLyc7XG5cbiAgICBpZihwcm9wcy5wYWdlID49IDApIHVybCArPSAocHJvcHMucGFnZSArIDEpO1xuICAgIGlmKCBwcm9wcy5zdWJwYWdlID49IDAgJiYgcHJvcHMuc3VicGFnZSAhPT0gZmFsc2UpIHVybCArPSAnLycgKyAocHJvcHMuc3VicGFnZSArIDEpO1xuXG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSB1cmw7XG59O1xuXG5leHBvcnQgY29uc3QgcmVhZFN0YXRlRnJvbVVSTCA9ICgpID0+IHtcbiAgICBsZXQgcGFydHMgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgyKS5zcGxpdCggJy8nICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwYWdlOiBwYXJzZUludChwYXJ0c1swXSwgMTApID8gcGFyc2VJbnQocGFydHNbMF0sIDEwKSAtIDEgOiAwLFxuICAgICAgICBzdWJwYWdlOiBwYXJzZUludChwYXJ0c1sxXSwgMTApID8gcGFyc2VJbnQocGFydHNbMV0sIDEwKSAtIDEgOiBmYWxzZSxcbiAgICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGhpZGVOb2RlID0gbm9kZSA9PiB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5ISURERU4pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNob3dOb2RlID0gbm9kZSA9PiB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLkNVUlJFTlQpO1xuICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShDTEFTU05BTUVTLkhJRERFTik7XG59O1xuXG5leHBvcnQgY29uc3QgaXNMYXN0SXRlbSA9IHN0YXRlID0+IHN0YXRlLnBhZ2UgKyAxID09PSBzdGF0ZS5wYWdlcy5sZW5ndGggJiYgKHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA9PT0gMCB8fCBzdGF0ZS5zdWJwYWdlICsgMSA9PT0gc3RhdGUucGFnZXNbc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlyc3RJdGVtID0gc3RhdGUgPT4gc3RhdGUucGFnZSA9PT0gMCAmJiAoc3RhdGUucGFnZXNbc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoID09PSAwIHx8IHN0YXRlLnN1YnBhZ2UgPT09IGZhbHNlKTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxTdGF0ZSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJTklUSUFMX1NUQVRFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlczogW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDTEFTU05BTUVTLlBBR0V9YCkpLnJlZHVjZSgocGFnZXMsIHBhZ2UpID0+IFsuLi5wYWdlcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IHBhZ2UuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5DQUxMQkFDSykgPyBmdW5jdGlvbigpeyBwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQ0FMTEJBQ0spLmFwcGx5KHRoaXMsIHBhZ2UuZ2V0QXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5QQVJBTVMpID8gSlNPTi5wYXJzZShwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuUEFSQU1TKSkgOiBbXSkgfSA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnBhZ2VzOiBbXS5zbGljZS5jYWxsKHBhZ2UucXVlcnlTZWxlY3RvckFsbChgLiR7Q0xBU1NOQU1FUy5TVUJfUEFHRX1gKSkucmVkdWNlKChzdWJwYWdlcywgc3VicGFnZSkgPT4gWy4uLnN1YnBhZ2VzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IHN1YnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBzdWJwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQ0FMTEJBQ0spID8gZnVuY3Rpb24oKSB7IHdpbmRvd1tgJHtzdWJwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQ0FMTEJBQ0spfWBdLmNhbGwodGhpcyk7IH0uYmluZChzdWJwYWdlKSA6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sIFtdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sIFtdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgWyR7REFUQV9BVFRSSUJVVEVTLkJVVFRPTl9ORVhUfV1gKSkuY29uY2F0KFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgWyR7REFUQV9BVFRSSUJVVEVTLkJVVFRPTl9QUkVWSU9VU31dYCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTsiXX0=
