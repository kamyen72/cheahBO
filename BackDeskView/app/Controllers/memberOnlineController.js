'use strict';
app.controller('memberOnlineController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'memberShipService',
    'systemConfigService',
    'bankService',
    'transactionsService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        memberShipService, systemConfigService, bankService, transactionsService) {

        $scope.changeConsole = function () {
            console.log($scope.dataSource.selMemberInfo);
        };

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            listData: [],
            agentLevelList: [],
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
            $scope.getSystemConfig();
            //$scope.search();
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            blockUI.start();
            // $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            // $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            // $scope.dataSource.searchCondition.IsOnline = true;

            var ajaxData = {
                ...$scope.dataSource.searchCondition,
                CurrentPage: $scope.dataSource.PagerObj.CurrentPage,
                PageSize: $scope.dataSource.PagerObj.PageSize,
                IsOnline: true,
            };
            if (!IS_MASTER && ngAuthSettings.platformCode && ajaxData.UserName && !ajaxData.UserName.includes('_')) {
                // 不在IS_MASTER 加上當前平台前綴 串出UserName
                ajaxData.UserName = ngAuthSettings.platformCode + '_' + ajaxData.UserName;
            }

            memberShipService.findUser(ajaxData)
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;
                            $scope.dataSource.listData.forEach(p => {
                                p.AgentLevelSCID = $scope.dataSource.agentLevelList.filter(q => q.ID === p.AgentLevelSCID)[0].ConfigName;
                            });
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

        $scope.getSystemConfig = function () {
            blockUI.start();
            //AgentLevel DropDown
            systemConfigService.findSystemConfigChildren({ ListConfigName: ['AgentLevel'] })
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.agentLevelList = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                        blockUI.stop();
                        $scope.search();
                    },
                    function error(data, status, headers) {
                        blockUI.stop();
                    });
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);