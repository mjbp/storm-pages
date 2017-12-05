import Pages from './libs/component';

const onDOMContentLoadedTasks = [() => {
    window.testFn = function() {
        console.log(JSON.parse(this.getAttribute('data-page-params')).join(' '));
    };
    window.Pages = Pages.init('.js-pages');
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });