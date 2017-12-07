export const CLASSNAMES = {
    PAGE: 'js-page',
    PART: 'js-page__part',
    HIDDEN: 'hidden',
    CURRENT: 'current',
    PAST: 'past',
    FUTURE: 'future',
    PREVIOUS: 'previous',
    NEXT: 'next',
    BUTTON: 'js-page__btn',
    BUTTON_CONTAINER: 'page__btn-container'
};

export const DATA_ATTRIBUTES = {
    BUTTON_NEXT: 'data-page-next',
    BUTTON_PREVIOUS: 'data-page-previous',
    CALLBACK: 'data-page-callback'
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
    part: false,
    pages: false
};