define('spec/scene', ['lyria/scene'], function(Scene) {
  'use strict';
  
  describe('lyria/scene', function() {
    
    var scene = new Scene();
    
    it('is a function', function() {
      expect(Scene).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(scene).to.be.a('object');
      expect(scene).to.be.an.instanceOf(Scene);
    });
    
  });
  
});
