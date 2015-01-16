module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'pluginassets',
		'clean:dev',
		'jst:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
