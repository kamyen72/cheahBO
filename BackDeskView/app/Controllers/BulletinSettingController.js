'use strict';
app.controller('bulletinSettingController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'bulletinSettingService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        BulletinSettingService) {
        blockUI.start();

        function f_showModel(obj) {
            angular.extend(ngAuthSettings.modalMsg, obj);
            $rootScope.$broadcast('changeModalMsg',false);
        }
        function f_dataInit(obj) {
            obj.DateS = null;
            obj.DateE = null;
            obj.BulletinTitle = null;
            obj.BulletinNotice = null;
            obj.IsEnable = false;
        }

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: {
                CurrentPage: 1,
                PageSize: 10
            },
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
            BulletinSettingService.find($scope.dataSource.searchCondition)
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

            BulletinSettingService.add($scope.dataSource.PostData).then(
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
                            type: response.data.APIRes.ResCode,
                            callBack: ''
                        });
                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                    }
                });
        };

        $scope.update = function (form) {
            if ($rootScope.valid(form)) return;

            BulletinSettingService.update($scope.dataSource.PostData).then(
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
                            type: response.data.APIRes.ResCode,
                            callBack: ''
                        });
                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                    }
                });
        };
        
        $scope.delete = function (data) {
            //if (!confirm('Confirm刪除?')) return;
            $scope.dataSource.PostData = data;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.type = '000';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function (event) {
            BulletinSettingService.del($scope.dataSource.PostData).then(
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
                            type: response.data.APIRes.ResCode,
                            callBack: ''
                        });
                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                    }
                });
        });

        $scope.changeAndSave = function (data) {
            data.DateS = new Date(data.DateS);
            data.DateE = new Date(data.DateE);
            $scope.dataSource.PostData = data;
            $scope.update();
        };

        $scope.clear = function () {
            f_dataInit($scope.dataSource.searchCondition);
        };

        $scope.showAdd = function () {
            $scope.dataSource.pageStatus = 'addView';
            f_dataInit($scope.dataSource.PostData);
        };

        $scope.showEdit = function (data) {
            data.DateS = new Date(data.DateS);
            data.DateE = new Date(data.DateE);
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