module.exports = function(grunt) {

  var lyriaOrigin = 'src/**/*.js';
  var generatedFiles = 'generated/**/*.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      scripts: {
        src: [lyriaOrigin, generatedFiles],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
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
          'dist/js/<%= pkg.name %>.min.js': ['<%= concat.scripts.dest %>']
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
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('./tasks');

  grunt.registerTask('test', 'Lints and unit tests', ['jshint']);
  grunt.registerTask('doc', 'Generated documentation', ['yuidoc', 'dependo']);
  grunt.registerTask('default', 'Default task', ['clean', 'test', 'handlebars', 'stylus', 'concat', 'uglify', 'cssmin', 'doc']);

};
