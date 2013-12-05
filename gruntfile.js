var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {

  var lyriaOrigin = 'src/**/*.js';
  var generatedFiles = 'generated/**/*.js';

  var testFolder = fs.readdirSync('test/spec');
  var templateObject = {};
  testFolder.forEach(function(elem) {
    var extension = path.extname(elem);
    var base = elem.split(extension)[0];

    templateObject[base] = {
      engine: 'handlebars',
      src: 'test/templates/browser.html',
      dest: 'test/browser/' + base + '.html',
      variables: {
        script: 'spec/' + base,
        title: base.charAt(0).toUpperCase() + base.slice(1)
      }
    };
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    amd_tamer: {
      options: {
        base: 'src/',
        namespace: 'lyria'
      },
      scripts: {
        src: [lyriaOrigin, generatedFiles],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    concat: {
      styles: {
        src: ['dist/css/*.css'],
        dest: 'dist/css/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        report: 'gzip'
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': ['<%= concat_sourcemap.scripts.dest %>']
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/min',
        ext: '.min.css'
      }
    },
    jshint: {
      files: ['gruntfile.js', lyriaOrigin, 'test/**/*.js'],
      options: grunt.file.readJSON('.jshintrc')
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          linkNatives: true,
          paths: 'src/',
          outdir: 'doc/api'
        }
      }
    },
    stylus: {
      options: {
        paths: ['stylus'],
        urlfunc: 'embedurl',
        import: ['nib']
      },
      compile: {
        options: {
          compress: false,
        },
        files: [{
          expand: true,
          cwd: 'stylus/',
          src: ['**/*.styl'],
          dest: 'dist/css/',
          ext: '.css'
        }]
      }
    },
    handlebars: {
      options: {
        namespace: 'lyria/template/list',
      },
      compile: {
        files: {
          'generated/templates.js': ['templates/*.html']
        }
      }
    },
    clean: ['dist', 'generated', 'test/browser'],
    dependo: {
      targetPath: 'dist',
      outputPath: './doc/dependencies',
      format: 'amd'
    },
    plato: {
      all: {
        options: {
          jshint: grunt.file.readJSON('.jshintrc'),
          complexity: {
            logicalor: false,
            switchcase: false,
            forin: true,
            trycatch: true
          }
        },
        files: {
          'doc/reports/': ['src/**/*.js', 'test/**/*.js', 'gruntfile.js']
        }
      }
    },
    connect: {
      test: {
        options: {
          port: 9001
        }
      }
    },
    template: templateObject,
    mocha: {
      options: {
        log: true,
        reporter: 'Spec'
      },
      all: {
        src: ['test/browser/**/*.html']
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: ['dist/css/*.css']
      }
    },
    release: {
      options: {
        npm: false
      },
      bowerFile: {
        options: {
          file: 'bower.json'          
        }
      },
      packageFile: {
        options: {
          file: 'package.json'          
        }
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('./tasks');

  grunt.registerTask('test', 'Lints and unit tests', ['jshint', 'csslint', 'template', 'mocha']);
  grunt.registerTask('doc', 'Generated documentation', ['yuidoc', 'dependo', 'plato']);
  grunt.registerTask('default', 'Default task', ['clean', 'handlebars', 'stylus', 'concat', 'amd_tamer', 'test', 'uglify', 'cssmin']);
  
  grunt.registerTask('releaser', 'When releasing this library', ['doc']);

};
