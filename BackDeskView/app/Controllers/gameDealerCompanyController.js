'use strict';
app.controller('gameDealerCompanyController', [
    '$scope',
    '$rootScope',
    '$timeout',
    'blockUI',
    'ngAuthSettings',
    'platformService',
    function ($scope, $rootScope, $timeout, blockUI, ngAuthSettings, platformService) {

        var DEFAULT_SEARCH_CONDITION = { CurrentPage: 1, PageSize: 10 };
        var CALL_BACK_LIST = ['Auth','SlotBet','Balance','BonusWin','JackpotWin','Login','PromoWin','Refund','Result','Withdraw'];

        function f_showModel(obj) {
            angular.extend(ngAuthSettings.modalMsg, obj);
            $rootScope.$broadcast('changeModalMsg');
        }

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: DEFAULT_SEARCH_CONDITION,
            listData: [],
            platformList: [],
            PostData: {},
            PlatformObj: {},
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
            $scope.findPlatform();
            $scope.search();
        };

        $timeout($scope.init, 100);

        $scope.findPlatform = function () {
            blockUI.start();
            const ajaxData = {
                TypeCode: "Platform"
            };
            platformService.find(ajaxData)
                .then(function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.platformList = response.data.Rows.ListData;
                    } else {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode
                        });
                    }
                    blockUI.stop();
                },
                function error() {
                    blockUI.stop();
                });
        };

        $scope.changePlatform = function () {
            //$scope.dataSource.PostData.ShortName = $scope.dataSource.PlatformObj.ShortName;
            $scope.dataSource.PostData.URL = $scope.dataSource.PlatformObj.URL;
        };

        $scope.search = function () {
            blockUI.start();
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            const ajaxData = {
                ...$scope.dataSource.searchCondition,
                TypeCode: "API"
            };
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
                            f_showModel({
                                title: "Message",
                                msg: response.data.APIRes.ResMessage,
                                type: response.data.APIRes.ResCode
                            });
                        }
                        blockUI.stop();
                    },
                    function error() {
                        blockUI.stop();
                    });
        };

        $scope.add = function (form) {
            if ($rootScope.valid(form)) return;

            const ajaxData = {
                ...$scope.dataSource.PostData,
                TypeCode: "API",
            }
            platformService.add(ajaxData).then(
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
            if (form && $rootScope.valid(form)) return;

            const ajaxData = {
                ...$scope.dataSource.PostData,
                TypeCode: "API"
            };
            platformService.update(ajaxData).then(
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

        $scope.changeAndSave = function (data) {
            $scope.dataSource.PostData = data;
            $scope.update();
        };

        $scope.addCB = function (formCB) {
            if ($rootScope.valid(formCB)) return;
            let ajaxData = {
                GameDealerCBs: $scope.dataSource.PostCBData
            };
            platformService.addGameDealerCB(ajaxData).then(
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
                function error() {
                });

        };

        $scope.updateCB = function (formCB) {
            if ($rootScope.valid(formCB)) return;
            let ajaxData = {
                GameDealerCBs: $scope.dataSource.PostCBData
            };
            platformService.updateGameDealerCB(ajaxData).then(
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
                function error() {
                });

        };

        // $scope.delete = function (data) {
        //     $scope.dataSource.PostData = data;
        //     ngAuthSettings.modalMsg.title = 'Confirm';
        //     ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
        //     ngAuthSettings.modalMsg.type = '000';
        //     ngAuthSettings.modalMsg.callBack = 'confirmDel';
        //     $rootScope.$broadcast('changeModalMsg', true);
        // };

        // $scope.$on('confirmDel', function (event) {
        //     platformService.del(data).then(
        //         function success(response) {
        //             if (response.data.APIRes.ResCode === '000') {
        //                 f_showModel({
        //                     title: "Message",
        //                     msg: response.data.APIRes.ResMessage,
        //                     type: response.data.APIRes.ResCode,
        //                     callBack: 'showSearch'
        //                 });
        //             }
        //             else {
        //                 f_showModel({
        //                     title: "Message",
        //                     msg: response.data.APIRes.ResMessage,
        //                     type: response.data.APIRes.ResCode
        //                 });

        //                 $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
        //                 return;
        //             }
        //         },
        //         function error(response) {

        //         });
        // });

        $scope.clear = function () {
            $scope.dataSource.searchCondition = DEFAULT_SEARCH_CONDITION;
        };

        $scope.showAdd = function () {
            $scope.dataSource.pageStatus = 'addView';
            $scope.dataSource.PostData = {};
            $scope.dataSource.PlatformObj = {};
        };

        $scope.showEdit = function (data) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.PostData = data;
            //$scope.dataSource.PlatformObj = $scope.dataSource.platformList.find(p => p.ShortName === data.ShortName);
        };

        $scope.showAddCB = function (data) {
            $scope.dataSource.pageStatus = 'addCBView';
            let CompanyID = data.ID;
            $scope.dataSource.PostCBData = CALL_BACK_LIST.map(key => ({
                CompanyID, GameActivie: key, CallBackURL: ''
            }));
        };
        $scope.showEditCB = function (data) {
            $scope.dataSource.pageStatus = 'editCBView';
            $scope.dataSource.PostCBData = data;
            let { ID, GameDealerCBs } = data;
            $scope.dataSource.PostCBData = CALL_BACK_LIST.map(key => {
                let cbData = GameDealerCBs.find(cb => cb.GameActivie === key);
                if(cbData) {
                    return { CompanyID: ID, GameActivie: key, CallBackURL: cbData.CallBackURL };
                }
                return { CompanyID: ID, GameActivie: key, CallBackURL: '' };
            });
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