/**
 * @name storm-pages: 
 * @version 0.1.0: Tue, 05 Dec 2017 17:51:02 GMT
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

var initialState = Object.assign({}, INITIAL_STATE, {
				pages: [].slice.call(document.querySelectorAll('.' + CLASSNAMES.PAGE)).reduce(function (pages, page) {
								return [].concat(_toConsumableArray(pages), [{
												node: page,
												subpages: [].slice.call(page.querySelectorAll('.' + CLASSNAMES.SUB_PAGE))
								}]);
				}, [])
});

var buttons = function buttons() {
				return '<div class="' + CLASSNAMES.BUTTON + ' page__btn page__btn--previous" role="button" data-page-action="previous">Previous</div>\n                            <div class="' + CLASSNAMES.BUTTON + ' page__btn page__btn--next" role="button" data-page-action="next">Next</div>';
};

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
												showNode(subpage);
								}
				});
};

var resetSubpages = function resetSubpages(state) {
				state.pages.forEach(function (page, i) {
								page.subpages.forEach(function (subpage) {
												hideNode(subpage);
								});
				});
};

var componentPrototype = {
				init: function init() {
								this.state = Object.assign({}, initialState, this.stateFromHash(initialState));
								this.settings.buttons && this.initButtons();
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

								//only have buttons in DOM??

								var buttonContainer = this.root.appendChild(document.createElement('div'));
								buttonContainer.classList.add(CLASSNAMES.BUTTON_CONTAINER);
								buttonContainer.innerHTML = buttons();

								// this.state = Object.assign({}, this.state, {
								// 	previousButton: this.state.root.,querySelector('[data-page-action=previous]'),
								// 	nextButton: this.state.root.querySelector('[data-page-action=next]')
								// });

								this.settings.buttons && TRIGGER_EVENTS.forEach(function (ev) {
												[].slice.call(document.querySelectorAll('.' + CLASSNAMES.BUTTON)).forEach(function (btn) {
																btn.addEventListener(ev, function (e) {
																				if (e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.KeyCode)) return;
																				_this[btn.getAttribute('data-page-action')]();
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
								// renderButtons(this.state;
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
