(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-cart', [
			'ionic',
			'LocalStorageModule'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.restaurant-cart', {
					url: '/restaurant-cart',
					views: {
						'menuContent': {
							templateUrl: 'scripts/cart/restaurant-cart/restaurant-cart.html',
							controller: 'RestaurantCartController as vm'
						}
					},
					cache: false
				})
				
				.state('app.restaurant-cart-opt', {
					url: '/restaurant-cart-opt',
					views: {
						'menuContent': {
							templateUrl: 'scripts/cart/restaurant-cart/restaurant-cart-opt.html',
							controller: 'RestaurantCartOptController as vm'
						}
					},
					cache: false
				})

				.state('app.restaurant-cart-pesquisar', {
					url: '/restaurant-cart-pesquisar',
					views: {
						'menuContent': {
							templateUrl: 'scripts/cart/restaurant-cart/restaurant-cart-pesquisar.html',
							controller: 'RestaurantCartPesquisarController as vm'
						}
					},
					cache: false
				});

		});
})();