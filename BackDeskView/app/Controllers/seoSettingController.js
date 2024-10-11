'use strict';
app.controller('seoSettingController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'seoService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        seoService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            seo: {},
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
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            seoService.find($scope.dataSource.searchCondition)
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
                            //$scope.CalculatorPageArray();
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
            if (form && form.$invalid) {
                var errorMsg = '';
                if (form.$error.required) {
                    errorMsg += '必填欄位：';
                    form.$error.required.forEach(p => { errorMsg += p.$name + '.'; });
                }

                if (form.$error.myValidator) {
                    errorMsg += '欄位格式有誤：';
                    form.$error.myValidator.forEach(p => { errorMsg += p.$name + '.'; });
                }

                ngAuthSettings.modalMsg.title = "Message";
                ngAuthSettings.modalMsg.msg = errorMsg;
                ngAuthSettings.modalMsg.type = '100';
                $rootScope.$broadcast('changeModalMsg');

                $scope.resetInfo();
                return;
            }

            seoService.add($scope.dataSource.seo).then(
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

        $scope.update = function (form) {
            if ($rootScope.valid(form)) return;

            seoService.update($scope.dataSource.seo).then(
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

        $scope.delete = function (seo) {
            $scope.dataSource.seo = seo;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.type = '000';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function (event) {
            seoService.delete($scope.dataSource.seo).then(
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
            $scope.dataSource.searchCondition = { CurrentPage: 1, PageSize: 10 };
        };

        $scope.showAdd = function () {
            $scope.dataSource.pageStatus = 'addView';
            $scope.dataSource.seo = {};
        };

        $scope.showEdit = function (seo) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.seo = seo;
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