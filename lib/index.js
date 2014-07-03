var angular = require('angular');
var ui_router = require('angular-ui-router');

var user = require('user'),
		strategi = require('strategi');

var backstage = angular.module('backstage', ['ui.router', 'user', 'strategi']);

require('./moduleRenderer.js');
backstage.config(require('./routes.js'));
