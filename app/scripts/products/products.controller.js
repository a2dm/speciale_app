(function() {
	'use strict';

	angular
		.module('restaurant.products')
		.controller('ProductsController', ProductsController);

	ProductsController.$inject = ['$state', 'productsService', 'restaurantCartService', 'localStorageService'];

	/* @ngInject */
	function ProductsController($state, productsService, restaurantCartService, localStorageService) {
		var categoryId = $state.params.categoryId;
		var categoryName = $state.params.categoryName;

		var vm = angular.extend(this, {
			lengthCart: restaurantCartService.lengthCart(),
			products: [],
			showProductDetails: showProductDetails,
			showCart: showCart,
			category: categoryName,
			showHome: showHome
		});

		(function activate() {
			loadProducts();
		})();

		// ******************************************************

		function showHome() {
			$state.go('app.home');
		}

		function showCart() {
			$state.go('app.restaurant-cart');
		}

		function loadProducts() {
			return productsService.getListProductByClient(localStorageService.get('usuarioAutenticado').idCliente).then(function(data) {
				vm.products = data;
			});
		}

		function showProductDetails(productId) {
			$state.go('app.product', {
				productId: productId,
				clienteId: localStorageService.get('usuarioAutenticado').idCliente
			});
		}
	}
})();