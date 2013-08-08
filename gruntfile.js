module.exports = function(grunt) {

  var lyriaOrigin = 'src/**/*.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      scripts: {
        src: [lyriaOrigin],
        dest: 'dist/<%= pkg.name %>.js'
      },
      styles: {
        src: ['css/**/*.css'],
        dest: 'css/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        report: 'gzip'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.scripts.dest %>']
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', lyriaOrigin],
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
          dest: 'css/',
          ext: '.css'
        }]
      }
    },
    clean: ['dist'],
    dependo: {
      targetPath: 'src',
      outputPath: './doc/dependencies',
      format: 'amd'
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', 'Lints and unit tests', ['jshint']);
  grunt.registerTask('doc', 'Generated documentation', ['yuidoc', 'dependo']);
  grunt.registerTask('default', 'Default task', ['clean', 'test', 'stylus', 'concat', 'uglify', 'doc']);

};
