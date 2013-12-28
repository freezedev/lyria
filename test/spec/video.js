define('spec/video', ['lyria/video'], function(Video) {
  'use strict';
  
  describe('lyria/video', function() {
    
    var video = new Video();
    
    it('is a function', function() {
      expect(Video).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(video).to.be.a('object');
      expect(video).to.be.an.instanceOf(Video);
    });
    
  });
  
});
