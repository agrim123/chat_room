module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      html:{
        files:['views/*.ejs'],
        options: {
          livereload: true,
        }
      },
      css: {
        files: ['public/stylesheets/*.css'],
        options: {
          livereload: true,
        }
      },
      js: {
        files: ['Gruntfile.js','public/javascripts/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true,
        }
      }
    },
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['nodemon','watch']
    }   
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('default', ['concurrent']);

};