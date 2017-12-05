import { CLASSNAMES, INITIAL_STATE, DATA_ATTRIBUTES } from './constants';

const noop = () => {};

export const writeStateToURL = props => {
    var url = '/';

    if(props.page >= 0) url += (props.page + 1);
    if( props.subpage >= 0 && props.subpage !== false) url += '/' + (props.subpage + 1);

    window.location.hash = url;
};

export const readStateFromURL = () => {
    let parts = window.location.hash.slice(2).split( '/' );

    return {
        page: parseInt(parts[0], 10) ? parseInt(parts[0], 10) - 1 : 0,
        subpage: parseInt(parts[1], 10) ? parseInt(parts[1], 10) - 1 : false,
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

export const isLastItem = state => state.page + 1 === state.pages.length && (state.pages[state.page].subpages.length === 0 || state.subpage + 1 === state.pages[state.page].subpages.length);

export const isFirstItem = state => state.page === 0 && (state.pages[state.page].subpages.length === 0 || state.subpage === false);

export const initialState = Object.assign(
                                {},
                                INITIAL_STATE,
                                {
                                    pages: [].slice.call(document.querySelectorAll(`.${CLASSNAMES.PAGE}`)).reduce((pages, page) => [...pages, {
                                        node: page,
                                        callback: page.getAttribute(DATA_ATTRIBUTES.CALLBACK) ? function(){ page.getAttribute(DATA_ATTRIBUTES.CALLBACK).apply(this, page.getAttribute(DATA_ATTRIBUTES.PARAMS) ? JSON.parse(page.getAttribute(DATA_ATTRIBUTES.PARAMS)) : []) } : false,
                                        subpages: [].slice.call(page.querySelectorAll(`.${CLASSNAMES.SUB_PAGE}`)).reduce((subpages, subpage) => [...subpages, {
                                            node: subpage,
                                            callback: subpage.getAttribute(DATA_ATTRIBUTES.CALLBACK) ? function(){
                                                window[subpage.getAttribute(DATA_ATTRIBUTES.CALLBACK)].apply(this, subpage.getAttribute(DATA_ATTRIBUTES.PARAMS) ? JSON.parse(subpage.getAttribute(DATA_ATTRIBUTES.PARAMS)) : []);
                                            } : false
                                        }], [])
                                    }], []),
                                    buttons: [].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.BUTTON_NEXT}]`)).concat([].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.BUTTON_PREVIOUS}]`)))
                                }
                            );