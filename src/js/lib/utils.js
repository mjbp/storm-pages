import { CLASSNAMES, INITIAL_STATE, DATA_ATTRIBUTES } from './constants';

const noop = () => {};

export const writeStateToURL = props => {
    var url = '/';

    if(props.page >= 0) url += (props.page + 1);
    if( props.part >= 0 && props.part !== false) url += '/' + (props.part + 1);

    window.location.hash = url;
};

export const readStateFromURL = () => {
    let parts = window.location.hash.slice(2).split( '/' );

    return {
        page: parseInt(parts[0], 10) ? parseInt(parts[0], 10) - 1 : 0,
        part: parseInt(parts[1], 10) ? parseInt(parts[1], 10) - 1 : false,
    };
};

export const hideNode = node => {
    node.setAttribute('hidden', 'hidden');
    node.classList.remove(CLASSNAMES.CURRENT);
    node.classList.add(CLASSNAMES.HIDDEN);
};

export const showNode = node => {
    node.removeAttribute('hidden');
    node.classList.add(CLASSNAMES.CURRENT);
    node.classList.remove(CLASSNAMES.HIDDEN);
};

export const isLastItem = state => state.page + 1 === state.pages.length && (state.pages[state.page].parts.length === 0 || state.part + 1 === state.pages[state.page].parts.length);

export const isFirstItem = state => state.page === 0 && (state.pages[state.page].parts.length === 0 || state.part === false);

export const partHasCallback = state => state.part !== false && state.pages[state.page].parts.length !== 0 && state.pages[state.page].parts[state.part].callback;

export const initialState = Object.assign(
                                {},
                                INITIAL_STATE,
                                {
                                    pages: [].slice.call(document.querySelectorAll(`.${CLASSNAMES.PAGE}`)).reduce((pages, page) => [...pages, {
                                        node: page,
                                        callback: page.getAttribute(DATA_ATTRIBUTES.CALLBACK) ? function(){ window[`${page.getAttribute(DATA_ATTRIBUTES.CALLBACK)}`].call(page); }.bind(page) : false,
                                        parts: [].slice.call(page.querySelectorAll(`.${CLASSNAMES.PART}`)).reduce((parts, part) => [...parts, {
                                            node: part,
                                            callback: part.getAttribute(DATA_ATTRIBUTES.CALLBACK) ? function() { window[`${part.getAttribute(DATA_ATTRIBUTES.CALLBACK)}`].call(part); }.bind(part) : false,
                                        }], [])
                                    }], []),
                                    buttons: [].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.BUTTON_PREVIOUS}]`)).concat([].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.BUTTON_NEXT}]`)))
                                }
                            );