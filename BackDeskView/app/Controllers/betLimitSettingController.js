'use strict';
app.controller('betLimitSettingController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'betLimitSettingService',
    'lotteryService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        betLimitSettingService, lotteryService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10000 },
            betLimit: { mapList: [] },
            listData: [],
            selTypeList: [],
            selParentList: [],
            lotteryClassList: [],
            lotteryTypeList: [],
            lotteryInfoList: [],
            selLotteryInfoList: [],
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
            $scope.findLotteryDatas();
        };

        $scope.findLimitType = function () {
            $scope.dataSource.searchCondition.IsParentType = true;

            betLimitSettingService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.selTypeList = response.data.Rows.ListData.filter(p => p.IsParentType);
                            $scope.dataSource.searchCondition.LimitName = $scope.dataSource.selTypeList[0].LimitName;

                            $scope.search();
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

        $scope.search = function () {
            blockUI.start();
            $scope.dataSource.searchCondition.IsParentType = false;

            betLimitSettingService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;

                            $scope.dataSource.selParentList = response.data.ParentLimits;

                            $scope.dataSource.listData.forEach(p => {
                                p.mapList.forEach(q => {
                                    var lotteryType = $scope.dataSource.lotteryTypeList.find(l => l.LotteryTypeID === q.LotteryTypeID);
                                    var lotteryInfo = $scope.dataSource.lotteryInfoList.find(l => l.LotteryInfoID === q.LotteryInfoID);

                                    q.LotteryTypeName = lotteryType ? lotteryType.LotteryTypeName : '';
                                    q.LotteryInfoName = lotteryInfo ? lotteryInfo.LotteryInfoName : '';
                                    q.SelLotteryInfoList = $scope.dataSource.lotteryInfoList.filter(l => l.LotteryTypeID === q.LotteryTypeID);
                                });
                            });

                            //頁籤
                            //$scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                            //$scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                            //$scope.dataSource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                            //$scope.dataSource.PagerObj["PageArray"] = [];
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
            if ($rootScope.valid(form)) return;

            betLimitSettingService.add($scope.dataSource.betLimit).then(
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

            betLimitSettingService.update($scope.dataSource.betLimit).then(
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

        $scope.delete = function (betLimit) {
            $scope.dataSource.betLimit = betLimit;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.type = '000';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function (event) {
            betLimitSettingService.delete($scope.dataSource.betLimit).then(
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
            $scope.dataSource.betLimit = { mapList: [] };
        };

        $scope.showEdit = function (betLimit) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.betLimit = betLimit;
        };

        $scope.showSearch = function () {
            $scope.dataSource.pageStatus = 'searchView';
        };

        $scope.$on('showSearch', $scope.showSearch);

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

        $scope.findLotteryDatas = function () {

            var callStatus = true;

            //var lotteryClass = lotteryService.findLotteryClass($scope.dataSource.searchCondition)
            //    .then(
            //        function success(response, status, headers, config) {
            //            if (response.data.APIRes.ResCode === '000') {
            //                $scope.dataSource.lotteryClassList = response.data.Rows.ListData;
            //            } else {
            //                ngAuthSettings.modalMsg.title = "Message";
            //                ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
            //                ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

            //                $rootScope.$broadcast('changeModalMsg');
            //            }
            //        },
            //        function error(msg) {
            //            console.log(msg);
            //        });

            var lotteryType = lotteryService.findLotteryType({ CurrentPage: 1, PageSize: 100000 })
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.lotteryTypeList = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
                            callStatus = false;
                        }
                    },
                    function error(msg) {
                        console.log(msg);
                        callStatus = false;
                    });

            var lotteryInfo = lotteryService.findLotteryInfo({ CurrentPage: 1, PageSize: 100000 })
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.lotteryInfoList = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
                            callStatus = false;
                        }
                    },
                    function error(msg) {
                        console.log(msg);
                        callStatus = false;
                    });

            Promise.all([lotteryInfo, lotteryType])
                .then(() => {
                    if (callStatus) {
                        //$scope.bindSelLotteryInfo($scope.dataSource.lotteryTypeList[0].LotteryTypeID);
                        $scope.findLimitType();
                        //$scope.search();
                    }
                    else $rootScope.$broadcast('changeModalMsg');
                });
        };

        $scope.addMap = function () {
            $scope.dataSource.betLimit.mapList.push({});
        };

        $scope.delMap = function (betMap) {
            if (!confirm('Confirm delete map?')) { return; }

            if (betMap.ID > 0) {
                betLimitSettingService.deleteMap({ LotteryBetLimitMapID: betMap.ID }).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');

                            var idx = betLimitArray.indexOf(betLimit);
                            if (idx > -1) {
                                betLimitArray.splice(idx, 1);
                            }
                        }
                        else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
                            return;
                        }
                    },
                    function error(response) {
                        console.log(response);
                    });
            }

            var idx = $scope.dataSource.betLimit.mapList.indexOf(betMap);
            if (idx > -1) {
                $scope.dataSource.betLimit.mapList.splice(idx, 1);
            }
        };

        $scope.bindSelLotteryInfo = function (betMap) {
            betMap.SelLotteryInfoList = $scope.dataSource.lotteryInfoList.filter(p => p.LotteryTypeID === betMap.LotteryTypeID);
        };

    }]);