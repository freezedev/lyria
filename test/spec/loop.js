define('spec/loop', ['lyria/loop'], function(Loop) {
  'use strict';
  
  describe('lyria/loop', function() {
    
    it('is an object', function() {
      expect(Loop).to.be.a('object');
    });
    
    it('.run', function() {
      expect(Loop).to.have.property('run');
      expect(Loop.run).to.be.a('function');
    });
    
    it('.stop', function() {
      expect(Loop).to.have.property('stop');
      expect(Loop.stop).to.be.a('function');
    });
    
    it('.clear', function() {
      expect(Loop).to.have.property('clear');
      expect(Loop.clear).to.be.a('function');
    });
    
    it('.on', function() {
      expect(Loop).to.have.property('on');
      expect(Loop.on).to.be.a('function');
    });
    
    it('.off', function() {
      expect(Loop).to.have.property('off');
      expect(Loop.off).to.be.a('function');
    });
    
    it('.pause', function() {
      expect(Loop).to.have.property('pause');
      expect(Loop.pause).to.be.a('function');
    });
    
    it('.resume', function() {
      expect(Loop).to.have.property('resume');
      expect(Loop.resume).to.be.a('function');
    });
    
  });
  
});
