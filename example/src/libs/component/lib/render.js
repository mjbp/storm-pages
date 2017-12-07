import { CLASSNAMES } from './constants';
import { resetNode, hideNode, showNode, isFirstItem, isLastItem } from './utils';

export const renderPage = nextState => {
    nextState.pages.forEach((page, i) => {
        // if(nextState.page !== i) {
        //     hideNode(page.node);
        // }
        resetNode(page.node);
        if(nextState.page > i){
            page.node.classList.add(CLASSNAMES.PAST);
            if(nextState.page - 1 === i) page.node.classList.add(CLASSNAMES.PREVIOUS);
        } 
        if(nextState.page === i) page.node.classList.add(CLASSNAMES.CURRENT);
        if(nextState.page < i) {
            page.node.classList.add(CLASSNAMES.FUTURE);
            if(nextState.page + 1 === i)  page.node.classList.add(CLASSNAMES.NEXT);
        }
    });
    // showNode(nextState.pages[nextState.page].node);
};

export const renderPart = nextState => {
    resetParts(nextState);
    if(nextState.part === false) return;
    
    nextState.pages[nextState.page].parts.forEach((part, i) => {
        if(nextState.part >= i) {
            showNode(part.node);
        }
    });
};

const resetParts = state => {
    state.pages.forEach((page, i) => {
        page.parts.forEach(part => {
            hideNode(part.node);
        });
    });
};

export const renderButtons = state => {
    if(state.buttons.length === 0) return;
    state.buttons.forEach(btn => {
        if(isFirstItem(state)) state.buttons[0].setAttribute('disabled', 'disabled');
        else if(state.buttons[0].hasAttribute('disabled')) state.buttons[0].removeAttribute('disabled');

        if(isLastItem(state)) state.buttons[1].setAttribute('disabled', 'disabled');
        else if(state.buttons[1].hasAttribute('disabled')) state.buttons[1].removeAttribute('disabled');
    });
};

export const navigation = nextState => {};