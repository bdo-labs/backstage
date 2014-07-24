/**
 * This directive is used instead of ui-view, as we want a single view on our
 * page, as well as a single scope. As there is no template associated with each state,
 * ui-router will not call the controller. In bdo-view, we call the controller if it exists,
 * and pass everything else along.
 */

angular.module('backstage').directive('bdoView', [
  '$state', '$compile', '$controller', function ($state, $compile, $controller) {
    return {
      link: function (scope, el, attrs) {
        scope.$on('$stateChangeSuccess', function () {
          var current = $state.$current;

          if (current.self.controller) {
            var controller = $controller(current.self.controller, {$scope: scope});

            el.data('$ngControllerController', controller);
            el.children().data('$ngControllerController', controller);
          }

        });
      }
    };
  }
]);