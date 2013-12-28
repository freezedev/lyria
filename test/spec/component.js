define('spec/component', ['lyria/component'], function(Component) {
  'use strict';
  
  describe('lyria/component', function() {
    
    var component = new Component();
    
    it('is a function', function() {
      expect(Component).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(component).to.be.a('object');
      expect(component).to.be.an.instanceOf(Component);
    });
    
  });
  
});
