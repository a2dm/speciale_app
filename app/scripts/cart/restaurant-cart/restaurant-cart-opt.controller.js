(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-cart')
		.controller('RestaurantCartOptController', RestaurantCartOptController);

	RestaurantCartOptController.$inject = ['restaurantCartService', '$state', '$ionicHistory', 'localStorageService'];

	/* @ngInject */
	function RestaurantCartOptController(restaurantCartService, $state, $ionicHistory, localStorageService) {
		var dataPedidoKey = 'dataPedido';
		var notesKey = 'notes';
		var idPedidoKey = 'idPedido';

		var vm = angular.extend(this, {
			lengthCart: restaurantCartService.lengthCart(),
			showCart: showCart,
			inativarUltimoPedido: inativarUltimoPedido,
			preparaAlterarUltimoPedido: preparaAlterarUltimoPedido,
			novoPedido: novoPedido,
			preparaPesquisar: preparaPesquisar,
			showHome: showHome
		});

		(function activate() {
			
		})();

		function inativarUltimoPedido() {
			restaurantCartService.inativarUltimoPedido(localStorageService.get('usuarioAutenticado').idUsuario,localStorageService.get('usuarioAutenticado').idCliente);
		}

		function preparaAlterarUltimoPedido() {
			restaurantCartService.preparaAlterarUltimoPedido(localStorageService.get('usuarioAutenticado').idCliente);
		}

		function showCart() {
			$state.go('app.restaurant-cart');
		}

		function showHome() {
			$state.go('app.home');
		}

		function novoPedido() {
			return restaurantCartService.novoPedido().then(function(data) {
				$state.go('app.restaurant-cart');	
			});
		}

		function preparaPesquisar() {
			$state.go('app.restaurant-cart-pesquisar');
		}
	}
})();