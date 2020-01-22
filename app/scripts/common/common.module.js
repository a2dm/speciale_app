(function() {
	'use strict';

	angular
		.module('restaurant.common', ['ionic'])
		.value('convert', window.convert);
})();