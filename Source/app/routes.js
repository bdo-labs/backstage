angular.module('backstage')
	.config(['$urlRouterProvider','$locationProvider', '$stateProvider', 
		function ($urlRouterProvider, $locationProvider, $stateProvider) {
			//$locationProvider.html5Mode(true)
			$urlRouterProvider.otherwise('/')
			$stateProvider
				.state('bs-home', {
					url: '/',
					controller: function ($scope) {console.log('Backstage talks')}
				})
		}]);
