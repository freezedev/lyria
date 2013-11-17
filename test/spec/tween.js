define('spec/tween', ['lyria/tween'], function(Tween) {
  
  describe('lyria/tween', function() {
    
    var tween = new Tween();
    
    it('is a function', function() {
      expect(Tween).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(tween).to.be.a('object');
      expect(tween).to.be.an.instanceOf(Tween);
    });
    
  });
  
});
