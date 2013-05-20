module.exports = function(grunt) {

  var lyriaOrigin = 'src/**/*.js';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [lyriaOrigin],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        report: 'gzip'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
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
          paths: 'src/',
          outdir: 'doc/api'
        }
      }
    },
    less: {
      options: {
        paths: ['style'],
        yuicompress: true
      },
      dist: {
        files: {
          'css/lyria.css': 'style/*.less'
        }        
      }
    },
    dependo: {
      targetPath: 'src',
      outputPath: './doc/dependencies',
      format: 'amd'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-dependo');
  
  grunt.registerTask('test', 'Lints and unit tests', ['jshint']);
  grunt.registerTask('doc', 'Generated documentation', ['yuidoc', 'dependo']);
  grunt.registerTask('default', 'Default task', ['test', 'concat', 'uglify', 'less', 'doc']);

};
