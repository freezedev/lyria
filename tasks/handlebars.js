var path = require('path');

var handlebars = require('handlebars');
var beautify = require('js-beautify').js_beautify;

var packageFile = require('../package.json');

module.exports = function(grunt) {

  grunt.registerMultiTask('handlebars', function() {
    var options = this.options({
      namespace: packageFile.name
    });
    var files = this.files;
    var dest = null;

    var lines = '';

    lines += 'define(\'' + options.namespace + '\', {';
    for (var i = 0, j = files.length; i < j; i++) {
      (function(item) {
        dest = dest || item.dest;

        for (var k = 0, l = item.src.length; k < l; k++) {
          (function(filename, lastElem) {
            var shortName = path.basename(filename).split(path.extname(filename))[0];
            lines += '\'' + shortName + '\':' + handlebars.precompile(grunt.file.read(filename)) + ',';
          })(item.src[k]);
        }
      })(files[i]);
    }
    // Remove last comma
    lines = lines.substring(0, lines.length - 1);

    lines += '});';

    lines = beautify(lines, {
      indent_size: 2
    });

    grunt.file.write(dest, lines);
  });

};
