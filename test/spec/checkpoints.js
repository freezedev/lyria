define('spec/checkpoints', ['lyria/checkpoints'], function(Checkpoints) {
  
  describe('lyria/checkpoints', function() {
    
    var checkpoints = new Checkpoints();
    
    it('is a function', function() {
      expect(Checkpoints).to.be.a('function');
    });
    
    describe('constructor', function() {
      it('can be instantiated', function() {
        expect(checkpoints).to.be.a('object');
        expect(checkpoints).to.be.an.instanceOf(Checkpoints);
      });
      
      it('has default values', function() {
        expect(checkpoints.startTime).to.be.a('number');
        expect(checkpoints.checkpointList).to.be.a('array');
      });
    });
    
    describe('Checkpoints functionality', function() {
      beforeEach(function() {
        checkpoints.reset();
      });
      
      describe('#pass', function() {
        
        
        it('pass a checkpoint', function() {
          checkpoints.pass('test');
          
          expect(checkpoints.checkpointList).to.be.a('array');
          expect(checkpoints.checkpointList.indexOf('test')).to.equal(0);
        });
      });
    });
    
  });
  
});
