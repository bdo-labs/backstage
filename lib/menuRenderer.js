/**
 * Angular Directive for rendering the main menu.
 *
 * Renders a menu from a given config in the states. Every state that has something it wants on the menu
 * needs a menuLoader method, which returns an array of arrays with all siblings that should be shown, as well
 * as its own config.
 *
 * The menu items are taken from the database, but to correctly show the menu, the state of item to link to, as
 * well as a routerobject with the id type and its id need to be added to each object.
 *
 * the return of the method should be an array of siblingarrays for each level in the menu desired.
 *
 * menuArray: [ menuLevelArray1, menuLevelArray2, ..., menuLevelArrayN ]
 */
angular.module('backstage').directive('menuRenderer', ['$state', '$injector', function ($state, $injector) {

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
				scope.menuObjects = [];

				var parent = toState.name;
				while (parent) {
					var thing = $injector.invoke($state.get(parent).menuLoader, toState, {toParams: toParams});
					scope.menuObjects.push.apply(scope.menuObjects, thing);
					parent = parent.substring(0, parent.lastIndexOf('.'));
				}
				scope.menuObjects.reverse();
			});
		},
		template: require('./menu.html')
	};
}]);