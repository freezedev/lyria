define('spec/audiomanager', ['lyria/audio/manager'], function(AudioManager) {

  describe('lyria/audio/manager', function() {

    var audioManager = new AudioManager();

    it('is a function', function() {
      expect(AudioManager).to.be.a('function');
    });

    describe('constructor', function() {
      it('can be instantiated', function() {
        expect(audioManager).to.be.a('object');
        expect(audioManager).to.be.an.instanceOf(AudioManager);
      });
    });

    describe('Methods and functionality', function() {
      describe('#add', function() {
        it('exists', function() {
          expect(audioManager).to.have.property('add');
          expect(AudioManager.prototype.add).to.be.a('function');
          expect(audioManager.add).to.equal(AudioManager.prototype.add);
        });
      });
      
      describe('#play', function() {
        it('exists', function() {
          expect(audioManager).to.have.property('play');
          expect(AudioManager.prototype.play).to.be.a('function');
          expect(audioManager.play).to.equal(AudioManager.prototype.play);
        });
      });
      
      describe('#stop', function() {
        it('exists', function() {
          expect(audioManager).to.have.property('stop');
          expect(AudioManager.prototype.stop).to.be.a('function');
          expect(audioManager.stop).to.equal(AudioManager.prototype.stop);
        });
      });
    });
  });

});
