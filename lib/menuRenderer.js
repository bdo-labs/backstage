/**
 * Angular Directive for rendering the main menu.
 *
 * Renders a menu from a given config in the states. Every state that has something it wants on the menu
 * needs a menuLoader method, which returns an array of arrays with all siblings that should be shown, as well
 * as its own config.
 *
 * Config object:
 * {
 * 	name: PrettyDisplayName,
 * 	state: the.state.the.item.belongs.to,
 * 	routerObject: {
 * 		'typeofId': id
 * 	}
 * }
 *
 * Each menu set has an active item, which should be placed first in the array, like this:
 *
 * siblingArray: [activeItem, sibling1, sibling2, ..., siblingN]
 *
 * the return of the method should be an array of siblingarrays for each level in the menu desired. How this is
 * achieved is at the programmers discretion, but a nice method to do it is to recursively call the parent states
 * menuLoader method. The return should look like
 *
 * menuArray: [ menuLevelArray1, menuLevelArray2, ..., menuLevelArrayN ]
 */
angular.module('backstage').directive('menuRenderer', ['$state', '$location', function ($state, $location) {

	return {
		link: function (scope, elem, attrs)	{
			var show = {};
			scope.show = function (index) {
				return show[index];
			};

			scope.toggle_show = function (index) {
				show[index] = !show[index];
			};

			scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
				show = {};
				scope.menuObjects = toState.menuLoader($state, toParams);
			})
		},
		template: require('./menu.html')
	};
}]);