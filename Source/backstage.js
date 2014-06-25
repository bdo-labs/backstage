var angular = require('angular');
var ui_router = require('angular-ui-router');

var user = require('user');


var backstage = angular.module('backstage', ['ui.router', 'user'])
backstage.config(require('./app/routes.js'));
