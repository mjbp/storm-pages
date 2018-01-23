/**
 * @name storm-pages: 
 * @version 0.1.0: Tue, 23 Jan 2018 12:03:35 GMT
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

var DATA_ATTRIBUTES = {
    BUTTON_NEXT: 'data-page-next',
    BUTTON_PREVIOUS: 'data-page-previous',
    CALLBACK: 'data-page-callback'
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
    part: false,
    pages: false
};

var writeStateToURL = function writeStateToURL(props) {
    var url = '/';

    if (props.page >= 0) url += props.page + 1;
    if (props.part >= 0 && props.part !== false) url += '/' + (props.part + 1);

    window.location.hash = url;
};

var readStateFromURL = function readStateFromURL() {
    var parts = window.location.hash.slice(2).split('/');

    return {
        page: parseInt(parts[0], 10) ? parseInt(parts[0], 10) - 1 : 0,
        part: parseInt(parts[1], 10) ? parseInt(parts[1], 10) - 1 : false
    };
};

var resetNode = function resetNode(node) {
    node.classList.remove(CLASSNAMES.CURRENT);
    node.classList.remove(CLASSNAMES.PAST);
    node.classList.remove(CLASSNAMES.FUTURE);
    node.classList.remove(CLASSNAMES.PREVIOUS);
    node.classList.remove(CLASSNAMES.NEXT);
};

var hideNode = function hideNode(node) {
    //node.setAttribute('hidden', 'hidden');
    node.classList.remove(CLASSNAMES.CURRENT);
    node.classList.add(CLASSNAMES.HIDDEN);
};

var extractBackgrounds = function extractBackgrounds(state) {
    var backgroundContainer = n('div', { class: CLASSNAMES.BG_CONTAINER });
    state.pages.forEach(function (page) {
        backgroundContainer.appendChild(page.background || n('div', { class: CLASSNAMES.BG.replace('js_', '') }));
        //page.background && page.node.removeChild(page.background);
    });
    state.pages[0].node.parentNode.parentNode.insertBefore(backgroundContainer, state.pages[0].node.parentNode.nextElementSibling);
};

var isLastItem = function isLastItem(state) {
    return state.page + 1 === state.pages.length && (state.pages[state.page].parts.length === 0 || state.part + 1 === state.pages[state.page].parts.length || !state.pages[state.page].parts);
};

var isFirstItem = function isFirstItem(state) {
    return state.page === 0 && (state.pages[state.page].parts.length === 0 || state.part === false);
};

var partHasCallback = function partHasCallback(state) {
    return state.part !== false && state.pages[state.page].parts.length !== 0 && state.pages[state.page].parts[state.part].callback;
};

var n = function n(nodeType, attributes) {
    var node = document.createElement(nodeType);
    for (var prop in attributes) {
        node.setAttribute(prop, attributes[prop]);
    }return node;
};

var initialState = Object.assign({}, INITIAL_STATE, {
    pages: [].slice.call(document.querySelectorAll('.' + CLASSNAMES.PAGE)).reduce(function (pages, page) {
        return [].concat(_toConsumableArray(pages), [{
            node: page,
            background: page.querySelector('.' + CLASSNAMES.BG) ? page.querySelector('.' + CLASSNAMES.BG) : false,
            callback: page.getAttribute(DATA_ATTRIBUTES.CALLBACK) ? function () {
                window['' + page.getAttribute(DATA_ATTRIBUTES.CALLBACK)].call(page);
            }.bind(page) : false,
            parts: [].slice.call(page.querySelectorAll('.' + CLASSNAMES.PART)).length ? [].slice.call(page.querySelectorAll('.' + CLASSNAMES.PART)).reduce(function (parts, part) {
                return [].concat(_toConsumableArray(parts), [{
                    node: part,
                    callback: part.getAttribute(DATA_ATTRIBUTES.CALLBACK) ? function () {
                        window['' + part.getAttribute(DATA_ATTRIBUTES.CALLBACK)].call(part);
                    }.bind(part) : false
                }]);
            }, []) : false
        }]);
    }, []),
    buttons: [].slice.call(document.querySelectorAll('[' + DATA_ATTRIBUTES.BUTTON_PREVIOUS + ']')).concat([].slice.call(document.querySelectorAll('[' + DATA_ATTRIBUTES.BUTTON_NEXT + ']')))
});

var renderPage = function renderPage(nextState) {
    nextState.pages.forEach(function (page, i) {
        resetNode(page.node);
        renderNode(page.node, nextState.page, i);
        resetNode(page.background);
        renderNode(page.background, nextState.page, i);
    });
};

var renderNode = function renderNode(item, nextSubState, i) {
    if (nextSubState > i) {
        item.classList.add(CLASSNAMES.PAST);
        if (nextSubState - 1 === i) item.classList.add(CLASSNAMES.PREVIOUS);
    }
    if (nextSubState === i) item.classList.add(CLASSNAMES.CURRENT);
    if (nextSubState < i) {
        item.classList.add(CLASSNAMES.FUTURE);
        if (nextSubState + 1 === i) item.classList.add(CLASSNAMES.NEXT);
    }
};

var renderPart = function renderPart(nextState) {
    resetParts(nextState);
    if (nextState.part === false) return;
    nextState.pages[nextState.page].parts.forEach(function (part, i) {
        renderNode(part.node, nextState.part, i);
    });
};

var resetParts = function resetParts(state) {
    state.pages.forEach(function (page, i) {
        page.parts && page.parts.forEach(function (part) {
            resetNode(part.node);
            hideNode(part.node);
        });
    });
};

var renderButtons = function renderButtons(state) {
    if (state.buttons.length === 0) return;
    state.buttons.forEach(function (btn) {
        if (isFirstItem(state)) state.buttons[0].setAttribute('disabled', 'disabled');else if (state.buttons[0].hasAttribute('disabled')) state.buttons[0].removeAttribute('disabled');

        if (isLastItem(state)) state.buttons[1].setAttribute('disabled', 'disabled');else if (state.buttons[1].hasAttribute('disabled')) state.buttons[1].removeAttribute('disabled');
    });
};

var componentPrototype = {
    init: function init() {
        this.state = Object.assign({}, initialState, this.stateFromHash(initialState));
        this.state.buttons.length && this.initButtons();
        extractBackgrounds(this.state);
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
            part: previousState.pages[candidate.page].parts ? candidate.nextPart < 0 ? 0 : candidate.part >= previousState.pages[candidate.page].parts.length ? previousState.pages[candidate.page].parts.length - 1 : candidate.part : false
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
        renderPart(this.state);
        renderButtons(this.state);
        this.postRender();
        // renderButtons(this.state;
    },
    postRender: function postRender() {
        if (this.state.pages[this.state.page].callback) this.state.pages[this.state.page].callback();
        if (partHasCallback(this.state)) this.state.pages[this.state.page].parts[this.state.part].callback();
    },
    previous: function previous() {
        if (isFirstItem(this.state)) return;

        if (this.state.pages[this.state.page].parts.length > 0 && this.state.part !== false && this.state.part > 0) this.state = Object.assign({}, this.state, { part: this.state.part - 1 });else if (this.state.pages[this.state.page].parts.length > 0 && this.state.part === 0) this.state = Object.assign({}, this.state, { part: false });else this.state = Object.assign({}, this.state, { page: this.state.page - 1, part: this.state.pages[this.state.page - 1].parts.length - 1 });

        writeStateToURL(this.state);
    },
    next: function next() {
        if (isLastItem(this.state)) return;

        if (this.state.pages[this.state.page].parts.length > 0 && this.state.part + 1 < this.state.pages[this.state.page].parts.length) {
            if (this.state.part === false) this.state = Object.assign({}, this.state, { part: 0 });else this.state = Object.assign({}, this.state, { part: this.state.part + 1 });
        } else {
            this.state = Object.assign({}, this.state, { page: this.state.page + 1, part: false });
        }

        writeStateToURL(this.state);
    },
    goTo: function goTo(nextState) {
        this.state = Object.assign({}, this.state, {
            page: nextState.page !== null && nextState.page < this.state.pages.length ? nextState.page : this.state.page,
            part: nextState.part < this.state.pages[nextState.page].parts.length ? nextState.part : this.stateFromHash.part
        });
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
