var path = require('path');
var cwd = process.cwd();
var filter = require('../../api/hooks/pluginloader/pluginhelper').filter;

module.exports = function(grunt) {
    grunt.registerTask('pluginassets', 'Links assets from plugins into the assets folder', function() {
        var options = this.options({
            modlabConfig: 'config/',
            assetsDir: 'assets/',
            jsDir: 'js/',
            cssDir: 'styles/',
            templatesDir: 'templates/'
        });

        var files = grunt.config.get('copy.dev.files');

        var pluginConfig = require(path.join(cwd, options.modlabConfig, 'plugins.js')).plugins;
        var filtered = filter(pluginConfig);
        filtered.forEach(function(plugin) {
            var pluginAssetDir = path.join('.', plugin.path, options.assetsDir);
            files.push({
                expand: true,
                cwd: path.join(pluginAssetDir, options.jsDir),
                src: [ '*.js' ],
                dest: path.join('.tmp/public/js/plugin', plugin.name)
            });

            files.push({
                expand: true,
                cwd: path.join(pluginAssetDir, options.cssDir),
                src: [ '*.css' ],
                dest: path.join('.tmp/public/styles/plugin', plugin.name)
            });

            files.push({
                expand: true,
                cwd: path.join(pluginAssetDir, options.templatesDir),
                src: [ '*.html' ],
                dest: path.join('.tmp/public/templates/plugin', plugin.name)
            });
        });

        grunt.config.set('copy.dev.files', files);
    });
};
