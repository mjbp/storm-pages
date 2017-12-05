import Pages from './libs/component';

const onDOMContentLoadedTasks = [() => {
    window.testFn = (test) => {
        console.log('here');
        console.log(test);
    };
    window.Pages = Pages.init('.js-pages');
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });