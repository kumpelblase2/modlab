var path = require('path');
var cwd = process.cwd();
var filter = require('../../api/hooks/moduleloader/modulehelper').filter;

module.exports = function(grunt) {
    grunt.registerTask('moduleassets', 'Links assets from modules into the assets folder', function() {
        var options = this.options({
            modlabConfig: 'config/',
            assetsDir: 'assets/',
            jsDir: 'js/',
            cssDir: 'styles/',
            templatesDir: 'templates/'
        });

        var files = grunt.config.get('copy.dev.files');

        var moduleConfig = require(path.join(cwd, options.modlabConfig, 'modules.js')).modules;
        var filtered = filter(moduleConfig);
        filtered.forEach(function(mod) {
            var moduleAssetDir = path.join('.', mod.path, options.assetsDir);
            files.push({
                expand: true,
                cwd: path.join(moduleAssetDir, options.jsDir),
                src: [ '*.js' ],
                dest: path.join('.tmp/public/js/module', mod.name)
            });

            files.push({
                expand: true,
                cwd: path.join(moduleAssetDir, options.cssDir),
                src: [ '*.css' ],
                dest: path.join('.tmp/public/styles/module', mod.name)
            });

            files.push({
                expand: true,
                cwd: path.join(moduleAssetDir, options.templatesDir),
                src: [ '*.html' ],
                dest: path.join('.tmp/public/templates/module', mod.name)
            });
        });

        grunt.config.set('copy.dev.files', files);
    });
};
