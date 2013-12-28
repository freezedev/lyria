define('spec/world', ['lyria/world'], function(World) {
  'use strict';
  
  describe('lyria/world', function() {
    
    var world = new World();
    
    it('is a function', function() {
      expect(World).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(world).to.be.a('object');
      expect(world).to.be.an.instanceOf(World);
    });
    
  });
  
});
