define('spec/prefab', ['lyria/prefab'], function(Prefab) {
  'use strict';
  
  describe('lyria/prefab', function() {
    
    var prefab = new Prefab('prefab');
    
    it('is a function', function() {
      expect(Prefab).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(prefab).to.be.a('object');
    });
    
  });
  
});
