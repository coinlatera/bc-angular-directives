'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'assets',
    dist: 'dist',
    testApp: 'test-app'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      build: {
        files: ['<%= yeoman.app %>/{,*/}*.coffee'],
        tasks: ['build', 'livereload']
      },
      reload: {
        files: ['<%= yeoman.testApp %>/{,*/}*'],
        tasks: ['livereload']
      },
      jsTest: {
        files: ['test/{,*/}*.js'],
        tasks: ['karma']
      }
    },
    connect: {
      options: {
        port: 1666,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, '')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/test-app/'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '{,*/}*.coffee',
          dest: '.tmp',
          ext: '.js'
        }]
      }
    },
    concat: {
      dist: {
        files: {
          '<%= yeoman.dist %>/bc-angular-directives.js': [
            '.tmp/{,*/}*.js'
          ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/bc-angular-directives.min.js': [
            '<%= yeoman.dist %>/bc-angular-directives.js'
          ]
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      e2e: {
        configFile: 'karma-e2e.conf.js'
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'livereload-start',
    'build',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('unit', [
    'clean:server',
    'coffee',
    'connect',
    'karma:unit'
  ]);

  grunt.registerTask('e2e', [
    'clean:server',
    'coffee',
    'connect',
    'karma:e2e'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'coffee',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('default', ['build']);
};
