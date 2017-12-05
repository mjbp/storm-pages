export const CLASSNAMES = {
    PAGE: 'js-page',
    SUB_PAGE: 'js-page__sub',
    HIDDEN: 'hidden',
    CURRENT: 'current',
    BUTTON: 'js-page__btn',
    BUTTON_CONTAINER: 'page__btn-container'
};

export const DATA_ATTRIBUTES = {
    BUTTON_NEXT: 'data-page-next',
    BUTTON_PREVIOUS: 'data-page-previous',
    CALLBACK: 'data-page-callback',
    PARAMS: 'data-page-params'
};

export const KEY_CODES = {
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40
};

export const TRIGGER_EVENTS = ['click', 'keydown'];

export const TRIGGER_KEYCODES = [13, 32];

export const INITIAL_STATE = {
    page: false,
    subpage: false,
    pages: false
};