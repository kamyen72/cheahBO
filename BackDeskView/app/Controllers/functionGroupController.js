
'use strict';
app.controller('functionGroupController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'functionGroupService',
    'mGroupService',
    'apiDefaultService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings,
        functionGroupService, mGroupService, apiDefaultService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: {},
            listData: [],
            functionGroup: {},
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

            functionGroupService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            console.log(response.data.Rows.ListData);
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
            $scope.dataSource.functionGroup = {};
            $('#ShowFunctionDialog').click();

            //$scope.dataSource.groupInfo = {};
            //$scope.dataSource.pageStatus = 'addView';
        };

        $scope.showEdit = function (functionG) {
            $scope.dataSource.functionGroup = functionG;
            $('#ShowFunctionDialog').click();

            //$scope.dataSource.groupInfo = group;
            //$scope.dataSource.pageStatus = 'editView';
        };

        $scope.updatefunctionGroup = function () {
            if ($scope.dataSource.functionGroup.ID > 0) {
                functionGroupService.update($scope.dataSource.functionGroup)
                    .then(
                        function success(response) {
                            if (response.data.APIRes.ResCode === '000') {
                                ngAuthSettings.modalMsg.title = "Message";
                                ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                                ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
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
                functionGroupService.add($scope.dataSource.functionGroup)
                    .then(
                        function success(response) {
                            if (response.data.APIRes.ResCode === '000') {
                                ngAuthSettings.modalMsg.title = "Message";
                                ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                                ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
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

        $scope.delete = function (functionG) {
            $scope.dataSource.functionGroup = functionG;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function () {
            functionGroupService.del($scope.dataSource.functionGroup).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';

                        $scope.search();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = "";
                    }
                    $rootScope.$broadcast('changeModalMsg');
                },
                function error(response) {

                });
        });

        $scope.showGroupList = function (functionGroup) {
            $scope.dataSource.functionGroup = functionGroup;
            $scope.dataSource.pageStatus = 'groupListView';
        };
        
        $scope.showGroupDialog = function () {
            var sendObj = {};
            sendObj.CurrentPage = 1;
            sendObj.PageSize = 10000;
            sendObj.FunctionID_not = $scope.dataSource.functionGroup.ID;

            mGroupService.find(sendObj)
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.groupListData = response.data.Rows.ListData;
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
            $('#ShowGroupDialog').click();
        };

        $scope.addGroup = function () {
            var sendObj = {};
            sendObj.FunctionID = $scope.dataSource.functionGroup.ID;
            sendObj.MGroupIDs = $scope.dataSource.groupListData.filter(p => p.check).map(p => p.ID);

            //AddFunctionList
            functionGroupService.addMGroupList(sendObj)
                .then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $scope.dataSource.groupListData.filter(p => p.check).forEach(p => {
                                $scope.dataSource.functionGroup.MGroups.push(p);
                            });
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

        $scope.showAPIList = function (functionGroup) {
            $scope.dataSource.functionGroup = functionGroup;
            $scope.dataSource.pageStatus = 'apiListView';
        };

        $scope.showAPIDialog = function () {
            $scope.searchAPIDefault();
            $('#ShowAPIDialog').click();
        };

        $scope.searchAPIDefault = function () {
            var sendObj = {};
            sendObj.CurrentPage = 1;
            sendObj.PageSize = 10000;
            sendObj.FunctionID_not = $scope.dataSource.functionGroup.ID;
            sendObj.Controller = $scope.dataSource.searchCondition.Controller;
            sendObj.Action = $scope.dataSource.searchCondition.Action;

            apiDefaultService.find(sendObj)
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.apiListData = response.data.Rows.ListData;
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

        $scope.addAPI = function () {
            var sendObj = {};
            sendObj.FunctionID = $scope.dataSource.functionGroup.ID;
            sendObj.ApiDefaultIDs = $scope.dataSource.apiListData.filter(p => p.check).map(p => p.ID);

            //AddFunctionList
            functionGroupService.addApiList(sendObj)
                .then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $scope.dataSource.apiListData.filter(p => p.check).forEach(p => {
                                $scope.dataSource.functionGroup.APIDefaults.push(p);
                            });
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

        $scope.deleteAPI = function (apiDefault) {
            $scope.dataSource.apiDefault = apiDefault;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'Confirm Delete';
            ngAuthSettings.modalMsg.callBack = 'confirmDelAPI';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDelAPI', function () {
            var sendObj = {};
            sendObj.FID = $scope.dataSource.functionGroup.ID;
            sendObj.APIID = $scope.dataSource.apiDefault.ID;

            functionGroupService.delApiList(sendObj).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';

                        $scope.search();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = "";
                    }
                    $rootScope.$broadcast('changeModalMsg');
                },
                function error(response) {

                });
        });

        $scope.showSearch = function () {
            $scope.dataSource.checkAll = false;
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