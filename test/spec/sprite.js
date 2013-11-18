define('spec/sprite', ['lyria/sprite'], function(Sprite) {
  
  describe('lyria/sprite', function() {
    
    var sprite = new Sprite();
    
    it('is a function', function() {
      expect(Sprite).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(sprite).to.be.a('object');
      expect(sprite).to.be.an.instanceOf(Sprite);
    });
    
  });
  
});
