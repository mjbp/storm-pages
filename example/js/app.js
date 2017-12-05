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
	handleKeyDown: function handleKeyDown(e) {
		var _keyDictionary;

		var keyDictionary = (_keyDictionary = {}, _defineProperty(_keyDictionary, _constants.KEY_CODES.LEFT, function () {
			if ((0, _utils.isFirstItem)(this.state)) return;

			if (this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage !== false && this.state.subpage > 0) this.state = Object.assign({}, this.state, { subpage: this.state.subpage - 1 });else if (this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage === 0) this.state = Object.assign({}, this.state, { subpage: false });else this.state = Object.assign({}, this.state, { page: this.state.page - 1, subpage: this.state.pages[this.state.page - 1].subpages.length - 1 });

			(0, _utils.writeStateToURL)(this.state);
		}), _defineProperty(_keyDictionary, _constants.KEY_CODES.RIGHT, function () {
			if ((0, _utils.isLastItem)(this.state)) return;

			if (this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage + 1 < this.state.pages[this.state.page].subpages.length) {
				if (this.state.subpage === false) this.state = Object.assign({}, this.state, { subpage: 0 });else this.state = Object.assign({}, this.state, { subpage: this.state.subpage + 1 });
			} else this.state = Object.assign({}, this.state, { page: this.state.page + 1, subpage: false });

			(0, _utils.writeStateToURL)(this.state);
		}), _keyDictionary);
		if (keyDictionary[e.keyCode]) keyDictionary[e.keyCode].call(this);
	},
	render: function render() {
		(0, _render.renderPage)(this.state);
		(0, _render.renderSubpage)(this.state);
	}
};

},{"./constants":4,"./render":6,"./utils":8}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CLASSNAMES = exports.CLASSNAMES = {
    PAGE: 'js-page',
    SUB_PAGE: 'js-page__sub',
    HIDDEN: 'hidden',
    CURRENT: 'current'
};

var KEY_CODES = exports.KEY_CODES = {
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40
};

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

var _templates = require('./templates');

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

},{"./constants":4,"./templates":7,"./utils":8}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var controls = exports.controls = function controls() {
  return "<div role=\"button\" data-page-previous></div><div role=\"button\" data-page-next></div>";
};

