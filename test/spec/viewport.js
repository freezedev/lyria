define('spec/viewport', ['lyria/viewport'], function(Viewport) {
  
  describe('lyria/viewport', function() {
    
    var viewport = new Viewport();
    
    it('is a function', function() {
      expect(Viewport).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(viewport).to.be.a('object');
      expect(viewport).to.be.an.instanceOf(Viewport);
    });
    
  });
  
});
