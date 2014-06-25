module.exports = ['$stateProvider', '$urlRouterProvider', 
	function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider
			.otherwise('/')

		$stateProvider
			.state('home', {
				url: '/',
			})
	}
]

