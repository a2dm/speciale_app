(function() {
	'use strict';

	angular
		.module('restaurant.alterar-senha', [
			'ionic',
			'restaurant.common'
		])
		
		.config(function($stateProvider) {
			$stateProvider
				.state('app.alterar-senha', {
					url: '/alterar-senha',
					views: {
						'menuContent': {
							templateUrl: 'scripts/alterar-senha/alterar-senha.html',
							controller: 'AlterarSenhaController as vm'
						}
					},
					cache: false
				});
		});
})();