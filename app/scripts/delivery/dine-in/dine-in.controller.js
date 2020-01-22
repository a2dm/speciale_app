(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-delivery')
		.controller('DineInController', DineInController);

	DineInController.$inject = [
		'restaurantCartService', 'restaurantOrderProcessor', 'restaurantInfoService', '$ionicHistory', '$state',
		'deliveryDataService', 'phoneNumber', 'productsService', 'ionicToast', 'localStorageService'];

	/* @ngInject */
	function DineInController(
		restaurantCartService, restaurantOrderProcessor, restaurantInfoService, $ionicHistory, $state, deliveryDataService, phoneNumber, productsService, ionicToast, localStorageService) {

		var dataPedidoKey = 'dataPedido';
		var notesKey = 'notes';
		var idPedidoKey = 'idPedido';

		var dataPedidoStr = localStorageService.get(dataPedidoKey);
		var dataPedido = null;
		if (dataPedidoStr != null && dataPedidoStr != '') {
			dataPedido = new Date(localStorageService.get(dataPedidoKey));
		}
		var notes = localStorageService.get(notesKey);
		var idPedido = localStorageService.get(idPedidoKey);

		var vm = angular.extend(this, {
			confirm: confirm,
			restaurant: null,
			data: {
				email: null,
				table: null,
				phone: phoneNumber,
				notes: notes,
				dataPedido: dataPedido,
				idPedido: idPedido
			}
		});

		(function activate() {
			
		})();

		// ********************************************************************

		function loadRestaurantInfo() {
			restaurantInfoService.getRestaurantInfo().then(function(data) {
				vm.restaurant = data.restaurant;
			});
		}

		function confirm(form) {
			var items = restaurantCartService.getAll();
			angular.forEach(form, function(obj) {
				if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
					obj.$setDirty();
				}
			})

			if (!form.$valid) {
				return;
			}

			return productsService.validarData(localStorageService.get('usuarioAutenticado').idCliente, form.idPedido.$modelValue, form.dataPedido.$modelValue).then(function(data) {
				if (data.descricao != null && data.descricao != '') {
					ionicToast.show(data.descricao, 'bottom', false, 5000);
				} else {
					return productsService.cadastrarPedido(localStorageService.get('usuarioAutenticado').idCliente,
						                                   localStorageService.get('usuarioAutenticado').idUsuario,
						                                   form.idPedido.$modelValue,
						                                   form.dataPedido.$modelValue,
				                                           form.notes.$modelValue,
				                                           items).then(function(data) {
						ionicToast.show('Registro inserido com sucesso. Protocolo: ' + data + '.', 'bottom', false, 5000);

						restaurantCartService.flush();
						$state.go('app.home');
					});
				}
			});
		}
	}
})();
