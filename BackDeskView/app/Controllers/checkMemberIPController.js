'use strict';
app.controller('checkMemberIPController', [
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

        var validatorObj = new memberManageValidator();

        $scope.changeConsole = function () {
            console.log($scope.dataSource.selMemberInfo);
        };

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10},
            listData: [],
            loginInfo: {},
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
            // $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            // $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            var ajaxData = {
                ...$scope.dataSource.searchCondition,
                CurrentPage: $scope.dataSource.PagerObj.CurrentPage,
                PageSize: $scope.dataSource.PagerObj.PageSize,
            };
            if (!IS_MASTER && ngAuthSettings.platformCode && ajaxData.UserName && !ajaxData.UserName.includes('_')) {
                // 不在IS_MASTER 加上當前平台前綴 串出UserName
                ajaxData.UserName = ngAuthSettings.platformCode + '_' + ajaxData.UserName;
            }

            memberShipService.findLoginHistory(ajaxData)
                .then(
                    function success(response, status, headers, config) {
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
                    },
                    function error(data, status, headers, config) {
                    });
        };

        $scope.showIPDialog = function (login) {
            $scope.dataSource.loginInfo = login;
            $('#ShowIPDialog').click();
            
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);