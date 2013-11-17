define('spec/events', ['lyria/events', 'eventmap'], function(Events, EventMap) {
  
  describe('lyria/events', function() {
    
    it('is an object', function() {
      expect(Events).to.be.a('object');
    });
    
    it('is an EventMap instance', function() {
      expect(Events).to.be.an.instanceOf(EventMap);
    });
    
  });
  
});
