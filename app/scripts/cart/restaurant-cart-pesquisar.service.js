(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-cart')
		.factory('restaurantCartPesquisarService', restaurantCartPesquisarService);

	restaurantCartPesquisarService.$inject = ['$rootScope', '$ionicPopup', '$state', '_', 'localStorageService', 'ionicToast', 'dataService', '$filter'];

	/* @ngInject */
	function restaurantCartPesquisarService($rootScope, $ionicPopup, $state, _, localStorageService, ionicToast, dataService, $filter) {
		var restaurantCartAltKey = 'restaurant-cart';
		var cart = localStorageService.get(restaurantCartAltKey) || [];

		var dataPedidoKey = 'dataPedido';
		var notesKey = 'notes';

		var service = {
			addToCart: addToCart,
			deleteItem: deleteItem,
			changeQuantity: changeQuantity,
			inativarUltimoPedido: inativarUltimoPedido,
			preparaAlterarUltimoPedido: preparaAlterarUltimoPedido,
			pesquisar: pesquisar,
			preparaAlterarPedido: preparaAlterarPedido,
			inativarPedido: inativarPedido,
			flush: flush,
			showCart: showCart,
			getAll: getAll
		};
		return service;

		// ********************************************************

		function deleteItem(itemToRemove) {
			_.remove(cart, function(item) {
				return item === itemToRemove;
			});
			localStorageService.set(restaurantCartAltKey, cart);
		}

		function flush() {
			cart = [];
			localStorageService.set(restaurantCartAltKey, cart);
		}

		function getAll() {
			return cart;
		}

		function addToCart(cartItem) {
			if (cartItem.quantity) {
				saveToCart(cartItem, cartItem.quantity);
				return;
			}

			var popup = createAddToCartPopup(cartItem.name);

			return $ionicPopup.show(popup).then(function(result) {
				if (result.canceled) {
					return;
				}

				saveToCart(cartItem, result.quantity);
				ionicToast.show('\'' + cartItem.name +
				'\' foi adicionado no pedido', 'bottom', false, 5000);
			});
		}

		function saveToCart(cartItem, quantity) {
			cartItem.quantity = quantity;
			cart.push(cartItem);

			localStorageService.set(restaurantCartAltKey, cart);
		}

		function changeQuantity(cartItem) {
			var popup = createAddToCartPopup(cartItem.name, cartItem.quantity);

			return $ionicPopup.show(popup).then(function(result) {
				if (result.canceled) {
					return;
				}

				cartItem.quantity = result.quantity;
				localStorageService.set(restaurantCartAltKey, cart);
			});
		}

		function createAddToCartPopup(title, quantity) {
			var scope = $rootScope.$new();
			scope.data = {
				quantity: quantity || 1
			};

			return {
				templateUrl: 'scripts/cart/add-to-cart.html',
				title: title,
				scope: scope,
				buttons: [{
					text: 'Cancelar',
					onTap: function(e) {
						scope.data.canceled = true;
						return scope.data;
					}
				}, {
					text: '<b>Adicionar</b>',
					type: 'button-positive',
					onTap: function(e) {
						var quantity = parseInt(scope.data.quantity);
						if (quantity > 0) {
							scope.data.quantity = quantity;
							return scope.data;
						} else {
							alert('Quantity should be greather then zero');
							e.preventDefault();
						}
					}
				}]
			};
		}

		function inativarUltimoPedido(idUsuario, idCliente) {
			return dataService.inativarUltimoPedido(idUsuario,idCliente)
				.then(function(data) {
					ionicToast.show('O último pedido ' + data +' foi inativado com sucesso.', 'bottom', false, 5000);
					$state.go('app.home');
				});
		}

		function preparaAlterarUltimoPedido(idCliente) {
			return dataService.preparaAlterarUltimoPedido(idCliente)
				.then(function(data) {
					$state.go('app.restaurant-cart-alt');
				});
		}

		function pesquisar(idCliente, dataPedido) {
			return dataService.pesquisar(idCliente, dataPedido).then(function(data) {
				return data;
			});
		}

		function preparaAlterarPedido(data) {
			flush();
		
			localStorageService.set(dataPedidoKey, $filter('date')(data.pedido.dataPedido, 'yyyy/MM/dd', null));
			localStorageService.set(notesKey, data.pedido.observacao);
			
			_.each(data.listaPedidoProduto, function(item) {
				saveToCart(item, item.qtdSolicitada);
			});
			showCart();
		}

		function showCart() {
			$state.go('app.restaurant-cart');
		}

		function inativarPedido(idPedido) {
			return dataService.inativarPedido(idPedido).then(function(data) {
				return data;
			});
		}
	}
})();