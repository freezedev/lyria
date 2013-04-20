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
          outdir: 'doc/api'
        }
      }
    },
    less: {
      options: {
        paths: ['style', 'style/lib', 'style/lib/lyria'],
        yuicompress: true
      },
      dist: {
        files: {
          'css/main.css': 'style/main.less'
        }        
      }
    },
    dependo: {
      targetPath: 'js/lyria',
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
  
  var createAssetArray = require('./createassetarray').createAssetArray;
  var prepareScenes = require('./preparescenes').prepareScenes;
  var path = require('path');

  grunt.registerTask('build', 'Updates asset array and prepares scenes', function() {
    var dir = './';
    
    createAssetArray(dir, function() {
      prepareScenes(path.join(dir, 'assets', 'scenes'), path.join(dir, 'js', 'scenes.js'), function() {
        grunt.log.writeln('Project built');
      });    
    });
  });

  grunt.registerTask('test', 'Lints and unit tests', ['jshint']);
  grunt.registerTask('doc', 'Generated documentation', ['yuidoc', 'dependo']);
  grunt.registerTask('default', 'Default task', ['test', 'concat', 'uglify', 'less', 'build', 'doc']);

};
