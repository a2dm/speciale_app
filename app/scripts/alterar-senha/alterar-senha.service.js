(function() {
	'use strict';

	angular
		.module('restaurant.alterar-senha')
		.factory('alterarSenhaService', alterarSenhaService);

	alterarSenhaService.$inject = ['$state', 'ionicToast', 'dataService'];

	/* @ngInject */
	function alterarSenhaService($state, ionicToast, dataService) {
		var service = {
			alterar: alterar
		}
		return service;

		function alterar(idUsuario, senha) {
			dataService.alterarSenha(idUsuario, senha).then(function(data) {
				if (data != null && data != '') {
					$state.go('app.home'); 
					ionicToast.show('A senha foi alterada com sucesso!', 'bottom', false, 2000);
				} else {
					ionicToast.show('Login ou senha incorretos!', 'bottom', false, 2000);
				}
			});
		}
	}
})();