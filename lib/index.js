var angular = require('angular');

require('angular-ui-router');
require('strategy');

	backstage = angular.module('backstage', [
		'ui.router',
		'strategy'
	]);


require('./menuRenderer.js');
require('./moduleRenderer.js');


backstage.config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider
			.otherwise('/')
	}
]);