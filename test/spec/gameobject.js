define('spec/gameobject', ['lyria/gameobject'], function(GameObject) {
  
  describe('lyria/gameobject', function() {
    
    var gameobject = new GameObject();
    
    it('is a function', function() {
      expect(GameObject).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(gameobject).to.be.a('object');
      expect(gameobject).to.be.an.instanceOf(GameObject);
    });
    
  });
  
});
