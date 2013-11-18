define('spec/serialize', ['lyria/serialize', 'jquery'], function(serialize, $) {
  
  describe('serialize', function() {
    
    it('is a function', function() {
      expect(serialize).to.be.a('function');
    });
    
    it('should be undefined when calling without parameters', function() {
      expect(serialize()).to.equal(undefined);      
    });
    
    it('should return the primitive input parameter as a string', function() {
      expect(serialize('test')).to.equal("'test'");
      expect(serialize(0)).to.equal("0");
      expect(serialize(true)).to.equal("true");
      expect(serialize(false)).to.equal("false");
    });
    
    it('should be undefined when input is a jquery object', function() {
      expect(serialize($('body'))).to.equal(undefined);
    });
    
  });
  
});
