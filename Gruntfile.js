module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        mangle: false // prevent changes into function and variables name
      },
      app: {
        options: {
          //sourceMap: true,
          //sourceMapName: 'public/admin/admin.map'
        },
        files: {
          'public/client/log.js': ['assets/client/log.js']
        }
      }
    },
    jshint: {
      options: {
          reporter: require('jshint-stylish'),
          esversion: 6
      },
      all: ['Gruntfile.js', 'lib/**/*.js', 'module/**/*.js', 'assets/**/*.js']
    },
    watch: {
      scripts: {
        files: ['**/*.js'],
        tasks: ['jshint', 'uglify'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'jshint', 'watch']);

};
