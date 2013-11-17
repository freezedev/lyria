define('spec/preloader', ['lyria/preloader'], function(Preloader) {
  
  describe('lyria/preloader', function() {
    
    var preloader = new Preloader();
    
    it('is a function', function() {
      expect(Preloader).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(preloader).to.be.a('object');
      expect(preloader).to.be.an.instanceOf(Preloader);
    });
    
  });
  
});
