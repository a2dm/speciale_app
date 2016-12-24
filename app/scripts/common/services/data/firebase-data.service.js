(function() {
	'use strict';

	angular
		.module('restaurant.common')
		.factory('db', ['ENV', function(ENV) {
			firebase.initializeApp(ENV.firebaseConfig);
			return firebase.database().ref()
		}])
		.factory('firebaseDataService', firebaseDataService);

	firebaseDataService.$inject = ['_', 'db', '$firebaseArray', '$firebaseObject'];

	/* @ngInject */
	function firebaseDataService(_, db, $firebaseArray, $firebaseObject) {
		var service = {
			getCategories: getCategories,
			getProducts: getProducts,
			getProduct: getProduct,
			getFeaturedCategories: getFeaturedCategories,
			getFeaturedProducts: getFeaturedProducts,
			getFeaturedProduct: getFeaturedProduct,
			getBusiness: getBusiness,
			getArticles: getArticles,
			getArticle: getArticle
		};
		return service;

		// ***********************************************************

		function getArticles() {
			var query = db.child('news');
			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getArticle(articleId) {
			var query = db.child('news/' + articleId);
			return $firebaseObject(query).$loaded().then(initItem);
		}

		function getCategories() {
			var query = db.child('categories');
			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getProducts(categoryGuid) {
			var query = db.child('menuItems').orderByChild('category').equalTo(categoryGuid);
			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getProduct(categoryGuid, productGuid) {
			var query = db.child('menuItems/' + productGuid);
			return $firebaseObject(query).$loaded().then(initItem);
		}

		function getFeaturedCategories() {
			var query = db.child('categories').orderByChild('featured').equalTo(true);
			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getFeaturedProducts() {
			var query = db.child('menuItems').orderByChild('isFeatured').equalTo(true);
			return $firebaseArray(query).$loaded().then(initArray);
		}

		function getFeaturedProduct(productGuid) {
			return getProduct(null, productGuid);
		}

		function getBusiness() {
			var query = db.child('business');
			return $firebaseObject(query).$loaded().then(initItem);
		}

		function initItem(item) {
			return angular.extend({}, item, {
				guid: item.$id
			});
		}

		function initArray(array) {
			return _.map(array, initItem);
		}
	}
})();
