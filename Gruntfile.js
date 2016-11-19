module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'build/app.js': ['src/app.js'],
          'build/public/js/script.js' : ['src/public/js/*.js'],
          'build/wordFilter.js' : ['src/wordFilter.js']

        }
      }
    },
    copy: {
      files: {
            expand : true,
            dest   : 'build/',
            cwd    : 'src/',
            src    : [
              '**',
            ],
      }
    },
    mocha: {
        test: {
          src: ['test/TestClient/*.html'],
          options: {
            run: true,
          },
        },
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
        },
        src: ['test/TestServer/*.js']
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/*.js', 'src/public/js/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      options: { livereload: true },
    express: {
      files:  [ 'src/*.js', 'src/**/*.js', 'src/**/*.html', 'src/**/*.css' ],
      tasks:  [ 'express:dev' ],
      options: {
        spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
      }
    }
  },
  express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'src/app.js'
        }
      }
  }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('test', ['jshint', 'mochaTest','mocha']);
  grunt.registerTask('server', ['jshint', 'express:dev', 'watch']);

  grunt.registerTask('default', ['jshint', 'mochaTest', 'mocha','copy','uglify', 'express:dev']);

};