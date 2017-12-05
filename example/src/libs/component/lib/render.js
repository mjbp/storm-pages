import { CLASSNAMES } from './constants';
import { hideNode, showNode } from './utils';
import { controls, nav } from './templates';

export const renderPage = nextState => {
    nextState.pages.forEach((page, i) => {
        if(nextState.page !== i) {
            hideNode(page.node);
        }
    });
    showNode(nextState.pages[nextState.page].node);
};

export const renderSubpage = nextState => {
    resetSubpages(nextState);
    if(nextState.subpage === false) return;
    
    nextState.pages[nextState.page].subpages.forEach((subpage, i) => {
        if(nextState.subpage >= i) {
            showNode(subpage);
        }
    });
};

const resetSubpages = state => {
    state.pages.forEach((page, i) => {
        page.subpages.forEach(subpage => {
            hideNode(subpage);
        });
    });
};

export const navigation = nextState => {};