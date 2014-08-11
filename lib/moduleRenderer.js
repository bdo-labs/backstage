/**
 * This directive takes a list of module config objects and renders the correct
 * modules. The following attributes are allowed:
 * @param {Array=} The array of configuration object.
 *
 * Each configuration object is either the module type/name as a string or a
 * configuration object on the form:
 * {
 *   name: '<module name>',
 *   attributes: {
 *		'<attribute name>': '<attribute-value>'
 *		...
 *   }
 * }
 */
angular.module('backstage').directive('moduleRenderer', function ($compile) {

	// This class is added to all modules by default
	var defaultClassName = 'suite-module';


	/**
	 * Does the opposite of the $normalize method. Converts from camelCase to
	 * dash separated names (eg. camelCase to camel-case)
	 */
	function denormalize(str) {

		return str.replace(/[A-Z]/g, function (match, offset) {
			return (offset ? '-' : '') + match.toLowerCase();
		});

	}


	/**
	 * Compiles and links a module against the given scope. The resulting DOM
	 * element.
	 */
	function instantiateModule(config, scope) {

		// String config? Create an object one.
		if (typeof config !== 'object') {
			config = {
				name: config
			};
		}

		var template = '<div',
			attrs = config.attributes = config.attributes || {};

		// Add the default module class
		if (!attrs['class'] || attrs['class'].indexOf(defaultClassName) < 0) {
			attrs['class'] = defaultClassName +
				(attrs['class'] ? ' ' + attrs['class'] : '');
		}

		// Add all attributes
		angular.forEach(attrs, function (value, name) {
			template += ' ' + denormalize(name) + '="' + value + '"';
		});

		// Let's handle content
		if (!config.name && config.template) {
			template += '>' + config.template + '</div>';
		} else if (config.name) {
			template += denormalize(config.name) + '></div>';
		} else {
			throw new Error('Invalid box config for moduleRendrer');
		}

		// Compile, link and unwrap from jqLite
		return $compile(template)(scope)[0];

	}


	return {

		scope: false,

		link: function (scope, element, attributes) {
			var visibleBoxConfigs = []; // Configs for boxes currently visible

			// Let's watch for changes to the boxes
			scope.$watchCollection(attributes.moduleRenderer, function (boxConfigs) {

				// Should we remove all boxes?
				if (!angular.isArray(boxConfigs) || !boxConfigs.length) {
					element.empty();
					visibleBoxConfigs = [];
					return;
				}

				// Alright, we must merge the current state with the new
				boxConfigs.forEach(function (boxConfig, index) {

					// The correct module might already be present
					if (boxConfig === visibleBoxConfigs[index]) {
						return;
					}


					var existingIndex = visibleBoxConfigs.indexOf(boxConfig, index),
						domElement;

					if (existingIndex < 0) {

						// Create a new instance
						domElement = instantiateModule(boxConfig, scope);

					} else {

						// Reuse existing instance
						domElement = element.children()[existingIndex];
						element[0].removeChild(domElement);

						// Remove from config
						visibleBoxConfigs.splice(existingIndex);

					}

					// Attach in the correct position
					if (index === element.children().length) {
						element.append(domElement);
					} else {
						element[0].insertBefore(
							domElement,
							element[0].children[index]
						);
					}

					// Add to config
					visibleBoxConfigs.splice(index, 0, boxConfig);

				});

				// Remove the excess boxes
				for (var i = visibleBoxConfigs.length - 1; i >= boxConfigs.length; i--) {
					element[0].removeChild(element.children()[i]);
					visibleBoxConfigs.pop();
				}

			});
		}
	};
});
