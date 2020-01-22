(function() {
	'use strict';

	angular
		.module('restaurant.favorites')
		.factory('favoritesService', favoritesService);

	favoritesService.$inject = ['dataService', '$rootScope', '_', 'localStorageService'];

	/* @ngInject */
	function favoritesService(dataService, $rootScope, _, localStorageService) {
		var items = localStorageService.get('favorites') || [];

		var service = {
			addItem: addItem,
			deleteItem: deleteItem,
			getAll: getAll,
			isInFavorites: isInFavorites,
			getBusiness: dataService.getBusiness
		};
		return service;

		// ********************************************************

		function deleteItem(idCliente, idProduto, idUsuario) {
			return dataService.excluirFavorito(idCliente, idProduto, idUsuario).then(function(data) {
				return data;
			});
		}

		function getAll(idCliente) {
			return dataService.listarFavoritoByCliente(idCliente).then(function(data) {
				return data;
			});
		}

		function addItem(idCliente, idProduto, idUsuario) {
			return dataService.adicionarFavorito(idCliente, idProduto, idUsuario).then(function(data) {
				return data;
			});
		}

		function isInFavorites(guid) {
			return _.some(items, 'id', guid);
		}
	}
})();
