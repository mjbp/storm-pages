/**
 * @name storm-pages: 
 * @version 0.1.0: Tue, 23 Jan 2018 12:03:35 GMT
 * @author stormid
 * @license MIT
 */
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