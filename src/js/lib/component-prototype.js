import { CLASSNAMES, INITIAL_STATE, DATA_ATTRIBUTES, TRIGGER_EVENTS, TRIGGER_KEYCODES, KEY_CODES } from './constants';
import { initialState, readStateFromURL, writeStateToURL, isFirstItem, isLastItem } from './utils';
import { renderPage, renderSubpage, renderButtons } from './render';

export default {
	init() {
		this.state = Object.assign({}, initialState, this.stateFromHash(initialState));
		this.state.buttons.length && this.initButtons();
		this.render();

		window.addEventListener('hashchange', this.handleHashChange.bind(this), false);
		document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
		
		return this;
	},
	stateFromHash(previousState = initialState){
		let candidate = readStateFromURL();
		return Object.assign({}, this.state, {
			page: candidate.page < 0 ? 0 : candidate.page >= previousState.pages.length ? previousState.pages.length - 1 : candidate.page,
			subpage: previousState.pages[candidate.page].subpages ? candidate.nextSubpage < 0 ? 0 : candidate.subpage >= previousState.pages[candidate.page].subpages.length ? previousState.pages[candidate.page].subpages.length - 1 : candidate.subpage : false,
		});
	},
	handleHashChange(){
		this.state = this.stateFromHash();
		this.render();
	},
	initButtons(){
		TRIGGER_EVENTS.forEach(ev => {
			this.state.buttons.forEach(btn => {
				btn.addEventListener(ev, e => {
					if(e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.KeyCode)) return;
					this[btn.hasAttribute(DATA_ATTRIBUTES.BUTTON_NEXT) ? 'next' : 'previous']();
				});
			});
		});
	},
	handleKeyDown(e){
		const keyDictionary = {
			[KEY_CODES.LEFT](){ this.previous(); },
			[KEY_CODES.RIGHT](){ this.next(); }
		};
		if(keyDictionary[e.keyCode]) keyDictionary[e.keyCode].call(this);
	},
	render(){
		renderPage(this.state);
		renderSubpage(this.state);
		renderButtons(this.state);
		this.postRender();
		// renderButtons(this.state;
	},
	postRender(){
		(this.state.subpage !== false && this.state.pages[this.state.page].subpages[this.state.subpage].callback) && this.state.pages[this.state.page].subpages[this.state.subpage].callback();

		this.state.pages[this.state.page].callback && this.state.pages[this.state.page].callback();
	},
	previous(){
		if(isFirstItem(this.state)) return;
		
		if(this.state.pages[this.state.page].subpages.length > 0 && (this.state.subpage !== false && this.state.subpage > 0)) this.state = Object.assign({}, this.state, { subpage: this.state.subpage - 1});
		else if(this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage === 0) this.state = Object.assign({}, this.state, { subpage: false });
		else this.state = Object.assign({}, this.state, { page: this.state.page - 1, subpage: this.state.pages[this.state.page - 1].subpages.length - 1 });
		
		writeStateToURL(this.state);
	},
	next(){
		if(isLastItem(this.state)) return;

		if(this.state.pages[this.state.page].subpages.length > 0 && this.state.subpage + 1 < this.state.pages[this.state.page].subpages.length){
			if(this.state.subpage === false) this.state = Object.assign({}, this.state, { subpage: 0 });
			else this.state = Object.assign({}, this.state, { subpage: this.state.subpage + 1 });
		} else this.state = Object.assign({}, this.state, { page: this.state.page + 1, subpage: false });

		writeStateToURL(this.state);
	}
};