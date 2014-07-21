var angular = require('angular');

require('angular-ui-router');
require('strategi');

	backstage = angular.module('backstage', [
		'ui.router',
		'strategi'
	]);


require('./menuRenderer.js');
require('./moduleRenderer.js');


backstage.config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider
			.otherwise('/')
	}
]);