(function () {
    'use strict';

    angular
        .module('restaurant.common')
        .factory('localDataService', localDataService);

    localDataService.$inject = ['$http', '$q', '_'];

    /* @ngInject */
    function localDataService($http, $q, _) {
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
            adicionarFavorito: adicionarFavorito
        };

        return service;

        function getBusiness(){
            return $http.get(businessUrl).then(function(response) {
                var business = response.data.result;
                return business;
            });
        }

        function getArticles() {
            if (articles.length) {
                return $q.when(articles);
            }

            return $http.get(newsUrl).then(function(response) {
                articles = response.data.result;
                return articles;
            });
        }

        function getArticle(articleId) {
            return getArticles().then(function(articles) {
                return _.find(articles, function(article) {
                    return article.guid == articleId;
                });
            });
        }

        function getCategories() {
            return $http.get(categoriesUrl).then(function(response) {
                categories = response.data.result;

                _.each(categories, function(category) {
                    var index = category.url.lastIndexOf('/');
                    category.url = urlPrefix + category.url.substring

(index + 1);
                });

                return categories;
            });
        }

        function getFeaturedCategories() {
            return getCategories().then(function(categories) {
                return _.filter(categories, 'featured', true);
            });
        }

        function getProducts(categoryGuid) {
            var category = _.find(categories, function(category) {
                return category.guid === categoryGuid;
            });
            return $http.get(category.url).then(function(response) {
                products[categoryGuid] = response.data.result;
                _.each(products[categoryGuid], function(product) {
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
            return $http.get(featuredProductsUrl).then(function(response) {
                featuredProducts = response.data.result;
                return featuredProducts;
            });
        }

        function getProduct(productGuid, clientGuid) {
            var request = {
                method: 'POST',
                url: 'speciale_app/PedidoWS/getProduct',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idProduto=' + productGuid
                    + '&idCliente=' + clientGuid
            };

            return $http(request).then(function(response) {
                return response.data;
            });
        }

        function getFeaturedProduct(productGuid) {
            var product = _.find(featuredProducts, function(product) {
                return product.guid === productGuid;
            });
            return $q.when(product);
        }

        function getListProductByClient(clientGuid) {
            var request = {
                method: 'POST',
                url: 'speciale_app/PedidoWS/getListaProdutoByCliente',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idCliente=' + clientGuid
            };

            return $http(request).then(function(response) {
                return response.data;
            });
        }

        function cadastrarPedido(idCliente, idUsuario, idPedido, dataPedido, observacao, listaProduto) {
            var request = {
                method: 'POST',
                url: 'speciale_app/PedidoWS/cadastrar',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'idCliente=' + idCliente
                    + '&idUsuario=' + idUsuario
                    + '&idPedido=' + idPedido
                    + '&data=' + dataPedido
                    + '&observacao=' + observacao
                    + '&produtosAdicionadosJson=' + angular.toJson(listaProduto)
            };

            return $http(request).then(function(response) {
                return response.data;
            });
        }

        function preparaAlterarUltimoPedido(idCliente) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/preparaAlterarUltimoPedido',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idCliente=' + idCliente
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function preparaAlterarPedido(idPedido) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/preparaAlterarPedido',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idPedido=' + idPedido
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function alterarUltimoPedido(idUsuario, data, observacao, listaProdutosAdicionados) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/alterarUltimoPedido',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idUsuario=' + idUsuario
                        + '&data=' + data
                        + '&observacao=' + observacao
                        + '&produtosAdicionadosJson=' + angular.toJson(listaProdutosAdicionados)
                }

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function preparaPesquisar() {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/preparaPesquisar',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function pesquisar() {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/pesquisar',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'data=' + data
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function alterarPedido(idPedido, idUsuario, data, observacao, listaProdutosAdicionados) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/alterarPedido',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idPedido=' + idPedido
                        + '&idUsuario=' + idUsuario
                        + '&data=' + data
                        + '&observacao=' + observacao
                        + '&produtosAdicionadosJson=' + angular.toJson(listaProdutosAdicionados)
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function inativarUltimoPedido(idUsuario, idCliente) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/inativarUltimoPedido',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idUsuario=' + idUsuario
                        + '&idCliente=' + idCliente
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function inativarPedido(idUsuario, idPedido) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/inativarPedido',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idUsuario=' + idUsuario
                        + '&idPedido=' + idPedido
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function getUltimoPedido(idCliente) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/getUltimoPedido',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idCliente=' + idCliente
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function pesquisar(idCliente, dataPedido) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/getPedido',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idCliente=' + idCliente
                        + '&dataPedido=' + dataPedido
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }


        function validar(idProduto, quantidade) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/validar',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idProduto=' + idProduto
                        + '&quantidade=' + quantidade
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function validarData(idCliente, idPedido, dataPedido) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/validarData',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idCliente=' + idCliente
                        + '&idPedido=' + idPedido
                        + '&dataPedido=' + dataPedido
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function validarInativar(idCliente, dataPedido) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/validarInativar',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idCliente=' + idCliente
                        + '&dataPedido=' + dataPedido
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function novoPedido() {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/novoPedido',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function entrar(login, senha) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/LoginWS/login',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'login=' + login
                        + '&senha=' + senha
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function excluirFavorito(idCliente, idProduto, idUsuario) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/excluirFavorito',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idCliente=' + idCliente
                        + '&idProduto=' + idProduto
                        + '&idUsuario=' + idUsuario
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function adicionarFavorito(idCliente, idProduto, idUsuario) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/adicionarFavorito',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idCliente=' + idCliente
                        + '&idProduto=' + idProduto
                        + '&idUsuario=' + idUsuario
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }

        function listarFavoritoByCliente(idCliente) {
            var request = {
                    method: 'POST',
                    url: 'speciale_app/PedidoWS/listarFavoritoByCliente',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'idCliente=' + idCliente
                };

                return $http(request).then(function(response) {
                    return response.data;
                });
        }
    }
})();
