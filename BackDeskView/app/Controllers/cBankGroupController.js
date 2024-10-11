'use strict';
app.controller('cBankGroupController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'cBankService',
    'bankGroupService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        cBankService, bankGroupService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            listData: [],
            bankListData: [],
            userLevel: {},
            resetInfo: {},
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
            $scope.searchBankList();
            blockUI.stop();
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            bankGroupService.findByUserLevel($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        console.log(response.data.Rows.ListData);
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                        blockUI.stop();
                    },
                    function error(data, status, headers, config) {
                        blockUI.stop();
                    });
        };

        $scope.searchBankList = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            cBankService.find({})
                .then(
                    function success(response, status, headers, config) {
                        console.log(response.data.Rows.ListData);
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.bankListData = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                        blockUI.stop();
                    },
                    function error(data, status, headers, config) {
                        blockUI.stop();
                    });
        };

        $scope.update = function () {

            var dataObj = {};
            dataObj.UserLevelID = $scope.dataSource.userLevel.LevelID;
            dataObj.BankIDList = [];

            $scope.dataSource.bankListData.filter(p => p.IsChecked).forEach(p => { dataObj.BankIDList.push(p.ID); });

            bankGroupService.updateBankGroup(dataObj).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'test';
                        $rootScope.$broadcast('changeModalMsg', false);
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        $rootScope.$broadcast('changeModalMsg', false);

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        return;
                    }
                },
                function error(response) {

                });
        };

        $scope.checkAll = function () {
            $scope.dataSource.bankListData.forEach(p => { p.IsChecked = $scope.dataSource.checkAll; });
        };

        $scope.showSearch = function () {
            $scope.dataSource.checkAll = false;
            $scope.dataSource.pageStatus = 'searchView';
            $scope.search();
        };

        $scope.showEdit = function (userLevel) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.userLevel = userLevel;

            $scope.dataSource.bankListData.forEach(p => { p.IsChecked = false; });
            $scope.dataSource.userLevel.CBanks.forEach(p => { $scope.dataSource.bankListData.filter(b => b.ID === p.ID)[0].IsChecked = true; });
        };

        $scope.resetInfo = function () {
            $.extend($scope.dataSource.userLevel, $scope.dataSource.resetInfo);
        };

    }]);