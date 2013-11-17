module.exports = function(grunt) {

  var lyriaOrigin = 'src/**/*.js';
  var generatedFiles = 'generated/**/*.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat_sourcemap: {
      options: {
        sourcesContent: true,
        sourceRoot: '/'
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
    clean: ['dist', 'generated'],
    dependo: {
      targetPath: 'src',
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
    mocha: {
      all: {
        options: {
          reporter: 'Spec',
          log: true
        },
        src: ['test/*.html']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('./tasks');

  grunt.registerTask('test', 'Lints and unit tests', ['jshint']);
  grunt.registerTask('doc', 'Generated documentation', ['yuidoc', 'dependo', 'plato']);
  grunt.registerTask('default', 'Default task', ['clean', 'handlebars', 'stylus', 'concat', 'concat_sourcemap', 'test', 'uglify', 'cssmin', 'doc']);

};
