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
      expect(templateString.key.start).to.equal('{{');
    });

    it('.key.end', function() {
      expect(templateString.key).to.have.property('end');
      expect(templateString.key.end).to.be.a('string');
      expect(templateString.key.end).to.equal('}}');
    });

    describe('.process', function() {

      it('exists', function() {
        expect(templateString).to.have.property('process');
        expect(templateString.process).to.be.a('function');
      });

      it('calling without parameters returns undefined', function() {
        expect(templateString.process()).to.equal(undefined);
      });

      it('calling without templating returns the string itself', function() {
        var processedString = templateString.process('test');

        expect(processedString).to.be.a('string');
        expect(processedString).to.equal('test');
      });

      //TODO: Not working with arrays atm
      /*it('calling with an array', function() {
        var processedString = templateString.process('My {{0}} string with {{1}}', ['first', 'stuff']);

        expect(processedString).to.be.a('string');
        expect(processedString).to.equal('My first string with stuff');
      });*/

      it('calling with an object', function() {
        var processedString = templateString.process('My {{bueno}} string with {{things}}', {
          bueno: 'first',
          things: 'stuff'
        });

        expect(processedString).to.be.a('string');
        expect(processedString).to.equal('My first string with stuff');
      });

      /*it('calling with an array and duplicate identifiers', function() {
        var processedString = templateString.process('My {{0}} string with {{0}} {{1}}', ['nice', 'stuff']);

        expect(processedString).to.be.a('string');
        expect(processedString).to.equal('My nice string with nice stuff');
      });*/

      it('calling with an object and duplicate identifiers', function() {
        var processedString = templateString.process('My {{bueno}} string with {{bueno}} {{things}}', {
          bueno: 'nice',
          things: 'stuff'
        });

        expect(processedString).to.be.a('string');
        expect(processedString).to.equal('My nice string with nice stuff');
      });

    });

  });

});
