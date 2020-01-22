(function() {
	'use strict';

	angular
		.module('restaurant.favorites')
		.controller('FavoritesController', FavoritesController);

	FavoritesController.$inject = ['$state', 'favoritesService', 'favoritesSenderService', 'localStorageService', 'restaurantCartService'];

	/* @ngInject */
	function FavoritesController($state, favoritesService, favoritesSenderService, localStorageService, restaurantCartService) {
		var vm = angular.extend(this, {
			lengthCart: restaurantCartService.lengthCart(),
			items: [],
			deleteItem: deleteItem,
			sendFavorites: sendFavorites,
			showProductDetails: showProductDetails,
			showCart: showCart
		});

		(function activate() {
			loadItems();
		})();

		// ********************************************************************

		function showCart() {
			$state.go('app.restaurant-cart');
		}

		function loadItems() {
			return favoritesService.getAll(localStorageService.get('usuarioAutenticado').idCliente).then(function(data) {
				vm.items = data;
			});
		}

		function deleteItem(index, idProduto) {
			favoritesService.deleteItem(localStorageService.get('usuarioAutenticado').idCliente, 
				                        idProduto,
				                        localStorageService.get('usuarioAutenticado').idUsuario);
			vm.items.splice(index,1);
		}

		function sendFavorites() {
			favoritesSenderService.sendFavorites(localStorageService.get('usuarioAutenticado').idCliente, 
				                        		 item.id,
				                                 localStorageService.get('usuarioAutenticado').idUsuario);
		}

		function showProductDetails(productId) {
			$state.go('app.product', {
				productId: productId,
				clienteId: localStorageService.get('usuarioAutenticado').idCliente
			});
		}
	}
})();
