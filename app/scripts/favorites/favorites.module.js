(function() {
	'use strict';

	angular
		.module('restaurant.favorites', [
			'ionic'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.favorites', {
					url: '/favorites',
					views: {
						'menuContent': {
							templateUrl: 'scripts/favorites/favorites.html',
							controller: 'FavoritesController as vm'
						}
					},
					cache: false
				});
		});
})();
