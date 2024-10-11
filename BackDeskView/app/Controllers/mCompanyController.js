'use strict';
app.controller('mCompanyController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'mCompanyService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        mCompanyService) {
        blockUI.start();

        function f_showModel(obj) {
            angular.extend(ngAuthSettings.modalMsg, obj);
            $rootScope.$broadcast('changeModalMsg');
        }

        function f_dataInit(obj) {
            obj.DateS = null;
            obj.DateE = null;
            obj.BulletinTitle = null;
            obj.BulletinNotice = null;
            obj.isEnable = false;
        }

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            listData: [],
            PostData: {},
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
            
            mCompanyService.find($scope.dataSource.searchCondition)
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
                            f_showModel({
                                title: "Message",
                                msg: response.data.APIRes.ResMessage,
                                type: response.data.APIRes.ResCode
                            });
                        }
                        blockUI.stop();
                    },
                    function error(data, status, headers, config) {
                        blockUI.stop();
                    });
        };

        $scope.add = function (form) {
            if ($rootScope.valid(form)) return;

            mCompanyService.add($scope.dataSource.PostData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode,
                            callBack: 'showSearch'
                        });
                    }
                    else {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode
                        });

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        return;
                    }
                },
                function error(response) {

                });

        };

        $scope.update = function (form) {
            if ($rootScope.valid(form)) return;

            mCompanyService.update($scope.dataSource.PostData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode,
                            callBack: 'showSearch'
                        });
                    }
                    else {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode
                        });

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        return;
                    }
                },
                function error(response) {

                });
        };
        

        $scope.delete = function (data) {
            $scope.dataSource.PostData = data;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.type = '000';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function (event) {
            mCompanyService.del(data).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode,
                            callBack: 'showSearch'
                        });
                    }
                    else {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode
                        });

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
            $scope.dataSource.PostData = {};
        };

        $scope.showEdit = function (data) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.PostData = data;
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