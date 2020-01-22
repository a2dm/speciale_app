(function() {
	'use strict';

	angular
		.module('restaurant.products', [
			'ionic'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.products', {
					url: '/products/:categoryId?categoryName',
					views: {
						'menuContent': {
							templateUrl: 'scripts/products/products.html',
							controller: 'ProductsController as vm'
						}
					},
					cache: false
				})
				.state('app.featured-product', {
					url: '/products/featured/:productId',
					views: {
						'menuContent': {
							templateUrl: 'scripts/products/product.html',
							controller: 'ProductController as vm'
						}
					},
					resolve: {
						product: function($stateParams, $state, productsService) {
							var productId = $stateParams.productId;
							return productsService.getFeatured(productId);
						}
					}
				})
				.state('app.product', {
					url: '/products/:productId/:clienteId',
					views: {
						'menuContent': {
							templateUrl: 'scripts/products/product.html',
							controller: 'ProductController as vm'
						},
						cache: false
					},
					resolve: {
						product: function($stateParams, $state, productsService) {
							return productsService.get($stateParams.productId,$stateParams.clienteId);
						}
					}
				});

		});

})();