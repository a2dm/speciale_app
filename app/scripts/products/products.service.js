(function() {
	'use strict';

	angular
		.module('restaurant.products')
		.factory('productsService', productsService);

	productsService.$inject = ['dataService'];

	/* @ngInject */
	function productsService(dataService) {
		var service = {
			all: all,
			get: get,
			getFeatured: getFeatured,
			getListProductByClient: getListProductByClient,
			cadastrarPedido: cadastrarPedido,
			validarData: validarData
		};
		return service;

		// ******************************************************************

		function all(categoryGuid) {
			return dataService.getProducts(categoryGuid);
		}

		function get(productGuid, clientGuid) {
			return dataService.getProduct(productGuid, clientGuid);
		}

		function getFeatured(productGuid) {
			return dataService.getFeaturedProduct(productGuid);
		}

		function getListProductByClient(clientGuid) {
			return dataService.getListProductByClient(clientGuid);
		}

		function cadastrarPedido(idCliente, idUsuario, idPedido, dataPedido, observacao, listaProduto) {
			return dataService.cadastrarPedido(idCliente, idUsuario, idPedido, dataPedido, observacao, listaProduto);
		}

		function validarData(idCliente, idPedido, dataPedido) {
			return dataService.validarData(idCliente, idPedido, dataPedido);
		}
	}
})();
