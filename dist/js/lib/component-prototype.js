import { CLASSNAMES, INITIAL_STATE, DATA_ATTRIBUTES, TRIGGER_EVENTS, TRIGGER_KEYCODES, KEY_CODES } from './constants';
import { initialState, readStateFromURL, writeStateToURL, isFirstItem, isLastItem, partHasCallback } from './utils';
import { renderPage, renderPart, renderButtons } from './render';

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
			part: previousState.pages[candidate.page].parts ? candidate.nextPart < 0 ? 0 : candidate.part >= previousState.pages[candidate.page].parts.length ? previousState.pages[candidate.page].parts.length - 1 : candidate.part : false,
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
		renderPart(this.state);
		renderButtons(this.state);
		this.postRender();
		// renderButtons(this.state;
	},
	postRender(){
		if(this.state.pages[this.state.page].callback) this.state.pages[this.state.page].callback();
		if(partHasCallback(this.state)) this.state.pages[this.state.page].parts[this.state.part].callback();
	},
	previous(){
		if(isFirstItem(this.state)) return;
		
		if(this.state.pages[this.state.page].parts.length > 0 && (this.state.part !== false && this.state.part > 0)) this.state = Object.assign({}, this.state, { part: this.state.part - 1});
		else if(this.state.pages[this.state.page].parts.length > 0 && this.state.part === 0) this.state = Object.assign({}, this.state, { part: false });
		else this.state = Object.assign({}, this.state, { page: this.state.page - 1, part: this.state.pages[this.state.page - 1].parts.length - 1 });
		
		writeStateToURL(this.state);
	},
	next(){
		if(isLastItem(this.state)) return;

		if(this.state.pages[this.state.page].parts.length > 0 && this.state.part + 1 < this.state.pages[this.state.page].parts.length){
			if(this.state.part === false) this.state = Object.assign({}, this.state, { part: 0 });
			else this.state = Object.assign({}, this.state, { part: this.state.part + 1 });
		} else {
			this.state = Object.assign({}, this.state, { page: this.state.page + 1, part: false });
		}

		writeStateToURL(this.state);
	},
	goTo(nextState){
		this.state = Object.assign({}, this.state, {
			page: nextState.page !== null && nextState.page < this.state.pages.length ? nextState.page : this.state.page,
			part: nextState.part < this.state.pages[nextState.page].parts.length ? nextState.part : this.stateFromHash.part
		});
		writeStateToURL(this.state);
		
	}
};