var nav = exports.nav = function nav() {
  return "";
};

},{}],8:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2NvbnN0YW50cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9kZWZhdWx0cy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9yZW5kZXIuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9saWIvdGVtcGxhdGVzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO1dBQUEsQUFBTyxRQUFRLG9CQUFBLEFBQU0sS0FBckIsQUFBZSxBQUFXLEFBQzdCO0FBRkQsQUFBZ0MsQ0FBQTs7QUFJaEMsSUFBRyxzQkFBSCxBQUF5QixlQUFRLEFBQU8saUJBQVAsQUFBd0Isb0JBQW9CLFlBQU0sQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDtBQUFwRyxDQUFBOzs7Ozs7Ozs7QUNOakM7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxBQUFPLEtBQUEsQUFBQyxLQUFELEFBQU0sTUFBUyxBQUMzQjtPQUFJLEtBQUssU0FBQSxBQUFTLGNBQWxCLEFBQVMsQUFBdUIsQUFDN0I7QUFDSDtPQUFHLENBQUgsQUFBSSxJQUFJLE9BQU8sUUFBQSxBQUFRLHNFQUFSLEFBQTJFLE1BQWxGLEFBRVI7O2lCQUFPLEFBQU8sT0FBTyxPQUFBLEFBQU8sNEJBQXJCO1lBQWlELEFBQ2hE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QUEsQUFBUyx1QkFBcUIsc0JBQTVDLEFBQWMsQUFBeUMsT0FBdkQsQUFBZ0UsT0FBTyxVQUFBLEFBQUMsT0FBRCxBQUFRLE1BQVI7NENBQUEsQUFBcUI7a0JBQU8sQUFDaEcsQUFDTjtzQkFBVSxHQUFBLEFBQUcsTUFBSCxBQUFTLEtBQUssS0FBQSxBQUFLLHVCQUFxQixzQkFGd0IsQUFBNEIsQUFFNUYsQUFBYyxBQUFxQztBQUZ5QyxBQUN0RztBQURHLEtBQUEsRUFKcEMsQUFBcUIsQUFHSSxBQUNXLEFBR0g7QUFKUixBQUNJLENBSlIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFBhZ2VzIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgd2luZG93LlBhZ2VzID0gUGFnZXMuaW5pdCgnLmpzLXBhZ2VzJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgLy9sZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRpZighZWwpIHJldHVybiBjb25zb2xlLndhcm4oYFBhZ2VzIG5vdCBpbml0aWFsaXNlZCwgbm8gZWxlbWVudHMgZm91bmQgZm9yIHRoZSBzZWxlY3RvciAnJHtzZWx9J2ApO1xuICAgIFxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdHJvb3Q6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCB7IENMQVNTTkFNRVMsIElOSVRJQUxfU1RBVEUsIEtFWV9DT0RFUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGluaXRpYWxTdGF0ZSwgcmVhZFN0YXRlRnJvbVVSTCwgd3JpdGVTdGF0ZVRvVVJMLCBpc0ZpcnN0SXRlbSwgaXNMYXN0SXRlbSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgcmVuZGVyUGFnZSwgcmVuZGVyU3VicGFnZSB9IGZyb20gJy4vcmVuZGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBpbml0aWFsU3RhdGUsIHRoaXMuc3RhdGVGcm9tSGFzaChpbml0aWFsU3RhdGUpKTtcblx0XHR0aGlzLnJlbmRlcigpO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhbmRsZUhhc2hDaGFuZ2UuYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdFxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRzdGF0ZUZyb21IYXNoKHByZXZpb3VzU3RhdGUgPSBpbml0aWFsU3RhdGUpe1xuXHRcdGxldCBjYW5kaWRhdGUgPSByZWFkU3RhdGVGcm9tVVJMKCk7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtcblx0XHRcdHBhZ2U6IGNhbmRpZGF0ZS5wYWdlIDwgMCA/IDAgOiBjYW5kaWRhdGUucGFnZSA+PSBwcmV2aW91c1N0YXRlLnBhZ2VzLmxlbmd0aCA/IHByZXZpb3VzU3RhdGUucGFnZXMubGVuZ3RoIC0gMSA6IGNhbmRpZGF0ZS5wYWdlLFxuXHRcdFx0c3VicGFnZTogcHJldmlvdXNTdGF0ZS5wYWdlc1tjYW5kaWRhdGUucGFnZV0uc3VicGFnZXMgPyBjYW5kaWRhdGUubmV4dFN1YnBhZ2UgPCAwID8gMCA6IGNhbmRpZGF0ZS5zdWJwYWdlID49IHByZXZpb3VzU3RhdGUucGFnZXNbY2FuZGlkYXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA/IHByZXZpb3VzU3RhdGUucGFnZXNbY2FuZGlkYXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCAtIDEgOiBjYW5kaWRhdGUuc3VicGFnZSA6IGZhbHNlLFxuXHRcdH0pO1xuXHR9LFxuXHRoYW5kbGVIYXNoQ2hhbmdlKCl7XG5cdFx0dGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGVGcm9tSGFzaCgpO1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdH0sXG5cdGhhbmRsZUtleURvd24oZSl7XG5cdFx0Y29uc3Qga2V5RGljdGlvbmFyeSA9IHtcblx0XHRcdFtLRVlfQ09ERVMuTEVGVF0oKXtcblx0XHRcdFx0aWYoaXNGaXJzdEl0ZW0odGhpcy5zdGF0ZSkpIHJldHVybjtcblx0XHRcdFx0XG5cdFx0XHRcdGlmKHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5zdWJwYWdlcy5sZW5ndGggPiAwICYmICh0aGlzLnN0YXRlLnN1YnBhZ2UgIT09IGZhbHNlICYmIHRoaXMuc3RhdGUuc3VicGFnZSA+IDApKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBzdWJwYWdlOiB0aGlzLnN0YXRlLnN1YnBhZ2UgLSAxfSk7XG5cdFx0XHRcdGVsc2UgaWYodGhpcy5zdGF0ZS5wYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA+IDAgJiYgdGhpcy5zdGF0ZS5zdWJwYWdlID09PSAwKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBzdWJwYWdlOiBmYWxzZSB9KTtcblx0XHRcdFx0ZWxzZSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBwYWdlOiB0aGlzLnN0YXRlLnBhZ2UgLSAxLCBzdWJwYWdlOiB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZSAtIDFdLnN1YnBhZ2VzLmxlbmd0aCAtIDEgfSk7XG5cdFx0XHRcdFxuXHRcdFx0XHR3cml0ZVN0YXRlVG9VUkwodGhpcy5zdGF0ZSk7XG5cdFx0XHR9LFxuXHRcdFx0W0tFWV9DT0RFUy5SSUdIVF0oKXtcblx0XHRcdFx0aWYoaXNMYXN0SXRlbSh0aGlzLnN0YXRlKSkgcmV0dXJuO1xuXG5cdFx0XHRcdGlmKHRoaXMuc3RhdGUucGFnZXNbdGhpcy5zdGF0ZS5wYWdlXS5zdWJwYWdlcy5sZW5ndGggPiAwICYmIHRoaXMuc3RhdGUuc3VicGFnZSArIDEgPCB0aGlzLnN0YXRlLnBhZ2VzW3RoaXMuc3RhdGUucGFnZV0uc3VicGFnZXMubGVuZ3RoKXtcblx0XHRcdFx0XHRpZih0aGlzLnN0YXRlLnN1YnBhZ2UgPT09IGZhbHNlKSB0aGlzLnN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgeyBzdWJwYWdlOiAwIH0pO1xuXHRcdFx0XHRcdGVsc2UgdGhpcy5zdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHsgc3VicGFnZTogdGhpcy5zdGF0ZS5zdWJwYWdlICsgMSB9KTtcblx0XHRcdFx0fSBlbHNlIHRoaXMuc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7IHBhZ2U6IHRoaXMuc3RhdGUucGFnZSArIDEsIHN1YnBhZ2U6IGZhbHNlIH0pO1xuXG5cdFx0XHRcdHdyaXRlU3RhdGVUb1VSTCh0aGlzLnN0YXRlKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdGlmKGtleURpY3Rpb25hcnlbZS5rZXlDb2RlXSkga2V5RGljdGlvbmFyeVtlLmtleUNvZGVdLmNhbGwodGhpcyk7XG5cdH0sXG5cdHJlbmRlcigpe1xuXHRcdHJlbmRlclBhZ2UodGhpcy5zdGF0ZSk7XG5cdFx0cmVuZGVyU3VicGFnZSh0aGlzLnN0YXRlKTtcblx0fSxcblxufTsiLCJleHBvcnQgY29uc3QgQ0xBU1NOQU1FUyA9IHtcbiAgICBQQUdFOiAnanMtcGFnZScsXG4gICAgU1VCX1BBR0U6ICdqcy1wYWdlX19zdWInLFxuICAgIEhJRERFTjogJ2hpZGRlbicsXG4gICAgQ1VSUkVOVDogJ2N1cnJlbnQnXG59O1xuXG5leHBvcnQgY29uc3QgS0VZX0NPREVTID0ge1xuICAgIFNQQUNFOiAzMixcbiAgICBFTlRFUjogMTMsXG4gICAgVEFCOiA5LFxuICAgIExFRlQ6IDM3LFxuICAgIFJJR0hUOiAzOSxcbiAgICBET1dOOiA0MFxufTtcblxuZXhwb3J0IGNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gICAgcGFnZTogZmFsc2UsXG4gICAgc3VicGFnZTogZmFsc2UsXG4gICAgcGFnZXM6IGZhbHNlXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcblx0Y2FsbGJhY2s6IG51bGxcbn07IiwiaW1wb3J0IHsgQ0xBU1NOQU1FUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGhpZGVOb2RlLCBzaG93Tm9kZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgY29udHJvbHMsIG5hdiB9IGZyb20gJy4vdGVtcGxhdGVzJztcblxuZXhwb3J0IGNvbnN0IHJlbmRlclBhZ2UgPSBuZXh0U3RhdGUgPT4ge1xuICAgIG5leHRTdGF0ZS5wYWdlcy5mb3JFYWNoKChwYWdlLCBpKSA9PiB7XG4gICAgICAgIGlmKG5leHRTdGF0ZS5wYWdlICE9PSBpKSB7XG4gICAgICAgICAgICBoaWRlTm9kZShwYWdlLm5vZGUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgc2hvd05vZGUobmV4dFN0YXRlLnBhZ2VzW25leHRTdGF0ZS5wYWdlXS5ub2RlKTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJTdWJwYWdlID0gbmV4dFN0YXRlID0+IHtcbiAgICByZXNldFN1YnBhZ2VzKG5leHRTdGF0ZSk7XG4gICAgaWYobmV4dFN0YXRlLnN1YnBhZ2UgPT09IGZhbHNlKSByZXR1cm47XG4gICAgXG4gICAgbmV4dFN0YXRlLnBhZ2VzW25leHRTdGF0ZS5wYWdlXS5zdWJwYWdlcy5mb3JFYWNoKChzdWJwYWdlLCBpKSA9PiB7XG4gICAgICAgIGlmKG5leHRTdGF0ZS5zdWJwYWdlID49IGkpIHtcbiAgICAgICAgICAgIHNob3dOb2RlKHN1YnBhZ2UpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5jb25zdCByZXNldFN1YnBhZ2VzID0gc3RhdGUgPT4ge1xuICAgIHN0YXRlLnBhZ2VzLmZvckVhY2goKHBhZ2UsIGkpID0+IHtcbiAgICAgICAgcGFnZS5zdWJwYWdlcy5mb3JFYWNoKHN1YnBhZ2UgPT4ge1xuICAgICAgICAgICAgaGlkZU5vZGUoc3VicGFnZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IG5hdmlnYXRpb24gPSBuZXh0U3RhdGUgPT4ge307IiwiZXhwb3J0IGNvbnN0IGNvbnRyb2xzID0gKCkgPT4gYDxkaXYgcm9sZT1cImJ1dHRvblwiIGRhdGEtcGFnZS1wcmV2aW91cz48L2Rpdj48ZGl2IHJvbGU9XCJidXR0b25cIiBkYXRhLXBhZ2UtbmV4dD48L2Rpdj5gO1xuXG5leHBvcnQgY29uc3QgbmF2ID0gKCkgPT4gYGA7IiwiaW1wb3J0IHsgQ0xBU1NOQU1FUywgSU5JVElBTF9TVEFURSB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuZXhwb3J0IGNvbnN0IHdyaXRlU3RhdGVUb1VSTCA9IHByb3BzID0+IHtcbiAgICB2YXIgdXJsID0gJy8nO1xuXG4gICAgaWYocHJvcHMucGFnZSA+PSAwKSB1cmwgKz0gKHByb3BzLnBhZ2UgKyAxKTtcbiAgICBpZiggcHJvcHMuc3VicGFnZSA+PSAwICYmIHByb3BzLnN1YnBhZ2UgIT09IGZhbHNlKSB1cmwgKz0gJy8nICsgKHByb3BzLnN1YnBhZ2UgKyAxKTtcblxuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdXJsO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlYWRTdGF0ZUZyb21VUkwgPSAoKSA9PiB7XG4gICAgbGV0IHBhcnRzID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMikuc3BsaXQoICcvJyApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFnZTogcGFyc2VJbnQocGFydHNbMF0sIDEwKSA/IHBhcnNlSW50KHBhcnRzWzBdLCAxMCkgLSAxIDogMCxcbiAgICAgICAgc3VicGFnZTogcGFyc2VJbnQocGFydHNbMV0sIDEwKSA/IHBhcnNlSW50KHBhcnRzWzFdLCAxMCkgLSAxIDogZmFsc2UsXG4gICAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBoaWRlTm9kZSA9IG5vZGUgPT4ge1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG4gICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTTkFNRVMuQ1VSUkVOVCk7XG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKENMQVNTTkFNRVMuSElEREVOKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzaG93Tm9kZSA9IG5vZGUgPT4ge1xuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoQ0xBU1NOQU1FUy5DVVJSRU5UKTtcbiAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NOQU1FUy5ISURERU4pO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTGFzdEl0ZW0gPSBzdGF0ZSA9PiBzdGF0ZS5wYWdlICsgMSA9PT0gc3RhdGUucGFnZXMubGVuZ3RoICYmIChzdGF0ZS5wYWdlc1tzdGF0ZS5wYWdlXS5zdWJwYWdlcy5sZW5ndGggPT09IDAgfHwgc3RhdGUuc3VicGFnZSArIDEgPT09IHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCk7XG5cbmV4cG9ydCBjb25zdCBpc0ZpcnN0SXRlbSA9IHN0YXRlID0+IHN0YXRlLnBhZ2UgPT09IDAgJiYgKHN0YXRlLnBhZ2VzW3N0YXRlLnBhZ2VdLnN1YnBhZ2VzLmxlbmd0aCA9PT0gMCB8fCBzdGF0ZS5zdWJwYWdlID09PSBmYWxzZSk7XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsU3RhdGUgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSU5JVElBTF9TVEFURSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZXM6IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7Q0xBU1NOQU1FUy5QQUdFfWApKS5yZWR1Y2UoKHBhZ2VzLCBwYWdlKSA9PiBbLi4ucGFnZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnBhZ2VzOiBbXS5zbGljZS5jYWxsKHBhZ2UucXVlcnlTZWxlY3RvckFsbChgLiR7Q0xBU1NOQU1FUy5TVUJfUEFHRX1gKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7Il19
