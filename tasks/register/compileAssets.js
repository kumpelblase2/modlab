module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'moduleassets',
		'clean:dev',
		'jst:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
