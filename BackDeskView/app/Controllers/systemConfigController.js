'use strict';
app.controller('systemConfigController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'systemConfigService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        systemConfigService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            listData: [],
            systemConfig: {},
            PagerObj: {
                CurrentPage: 1,
                PageSize: 10,
                TotalItems: 0,
                PageArray: [],
                PageRangeMax: 10,
                PageRangeMin: 1,
                thisPage: 1
            }
        };

        $scope.init = function () {
            $scope.search();
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            systemConfigService.findSystemConfig($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;
                            //頁籤
                            $scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                            $scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                            $scope.dataSource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                            $scope.dataSource.PagerObj["PageArray"] = [];
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            
                            $rootScope.$broadcast('changeModalMsg');
                        }
                        blockUI.stop();
                    },
                    function error(data, status, headers, config) {
                        blockUI.stop();
                    });
        };

        $scope.addSystemConfig = function (form) {
            if ($rootScope.valid(form)) return;

            systemConfigService.addSystemConfig($scope.dataSource.systemConfig).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';
                        
                        $rootScope.$broadcast('changeModalMsg');
                        $scope.search();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        
                        $rootScope.$broadcast('changeModalMsg');

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        return;
                    }
                },
                function error(response) {

                });

        };

        $scope.updateSystemConfig = function (form) {
            if ($rootScope.valid(form)) return;

            systemConfigService.updateSystemConfig($scope.dataSource.systemConfig).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';
                        
                        $rootScope.$broadcast('changeModalMsg');
                        $scope.search();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        
                        $rootScope.$broadcast('changeModalMsg');

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        return;
                    }
                },
                function error(response) {

                });
        };

        $scope.deleteSystemConfig = function (systemConfig) {
            $scope.dataSource.systemConfig = systemConfig;

            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.type = '000';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);

        };

        $scope.$on('confirmDel', function (event) {
            systemConfigService.delSystemConfig($scope.dataSource.systemConfig).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';
                        
                        $rootScope.$broadcast('changeModalMsg');
                        $scope.search();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        
                        $rootScope.$broadcast('changeModalMsg');

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        return;
                    }
                },
                function error(response) {

                });
        });

        $scope.clear = function () {
            $scope.dataSource.searchCondition = {};
        };

        $scope.showAdd = function () {
            $scope.dataSource.pageStatus = 'addView';
            $scope.dataSource.systemConfig = {};
        };

        $scope.showEdit = function (systemConfig) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.systemConfig = systemConfig;
        };

        $scope.showSearch = function () {
            $scope.dataSource.pageStatus = 'searchView';
            $scope.search();
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);