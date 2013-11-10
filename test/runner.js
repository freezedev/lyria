mocha.setup('bdd');
window.expect = chai.expect;

require(['spec/' + spec], function() {
  mocha.run();
});