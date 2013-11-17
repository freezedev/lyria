define('spec/math', ['lyria/math'], function(Math) {
  
  describe('lyria/math', function() {
    
    it('is an object', function() {
      expect(Math).to.be.a('object');
    });
    
    it('.random', function() {
      expect(Math).to.have.property('random');
      expect(Math.random).to.be.a('function');
    });
    
    it('.clamp', function() {
      expect(Math).to.have.property('clamp');
      expect(Math.clamp).to.be.a('function');
    });
    
    it('.fisherYates', function() {
      expect(Math).to.have.property('fisherYates');
      expect(Math.fisherYates).to.be.a('function');
    });
    
  });
  
});
