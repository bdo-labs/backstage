/**
 * Angular Directive for rendering the main menu.
 *
 * Renders a menu from a given config in the states. Every state that has something it wants on the menu
 * needs a menuLoader method, which should return an object with the elements that is wanted on the menu.
 *
 * The menu is divided into the top menu, and a filter menu, and each expects its own loader. The elements in
 * the menu can either be a link (with name, state to change to and an object with parameters needed), a dropdown
 * (given by an array of links, and dropdown = true on the array) or a template.
 *
 * If the menu element somehow is decided by a service call, you can return a promise.
 *
 *
 */
angular.module('backstage').directive('menuRenderer', ['$document', '$compile', '$state', '$injector',
	function ($document, $compile, $state, $injector) {

	return {
		scope: true,
		link: function (scope, elem, attrs)	{
			scope.$on('$stateChangeStart', function (event, toState, toParams) {
				elem.html('');
				scope.menu = [];

				var toAppend = [];
				var parent = toState.name;
				while (parent.length > 0) {
					var loader = $state.get(parent)[attrs.menuRenderer + 'MenuLoader'];
					if (loader !== undefined) {
						var menu = $injector.invoke(loader, toState, {toParams: toParams, toState: toState});
						menu.forEach(function (menuElem) {
							if (menuElem.then){
								// The element is a promise, set up the handler.
								menuElem.then(function (item) {
									var index = scope.menu.indexOf(menuElem);
									// Replace the promise in the menu
									scope.menu[index] = item;
								});
							} else if (menuElem.template) {
									// It's a template, compile it and add it to the dom later.
									toAppend.push({id: menuElem.id, template: $compile(menuElem.template)(scope)[0]});
							}
							// Add all elements to the menu
							scope.menu.push(menuElem);
						});
					}
					parent = parent.substring(0, parent.lastIndexOf('.'));
				}

				// Since the menu is built from the bottom (lowest state active is added first),
				// reverse the menu so it is shown correctly
				scope.menu.reverse();

				// Compile the menu and append to DOM.
				elem.append($compile(require('./menu.html'))(scope)[0]);

				// Add compiled templates to the DOM after digest has run.
				scope.$$postDigest(function () {
					toAppend.forEach(function (el) {
						$document[0].getElementById(el.id).appendChild(el.template);
					});

				});

			});
		}
	};
}]);