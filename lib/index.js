var angular = require('angular');

require('angular-ui-router');
require('strategy');
require('custom-elements');
require('filters');
require('user');

	backstage = angular.module('backstage', [
		'ui.router',
		'strategy',
		'customElements',
		'filters',
		'user'
	]);


require('./menuRenderer.js');
require('./moduleRenderer.js');
require('./bdoView.js');


backstage.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function ($stateProvider, $urlRouterProvider, $locationProvider) {
		var html5Mode = (window.history && window.history.pushState);
		$locationProvider.html5Mode(html5Mode).hashPrefix('!');
		$urlRouterProvider
			.otherwise('/');
	}
]);
