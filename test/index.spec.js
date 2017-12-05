import should from 'should';
import Pages from '../dist/storm-pages.standalone';
import 'jsdom-global/register';

// const html = `<div class="js-boilerplate test"></div>
//              <div class="js-boilerplate test-2"></div>
//              <div class="js-boilerplate-two test-3"></div>`;

// document.body.innerHTML = html;
  
// let components = Boilerplate.init('.js-boilerplate'),
//     componentsTwo = Boilerplate.init.call(Boilerplate, '.js-boilerplate-two', {
//       callback(){
//         this.node.classList.toggle('callback-test');
//       }
//     });


// describe('Initialisation', () => {

//   it('should return array of length 2', () => {

//     should(components)
//       .Array()
//       .and.have.lengthOf(2);

//   });

//   it('each array item should be an object with DOMElement, settings, init, and  handleClick properties', () => {

//     components[0].should.be.an.instanceOf(Object).and.not.empty();
//     components[0].should.have.property('node');
//     components[0].should.have.property('settings').Object();
//     components[0].should.have.property('init').Function()
//     components[0].should.have.property('handleClick').Function();

//   });


//   it('should attach the handleClick eventListener to DOMElement click event to toggle className', () => {

//     components[0].node.click();
//     Array.from(components[0].node.classList).should.containEql('clicked');
//     components[0].node.click();
//     Array.from(components[0].node.classList).should.not.containEql('clicked');

//   });


//   // it('should throw an error if no elements are found', () => {

//   //   Boilerplate.init.bind(Boilerplate, '.js-err').should.throw();

//   // })
  
//   it('should initialisation with different settings if different options are passed', () => {

//     should(componentsTwo[0].settings.callback).not.equal(components[0].settings.callback);
  
//   });

// });


// describe('Callbacks', () => {

//   it('should be passed in options', () => {

//     should(components[0].settings.callback).null();
//     should(componentsTwo[0].settings.callback).Function();

//   });

//   it('should execute in the context of the component', () => {

//     componentsTwo[0].node.click();
//     Array.from(componentsTwo[0].node.classList).should.containEql('callback-test');
//     componentsTwo[0].node.click();
//     Array.from(componentsTwo[0].node.classList).should.not.containEql('callback-test');

//   });

// });

// describe('Component API', () => {

//   it('should trigger the handleClick function toggling the className', () => {

//     components[0].handleClick();
//     Array.from(components[0].node.classList).should.containEql('clicked');
//     components[0].handleClick();
//     Array.from(components[0].node.classList).should.not.containEql('clicked');

//    });

// });