'use strict';
app.controller('memberGroupController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'mGroupService',
    'functionGroupService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        mGroupService, functionGroupService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: {},
            listData: [],
            functionListData: [],
            addFunctionList: [],
            isChecked: false,
            mGroup: {},
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

            mGroupService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;
                            //頁籤
                            $scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                            $scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                            $scope.dataSource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                            $scope.dataSource.PagerObj["PageArray"] = [];

                            console.log($scope.dataSource.listData);
                            if ($scope.dataSource.mGroup.ID) {
                                $scope.dataSource.mGroup = $scope.dataSource.listData.filter(p => p.ID === $scope.dataSource.mGroup.ID)[0];
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
            $scope.dataSource.mGroup = {};
            $('#ShowGroupDialog').click();

            //$scope.dataSource.groupInfo = {};
            //$scope.dataSource.pageStatus = 'addView';
        };

        $scope.showEdit = function (group) {
            $scope.dataSource.mGroup = group;
            $('#ShowGroupDialog').click();

            //$scope.dataSource.groupInfo = group;
            //$scope.dataSource.pageStatus = 'editView';
        };

        $scope.updateMGroup = function () {
            if ($scope.dataSource.mGroup.ID > 0) {
                mGroupService.update($scope.dataSource.mGroup)
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
                mGroupService.add($scope.dataSource.mGroup)
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
            }
        };

        $scope.delete = function (group) {
            $scope.dataSource.mGroup = group;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function (event) {
            mGroupService.del($scope.dataSource.mGroup).then(
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
        });

        $scope.showList = function (group) {
            $scope.dataSource.mGroup = group;
            let functionMapList = [];

            $scope.dataSource.mGroup.FunctionGroups.forEach(item => {
                if(item.ParentID > 0) {
                    let parent = functionMapList.find(prev => prev.ID === item.ParentID);
                    if(parent) {
                        if(parent.subView && parent.subView.length > 0) {
                            parent.subView.push(item);
                        } else {
                            parent.subView = [item];
                        }
                    } else {
                        functionMapList.push(item);
                    }
                } else {
                    functionMapList.push(item);
                }
            });
            $scope.dataSource.mGroup.FunctionMapList = functionMapList;
            $scope.dataSource.pageStatus = 'functionListView';
        };

        $scope.searchFunctionGroup = function () {
            $scope.dataSource.searchCondition.CurrentPage = 1;
            $scope.dataSource.searchCondition.PageSize = 1000;
            $scope.dataSource.searchCondition.MGroupID_Not = $scope.dataSource.mGroup.ID;
            //$scope.dataSource.searchCondition.IsDropdown = false;

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
            sendObj.MGroupID = $scope.dataSource.mGroup.ID;
            sendObj.FunctionIDs = $scope.dataSource.functionListData.filter(p => p.check).map(p => p.ID);

            //AddFunctionList
            mGroupService.addFunctionList(sendObj)
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
        };

        $scope.showFunctionDialog = function () {
            $scope.searchFunctionGroup();
            $('#ShowFunctionDialog').click();
        };

        $scope.deleteFunction = function (fn) {
            var sendObj = {};
            sendObj.FID = fn.ID;
            sendObj.MGroupID = $scope.dataSource.mGroup.ID;

            mGroupService.delFunction(sendObj).then(
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
        };

        $scope.checkAll = function () {
            $scope.dataSource.functionListData.forEach(p => { p.check = $scope.dataSource.checkAll; });
        };

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