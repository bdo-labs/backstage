/**
 * Angular Directive for rendering the main menu. 
 * Each menu config item is an object with the structure:
 *
 * {
 *	 name: ...,
 *	 url: ...	
 * }
 *
 * This just puts the links in a list, it is up to the app
 * that the links are correct. The name should be formatted for
 * showing the user
 */
angular.module('backstage').directive('menuRenderer', function () {

	function createLinkFromConfig(configItem) {
		return '<li><a sref="' + configItem.url + '">' + configItem.name + '</a></li>';
	}


	return {
		scope: {
			menuRenderer: '=',
		},
		link: function (scope, elem, attrs)	{

			scope.$watchCollection('menuRenderer', function (menuConfigs) {
				if (!angular.isArray(menuConfigs) || !menuConfigs.length){
					elem.empty();
					return;
				}
				menuConfigs.forEach(function (item, index) {
					elem.append(createLinkFromConfig(item))
				});
			});
		}
	}
});