define('spec/prefab', ['lyria/prefab'], function(Prefab) {
  
  describe('lyria/prefab', function() {
    
    var prefab = new Prefab();
    
    it('is a function', function() {
      expect(Prefab).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(prefab).to.be.a('object');
    });
    
  });
  
});