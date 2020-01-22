(function() {
	'use strict';

	angular
		.module('restaurant.alterar-senha')
		.controller('AlterarSenhaController', AlterarSenhaController);

	AlterarSenhaController.$inject = ['$state', 'alterarSenhaService', 'localStorageService'];

	function AlterarSenhaController($state, alterarSenhaService, localStorageService) {
		var vm = angular.extend(this, {
			senha: null,
			alterar: alterar,
			login: localStorageService.get('usuarioAutenticado').login,
			nomeCliente: localStorageService.get('usuarioAutenticado').nomeCliente
		});

		(function activate() {
			init();
		})();

		function init() {
			vm.senha = null;
		}

		function alterar(form) {
			angular.forEach(form, function(obj) {
				if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
					obj.$setDirty();
				}
			})

			if (!form.$valid) {
				return;
			}

			var senha = calcMD5(form.senha.$modelValue.toUpperCase());
			alterarSenhaService.alterar(localStorageService.get('usuarioAutenticado').idUsuario, senha);
		}
	}
})();