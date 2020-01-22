(function() {
	'use strict';

	angular
		.module('restaurant.products')
		.controller('ProductController', ProductController);

	ProductController.$inject = [
		'$scope', '$stateParams', '$state', 'product', 'favoritesService',
		'ionicToast', 'restaurantCartService', '_', 'localStorageService', '$ionicHistory'];

	/* @ngInject */
	function ProductController($scope, $stateParams, $state, product, favoritesService,
	                           ionicToast, restaurantCartService, _, localStorageService, $ionicHistory) {

		$ionicHistory.removeBackView();
		var categoryId = $stateParams.categoryId;

		var vm = angular.extend(this, {
			lengthCart: restaurantCartService.lengthCart(),
			product: product,
			addToCart: addToCart,
			quickAddToCart: quickAddToCart,
			isInFavorites: isInFavorites,
			showCart: showCart,
			toggleFavorites: toggleFavorites,
			hasStandardOptions: false,
			hasExtraOptions: false,
			showFavoritos: showFavoritos
		});

		(function activate() {
			$scope.$on('$ionicView.enter', function() {
				if (vm.product) {
					isInFavorites();
				}
			});
		})();

		// **********************************************

		function isInFavorites() {
			vm.isInFavorites = false;
			if (vm.product.flgFavorito == 'S') {
				vm.isInFavorites = true;
			}
		}

		function showFavoritos() {
			$state.go('app.favorites');
		}

		function quickAddToCart() {
			addToCart(1);
			ionicToast.show('O produto ' + vm.product.desProduto + ' foi adicionado no pedido.', 'bottom', false, 5000);
		}

		function showCart() {
			$state.go('app.restaurant-cart');
		}

		function addToCart(quantity) {
			var quantidadeAnterior = restaurantCartService.lengthCart();
			restaurantCartService.addToCart({
				quantity: quantity,
				name: vm.product.desProduto,
				idProduto: vm.product.idProduto,
				qtdLoteMinimo: vm.product.qtdLoteMinimo,
				qtdMultiplo: vm.product.qtdMultiplo
			}).then(function(data) {
				vm.lengthCart = data;

				if (quantidadeAnterior != data) {
					$state.go('app.restaurant-cart');
				}
			});
		}

		function getSelectedOptions(options) {
			var selectedOptions = _.filter(options, function(option) {
				return option.selected;
			});

			return _.map(selectedOptions, function(option) {
				return {
					name: option.name,
					value: option.value || 0
				};
			});
		}

		function toggleFavorites() {
			if (vm.isInFavorites) {
				favoritesService.deleteItem(localStorageService.get('usuarioAutenticado').idCliente,
						                    vm.product.idProduto,
						                    localStorageService.get('usuarioAutenticado').idUsuario);
				ionicToast.show('O produto ' + vm.product.desProduto + ' foi removido dos favoritos.', 'bottom', false, 5000);

			} else {
				favoritesService.addItem(localStorageService.get('usuarioAutenticado').idCliente,
					                     vm.product.idProduto,
					                     localStorageService.get('usuarioAutenticado').idUsuario);
				ionicToast.show('O produto ' + vm.product.desProduto + ' foi adicionado nos favoritos.', 'bottom', false, 5000);
			}
			vm.isInFavorites = !vm.isInFavorites;
		}
	}
})();
