
/**
 * Expose bdoView initialization.
 */

module.exports = function(app){
  app.directive('bdoView', ['$state', '$compile', '$controller', bdoView]);
}

/**
 * BDO view
 *
 * This directive is used instead of `ui-view`, as we want a single view on
 * our page, as well as a single scope. As there is no template associated
 * with each state, ui-router will not call the controller. In `bdo-view`,
 * we call the controller if it exists and pass everything else along.
 */

function bdoView($state, $compile, $controller) {
  function link(scope, el, attrs) {
    scope.$on('$stateChangeSuccess', function () {
      var current = $state.$current;
      if (current.self.controller) {
        var controller = $controller(current.self.controller, {$scope: scope});
        el.data('$ngControllerController', controller);
        el.children().data('$ngControllerController', controller);
      }
    });
  }

  return { link: link };
}

