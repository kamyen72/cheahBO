'use strict';
app.controller('webSiteSettingController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'webSiteService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        webSiteService) {
        $scope.dataSource = {
            pageStatus: 'webSiteView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            webSite: {}
        };

        $timeout(function () { $scope.init(); }, 100);

        $scope.init = function () {
            $scope.search();
        };

        $scope.search = function () {
            blockUI.start();
            webSiteService.find({ BrandName: webCode })
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.webSite = response.data.Rows.ListData[0];
                            //$scope.CalculatorPageArray();
                            blockUI.stop();
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg');
                            blockUI.stop();
                        }
                    },
                    function error(data, status, headers, config) {
                        blockUI.stop();
                    });
        };

        $scope.update = function (form) {
            if ($rootScope.valid(form)) return;

            //Line前面要多加~字號
            if ($scope.dataSource.webSite.Line && $scope.dataSource.webSite.Line[0] !== '~') {
                $scope.dataSource.webSite.Line = '~' + $scope.dataSource.webSite.Line;
            }

            if (!$scope.dataSource.webSite.ID) {
                blockUI.start();
                webSiteService.add($scope.dataSource.webSite).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg');
                            blockUI.stop();
                        }
                        else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg');

                            $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                            blockUI.stop();
                            return;
                        }
                    },
                    function error(response) {
                        blockUI.stop();
                    });
            } else {
                blockUI.start();
                webSiteService.update($scope.dataSource.webSite).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg');
                            blockUI.stop();
                        }
                        else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg');

                            $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                            blockUI.stop();
                            return;
                        }
                    },
                    function error(response) {
                        blockUI.stop();
                    });
            }

        };
    }]);