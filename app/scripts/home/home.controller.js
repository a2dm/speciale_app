(function() {
	'use strict';

	angular
		.module('restaurant.home')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$rootScope', '$ionicPopup', '$state', 'homeService', '$ionicSlideBoxDelegate', '$ionicHistory', '$ionicNavBarDelegate', 'localStorageService', '$window'];

	/* @ngInject */
	function HomeController($rootScope, $ionicPopup, $state, homeService, $ionicSlideBoxDelegate, $ionicHistory, $ionicNavBarDelegate, localStorageService, $window) {
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
		$ionicHistory.removeBackView();

		var vm = angular.extend(this, {
			categories: [],
			products: [],
			showProducts: showProducts,
			showProductDetails: showProductDetails,
			storeName: '',
			showCart: showCart,
			logout: logout,
			openProfile: openProfile,
			login: localStorageService.get('usuarioAutenticado').login,
			nomeCliente: localStorageService.get('usuarioAutenticado').nomeCliente
		});

		(function activate() {
			loadProducts();
			loadCategories();
			loadBusinessInfo();
		})();

		// ******************************************************

		function openProfile() {
			var popup = createProfilePopup();

			return $ionicPopup.show(popup).then(function(result) {
				if (result != null && result.canceled) {
					return;
				}
			});
		}

		function createProfilePopup() {
			var scope = $rootScope.$new();
			scope.data = {
				nome: localStorageService.get('usuarioAutenticado').nome,
				nomeCliente: localStorageService.get('usuarioAutenticado').nomeCliente
			};

			return {
				templateUrl: 'scripts/home/profile.html',
				title: 'Perfil',
				scope: scope,
				buttons: [{
					text: 'Sair',
					type: 'button-positive',
					onTap: function(e) {
						logout();
					}
				} , {
					text: 'Cancelar',
					onTap: function(e) {
						scope.data.canceled = true;
						return scope.data;
					}
				}]
			};
		}

		function loadProducts() {
			homeService.getFeaturedProducts()
				.then(function(products) {
					vm.products = products;
					$ionicSlideBoxDelegate.update();
				});
		}

		function loadCategories() {
			homeService.getFeaturedCategories()
				.then(function(categories) {
					vm.categories = categories;
				});
		}

		function loadBusinessInfo() {
			homeService.getBusiness()
				.then(function(businessInfo) {
					vm.storeName = businessInfo.storeName;
				});
		}

		function showProductDetails(product) {
			$state.go('app.featured-product', {
				productId: product.guid
			});
		}

		function showCart() {
			$state.go('app.restaurant-cart-opt');
		}

		function logout() {
			$window.localStorage.clear();
		    $ionicHistory.clearCache();
		    $ionicHistory.clearHistory();
			$state.go('app.login');
		}

		function showProducts(category) {
			$state.go('app.products', {
				categoryId: category.guid,
				categoryName: category.title
			});
		}
	}
})();
