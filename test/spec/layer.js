define('spec/layer', ['lyria/layer'], function(Layer) {
  'use strict';
  
  describe('lyria/layer', function() {
    
    var layer = new Layer();
    
    it('is a function', function() {
      expect(Layer).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(layer).to.be.a('object');
      expect(layer).to.be.an.instanceOf(Layer);
    });
    
  });
  
});
