define('spec/log', ['lyria/log'], function(Log) {
  'use strict';
  
  describe('lyria/log', function() {
    
    it('is an object', function() {
      expect(Log).to.be.a('object');
    });
    
    describe('.plugins', function() {
      it('property exists', function() {
        expect(Log).to.have.property('plugins');
        expect(Log.plugins).to.be.a('object');
      });
      
      it('Console plugin does exist', function() {
        expect(Log.plugins).to.have.property('console');
        expect(Log.plugins.console).to.be.a('object');
      });
    });
    
    describe('.connector', function() {
      it('property exists', function() {
        expect(Log).to.have.property('connector');        
      });
      
      it('is bound to the console plugin by default', function() {
        expect(Log.connector).to.equal(Log.plugins.console);
      });
    });
    
    it('.logLevelMap', function() {
      expect(Log).to.have.property('logLevelMap');
      expect(Log.logLevelMap).to.be.a('object');
    });
    
    it('.logLevel', function() {
      expect(Log).to.have.property('logLevel');
      expect(Log.logLevel).to.be.a('string');
    });
    
  });
  
});
