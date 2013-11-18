define('spec/serialize', ['lyria/serialize', 'jquery'], function(serialize, $) {

  describe('serialize', function() {

    it('is a function', function() {
      expect(serialize).to.be.a('function');
    });

    it('should be undefined when calling without parameters', function() {
      expect(serialize()).to.equal(undefined);
    });

    it('should return the primitive input parameter as a string', function() {
      expect(serialize('test')).to.equal('"test"');
      expect(serialize(0)).to.equal('0');
      expect(serialize(true)).to.equal('true');
      expect(serialize(false)).to.equal('false');
    });

    it('returns a stringified function when input parameter is a function', function() {
      var func = function() {
        return 5;
      };

      expect(serialize(func)).to.equal(func.toString());
    });

    it('should be undefined when input is a jquery object', function() {
      expect(serialize($('body'))).to.equal(undefined);
    });

    it('jquery objects serialize to null', function() {
      expect(serialize({
        elem: $('body')
      })).to.deep.equal(JSON.stringify({
        elem: null
      }));
    });

    it('serializes primitive types', function() {
      expect(serialize({
        a: 1,
        b: 'test',
        c: false
      })).to.deep.equal(JSON.stringify({
        a: 1,
        b: 'test',
        c: false
      }));
    });

    it('serializes objects', function() {
      expect(serialize({
        a: {
          b: {
            c: {
              d: {
                e: 'test'
              }
            }
          }
        }
      })).to.deep.equal(JSON.stringify({
        a: {
          b: {
            c: {
              d: {
                e: 'test'
              }
            }
          }
        }
      }));
    });

    it('serializes objects and primitive types', function() {
      expect(serialize({
        a: 1,
        b: 'test',
        c: false,
        e: {
          b: {
            c: {
              d: {
                e: 'test'
              }
            }
          }
        }
      })).to.deep.equal(JSON.stringify({
        a: 1,
        b: 'test',
        c: false,
        e: {
          b: {
            c: {
              d: {
                e: 'test'
              }
            }
          }
        }
      }));
    });

  });

});
