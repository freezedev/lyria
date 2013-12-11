define('spec/audiomanager', ['lyria/audio/manager'], function(AudioManager) {
  
  describe('lyria/audio/manager', function() {
    
    it('is an object', function() {
      expect(AudioManager).to.be.a('function');
    });
    
    describe('constructor', function() {
      it('can be instantiated', function() {
        var audioManager = new AudioManager({});

        expect(audioManager).to.be.a('object');
        expect(audioManager).to.be.an.instanceOf(AudioManager);
      });
    });
  });
  
});
