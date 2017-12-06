/**
 * @name storm-pages: 
 * @version 0.1.0: Wed, 06 Dec 2017 21:49:25 GMT
 * @author stormid
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.gulpWrapUmd = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
				value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaults = {
				buttons: true,
				navigation: false,
				callback: null
};

var CLASSNAMES = {
				PAGE: 'js-page',
				SUB_PAGE: 'js-page__sub',
				HIDDEN: 'hidden',
				CURRENT: 'current',
				BUTTON: 'js-page__btn',
				BUTTON_CONTAINER: 'page__btn-container'
};

var DATA_ATTRIBUTES = {
				BUTTON_NEXT: 'data-page-next',
				BUTTON_PREVIOUS: 'data-page-previous',
				CALLBACK: 'data-page-callback',
				PARAMS: 'data-page-params'
};

var KEY_CODES = {
				SPACE: 32,
				ENTER: 13,
				TAB: 9,
				LEFT: 37,
				RIGHT: 39,
				DOWN: 40
};

var TRIGGER_EVENTS = ['click', 'keydown'];

var TRIGGER_KEYCODES = [13, 32];

var INITIAL_STATE = {
				page: false,
				subpage: false,
				pages: false
};

var writeStateToURL = function writeStateToURL(props) {
				var url = '/';

				if (props.page >= 0) url += props.page + 1;
				if (props.subpage >= 0 && props.subpage !== false) url += '/' + (props.subpage + 1);

				window.location.hash = url;
};

var readStateFromURL = function readStateFromURL() {
				var parts = window.location.hash.slice(2).split('/');

				return {
								page: parseInt(parts[0], 10) ? parseInt(parts[0], 10) - 1 : 0,
								subpage: parseInt(parts[1], 10) ? parseInt(parts[1], 10) - 1 : false
				};
};

var hideNode = function hideNode(node) {
				node.setAttribute('hidden', 'hidden');
				node.classList.remove(CLASSNAMES.CURRENT);
				node.classList.add(CLASSNAMES.HIDDEN);
};

var showNode = function showNode(node) {
				node.removeAttribute('hidden');
				node.classList.add(CLASSNAMES.CURRENT);
				node.classList.remove(CLASSNAMES.HIDDEN);
};

var isLastItem = function isLastItem(state) {
				return state.page + 1 === state.pages.length && (state.pages[state.page].subpages.length === 0 || state.subpage + 1 === state.pages[state.page].subpages.length);
};

var isFirstItem = function isFirstItem(state) {
				return state.page === 0 && (state.pages[state.page].subpages.length === 0 || state.subpage === false);
};

var subpageHasCallback = function subpageHasCallback(state) {
				return state.subpage !== false && state.pages[state.page].subpages[state.subpage].callback;
};

var initialState = Object.assign({}, INITIAL_STATE, {
				pages: [].slice.call(document.querySelectorAll('.' + CLASSNAMES.PAGE)).reduce(function (pages, page) {
								return [].concat(_toConsumableArray(pages), [{
												node: page,
												callback: page.getAttribute(DATA_ATTRIBUTES.CALLBACK) ? function () {
																page.getAttribute(DATA_ATTRIBUTES.CALLBACK).apply(this, page.getAttribute(DATA_ATTRIBUTES.PARAMS) ? JSON.parse(page.getAttribute(DATA_ATTRIBUTES.PARAMS)) : []);
												} : false,
												subpages: [].slice.call(page.querySelectorAll('.' + CLASSNAMES.SUB_PAGE)).reduce(function (subpages, subpage) {
																return [].concat(_toConsumableArray(subpages), [{
																				node: subpage,
																				callback: subpage.getAttribute(DATA_ATTRIBUTES.CALLBACK) ? function () {
																								window['' + subpage.getAttribute(DATA_ATTRIBUTES.CALLBACK)].apply(this, subpage.getAttribute(DATA_ATTRIBUTES.PARAMS) ? JSON.parse(subpage.getAttribute(DATA_ATTRIBUTES.PARAMS)) : []);
																				}.bind(subpage) : false
																}]);
												}, [])
								}]);
				}, []),
				buttons: [].slice.call(document.querySelectorAll('[' + DATA_ATTRIBUTES.BUTTON_NEXT + ']')).concat([].slice.call(document.querySelectorAll('[' + DATA_ATTRIBUTES.BUTTON_PREVIOUS + ']')))
});

var renderPage = function renderPage(nextState) {
				nextState.pages.forEach(function (page, i) {
								if (nextState.page !== i) {
												hideNode(page.node);
								}
				});
				showNode(nextState.pages[nextState.page].node);
};

var renderSubpage = function renderSubpage(nextState) {
				resetSubpages(nextState);
				if (nextState.subpage === false) return;

				nextState.pages[nextState.page].subpages.forEach(function (subpage, i) {
								if (nextState.subpage >= i) {
												showNode(subpage.node);
								}
				});
};

var resetSubpages = function resetSubpages(state) {
				state.pages.forEach(function (page, i) {
								page.subpages.forEach(function (subpage) {
												hideNode(subpage.node);
								});
				});
};

var renderButtons = function renderButtons(state) {
				state.buttons.forEach(function (btn) {
								//disable/enable
				});
};

var componentPrototype = {
				init: function init() {
								this.state = Object.assign({}, initialState, this.stateFromHash(initialState));
								this.state.buttons.length && this.initButtons();
								this.render();

								window.addEventListener('hashchange', this.handleHashChange.bind(this), false);
								document.addEventListener('keydown', this.handleKeyDown.bind(this), false);

								return this;
				},
				stateFromHash: function stateFromHash() {
								var previousState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;

								var candidate = readStateFromURL();
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

								TRIGGER_EVENTS.forEach(function (ev) {
												_this.state.buttons.forEach(function (btn) {
																btn.addEventListener(ev, function (e) {
																				if (e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.KeyCode)) return;
																				_this[btn.hasAttribute(DATA_ATTRIBUTES.BUTTON_NEXT) ? 'next' : 'previous']();
																});
												});
								});
				},
				handleKeyDown: function handleKeyDown(e) {
								var _keyDictionary;

								var keyDictionary = (_keyDictionary = {}, _defineProperty(_keyDictionary, KEY_CODES.LEFT, function () {
												this.previous();
								}), _defineProperty(_keyDictionary, KEY_CODES.RIGHT, function () {
												this.next();
								}), _keyDictionary);
								if (keyDictionary[e.keyCode]) keyDictionary[e.keyCode].call(this);
				},
				render: function render() {
								renderPage(this.state);
								renderSubpage(this.state);
								renderButtons(this.state);
								this.postRender();
								// renderButtons(this.state;
				},
				postRender: function postRender() {
								if (subpageHasCallback(this.state)) this.state.pages[this.state.page].subpages[this.state.subpage].callback();

								this.state.pages[this.state.page].callback && this.state.pages[this.state.page].callback();
				},
				previous: function previous() {
								if (isFirstItem(this.state)) return;

								if (this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage !== false && this.state.subpage > 0) this.state = Object.assign({}, this.state, { subpage: this.state.subpage - 1 });else if (this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage === 0) this.state = Object.assign({}, this.state, { subpage: false });else this.state = Object.assign({}, this.state, { page: this.state.page - 1, subpage: this.state.pages[this.state.page - 1].subpages.length - 1 });

								writeStateToURL(this.state);
				},
				next: function next() {
								if (isLastItem(this.state)) return;

								if (this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage + 1 < this.state.pages[this.state.page].subpages.length) {
												if (this.state.subpage === false) this.state = Object.assign({}, this.state, { subpage: 0 });else this.state = Object.assign({}, this.state, { subpage: this.state.subpage + 1 });
								} else this.state = Object.assign({}, this.state, { page: this.state.page + 1, subpage: false });

								writeStateToURL(this.state);
				},
				goTo: function goTo(nextState) {
								this.state = Object.assign({}, this.state, {
												page: nextState.page !== null && nextState.page < this.state.pages.length ? nextState.page : this.state.page,
												subpage: nextState.subpage < this.state.pages[nextState.page].subpages.length ? nextState.subpage : this.stateFromHash.subpage
								});
								writeStateToURL(this.state);

								/*
        {
        	page: X,
        	subpage: X || false
        }
        */
				}
};

var init = function init(sel, opts) {
				var el = document.querySelector(sel);
				//let els = Array.from(document.querySelectorAll(sel));
				if (!el) return console.warn('Pages not initialised, no elements found for the selector \'' + sel + '\'');

				return Object.assign(Object.create(componentPrototype), {
								root: el,
								settings: Object.assign({}, defaults, opts)
				}).init();
};

var index = { init: init };

exports.default = index;;
}));
