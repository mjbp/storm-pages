import { CLASSNAMES, INITIAL_STATE, TRIGGER_EVENTS, TRIGGER_KEYCODES, KEY_CODES } from './constants';
import { initialState, readStateFromURL, writeStateToURL, isFirstItem, isLastItem } from './utils';
import { buttons } from './templates';
import { renderPage, renderSubpage } from './render';

export default {
	init() {
		this.state = Object.assign({}, initialState, this.stateFromHash(initialState));
		this.settings.buttons && this.initButtons();
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
		//only have buttons in DOM??
		
		let buttonContainer = this.root.appendChild(document.createElement('div'));
		buttonContainer.classList.add(CLASSNAMES.BUTTON_CONTAINER);
		buttonContainer.innerHTML = buttons();

		// this.state = Object.assign({}, this.state, {
		// 	previousButton: this.state.root.,querySelector('[data-page-action=previous]'),
		// 	nextButton: this.state.root.querySelector('[data-page-action=next]')
		// });

		this.settings.buttons && TRIGGER_EVENTS.forEach(ev => {
			[].slice.call(document.querySelectorAll(`.${CLASSNAMES.BUTTON}`)).forEach(btn => {
				btn.addEventListener(ev, e => {
					if(e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.KeyCode)) return;
					this[btn.getAttribute('data-page-action')]();
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
		// renderButtons(this.state;
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