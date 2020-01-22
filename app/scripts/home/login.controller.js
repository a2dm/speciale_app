(function() {
	'use strict';

	angular
		.module('restaurant.home')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$state', 'loginService', '$ionicSideMenuDelegate','$ionicHistory', 'localStorageService'];

	/* @ngInject */
	function LoginController($state, loginService, $ionicSideMenuDelegate, $ionicHistory, localStorageService) {
		
		$ionicSideMenuDelegate.canDragContent(true);

		$ionicHistory.nextViewOptions({
		  disableAnimate: true,
		  disableBack: true,
		  historyRoot: true
		});

		var vm = angular.extend(this, {
			entrar: entrar
		});

		(function activate() {
			
		})();

		// ******************************************************

		function entrar(form) {
			angular.forEach(form, function(obj) {
				if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
					obj.$setDirty();
				}
			})

			if (!form.$valid) {
				return;
			}

			var senha = calcMD5(form.senha.$modelValue.toUpperCase());
			loginService.entrar(form.login.$modelValue.toUpperCase(), senha, localStorageService.get('registrationId'));
		}
	}
})();
