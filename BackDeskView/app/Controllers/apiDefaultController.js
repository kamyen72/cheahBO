'use strict';
app.controller('apiDefaultController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'apiDefaultService',
    'functionGroupService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings,
        apiDefaultService, functionGroupService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: {},
            listData: [],
            apiDefault: {},
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

        $scope.search = function () {

            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            apiDefaultService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;
                            //頁籤
                            $scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                            $scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                            $scope.dataSource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                            $scope.dataSource.PagerObj["PageArray"] = [];

                            if ($scope.dataSource.apiDefault.ID) {
                                $scope.dataSource.apiDefault = $scope.dataSource.listData.filter(p => p.ID === $scope.dataSource.apiDefault.ID)[0];
                            }
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg');
                        }
                        blockUI.stop();
                    },
                    function error(data, status, headers) {
                        blockUI.stop();
                    });
        };

        $scope.init = function () {
            ngAuthSettings.topBarShow = true;
            ngAuthSettings.menuShow = true;

            $scope.search();
        };

        $scope.init();

        $scope.showAdd = function () {
            $scope.dataSource.apiDefault = {};
            $('#ShowApiDefaultDialog').click();

            //$scope.dataSource.groupInfo = {};
            //$scope.dataSource.pageStatus = 'addView';
        };

        $scope.showEdit = function (apiDefault) {
            $scope.dataSource.apiDefault = apiDefault;
            $('#ShowApiDefaultDialog').click();

            //$scope.dataSource.groupInfo = group;
            //$scope.dataSource.pageStatus = 'editView';
        };

        $scope.updateapiDefault = function () {
            if ($scope.dataSource.apiDefault.ID > 0) {
                apiDefaultService.update($scope.dataSource.apiDefault)
                    .then(
                        function success(response) {
                            if (response.data.APIRes.ResCode === '000') {
                                ngAuthSettings.modalMsg.title = "Message";
                                ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                                ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                                ngAuthSettings.modalMsg.callBack = 'showSearch';
                            }
                            else {
                                ngAuthSettings.modalMsg.title = "Message";
                                ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                                ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                                
                                $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                            }
                            $rootScope.$broadcast('changeModalMsg');
                        },
                        function error(response) {
                        });
            } else {
                apiDefaultService.add($scope.dataSource.apiDefault)
                    .then(
                        function success(response) {
                            if (response.data.APIRes.ResCode === '000') {
                                ngAuthSettings.modalMsg.title = "Message";
                                ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                                ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                                ngAuthSettings.modalMsg.callBack = 'showSearch';
                            }
                            else {
                                ngAuthSettings.modalMsg.title = "Message";
                                ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                                ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                                $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                            }
                            $rootScope.$broadcast('changeModalMsg');
                            $scope.search();
                        },
                        function error(response) {
                        });
            }
        };

        $scope.delete = function (apiDefault) {
            $scope.dataSource.apiDefault = apiDefault;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function (event) {
            apiDefaultService.del($scope.dataSource.apiDefault).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                    }
                    $rootScope.$broadcast('changeModalMsg');
                },
                function error(response) {

                });
        });

        $scope.showList = function (apiDefault) {
            $scope.dataSource.apiDefault = apiDefault;
            $scope.dataSource.pageStatus = 'functionListView';
        };

        $scope.searchFunctionGroup = function () {
            $scope.dataSource.searchCondition.CurrentPage = 1;
            $scope.dataSource.searchCondition.PageSize = 1000;
            $scope.dataSource.searchCondition.ApiDefaultID_Not = $scope.dataSource.apiDefault.ID;
            $scope.dataSource.searchCondition.IsDropdown = false;

            functionGroupService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.functionListData = response.data.Rows.ListData;
                            //頁籤
                            //$scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                            //$scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                            //$scope.dataSource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                            //$scope.dataSource.PagerObj["PageArray"] = [];
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg');
                        }
                        blockUI.stop();
                    },
                    function error(data, status, headers) {
                        blockUI.stop();
                    });
        };

        $scope.addFuncitonList = function () {
            var sendObj = {};
            sendObj.APID = $scope.dataSource.apiDefault.ID;
            sendObj.FunctionIDs = $scope.dataSource.functionListData.filter(p => p.check).map(p => p.ID);

            //AddFunctionList
            apiDefaultService.addFunctionList(sendObj)
                .then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $scope.search();
                        }
                        else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        }
                        $rootScope.$broadcast('changeModalMsg');
                        $scope.search();
                    },
                    function error(response) {
                    });
        };

        $scope.showFunctionDialog = function () {
            $scope.searchFunctionGroup();
            $('#ShowFunctionDialog').click();
        };

        $scope.deleteFunction = function (fn) {
            var sendObj = {};
            sendObj.FID = fn.ID;
            sendObj.APID = $scope.dataSource.apiDefault.ID;

            apiDefaultService.delFunction(sendObj).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        $scope.search();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                    }
                    $rootScope.$broadcast('changeModalMsg');
                },
                function error(response) {
                });
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };
        
        $scope.showSearch = function () {
            $scope.dataSource.pageStatus = 'searchView';
            $scope.search();
        };

        $scope.$on('showSearch', $scope.showSearch);
    }]);