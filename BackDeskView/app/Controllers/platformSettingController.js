'use strict';
app.controller('platformSettingController', [
    '$scope',
    '$rootScope',
    '$timeout',
    'blockUI',
    'ngAuthSettings',
    'platformService',
    function ($scope, $rootScope, $timeout, blockUI, ngAuthSettings, platformService) 
    {
        var DEFAULT_SEARCH_CONDITION = { CurrentPage: 1, PageSize: 10 };
        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: DEFAULT_SEARCH_CONDITION,
            platform: {},
            listData: [],
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

        $timeout(function () { $scope.init(); }, 100);

        $scope.init = function () {
            $scope.search();
        };

        $scope.search = function () {
            blockUI.start();
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            const ajaxData = {
                ...$scope.dataSource.searchCondition,
                TypeCode: "Platform",
            }
            platformService.find(ajaxData)
                .then(
                    function success(response) {
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

        $scope.add = function (form) {
            if ($rootScope.valid(form)) return;
            
            const ajaxData = {
                ...$scope.dataSource.platform,
                TypeCode: "Platform",
            }
            blockUI.start();
            platformService.add(ajaxData).then(
                function success(response) {
                    blockUI.stop();
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
                    blockUI.stop();
                });

        };

        $scope.update = function (form) {
            if ($rootScope.valid(form)) return;

            const ajaxData = {
                ...$scope.dataSource.platform,
                TypeCode: "Platform",
            }
            blockUI.start();
            platformService.update(ajaxData).then(
                function success(response) {
                    blockUI.stop();
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
                    blockUI.stop();
                });
        };

        $scope.clear = function () {
            $scope.dataSource.searchCondition = DEFAULT_SEARCH_CONDITION;
        };

        $scope.showAdd = function () {
            $scope.dataSource.pageStatus = 'addView';
            $scope.dataSource.platform = {};
        };

        $scope.showEdit = function (data) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.platform = data;
        };

        $scope.showSearch = function () {
            $scope.dataSource.pageStatus = 'searchView';
            $scope.search();
        };

        $scope.$on('showSearch', $scope.showSearch);

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);