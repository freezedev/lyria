define('spec/templatestring', ['lyria/template/string'], function(templateString) {
  
  describe('lyria/template/string', function() {
    
    it('is an object', function() {
      expect(templateString).to.be.a('object');
    });
    
    it('.key', function() {
      expect(templateString).to.have.property('key');
      expect(templateString.key).to.be.a('object');
    });
    
    it('.key.start', function() {
      expect(templateString.key).to.have.property('start');
      expect(templateString.key.start).to.be.a('string');
    });
    
    it('.key.end', function() {
      expect(templateString.key).to.have.property('end');
      expect(templateString.key.end).to.be.a('string');
    });
    
  });
  
});
