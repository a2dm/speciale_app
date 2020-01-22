(function () {
    'use strict';

    angular
        .module('restaurant.common')
        .factory('localDataService', localDataService);

    localDataService.$inject = ['$http', '$q', '_', '$ionicLoading'];

    /* @ngInject */
    function localDataService($http, $q, _, $ionicLoading) {
        var urlPrefix = 'misc/';
        var categoriesUrl = urlPrefix + 'categories.json';
        var featuredProductsUrl = urlPrefix + 'featured.json';
        var businessUrl = urlPrefix + 'business.json';
        var newsUrl = urlPrefix + 'news.json';
        var categories = [];
        var featuredProducts = [];
        var products = {};
        var articles = [];
        var proxyUrl = 'http://localhost:8080/spdmws';

        var service = {
            getCategories: getCategories,
            getProducts: getProducts,
            getProduct: getProduct,
            getFeaturedCategories: getFeaturedCategories,
            getFeaturedProducts: getFeaturedProducts,
            getFeaturedProduct: getFeaturedProduct,
            getBusiness: getBusiness,
            getArticles: getArticles,
            getArticle: getArticle,
            getListProductByClient: getListProductByClient,
            cadastrarPedido: cadastrarPedido,
            alterarUltimoPedido: alterarUltimoPedido,
            preparaPesquisar: preparaPesquisar,
            pesquisar: pesquisar,
            inativarUltimoPedido: inativarUltimoPedido,
            preparaAlterarUltimoPedido: preparaAlterarUltimoPedido,
            alterarPedido: alterarPedido,
            getUltimoPedido: getUltimoPedido,
            preparaAlterarPedido: preparaAlterarPedido,
            inativarPedido: inativarPedido,
            validar: validar,
            validarData: validarData,
            validarInativar: validarInativar,
            novoPedido: novoPedido,
            entrar: entrar,
            listarFavoritoByCliente: listarFavoritoByCliente,
            excluirFavorito: excluirFavorito,
            adicionarFavorito: adicionarFavorito,
            alterarSenha: alterarSenha,
            recuperarSenha: recuperarSenha
        };

        return service;

        function getBusiness() {
            return $http.get(businessUrl).then(function (response) {
                var business = response.data.result;
                return business;
            });
        }

        function getArticles() {
            if (articles.length) {
                return $q.when(articles);
            }

            return $http.get(newsUrl).then(function (response) {
                articles = response.data.result;
                return articles;
            });
        }

        function getArticle(articleId) {
            return getArticles().then(function (articles) {
                return _.find(articles, function (article) {
                    return article.guid == articleId;
                });
            });
        }

        function getCategories() {
            return $http.get(categoriesUrl).then(function (response) {
                categories = response.data.result;

                _.each(categories, function (category) {
                    var index = category.url.lastIndexOf('/');
                    category.url = urlPrefix + category.url.substring

                        (index + 1);
                });

                return categories;
            });
        }

        function getFeaturedCategories() {
            return getCategories().then(function (categories) {
                return _.filter(categories, 'featured', true);
            });
        }

        function getProducts(categoryGuid) {
            var category = _.find(categories, function (category) {
                return category.guid === categoryGuid;
            });
            return $http.get(category.url).then(function (response) {
                products[categoryGuid] = response.data.result;
                _.each(products[categoryGuid], function (product) {
                    // We do not need this touch. price should always 

                    //coming with a currency property 
                    // _.each(product.price, function(price) {
                    //  price.currency = price.value[0];
                    //  price.value = parseFloat

                    (price.value.substring(1));
                    // });
                });
                return products[categoryGuid];
            });
        }

        function getFeaturedProducts() {
            return $http.get(featuredProductsUrl).then(function (response) {
                featuredProducts = response.data.result;
                return featuredProducts;
            });
        }

        function http_request(request) {
            $ionicLoading.show({});
            return $http(request)
                .then(
                    function successCallback(response) {
                        $ionicLoading.hide({});
                        return response.data;
                    },
                    function errorCallback(response) {
                        console.log(response);
                        $ionicLoading.hide({});
                    }
                )

        }

        function http_post_form_data(endpoint, formData){
            var request = {
                method: 'POST',
                url: proxyUrl + endpoint,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            }
            return http_request(request);
        }

        function getProduct(productGuid, clientGuid) {
            return http_post_form_data('/PedidoWS/getProduct', 'idProduto=' + productGuid + '&idCliente=' + clientGuid);
        }

        function getFeaturedProduct(productGuid) {
            var product = _.find(featuredProducts, function (product) {
                return product.guid === productGuid;
            });
            return $q.when(product);
        }

        function getListProductByClient(clientGuid) {
            return http_post_form_data('/PedidoWS/getListaProdutoByCliente', 'idCliente=' + clientGuid);
        }

        function cadastrarPedido(idCliente, idUsuario, idPedido, dataPedido, observacao, listaProduto) {
            return http_post_form_data('/PedidoWS/cadastrar', 'idCliente=' + idCliente
                                                            + '&idUsuario=' + idUsuario
                                                            + '&idPedido=' + idPedido
                                                            + '&data=' + dataPedido
                                                            + '&observacao=' + observacao
                                                            + '&produtosAdicionadosJson=' + angular.toJson(listaProduto));
        }

        function preparaAlterarUltimoPedido(idCliente) {
            return http_post_form_data('/PedidoWS/preparaAlterarUltimoPedido', 'idCliente=' + idCliente);
        }

        function preparaAlterarPedido(idPedido) {
            return http_post_form_data('/PedidoWS/preparaAlterarPedido', 'idPedido=' + idPedido);
        }

        function alterarUltimoPedido(idUsuario, data, observacao, listaProdutosAdicionados) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/alterarUltimoPedido',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idUsuario=' + idUsuario
                    + '&data=' + data
                    + '&observacao=' + observacao
                    + '&produtosAdicionadosJson=' + angular.toJson(listaProdutosAdicionados)
            }

            return http_request(request);
        }

        function preparaPesquisar() {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/preparaPesquisar',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            return http_request(request);
        }

        function pesquisar() {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/pesquisar',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'data=' + data
            };

            return http_request(request);
        }

        function alterarPedido(idPedido, idUsuario, data, observacao, listaProdutosAdicionados) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/alterarPedido',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idPedido=' + idPedido
                    + '&idUsuario=' + idUsuario
                    + '&data=' + data
                    + '&observacao=' + observacao
                    + '&produtosAdicionadosJson=' + angular.toJson(listaProdutosAdicionados)
            };

            return http_request(request);
        }

        function inativarUltimoPedido(idUsuario, idCliente) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/inativarUltimoPedido',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idUsuario=' + idUsuario
                    + '&idCliente=' + idCliente
            };

            return http_request(request);
        }

        function inativarPedido(idUsuario, idPedido) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/inativarPedido',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idUsuario=' + idUsuario
                    + '&idPedido=' + idPedido
            };

            return http_request(request);
        }

        function getUltimoPedido(idCliente) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/getUltimoPedido',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idCliente=' + idCliente
            };

            return http_request(request);
        }

        function pesquisar(idCliente, dataPedido) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/getPedido',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idCliente=' + idCliente
                    + '&dataPedido=' + dataPedido
            };

            return http_request(request);
        }


        function validar(idProduto, quantidade) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/validar',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idProduto=' + idProduto
                    + '&quantidade=' + quantidade
            };

            return http_request(request);
        }

        function validarData(idCliente, idPedido, dataPedido) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/validarData',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idCliente=' + idCliente
                    + '&idPedido=' + idPedido
                    + '&dataPedido=' + dataPedido
            };

            return http_request(request);
        }

        function validarInativar(idCliente, dataPedido) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/validarInativar',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idCliente=' + idCliente
                    + '&dataPedido=' + dataPedido
            };

            return http_request(request);
        }

        function novoPedido() {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/novoPedido',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            return http_request(request);
        }

        function entrar(login, senha, deviceId) {
            return http_post_form_data('/LoginWS/login', 'login=' + login
                                                        + '&senha=' + senha
                                                        + '&deviceId=' + deviceId);
        }

        function alterarSenha(idUsuario, senha) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/LoginWS/alterarSenha',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idUsuario=' + idUsuario
                    + '&senha=' + senha
            };

            return http_request(request);
        }

        function recuperarSenha(email) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/LoginWS/recuperarSenha',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'email=' + email
            };

            return http_request(request);
        }

        function excluirFavorito(idCliente, idProduto, idUsuario) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/excluirFavorito',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idCliente=' + idCliente
                    + '&idProduto=' + idProduto
                    + '&idUsuario=' + idUsuario
            };

            return http_request(request);
        }

        function adicionarFavorito(idCliente, idProduto, idUsuario) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/adicionarFavorito',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idCliente=' + idCliente
                    + '&idProduto=' + idProduto
                    + '&idUsuario=' + idUsuario
            };

            return http_request(request);
        }

        function listarFavoritoByCliente(idCliente) {
            var request = {
                method: 'POST',
                url: proxyUrl + '/PedidoWS/listarFavoritoByCliente',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idCliente=' + idCliente
            };

            return http_request(request);
        }
    }
})();
