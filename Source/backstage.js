var angular = require('angular');
var ui_router = require('angular-ui-router');

var user = require('user'),
		strategi = require('strategi');

var backstage = angular.module('backstage', ['ui.router', 'user', 'strategi']);

backstage.directive('moduleRenderer', require('./app/directives/renderer.js'));
backstage.config(require('./app/routes.js'));
