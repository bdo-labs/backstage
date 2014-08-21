
/**
 * Module dependencies.
 */

var angular = require('angular');
var bdoView = require('./bdoView');
var menuRenderer = require('./menuRenderer');
var moduleRenderer = require('./moduleRenderer');

/**
 * TODO Pass backstage to the components instead.
 */

require('angular-ui-router');
require('strategy');
require('custom-elements');
require('filters');
require('user');

var backstage = angular.module('backstage', [
  'ui.router',
  'strategy',
  'customElements',
  'filters',
  'user'
]);

menuRenderer(backstage);
moduleRenderer(backstage);
bdoView(backstage);

function initialRouting($stateProvider, $urlRouterProvider, $locationProvider) {
  // html5 mode has to be turned off for now
  var html5Mode = false && (window.history && window.history.pushState);
  $locationProvider.html5Mode(html5Mode).hashPrefix('!');
  $urlRouterProvider.otherwise('/');
}

backstage.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  initialRouting
]);

