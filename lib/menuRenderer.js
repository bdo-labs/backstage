/**
 * Angular Directive for rendering the main menu.
 *
 * Renders a menu from a given config in the states. Every state that has something it wants on the menu
 * needs a menuLoader method, which should return an object with the elements that is wanted on the menu.
 *
 * The menu is divided into the top menu, and a filter menu. The top menu should include things that are
 * needed often. To add something to the top menu, let topMenu on the return object be a list with objects
 * formatted like this:
 *
 * {
 * 	name: DisplayName,
 * 	state: state.of.the.link.target,
 * 	routerObject: {
 * 	 whateverId: someNumber
 * 	}
 * }
 *
 * The filtermenu expects an array of arrays with the dropdown elements needed.
 *
 */
angular.module('backstage').directive('menuRenderer', ['$state', '$injector', function ($state, $injector) {

	return {
		scope: true,
		link: function (scope, elem, attrs)	{
			scope.$on('$stateChangeStart', function (event, toState, toParams) {
				scope.menu = [];
				var parent = toState.name;
				while (parent.length > 0) {
					var loader = $state.get(parent)[attrs.menuRenderer + 'MenuLoader'];
					if (loader !== undefined) {
						var menu = $injector.invoke(loader, toState, {toParams: toParams});
						for (var i = 0; i < menu.length; i++) {
							if(menu[i].routerObject === undefined) {
								menu[i].routerObject = {};
							}
						}
						scope.menu.push.apply(scope.menu, menu);
					}
					parent = parent.substring(0, parent.lastIndexOf('.'));
				}
				scope.menu.reverse();
			});
		},
		template: require('./menu.html')
	};
}]);