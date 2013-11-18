define('spec/achievement', ['lyria/achievement'], function(Achievement) {
  
  describe('lyria/achievement', function() {
    
    var achievement = new Achievement();
    
    it('is a function', function() {
      expect(Achievement).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(achievement).to.be.a('object');
      expect(achievement).to.be.an.instanceOf(Achievement);
    });
    
  });
  
});
