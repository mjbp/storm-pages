import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (sel, opts) => {
	let el = document.querySelector(sel);
    //let els = Array.from(document.querySelectorAll(sel));
	if(!el) return console.warn(`Pages not initialised, no elements found for the selector '${sel}'`);
    
	return Object.assign(Object.create(componentPrototype), {
			root: el,
			settings: Object.assign({}, defaults, opts)
		}).init();
};

export default { init };