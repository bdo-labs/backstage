var angular = require('angular');
var ui_router = require('angular-ui-router');

var user = require('user'),
		services = require('services');

var backstage = angular.module('backstage', ['ui.router', 'user', 'services']);


backstage.config(require('./app/routes.js'));
