"use strict";
angular.module('mobile_app_inventory').controller(
        'LoginCtrl', [
        '$scope', 'jsonRpc', '$state', '$translate', 'SettingModel', 'ProductModel',
        function ($scope, jsonRpc, $state, $translate, SettingModel, ProductModel) {

    $scope.data = {
        'database': '',
        'databases': [],
        'login': '',
        'password': '',
    };

    $scope.$on('$ionicView.beforeEnter', function() {
        if ($state.current.name === 'logout') {
            // SettingModel.reset_list();
            // ProductModel.reset_list();
            jsonRpc.logout(true);
        }
    });

    $scope.init = function () {
        // Set focus
        // angular.element(document.querySelector('#input_login'))[0].focus();

        // Load available databases
        jsonRpc.getDbList().then(function (databases) {
            $scope.data.databases = databases;
            if (databases.length >= 1) {
                $scope.data.database = databases[0];
            }
        }, function (reason) {
            $scope.errorMessage = $translate.instant('Unreachable Service');
        });
    };

    $scope.submit = function () {
        console.log("submit");
        jsonRpc.login(
            $scope.data.database,
            $scope.data.login,
            $scope.data.password
        ).then(function (user) {
            console.log("then du login");
            console.log(user);
            jsonRpc.call(
                'mobile.app.inventory',
                'check_group',
                ['stock.group_stock_user']
            ).then(function (res) {
                console.log("fromage");
                console.log(res);
                if (res) {
                    $scope.errorMessage = '';
                    $state.go('inventory', {});
                } else {
                    $scope.errorMessage = $translate.instant(
                        'Insufficient Acces Right: you should be member of' +
                        " 'Warehouse / user' group.");
                }
            }, function (e) {
                console.log("Error");
                console.log(e);
                $scope.errorMessage = $translate.instant('Une vieille erreur');
            });
        }, function (e) {
            console.log("Error");
            console.log(e);
            $scope.errorMessage = $translate.instant('Bad Login / Password');
        });
    };

}]);
