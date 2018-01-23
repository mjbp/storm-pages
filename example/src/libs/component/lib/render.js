import { CLASSNAMES } from './constants';
import { resetNode, hideNode, showNode, isFirstItem, isLastItem } from './utils';

export const renderPage = nextState => {
    nextState.pages.forEach((page, i) => {
        resetNode(page.node);
        renderNode(page.node, nextState.page, i);
        resetNode(page.background);
        renderNode(page.background, nextState.page, i);
    });
};

const renderNode = (item, nextSubState, i) => {
    if(nextSubState > i){
        item.classList.add(CLASSNAMES.PAST);
        if(nextSubState - 1 === i) item.classList.add(CLASSNAMES.PREVIOUS);
    } 
    if(nextSubState === i) item.classList.add(CLASSNAMES.CURRENT);
    if(nextSubState < i) {
        item.classList.add(CLASSNAMES.FUTURE);
        if(nextSubState + 1 === i) item.classList.add(CLASSNAMES.NEXT);
    }
};

export const renderPart = nextState => {
    resetParts(nextState);
    if(nextState.part  === false) return;
    nextState.pages[nextState.page].parts.forEach((part, i) => {
        renderNode(part.node, nextState.part, i);
    });
};

const resetParts = state => {
    state.pages.forEach((page, i) => {
        page.parts && page.parts.forEach(part => {
            resetNode(part.node);
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