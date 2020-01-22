(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-cart')
		.controller('RestaurantCartController', RestaurantCartController);

	RestaurantCartController.$inject = ['$ionicListDelegate', '_', 'restaurantCartService', '$state', 'ionicToast', 'localStorageService', 'productsService', '$ionicHistory'];

	/* @ngInject */
	function RestaurantCartController($ionicListDelegate, _, restaurantCartService, $state, ionicToast, localStorageService, productsService, $ionicHistory) {

		$ionicHistory.removeBackView();
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
			items: [],
			proceedToPayment: proceedToPayment,
			changeQuantity: changeQuantity,
			deleteItem: deleteItem,
			getItemTotal: getItemTotal,
			showFavoritos: showFavoritos,
			showOptions: showOptions,
			total: 0,
			currency: null,
			confirm: confirm,
			showHome: showHome,
			data: {
				notes: notes,
				dataPedido: dataPedido,
				idPedido: idPedido
			}
		});

		(function activate() {
			loadItems();
		})();

		// ********************************************************************

		function showHome() {
			$state.go('app.home');
		}

		function loadItems() {
			vm.items = restaurantCartService.getAll();
			calculateTotalAmount();
		}

		function proceedToPayment() {
			if (vm.items != null && vm.items.length > 0)  {
				$state.go('app.dine-in');
			} else {
				ionicToast.show('Pelo menos 1 produto deve ser adicionado ao pedido.', 'bottom', false, 8000);
			}
		}

		function flushCart() {
			restaurantCartService.flush();
			vm.items = [];
			calculateTotalAmount();
		}

		function calculateTotalAmount() {
			vm.currency = null;
			var total = 0;
			_.each(vm.items, function(item) {
				total += getItemTotal(item);
				vm.currency = item.currency;
			});
			vm.total = total;
		}

		function getItemTotal(item) {
			var total = item.price * item.quantity;
			if (item.options) {
				_.each(item.options, function(option) {
					total += option.value * item.quantity;
				});
			}
			return total;
		}

		function changeQuantity(item) {
			restaurantCartService.changeQuantity(item)
				.then(loadItems);
			$ionicListDelegate.closeOptionButtons();
		}

		function deleteItem(item) {
			restaurantCartService.deleteItem(item);
			loadItems();
		}

		function showFavoritos() {
			$state.go('app.favorites');
		}

		function showOptions() {
			$state.go('app.restaurant-cart-opt');	
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

			if (vm.items == null || vm.items.length <= 0)  {
				ionicToast.show('Pelo menos 1 produto deve ser adicionado ao pedido.', 'bottom', false, 8000);
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
						ionicToast.show('Registro inserido com sucesso. Protocolo: ' + data + '.', 'bottom', false, 8000);

						restaurantCartService.novoPedido();
						$state.go('app.home');
					});
				}
			});
		}
	}
})();
