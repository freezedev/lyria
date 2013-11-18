define('spec/animation', ['lyria/animation'], function(Animation) {
  
  describe('lyria/animation', function() {
    
    var animation = new Animation();
    
    it('is a function', function() {
      expect(Animation).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(animation).to.be.a('object');
      expect(animation).to.be.an.instanceOf(Animation);
    });
    
  });
  
});
