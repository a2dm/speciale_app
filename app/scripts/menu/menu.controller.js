(function() {
	'use strict';

	angular
		.module('restaurant.menu')
		.controller('MenuController', MenuController);

	MenuController.$inject = ['categories', 'localStorageService'];

	/* @ngInject */
	function MenuController(categories, localStorageService) {

		var vm = angular.extend(this, {
			categories: categories
		});
	}
})();