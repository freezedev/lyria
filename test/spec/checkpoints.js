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
    
    describe('Methods and functionality', function() {
      beforeEach(function() {
        checkpoints.reset();
      });
      
      describe('#pass', function() {
        it('exists', function() {
          expect(checkpoints).to.have.property('pass');
          expect(Checkpoints.prototype.pass).to.be.a('function');
          expect(checkpoints.pass).to.equal(Checkpoints.prototype.pass);
        });
        
        it('pass a checkpoint', function() {
          checkpoints.pass('test');
          
          expect(checkpoints.checkpointList).to.be.a('array');
          expect(checkpoints.checkpointList.indexOf('test')).to.equal(0);
        });
        
        it('a checkpoint can only be passed once', function() {
          checkpoints.pass('test2');
          checkpoints.pass('test2');
          
          expect(checkpoints.checkpointList.length).to.equal(1);   
        });
        
        it('an event is fired when a checkpoint is added', function(done) {
          checkpoints.once('pass', function() {
            done();
          });
          
          checkpoints.pass('test3');
        });
        
        it('the fired event has a name and time parameter', function(done) {
          checkpoints.once('pass', function(name, time) {
            expect(name).to.be.a('string');
            expect(name).to.equal('test4');
            expect(time).to.be.a('number');
            done();
          });
          
          checkpoints.pass('test4');
        });
      });
      
      describe('#hasPassed', function() {
        it('exists', function() {
          expect(checkpoints).to.have.property('hasPassed');
          expect(Checkpoints.prototype.hasPassed).to.be.a('function');
          expect(checkpoints.hasPassed).to.equal(Checkpoints.prototype.hasPassed);
        });
        
        it('returns false if event has not passed yet', function() {
          expect(checkpoints.hasPassed('test')).to.equal(false);
        });
        
        it('returns true if event has passed', function() {
          checkpoints.pass('test');
          
          expect(checkpoints.hasPassed('test')).to.equal(true);
          expect(checkpoints.hasPassed('test')).to.not.equal(false);
        });
      });
      
      describe('#reset', function() {
        it('exists', function() {
          expect(checkpoints).to.have.property('reset');
          expect(Checkpoints.prototype.reset).to.be.a('function');
          expect(checkpoints.reset).to.equal(Checkpoints.prototype.reset);
        });
        
        it('reset a single checkpoint', function() {
          checkpoints.pass('test');
          checkpoints.pass('test2');
          checkpoints.pass('test3');
          checkpoints.pass('test4');
          
          checkpoints.reset('test2');
          expect(checkpoints.checkpointList.length).to.equal(3);
        });
        
        it('reset all checkpoints', function() {
          checkpoints.pass('test');
          checkpoints.pass('test2');
          checkpoints.pass('test3');
          checkpoints.pass('test4');
          
          checkpoints.reset();
          expect(checkpoints.checkpointList.length).to.equal(0);  
        });
        
        it('triggers an event when reseting any checkpoints', function(done) {
          checkpoints.pass('test');
          checkpoints.pass('test2');
          checkpoints.pass('test3');
          checkpoints.pass('test4');
          
          checkpoints.once('reset', function() {
            done();
          });
          
          checkpoints.reset('test');
        });
        
        it('triggered event has the event name as its parameter', function(done) {
          checkpoints.pass('test');
          checkpoints.pass('test2');
          checkpoints.pass('test3');
          checkpoints.pass('test4');
          
          checkpoints.once('reset', function(param) {
            expect(param).to.be.a('string');
            expect(param).to.equal('test');
            done();
          });
          
          checkpoints.reset('test');
        });
        
        it('triggered event has all event names as its parameter', function(done) {
          checkpoints.pass('test');
          checkpoints.pass('test2');
          checkpoints.pass('test3');
          checkpoints.pass('test4');
          
          checkpoints.once('reset', function(param) {
            expect(param).to.be.a('array');
            expect(param).to.not.be.empty;
            expect(param).to.deep.equal(['test', 'test2', 'test3', 'test4']);
            done();
          });
          
          checkpoints.reset();
        });
      });
      
    });
    
  });
  
});
