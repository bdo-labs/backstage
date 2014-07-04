var angular = require('angular'),
   	ui_router = require('angular-ui-router'),
	user = require('user'),
	strategi = require('strategi'),
	
	backstage = angular.module('backstage', [
		'ui.router',
		'user',
		'strategi'
	]);


require('./moduleRenderer.js');


backstage.config(['$stateProvider', '$urlRouterProvider', 
	function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider
			.otherwise('/')

		$stateProvider
			.state('home', {
				url: '/',
			})
	}
]);
