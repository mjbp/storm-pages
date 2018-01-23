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

export const resetNode = node => {
    node.classList.remove(CLASSNAMES.CURRENT);
    node.classList.remove(CLASSNAMES.PAST);
    node.classList.remove(CLASSNAMES.FUTURE);
    node.classList.remove(CLASSNAMES.PREVIOUS);
    node.classList.remove(CLASSNAMES.NEXT);
};

export const hideNode = node => {
    //node.setAttribute('hidden', 'hidden');
    node.classList.remove(CLASSNAMES.CURRENT);
    node.classList.add(CLASSNAMES.HIDDEN);
};

export const showNode = node => {
    // node.removeAttribute('hidden');
    node.classList.add(CLASSNAMES.CURRENT);
    node.classList.remove(CLASSNAMES.HIDDEN);
};

export const extractBackgrounds = state => {
    let backgroundContainer = n('div', { class: CLASSNAMES.BG_CONTAINER});
    state.pages.forEach(page => {
        backgroundContainer.appendChild(page.background || n('div', {class: CLASSNAMES.BG.replace('js_', '')}));
        //page.background && page.node.removeChild(page.background);
    });
    state.pages[0].node.parentNode.parentNode.insertBefore(backgroundContainer, state.pages[0].node.parentNode.nextElementSibling);
};

export const isLastItem = state => state.page + 1 === state.pages.length && (state.pages[state.page].parts.length === 0 || state.part + 1 === state.pages[state.page].parts.length || !state.pages[state.page].parts);

export const isFirstItem = state => state.page === 0 && (state.pages[state.page].parts.length === 0 || state.part === false);

export const partHasCallback = state => state.part !== false && state.pages[state.page].parts.length !== 0 && state.pages[state.page].parts[state.part].callback;

const n = (nodeType, attributes) => {
    let node = document.createElement(nodeType);
    for(let prop in attributes) node.setAttribute(prop, attributes[prop]);
    return node;
};

export const initialState = Object.assign(
                                {},
                                INITIAL_STATE,
                                {
                                    pages: [].slice.call(document.querySelectorAll(`.${CLASSNAMES.PAGE}`)).reduce((pages, page) => [...pages, {
                                        node: page,
                                        background: page.querySelector(`.${CLASSNAMES.BG}`) ? page.querySelector(`.${CLASSNAMES.BG}`) : false,
                                        callback: page.getAttribute(DATA_ATTRIBUTES.CALLBACK) ? function(){ window[`${page.getAttribute(DATA_ATTRIBUTES.CALLBACK)}`].call(page); }.bind(page) : false,
                                        parts: [].slice.call(page.querySelectorAll(`.${CLASSNAMES.PART}`)).length ? [].slice.call(page.querySelectorAll(`.${CLASSNAMES.PART}`)).reduce((parts, part) => [...parts, {
                                            node: part,
                                            callback: part.getAttribute(DATA_ATTRIBUTES.CALLBACK) ? function() { window[`${part.getAttribute(DATA_ATTRIBUTES.CALLBACK)}`].call(part); }.bind(part) : false,
                                        }], []) : false
                                    }], []),
                                    buttons: [].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.BUTTON_PREVIOUS}]`)).concat([].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.BUTTON_NEXT}]`)))
                                }
                            );