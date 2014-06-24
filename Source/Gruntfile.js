var fs = require('fs');
var configFile = 'config.json';
var buildFolder;
var config;

var partialCopyCreator = function (appName) {
				return {
					expand: true,
					cwd: config.apps[appName].relativePath + 'partials/',
					src: '*',
					dest: buildFolder + 'partials/' + appName + '/',
					flatten: true,
					filter: 'isFile'
				}
}

module.exports = function (grunt) {
	config = JSON.parse(fs.readFileSync(configFile));
	buildFolder = config.buildFolder;
	var apps = Object.keys(config.apps);

	var jsSrc = [buildFolder + 'res/bs.js', 'app/**/*.js'];
	var partialsWatch = ['index.html'];
	var sassDirs = ['sass/'];
	var sassDirsWatch = ['sass/**/*.scss'];
	var copyDirectives = [{
					src: 'index.html',
					dest: buildFolder
				},
				{
					src: ['fonts/*', 'gfx/*', 'img/*', 'js/**/*'],
					dest: buildFolder
				}]
	var dependencies = '';
	config.dependencies.forEach(function (dep) {
		dependencies += '\'' + dep + '\', ';
	})



	for (var i = 0; i < apps.length; i++) {
		jsSrc.unshift(config.apps[apps[i]].relativePath + '**/*.js');
		partialsWatch.unshift(config.apps[apps[i]].relativePath + 'partials/**/*.html');
		sassDirs.unshift(config.apps[apps[i]].relativePath + 'sass/')
		sassDirsWatch.unshift(config.apps[apps[i]].relativePath + 'sass/**/*.scss')
		copyDirectives.unshift(partialCopyCreator(apps[i]));
	}
	var compileWatch = jsSrc.slice(0);
	compileWatch.push('config.json');

	grunt.initConfig({
		compass: {
			dev: {
				options: {
					config: 'config.rb',
					force: true,
					importPath: sassDirs
				}
			}
		},

		closureCompiler: {
		 	options: {
				compilerFile: '../Packages/Closure/compiler.jar',

				compilerOpts: {
					compilation_level: 'WHITESPACE_ONLY',
					formatting: 'PRETTY_PRINT',
					externs: ['js/externs/*'],
					warning_level: 'verbose',
					jscomp_off: ['checkTypes', 'fileoverviewTags'],
					summary_detail_level: 3,
					output_wrapper: '"(function(){%output%}).call(this);"',
					language_in: 'ECMASCRIPT5'
				},
				execOpts: {
					maxBuffer: 999999 * 1024
				}

			},
			targetName: {
				src: jsSrc,
				dest: buildFolder + 'bs.min.js'
			}
		},

		copy: {
			main: {
				files: copyDirectives
			}
		},

		replace: {
			comp: {
				src: 'backstage.js', 
				dest: buildFolder + 'res/bs.js',
				replacements: [{
					from: '/* CONFIG dependencies */',
					to: dependencies
				}]
			}
		},

		watch: {
			options: {
				livereload: true
			},
			sass: {
				files: sassDirsWatch,
				tasks: ['compass:dev']
			},
			partials: {
				files: partialsWatch,
				tasks: ['copy:main']
			},
			compile: {
				files: compileWatch,
				tasks: ['compile']
			},
		}
	});

	grunt.loadNpmTasks('grunt-closure-tools');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-text-replace');

	grunt.registerTask('compile', ['replace:comp', 'closureCompiler'])
	grunt.registerTask('clean', function () {
		grunt.file.delete(buildFolder + 'res/', {force: true});
	});
	grunt.registerTask('default', ['build-all', 'watch']);
	grunt.registerTask('build-all', ['compile', 'copy:main', 'compass']);
};
