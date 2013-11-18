define('spec/animation', ['lyria/animation'], function(Animation) {
  
  describe('lyria/animation', function() {
    
    var animation = new Animation();
    
    it('is a function', function() {
      expect(Animation).to.be.a('function');
    });
    
    describe('constructor', function() {
      it('can be instantiated', function() {
        expect(animation).to.be.a('object');
        expect(animation).to.be.an.instanceOf(Animation);
      });
      
      it('has default values', function() {
        expect(animation).to.have.property('frame');
        expect(animation.frame).to.deep.equal({
          width: 0,
          height: 0,
          current: 0
        });
        expect(animation).to.have.property('speed');
        expect(animation.speed).to.be.a('number');
        expect(animation.speed).to.equal(1);
      });
    });
    
    
  });
  
});
