(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
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

var _templates = require('./templates');

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
		this.settings.buttons && this.initButtons();
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

		//only have buttons in DOM??

		var buttonContainer = this.root.appendChild(document.createElement('div'));
		buttonContainer.classList.add(_constants.CLASSNAMES.BUTTON_CONTAINER);
		buttonContainer.innerHTML = (0, _templates.buttons)();

		// this.state = Object.assign({}, this.state, {
		// 	previousButton: this.state.root.,querySelector('[data-page-action=previous]'),
		// 	nextButton: this.state.root.querySelector('[data-page-action=next]')
		// });

		this.settings.buttons && _constants.TRIGGER_EVENTS.forEach(function (ev) {
			[].slice.call(document.querySelectorAll('.' + _constants.CLASSNAMES.BUTTON)).forEach(function (btn) {
				btn.addEventListener(ev, function (e) {
					if (e.keyCode && !~_constants.TRIGGER_KEYCODES.indexOf(e.KeyCode)) return;
					_this[btn.getAttribute('data-page-action')]();
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
		// renderButtons(this.state;
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

},{"./constants":4,"./render":6,"./templates":7,"./utils":8}],4:[function(require,module,exports){
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
            (0, _utils.showNode)(subpage);
        }
    });
};

var resetSubpages = function resetSubpages(state) {
    state.pages.forEach(function (page, i) {
        page.subpages.forEach(function (subpage) {
            (0, _utils.hideNode)(subpage);
        });
    });
};

var navigation = exports.navigation = function navigation(nextState) {};

},{"./constants":4,"./utils":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
                            value: true
});
exports.nav = exports.buttons = undefined;

var _constants = require('./constants');

var buttons = exports.buttons = function buttons() {
                            return '<div class="' + _constants.CLASSNAMES.BUTTON + ' page__btn page__btn--previous" role="button" data-page-action="previous">Previous</div>\n                            <div class="' + _constants.CLASSNAMES.BUTTON + ' page__btn page__btn--next" role="button" data-page-action="next">Next</div>';
};

var nav = exports.nav = function nav() {
                            return '';
};

},{"./constants":4}],8:[function(require,module,exports){
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
            subpages: [].slice.call(page.querySelectorAll('.' + _constants.CLASSNAMES.SUB_PAGE))
        }]);
    }, [])
});

},{"./constants":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9yZW5kZXIuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdGVtcGxhdGVzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO1dBQUEsQUFBTyxRQUFRLG9CQUFBLEFBQU0sS0FBckIsQUFBZSxBQUFXLEFBQzdCO0FBRkQsQUFBZ0MsQ0FBQTs7QUFJaEMsSUFBRyxzQkFBSCxBQUF5QixlQUFRLEFBQU8saUJBQVAsQUFBd0Isb0JBQW9CLFlBQU0sQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDtBQUFwRyxDQUFBOzs7Ozs7Ozs7QUNOakM7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxBQUFPLEtBQUEsQUFBQyxLQUFELEFBQU0sTUFBUyxBQUMzQjtPQUFJLEtBQUssU0FBQSxBQUFTLGNBQWxCLEFBQVMsQUFBdUIsQUFDN0I7QUFDSDtPQUFHLENBQUgsQUFBSSxJQUFJLE9BQU8sUUFBQSxBQUFRLHNFQUFSLEFBQTJFLE1BQWxGLEFBRVI7O2lCQUFPLEFBQU8sT0FBTyxPQUFBLEFBQU8sNEJBQXJCO1lBQWlELEFBQ2hE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LHNCQUE1QyxBQUFjLEFBQXlDLE9BQXZELEFBQWdFLE9BQU8sVUFBQSxBQUFDLE9BQUQsQUFBUSxNQUFSOzRDQUFBLEFBQXFCO2tCQUFPLEFBQ2hHLEFBQ047c0JBQVUsR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLEtBQUEsQUFBSyx1QkFBcUIsc0JBRndCLEFBQTRCLEFBRTVGLEFBQWMsQUFBcUM7QUFGeUMsQUFDdEc7QUFERyxLQUFBLEVBSnBDLEFBQXFCLEFBR0ksQUFDVyxBQUdIO0FBSlIsQUFDSSxDQUpSIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBQYWdlcyBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIHdpbmRvdy5QYWdlcyA9IFBhZ2VzLmluaXQoJy5qcy1wYWdlcycpO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpO1xuICAgIC8vbGV0IGVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0aWYoIWVsKSByZXR1cm4gY29uc29sZS53YXJuKGBQYWdlcyBub3QgaW5pdGlhbGlzZWQsIG5vIGVsZW1lbnRzIGZvdW5kIGZvciB0aGUgc2VsZWN0b3IgJyR7c2VsfSdgKTtcbiAgICBcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRyb290OiBlbCxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJpbXBvcnQgeyBDTEFTU05BTUVTLCBJTklUSUFMX1NUQVRFLCBUUklHR0VSX0VWRU5UUywgVFJJR0dFUl9LRVlDT0RFUywgS0VZX0NPREVTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaW5pdGlhbFN0YXRlLCByZWFkU3RhdGVGcm9tVVJMLCB3cml0ZVN0YXRlVG9VUkwsIGlzRmlyc3RJdGVtLCBpc0xhc3RJdGVtIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBidXR0b25zIH0gZnJvbSAnLi90ZW1wbGF0ZXMnO1xuaW1wb3J0IHsgcmVuZGVyUGFnZSwgcmVuZGVyU3VicGFnZSB9IGZyb20gJy4vcmVuZGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBpbml0aWFsU3RhdGUsIHRoaXMuc3RhdGVGcm9tSGFzaChpbml0aWFsU3RhdGUpKTtcblx0XHR0aGlzLnNldHRpbmdzLmJ1dHRvbnMgJiYgdGhpcy5pbml0QnV0dG9ucygpO1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMuaGFuZGxlSGFzaENoYW5nZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdHN0YXRlRnJvbUhhc2gocHJldmlvdXNTdGF0ZSA9IGluaXRpYWxTdGF0ZSl7XG5cdFx0bGV0IGNhbmRpZGF0ZSA9IHJlYWRTdGF0ZUZyb21VUkwoKTtcblx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge1xuXHRcdFx0cGFnZTogY2FuZGlkYXRlLnBhZ2UgPCAwID8gMCA6IGNhbmRpZGF0ZS5wYWdlID49IHByZXZpb3VzU3RhdGUucGFnZXMubGVuZ3RoID8gcHJldmlvdXNTdGF0ZS5wYWdlcy5sZW5ndGggLSAxIDogY2FuZGlkYXRlLnBhZ2UsXG5cdFx0XHRzdWJwYWdlOiBwcmV2aW91c1N0YXRlLnBhZ2VzW2NhbmRpZGF0ZS5wYWdlXS5zdWJwYWdlcyA/IGNhbmRpZGF0ZS5uZXh0U3VicGFnZSA8IDAgPyAwIDogY2FuZGlkYXRlLnN1YnBhZ2UgPj0gcHJldmlvdXNTdGF0ZS5wYWdlc1tjYW5kaWRhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoID8gcHJldmlvdXNTdGF0ZS5wYWdlc1tjYW5kaWRhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoIC0gMSA6IGNhbmRpZGF0ZS5zdWJwYWdlIDogZmFsc2UsXG5cdFx0fSk7XG5cdH0sXG5cdGhhbmRsZUhhc2hDaGFuZ2UoKXtcblx0XHR0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZUZyb21IYXNoKCk7XG5cdFx0dGhpcy5yZW5kZXIoKTtcblx0fSxcblx0aW5pdEJ1dHRvbnMoKXtcblx0XHQvL29ubHkgaGF2ZSBidXR0b25zIGluIERPTT8/XG5cdFx0XG5cdFx0bGV0IGJ1dHRvbkNvbnRhaW5lciA9IHRoaXMucm9vdC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG5cdFx0YnV0dG9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5CVVRUT05fQ09OVEFJTkVSKTtcblx0XHRidXR0b25Db250YWluZXIuaW5uZXJIVE1MID0gYnV0dG9ucygpO1xuXG5cdFx0Ly8gdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcblx0XHQvLyBcdHByZXZpb3VzQnV0dG9uOiB0aGlzLnN0YXRlLnJvb3QuLHF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBhZ2UtYWN0aW9uPXByZXZpb3VzXScpLFxuXHRcdC8vIFx0bmV4dEJ1dHRvbjogdGhpcy5zdGF0ZS5yb290LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBhZ2UtYWN0aW9uPW5leHRdJylcblx0XHQvLyB9KTtcblxuXHRcdHRoaXMuc2V0dGluZ3MuYnV0dG9ucyAmJiBUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcblx0XHRcdFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7Q0xBU1NOQU1FUy5CVVRUT059YCkpLmZvckVhY2goYnRuID0+IHtcblx0XHRcdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuXHRcdFx0XHRcdGlmKGUua2V5Q29kZSAmJiAhflRSSUdHRVJfS0VZQ09ERVMuaW5kZXhPZihlLktleUNvZGUpKSByZXR1cm47XG5cdFx0XHRcdFx0dGhpc1tidG4uZ2V0QXR0cmlidXRlKCdkYXRhLXBhZ2UtYWN0aW9uJyldKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0XG5cdH0sXG5cdGhhbmRsZUtleURvd24oZSl7XG5cdFx0Y29uc3Qga2V5RGljdGlvbmFyeSA9IHtcblx0XHRcdFtLRVlfQ09ERVMuTEVGVF0oKXsgdGhpcy5wcmV2aW91cygpOyB9LFxuXHRcdFx0W0tFWV9DT0RFUy5SSUdIVF0oKXsgdGhpcy5uZXh0KCk7IH1cblx0XHR9O1xuXHRcdGlmKGtleURpY3Rpb25hcnlbZS5rZXlDb2RlXSkga2V5RGljdGlvbmFyeVtlLmtleUNvZGVdLmNhbGwodGhpcyk7XG5cdH0sXG5cdHJlbmRlcigpe1xuXHRcdHJlbmRlclBhZ2UodGhpcy5zdGF0ZSk7XG5cdFx0cmVuZGVyU3VicGFnZSh0aGlzLnN0YXRlKTtcblx0XHQvLyByZW5kZXJCdXR0b25zKHRoaXMuc3RhdGU7XG5cdH0sXG5cdHByZXZpb3VzKCl7XG5cdFx0aWYoaXNGaXJzdEl0ZW0odGhpcy5zdGF0ZSkpIHJldHVybjtcblx0XHRcblx0XHRpZih0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoID4gMCAmJiAodGhpcy5zdGF0ZS5zdWJwYWdlICE9PSBmYWxzZSAmJiB0aGlzLnN0YXRlLnN1YnBhZ2UgPiAwKSkgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgc3VicGFnZTogdGhpcy5zdGF0ZS5zdWJwYWdlIC0gMX0pO1xuXHRcdGVsc2UgaWYodGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA+IDAgJiYgdGhpcy5zdGF0ZS5zdWJwYWdlID09PSAwKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBzdWJwYWdlOiBmYWxzZSB9KTtcblx0XHRlbHNlIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhZ2U6IHRoaXMuc3RhdGUucGFnZSAtIDEsIHN1YnBhZ2U6IHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlIC0gMV0uc3VicGFnZXMubGVuZ3RoIC0gMSB9KTtcblx0XHRcblx0XHR3cml0ZVN0YXRlVG9VUkwodGhpcy5zdGF0ZSk7XG5cdH0sXG5cdG5leHQoKXtcblx0XHRpZihpc0xhc3RJdGVtKHRoaXMuc3RhdGUpKSByZXR1cm47XG5cblx0XHRpZih0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoID4gMCAmJiB0aGlzLnN0YXRlLnN1YnBhZ2UgKyAxIDwgdGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCl7XG5cdFx0XHRpZih0aGlzLnN0YXRlLnN1YnBhZ2UgPT09IGZhbHNlKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBzdWJwYWdlOiAwIH0pO1xuXHRcdFx0ZWxzZSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBzdWJwYWdlOiB0aGlzLnN0YXRlLnN1YnBhZ2UgKyAxIH0pO1xuXHRcdH0gZWxzZSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBwYWdlOiB0aGlzLnN0YXRlLnBhZ2UgKyAxLCBzdWJwYWdlOiBmYWxzZSB9KTtcblxuXHRcdHdyaXRlU3RhdGVUb1VSTCh0aGlzLnN0YXRlKTtcblx0fVxufTsiLCJleHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHtcbiAgICBQQUdFOiAnanMtcGFnZScsXG4gICAgU1VCX1BBR0U6ICdqcy1wYWdlX19zdWInLFxuICAgIEhJRERFTjogJ2hpZGRlbicsXG4gICAgQ1VSUkVOVDogJ2N1cnJlbnQnLFxuICAgIEJVVFRPTjogJ2pzLXBhZ2VfX2J0bicsXG4gICAgQlVUVE9OX0NPTlRBSU5FUjogJ3BhZ2VfX2J0bi1jb250YWluZXInXG59O1xuXG5leHBvcnQgY29uc3QgS0VZX0NPREVTID0ge1xuICAgIFNQQUNFOiAzMixcbiAgICBFTlRFUjogMTMsXG4gICAgVEFCOiA5LFxuICAgIExFRlQ6IDM3LFxuICAgIFJJR0hUOiAzOSxcbiAgICBET1dOOiA0MFxufTtcblxuZXhwb3J0IGNvbnN0IFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJ107XG5cbmV4cG9ydCBjb25zdCBUUklHR0VSX0tFWUNPREVTID0gWzEzLCAzMl07XG5cbmV4cG9ydCBjb25zdCBJTklUSUFMX1NUQVRFID0ge1xuICAgIHBhZ2U6IGZhbHNlLFxuICAgIHN1YnBhZ2U6IGZhbHNlLFxuICAgIHBhZ2VzOiBmYWxzZVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGJ1dHRvbnM6IHRydWUsXG5cdG5hdmlnYXRpb246IGZhbHNlLFxuXHRjYWxsYmFjazogbnVsbFxufTsiLCJpbXBvcnQgeyBDTEFTU05BTUVTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaGlkZU5vZGUsIHNob3dOb2RlIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCByZW5kZXJQYWdlID0gbmV4dFN0YXRlID0+IHtcbiAgICBuZXh0U3RhdGUucGFnZXMuZm9yRWFjaCgocGFnZSwgaSkgPT4ge1xuICAgICAgICBpZihuZXh0U3RhdGUucGFnZSAhPT0gaSkge1xuICAgICAgICAgICAgaGlkZU5vZGUocGFnZS5ub2RlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHNob3dOb2RlKG5leHRTdGF0ZS5wYWdlc1tuZXh0U3RhdGUucGFnZV0ubm9kZSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVuZGVyU3VicGFnZSA9IG5leHRTdGF0ZSA9PiB7XG4gICAgcmVzZXRTdWJwYWdlcyhuZXh0U3RhdGUpO1xuICAgIGlmKG5leHRTdGF0ZS5zdWJwYWdlID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIFxuICAgIG5leHRTdGF0ZS5wYWdlc1tuZXh0U3RhdGUucGFnZV0uc3VicGFnZXMuZm9yRWFjaCgoc3VicGFnZSwgaSkgPT4ge1xuICAgICAgICBpZihuZXh0U3RhdGUuc3VicGFnZSA+PSBpKSB7XG4gICAgICAgICAgICBzaG93Tm9kZShzdWJwYWdlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuY29uc3QgcmVzZXRTdWJwYWdlcyA9IHN0YXRlID0+IHtcbiAgICBzdGF0ZS5wYWdlcy5mb3JFYWNoKChwYWdlLCBpKSA9PiB7XG4gICAgICAgIHBhZ2Uuc3VicGFnZXMuZm9yRWFjaChzdWJwYWdlID0+IHtcbiAgICAgICAgICAgIGhpZGVOb2RlKHN1YnBhZ2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBuYXZpZ2F0aW9uID0gbmV4dFN0YXRlID0+IHt9OyIsImltcG9ydCB7IENMQVNTTkFNRVMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBjb25zdCBidXR0b25zID0gKCkgPT4gYDxkaXYgY2xhc3M9XCIke0NMQVNTTkFNRVMuQlVUVE9OfSBwYWdlX19idG4gcGFnZV9fYnRuLS1wcmV2aW91c1wiIHJvbGU9XCJidXR0b25cIiBkYXRhLXBhZ2UtYWN0aW9uPVwicHJldmlvdXNcIj5QcmV2aW91czwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke0NMQVNTTkFNRVMuQlVUVE9OfSBwYWdlX19idG4gcGFnZV9fYnRuLS1uZXh0XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtcGFnZS1hY3Rpb249XCJuZXh0XCI+TmV4dDwvZGl2PmA7XG5cbmV4cG9ydCBjb25zdCBuYXYgPSAoKSA9PiBgYDsiLCJpbXBvcnQgeyBDTEFTU05BTUVTLCBJTklUSUFMX1NUQVRFIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5leHBvcnQgY29uc3Qgd3JpdGVTdGF0ZVRvVVJMID0gcHJvcHMgPT4ge1xuICAgIHZhciB1cmwgPSAnLyc7XG5cbiAgICBpZihwcm9wcy5wYWdlID49IDApIHVybCArPSAocHJvcHMucGFnZSArIDEpO1xuICAgIGlmKCBwcm9wcy5zdWJwYWdlID49IDAgJiYgcHJvcHMuc3VicGFnZSAhPT0gZmFsc2UpIHVybCArPSAnLycgKyAocHJvcHMuc3VicGFnZSArIDEpO1xuXG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSB1cmw7XG59O1xuXG5leHBvcnQgY29uc3QgcmVhZFN0YXRlRnJvbVVSTCA9ICgpID0+IHtcbiAgICBsZXQgcGFydHMgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgyKS5zcGxpdCggJy8nICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwYWdlOiBwYXJzZUludChwYXJ0c1swXSwgMTApID8gcGFyc2VJbnQocGFydHNbMF0sIDEwKSAtIDEgOiAwLFxuICAgICAgICBzdWJwYWdlOiBwYXJzZUludChwYXJ0c1sxXSwgMTApID8gcGFyc2VJbnQocGFydHNbMV0sIDEwKSAtIDEgOiBmYWxzZSxcbiAgICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGhpZGVOb2RlID0gbm9kZSA9PiB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5ISURERU4pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNob3dOb2RlID0gbm9kZSA9PiB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZChDTEFTU05BTUVTLkNVUlJFTlQpO1xuICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShDTEFTU05BTUVTLkhJRERFTik7XG59O1xuXG5leHBvcnQgY29uc3QgaXNMYXN0SXRlbSA9IHN0YXRlID0+IHN0YXRlLnBhZ2UgKyAxID09PSBzdGF0ZS5wYWdlcy5sZW5ndGggJiYgKHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA9PT0gMCB8fCBzdGF0ZS5zdWJwYWdlICsgMSA9PT0gc3RhdGUucGFnZXNbc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoKTtcblxuZXhwb3J0IGNvbnN0IGlzRmlyc3RJdGVtID0gc3RhdGUgPT4gc3RhdGUucGFnZSA9PT0gMCAmJiAoc3RhdGUucGFnZXNbc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoID09PSAwIHx8IHN0YXRlLnN1YnBhZ2UgPT09IGZhbHNlKTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxTdGF0ZSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJTklUSUFMX1NUQVRFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlczogW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDTEFTU05BTUVTLlBBR0V9YCkpLnJlZHVjZSgocGFnZXMsIHBhZ2UpID0+IFsuLi5wYWdlcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VicGFnZXM6IFtdLnNsaWNlLmNhbGwocGFnZS5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDTEFTU05BTUVTLlNVQl9QQUdFfWApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sIFtdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTsiXX0=
