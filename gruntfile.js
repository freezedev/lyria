module.exports = function(grunt) {
  
  var lyriaOrigin = 'js/<%= pkg.name %>/**/*.js';
  
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
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', lyriaOrigin],
      options: {
        loopfunc: true,
        sub: true,
        eqnull: true,
        es5: true
      }
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'js/lyria/',
          outdir: 'doc/'
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  
  grunt.registerTask('test', 'Lints and unit tests', ['jshint']);
  grunt.registerTask('doc', 'Generated documentation', ['yuidoc']);
  grunt.registerTask('default', 'Default task', ['test', 'concat', 'uglify', 'doc']);
  
};
