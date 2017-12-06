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
		if ((0, _utils.subpageHasCallback)(this.state)) this.state.subpage !== false && this.state.pages[this.state.page].subpages[this.state.subpage].callback && this.state.pages[this.state.page].subpages[this.state.subpage].callback();

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
	},
	goTo: function goTo(nextState) {
		this.state = Object.assign({}, this.state, {
			page: nextState.page !== null && nextState.page < this.state.pages.length ? nextState.page : this.state.page,
			subpage: nextState.subpage < this.state.pages[nextState.page].subpages.length ? nextState.subpage : this.stateFromHash.subpage
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
exports.initialState = exports.subpageHasCallback = exports.isFirstItem = exports.isLastItem = exports.showNode = exports.hideNode = exports.readStateFromURL = exports.writeStateToURL = undefined;

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

var subpageHasCallback = exports.subpageHasCallback = function subpageHasCallback(state) {
    return state.subpage !== false && state.pages[state.page].subpages[state.subpage].callback;
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
                        window['' + subpage.getAttribute(_constants.DATA_ATTRIBUTES.CALLBACK)].apply(this, subpage.getAttribute(_constants.DATA_ATTRIBUTES.PARAMS) ? JSON.parse(subpage.getAttribute(_constants.DATA_ATTRIBUTES.PARAMS)) : []);
                    }.bind(subpage) : false
                }]);
            }, [])
        }]);
    }, []),
    buttons: [].slice.call(document.querySelectorAll('[' + _constants.DATA_ATTRIBUTES.BUTTON_NEXT + ']')).concat([].slice.call(document.querySelectorAll('[' + _constants.DATA_ATTRIBUTES.BUTTON_PREVIOUS + ']')))
});

},{"./constants":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9yZW5kZXIuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7OztBQUVBLElBQU0sMkJBQTJCLFlBQU0sQUFDbkM7V0FBQSxBQUFPLFNBQVMsWUFBVyxBQUV2Qjs7Z0JBQUEsQUFBUSxJQUFJLEtBQUEsQUFBSyxNQUFNLEtBQUEsQUFBSyxhQUFoQixBQUFXLEFBQWtCLHFCQUE3QixBQUFrRCxLQUE5RCxBQUFZLEFBQXVELEFBQ3RFO0FBSEQsQUFJQTtXQUFBLEFBQU8sUUFBUSxvQkFBQSxBQUFNLEtBQXJCLEFBQWUsQUFBVyxBQUM3QjtBQU5ELEFBQWdDLENBQUE7O0FBUWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDVmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7T0FBSSxLQUFLLFNBQUEsQUFBUyxjQUFsQixBQUFTLEFBQXVCLEFBQzdCO0FBQ0g7T0FBRyxDQUFILEFBQUksSUFB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LEtBQUEsRUFEWCxBQUNXLEFBT0gsQUFDSjthQUFTLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsdUJBQXFCLDJCQUE5QixBQUE4QyxjQUE1RCxNQUFBLEFBQTZFLE9BQU8sR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyx1QkFBcUIsMkJBQTlCLEFBQThDLGtCQVp0TCxBQUFxQixBQUdJLEFBU2EsQUFBb0Y7QUFUakcsQUFDSSxDQUpSIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBQYWdlcyBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIHdpbmRvdy50ZXN0Rm4gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLXBhZ2UtcGFyYW1zJykpLmpvaW4oJyAnKSk7XG4gICAgfTtcbiAgICB3aW5kb3cuUGFnZXMgPSBQYWdlcy5pbml0KCcuanMtcGFnZXMnKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdGxldCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsKTtcbiAgICAvL2xldCBlbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cdGlmKCFlbCkgcmV0dXJuIGNvbnNvbGUud2FybihgUGFnZXMgbm90IGluaXRpYWxpc2VkLCBubyBlbGVtZW50cyBmb3VuZCBmb3IgdGhlIHNlbGVjdG9yICcke3NlbH0nYCk7XG4gICAgXG5cdHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0cm9vdDogZWwsXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0fSkuaW5pdCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiaW1wb3J0IHsgQ0xBU1NOQU1FUywgSU5JVElBTF9TVEFURSwgREFUQV9BVFRSSUJVVEVTLCBUUklHR0VSX0VWRU5UUywgVFJJR0dFUl9LRVlDT0RFUywgS0VZX0NPREVTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaW5pdGlhbFN0YXRlLCByZWFkU3RhdGVGcm9tVVJMLCB3cml0ZVN0YXRlVG9VUkwsIGlzRmlyc3RJdGVtLCBpc0xhc3RJdGVtLCBzdWJwYWdlSGFzQ2FsbGJhY2sgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHJlbmRlclBhZ2UsIHJlbmRlclN1YnBhZ2UsIHJlbmRlckJ1dHRvbnMgfSBmcm9tICcuL3JlbmRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpIHtcblx0XHR0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgaW5pdGlhbFN0YXRlLCB0aGlzLnN0YXRlRnJvbUhhc2goaW5pdGlhbFN0YXRlKSk7XG5cdFx0dGhpcy5zdGF0ZS5idXR0b25zLmxlbmd0aCAmJiB0aGlzLmluaXRCdXR0b25zKCk7XG5cdFx0dGhpcy5yZW5kZXIoKTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5oYW5kbGVIYXNoQ2hhbmdlLmJpbmQodGhpcyksIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKTtcblx0XHRcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0c3RhdGVGcm9tSGFzaChwcmV2aW91c1N0YXRlID0gaW5pdGlhbFN0YXRlKXtcblx0XHRsZXQgY2FuZGlkYXRlID0gcmVhZFN0YXRlRnJvbVVSTCgpO1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XG5cdFx0XHRwYWdlOiBjYW5kaWRhdGUucGFnZSA8IDAgPyAwIDogY2FuZGlkYXRlLnBhZ2UgPj0gcHJldmlvdXNTdGF0ZS5wYWdlcy5sZW5ndGggPyBwcmV2aW91c1N0YXRlLnBhZ2VzLmxlbmd0aCAtIDEgOiBjYW5kaWRhdGUucGFnZSxcblx0XHRcdHN1YnBhZ2U6IHByZXZpb3VzU3RhdGUucGFnZXNbY2FuZGlkYXRlLnBhZ2VdLnN1YnBhZ2VzID8gY2FuZGlkYXRlLm5leHRTdWJwYWdlIDwgMCA/IDAgOiBjYW5kaWRhdGUuc3VicGFnZSA+PSBwcmV2aW91c1N0YXRlLnBhZ2VzW2NhbmRpZGF0ZS5wYWdlXS5zdWJwYWdlcy5sZW5ndGggPyBwcmV2aW91c1N0YXRlLnBhZ2VzW2NhbmRpZGF0ZS5wYWdlXS5zdWJwYWdlcy5sZW5ndGggLSAxIDogY2FuZGlkYXRlLnN1YnBhZ2UgOiBmYWxzZSxcblx0XHR9KTtcblx0fSxcblx0aGFuZGxlSGFzaENoYW5nZSgpe1xuXHRcdHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlRnJvbUhhc2goKTtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHR9LFxuXHRpbml0QnV0dG9ucygpe1xuXHRcdFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuXHRcdFx0dGhpcy5zdGF0ZS5idXR0b25zLmZvckVhY2goYnRuID0+IHtcblx0XHRcdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuXHRcdFx0XHRcdGlmKGUua2V5Q29kZSAmJiAhflRSSUdHRVJfS0VZQ09ERVMuaW5kZXhPZihlLktleUNvZGUpKSByZXR1cm47XG5cdFx0XHRcdFx0dGhpc1tidG4uaGFzQXR0cmlidXRlKERBVEFfQVRUUklCVVRFUy5CVVRUT05fTkVYVCkgPyAnbmV4dCcgOiAncHJldmlvdXMnXSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVLZXlEb3duKGUpe1xuXHRcdGNvbnN0IGtleURpY3Rpb25hcnkgPSB7XG5cdFx0XHRbS0VZX0NPREVTLkxFRlRdKCl7IHRoaXMucHJldmlvdXMoKTsgfSxcblx0XHRcdFtLRVlfQ09ERVMuUklHSFRdKCl7IHRoaXMubmV4dCgpOyB9XG5cdFx0fTtcblx0XHRpZihrZXlEaWN0aW9uYXJ5W2Uua2V5Q29kZV0pIGtleURpY3Rpb25hcnlbZS5rZXlDb2RlXS5jYWxsKHRoaXMpO1xuXHR9LFxuXHRyZW5kZXIoKXtcblx0XHRyZW5kZXJQYWdlKHRoaXMuc3RhdGUpO1xuXHRcdHJlbmRlclN1YnBhZ2UodGhpcy5zdGF0ZSk7XG5cdFx0cmVuZGVyQnV0dG9ucyh0aGlzLnN0YXRlKTtcblx0XHR0aGlzLnBvc3RSZW5kZXIoKTtcblx0XHQvLyByZW5kZXJCdXR0b25zKHRoaXMuc3RhdGU7XG5cdH0sXG5cdHBvc3RSZW5kZXIoKXtcblx0XHRpZihzdWJwYWdlSGFzQ2FsbGJhY2sodGhpcy5zdGF0ZSkpXG5cdFx0KHRoaXMuc3RhdGUuc3VicGFnZSAhPT0gZmFsc2UgJiYgdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnN1YnBhZ2VzW3RoaXMuc3RhdGUuc3VicGFnZV0uY2FsbGJhY2spICYmIHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5zdWJwYWdlc1t0aGlzLnN0YXRlLnN1YnBhZ2VdLmNhbGxiYWNrKCk7XG5cblx0XHR0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uY2FsbGJhY2sgJiYgdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLmNhbGxiYWNrKCk7XG5cdH0sXG5cdHByZXZpb3VzKCl7XG5cdFx0aWYoaXNGaXJzdEl0ZW0odGhpcy5zdGF0ZSkpIHJldHVybjtcblx0XHRcblx0XHRpZih0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoID4gMCAmJiAodGhpcy5zdGF0ZS5zdWJwYWdlICE9PSBmYWxzZSAmJiB0aGlzLnN0YXRlLnN1YnBhZ2UgPiAwKSkgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgc3VicGFnZTogdGhpcy5zdGF0ZS5zdWJwYWdlIC0gMX0pO1xuXHRcdGVsc2UgaWYodGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA+IDAgJiYgdGhpcy5zdGF0ZS5zdWJwYWdlID09PSAwKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBzdWJwYWdlOiBmYWxzZSB9KTtcblx0XHRlbHNlIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhZ2U6IHRoaXMuc3RhdGUucGFnZSAtIDEsIHN1YnBhZ2U6IHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlIC0gMV0uc3VicGFnZXMubGVuZ3RoIC0gMSB9KTtcblx0XHRcblx0XHR3cml0ZVN0YXRlVG9VUkwodGhpcy5zdGF0ZSk7XG5cdH0sXG5cdG5leHQoKXtcblx0XHRpZihpc0xhc3RJdGVtKHRoaXMuc3RhdGUpKSByZXR1cm47XG5cblx0XHRpZih0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoID4gMCAmJiB0aGlzLnN0YXRlLnN1YnBhZ2UgKyAxIDwgdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCl7XG5cdFx0XHRpZih0aGlzLnN0YXRlLnN1YnBhZ2UgPT09IGZhbHNlKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBzdWJwYWdlOiAwIH0pO1xuXHRcdFx0ZWxzZSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBzdWJwYWdlOiB0aGlzLnN0YXRlLnN1YnBhZ2UgKyAxIH0pO1xuXHRcdH0gZWxzZSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBwYWdlOiB0aGlzLnN0YXRlLnBhZ2UgKyAxLCBzdWJwYWdlOiBmYWxzZSB9KTtcblxuXHRcdHdyaXRlU3RhdGVUb1VSTCh0aGlzLnN0YXRlKTtcblx0fSxcblx0Z29UbyhuZXh0U3RhdGUpe1xuXHRcdHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7XG5cdFx0XHRwYWdlOiBuZXh0U3RhdGUucGFnZSAhPT0gbnVsbCAmJiBuZXh0U3RhdGUucGFnZSA8IHRoaXMuc3RhdGUucGFnZXMubGVuZ3RoID8gbmV4dFN0YXRlLnBhZ2UgOiB0aGlzLnN0YXRlLnBhZ2UsXG5cdFx0XHRzdWJwYWdlOiBuZXh0U3RhdGUuc3VicGFnZSA8IHRoaXMuc3RhdGUucGFnZXNbbmV4dFN0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA/IG5leHRTdGF0ZS5zdWJwYWdlIDogdGhpcy5zdGF0ZUZyb21IYXNoLnN1YnBhZ2Vcblx0XHR9KTtcblx0XHR3cml0ZVN0YXRlVG9VUkwodGhpcy5zdGF0ZSk7XG5cblx0XHQvKlxuXHRcdHtcblx0XHRcdHBhZ2U6IFgsXG5cdFx0XHRzdWJwYWdlOiBYIHx8IGZhbHNlXG5cdFx0fVxuXHRcdCovXG5cdH1cbn07IiwiZXhwb3J0IGNvbnN0IENMQVNTTkFNRVMgPSB7XG4gICAgUEFHRTogJ2pzLXBhZ2UnLFxuICAgIFNVQl9QQUdFOiAnanMtcGFnZV9fc3ViJyxcbiAgICBISURERU46ICdoaWRkZW4nLFxuICAgIENVUlJFTlQ6ICdjdXJyZW50JyxcbiAgICBCVVRUT046ICdqcy1wYWdlX19idG4nLFxuICAgIEJVVFRPTl9DT05UQUlORVI6ICdwYWdlX19idG4tY29udGFpbmVyJ1xufTtcblxuZXhwb3J0IGNvbnN0IERBVEFfQVRUUklCVVRFUyA9IHtcbiAgICBCVVRUT05fTkVYVDogJ2RhdGEtcGFnZS1uZXh0JyxcbiAgICBCVVRUT05fUFJFVklPVVM6ICdkYXRhLXBhZ2UtcHJldmlvdXMnLFxuICAgIENBTExCQUNLOiAnZGF0YS1wYWdlLWNhbGxiYWNrJyxcbiAgICBQQVJBTVM6ICdkYXRhLXBhZ2UtcGFyYW1zJ1xufTtcblxuZXhwb3J0IGNvbnN0IEtFWV9DT0RFUyA9IHtcbiAgICBTUEFDRTogMzIsXG4gICAgRU5URVI6IDEzLFxuICAgIFRBQjogOSxcbiAgICBMRUZUOiAzNyxcbiAgICBSSUdIVDogMzksXG4gICAgRE9XTjogNDBcbn07XG5cbmV4cG9ydCBjb25zdCBUUklHR0VSX0VWRU5UUyA9IFsnY2xpY2snLCAna2V5ZG93biddO1xuXG5leHBvcnQgY29uc3QgVFJJR0dFUl9LRVlDT0RFUyA9IFsxMywgMzJdO1xuXG5leHBvcnQgY29uc3QgSU5JVElBTF9TVEFURSA9IHtcbiAgICBwYWdlOiBmYWxzZSxcbiAgICBzdWJwYWdlOiBmYWxzZSxcbiAgICBwYWdlczogZmFsc2Vcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRidXR0b25zOiB0cnVlLFxuXHRuYXZpZ2F0aW9uOiBmYWxzZSxcblx0Y2FsbGJhY2s6IG51bGxcbn07IiwiaW1wb3J0IHsgQ0xBU1NOQU1FUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGhpZGVOb2RlLCBzaG93Tm9kZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgcmVuZGVyUGFnZSA9IG5leHRTdGF0ZSA9PiB7XG4gICAgbmV4dFN0YXRlLnBhZ2VzLmZvckVhY2goKHBhZ2UsIGkpID0+IHtcbiAgICAgICAgaWYobmV4dFN0YXRlLnBhZ2UgIT09IGkpIHtcbiAgICAgICAgICAgIGhpZGVOb2RlKHBhZ2Uubm9kZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBzaG93Tm9kZShuZXh0U3RhdGUucGFnZXNbbmV4dFN0YXRlLnBhZ2VdLm5vZGUpO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlclN1YnBhZ2UgPSBuZXh0U3RhdGUgPT4ge1xuICAgIHJlc2V0U3VicGFnZXMobmV4dFN0YXRlKTtcbiAgICBpZihuZXh0U3RhdGUuc3VicGFnZSA9PT0gZmFsc2UpIHJldHVybjtcbiAgICBcbiAgICBuZXh0U3RhdGUucGFnZXNbbmV4dFN0YXRlLnBhZ2VdLnN1YnBhZ2VzLmZvckVhY2goKHN1YnBhZ2UsIGkpID0+IHtcbiAgICAgICAgaWYobmV4dFN0YXRlLnN1YnBhZ2UgPj0gaSkge1xuICAgICAgICAgICAgc2hvd05vZGUoc3VicGFnZS5ub2RlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuY29uc3QgcmVzZXRTdWJwYWdlcyA9IHN0YXRlID0+IHtcbiAgICBzdGF0ZS5wYWdlcy5mb3JFYWNoKChwYWdlLCBpKSA9PiB7XG4gICAgICAgIHBhZ2Uuc3VicGFnZXMuZm9yRWFjaChzdWJwYWdlID0+IHtcbiAgICAgICAgICAgIGhpZGVOb2RlKHN1YnBhZ2Uubm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlckJ1dHRvbnMgPSBzdGF0ZSA9PiB7XG4gICAgc3RhdGUuYnV0dG9ucy5mb3JFYWNoKGJ0biA9PiB7XG4gICAgICAgIC8vZGlzYWJsZS9lbmFibGVcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBuYXZpZ2F0aW9uID0gbmV4dFN0YXRlID0+IHt9OyIsImltcG9ydCB7IENMQVNTTkFNRVMsIElOSVRJQUxfU1RBVEUsIERBVEFfQVRUUklCVVRFUyB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuXG5leHBvcnQgY29uc3Qgd3JpdGVTdGF0ZVRvVVJMID0gcHJvcHMgPT4ge1xuICAgIHZhciB1cmwgPSAnLyc7XG5cbiAgICBpZihwcm9wcy5wYWdlID49IDApIHVybCArPSAocHJvcHMucGFnZSArIDEpO1xuICAgIGlmKCBwcm9wcy5zdWJwYWdlID49IDAgJiYgcHJvcHMuc3VicGFnZSAhPT0gZmFsc2UpIHVybCArPSAnLycgKyAocHJvcHMuc3VicGFnZSArIDEpO1xuXG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSB1cmw7XG59O1xuXG5leHBvcnQgY29uc3QgcmVhZFN0YXRlRnJvbVVSTCA9ICgpID0+IHtcbiAgICBsZXQgcGFydHMgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgyKS5zcGxpdCggJy8nICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwYWdlOiBwYXJzZUludChwYXJ0c1swXSwgMTApID8gcGFyc2VJbnQocGFydHNbMF0sIDEwKSAtIDEgOiAwLFxuICAgICAgICBzdWJwYWdlOiBwYXJzZUludChwYXJ0c1sxXSwgMTApID8gcGFyc2VJbnQocGFydHNbMV0sIDEwKSAtIDEgOiBmYWxzZSxcbiAgICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGhpZGVOb2RlID0gbm9kZSA9PiB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5ISURERU4pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNob3dOb2RlID0gbm9kZSA9PiB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLkNVUlJFTlQpO1xuICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShDTEFTU05BTUVTLkhJRERFTik7XG59O1xuXG5leHBvcnQgY29uc3QgaXNMYXN0SXRlbSA9IHN0YXRlID0+IHN0YXRlLnBhZ2UgKyAxID09PSBzdGF0ZS5wYWdlcy5sZW5ndGggJiYgKHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA9PT0gMCB8fCBzdGF0ZS5zdWJwYWdlICsgMSA9PT0gc3RhdGUucGFnZXNbc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlyc3RJdGVtID0gc3RhdGUgPT4gc3RhdGUucGFnZSA9PT0gMCAmJiAoc3RhdGUucGFnZXNbc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoID09PSAwIHx8IHN0YXRlLnN1YnBhZ2UgPT09IGZhbHNlKTtcblxuZXhwb3J0IGNvbnN0IHN1YnBhZ2VIYXNDYWxsYmFjayA9IHN0YXRlID0+IHN0YXRlLnN1YnBhZ2UgIT09IGZhbHNlICYmIHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnN1YnBhZ2VzW3N0YXRlLnN1YnBhZ2VdLmNhbGxiYWNrXG5cbmV4cG9ydCBjb25zdCBpbml0aWFsU3RhdGUgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSU5JVElBTF9TVEFURSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZXM6IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7Q0xBU1NOQU1FUy5QQUdFfWApKS5yZWR1Y2UoKHBhZ2VzLCBwYWdlKSA9PiBbLi4ucGFnZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuQ0FMTEJBQ0spID8gZnVuY3Rpb24oKXsgcGFnZS5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLkNBTExCQUNLKS5hcHBseSh0aGlzLCBwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuUEFSQU1TKSA/IEpTT04ucGFyc2UocGFnZS5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLlBBUkFNUykpIDogW10pIH0gOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJwYWdlczogW10uc2xpY2UuY2FsbChwYWdlLnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke0NMQVNTTkFNRVMuU1VCX1BBR0V9YCkpLnJlZHVjZSgoc3VicGFnZXMsIHN1YnBhZ2UpID0+IFsuLi5zdWJwYWdlcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBzdWJwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogc3VicGFnZS5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLkNBTExCQUNLKSA/IGZ1bmN0aW9uKCkgeyB3aW5kb3dbYCR7c3VicGFnZS5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLkNBTExCQUNLKX1gXS5hcHBseSh0aGlzLCBzdWJwYWdlLmdldEF0dHJpYnV0ZShEQVRBX0FUVFJJQlVURVMuUEFSQU1TKSA/IEpTT04ucGFyc2Uoc3VicGFnZS5nZXRBdHRyaWJ1dGUoREFUQV9BVFRSSUJVVEVTLlBBUkFNUykpOiBbXSk7IH0uYmluZChzdWJwYWdlKSA6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sIFtdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sIFtdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgWyR7REFUQV9BVFRSSUJVVEVTLkJVVFRPTl9ORVhUfV1gKSkuY29uY2F0KFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgWyR7REFUQV9BVFRSSUJVVEVTLkJVVFRPTl9QUkVWSU9VU31dYCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTsiXX0=
