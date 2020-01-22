(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-cart')
		.controller('RestaurantCartPesquisarController', RestaurantCartPesquisarController);

	RestaurantCartPesquisarController.$inject = ['$ionicListDelegate', '_', 'restaurantCartService', '$state', '$filter', 'ionicToast', 'localStorageService'];

	/* @ngInject */
	function RestaurantCartPesquisarController($ionicListDelegate, _, restaurantCartService, $state, $filter, ionicToast, localStorageService) {
		var vm = angular.extend(this, {
			items: [],
			pesquisar: pesquisar,
			preparaAlterarPedido: preparaAlterarPedido,
			inativarPedido: inativarPedido,
			showOptions: showOptions,
			dataPedido: null,
			total: 0,
			currency: null
		});

		(function activate() {
			init();
		})();

		// ********************************************************************

		function init() {
			var time = new Date();
            var outraData = new Date();
            outraData.setDate(time.getDate() + 1);
			vm.dataPedido = new Date(outraData.toLocaleDateString('pt-BR'));
		}

		function pesquisar(form) {
			vm.items = [];
			restaurantCartService.pesquisar(localStorageService.get('usuarioAutenticado').idCliente, form.dataPedido.$modelValue).then(function(data) {
				if (data != null && data != '') {
					vm.items.push(data);
				} else {
					ionicToast.show('Não existe pedido para a data selecionada.', 'bottom', false, 8000);
				}
			});
		}

		function showOptions() {
			$state.go('app.restaurant-cart-opt');	
		}

		function preparaAlterarPedido(data) {
			restaurantCartService.preparaAlterarPedido(data);
		}

		function inativarPedido(data) {
			restaurantCartService.inativarPedido(localStorageService.get('usuarioAutenticado').idCliente,localStorageService.get('usuarioAutenticado').idUsuario,data);
		}
	}
})();
