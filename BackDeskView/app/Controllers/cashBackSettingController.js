'use strict';
app.controller('cashBackSettingController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'cbrsService',
    'gameRoomService',
    'lotteryService',
    'systemConfigService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        cbrsService, gameRoomService, lotteryService, systemConfigService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            cashBacks: [],
            cashBack: {},
            listData: [],
            showListData: [],
            allRebate: '0.0000',
            gameRoomTypeListData: [],
            lotteryClassListData: [],
            payTypeDropDown: [],
            rebateDropDown: [
                '0.0000', '0.0005', '0.0010', '0.0015', '0.0020', '0.0025', '0.0030', '0.0035', '0.0040', '0.0045'
                , '0.0050', '0.0055', '0.0060', '0.0065', '0.0070', '0.0075', '0.0080', '0.0085', '0.0090', '0.0095', '0.0100', '0.0105', '0.0110'
                , '0.0115', '0.0120', '0.0125', '0.0130', '0.0135', '0.0140', '0.0145', '0.0150', '0.0155', '0.0160', '0.0165', '0.0170', '0.0175'
                , '0.0180', '0.0185', '0.0190', '0.0195', '0.0200', '0.0300', '0.0400', '0.0500', '0.0600', '0.0700', '0.0800', '0.0900', '0.1000'
            ],
            PagerObj: {
                CurrentPage: 1,
                PageSize: 10,
                TotalItems: 0,
                PageArray: [],
                PageRangeMax: 10,
                PageRangeMin: 1,
                thisPage: 1
            },
            callStatus: true
        };

        $timeout(function () { $scope.init(); }, 100);

        $scope.init = function () {
            $scope.search();
            $scope.searchGameRoomType();
            $scope.searchLotteryClass();
            $scope.searchPayType();
        };

        $scope.search = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            $scope.dataSource.searchCondition.RebateType = 1;

            cbrsService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;
                            
                            //let nowDate = new Date();
                            //$scope.dataSource.listData.forEach(p => {
                            //    if (new Date(p.DateS) <= nowDate && new Date(p.DateE) >= nowDate)
                            //        p.Active = 'Active';
                            //});

                            //$scope.dataSource.showListData = $scope.dataSource.listData.filter(p => p.PayType === 34).slice();
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
                    function error(response) {
                        blockUI.stop();
                    });
        };

        $scope.searchGameRoomType = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            gameRoomService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.gameRoomTypeListData = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
                        }
                        blockUI.stop();
                    },
                    function error(response) {
                        blockUI.stop();
                    });
        };

        $scope.searchLotteryClass = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            lotteryService.findLotteryClass($scope.dataSource.searchCondition)
                .then(
                    function success(response) {

                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.lotteryClassListData = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
                        }
                        blockUI.stop();
                    },
                    function error(response) {
                        blockUI.stop();
                    });
        };

        $scope.searchPayType = function () {
            systemConfigService.findSystemConfigChildren({ ListConfigName: ['PayType'] })
                .then(
                    function success(response) {
                        //console.log(response.data.Rows.ListData);
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.payTypeDropDown = response.data.Rows.ListData;
                            //$scope.dataSource.payTypeDropDown.unshift({ ID: -1, ConfigName: 'Please Choose' });
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                    },
                    function error(response) {
                        console.log(response);
                        blockUI.stop();
                    });
        };

        $scope.add = function () {
            if ($scope.dataSource.cashBack.DateS > $scope.dataSource.cashBack.DateE) {
                ngAuthSettings.modalMsg.title = "Message";
                ngAuthSettings.modalMsg.msg = "DateInvalidDetail";

                $rootScope.$broadcast('changeModalMsg');
                return;
            }
            $scope.dataSource.cashBack.CBRS = [];

            $scope.setCBRS();
            
            cbrsService.add($scope.dataSource.cashBack).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';

                        $scope.dataSource.callStatus = true;
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        $scope.dataSource.callStatus = false;
                    }
                    $rootScope.$broadcast('changeModalMsg');
                },
                function error(response) {
                    $scope.dataSource.callStatus = false;
                    console.log(response);
                });
        };

        $scope.update = function () {
            //var validator = validatorObj.AddMember($scope.dataSource.selMemberInfo);
            //if (!validator.pass) {
            //    ngAuthSettings.modalMsg.title = "Message";
            //    ngAuthSettings.modalMsg.msg = validator.errStatus.map(p => p.ResMessage); //$.validatorMsgProcess(validator.errStatus);
            //    ngAuthSettings.modalMsg.type = '100';
            //    // 填完訊息後顯示訊息框
            //    
            //    $rootScope.$broadcast('changeModalMsg');

            //    return;
            //}
            if ($scope.dataSource.cashBack.DateS >= $scope.dataSource.cashBack.DateE) {
                ngAuthSettings.modalMsg.title = "Message";
                ngAuthSettings.modalMsg.msg = "DateInvalidDetail";

                $rootScope.$broadcast('changeModalMsg');
                return;
            }

            $scope.dataSource.cashBack.CBRS = [];

            $scope.setCBRS();
            
            cbrsService.update($scope.dataSource.cashBack).then(
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

                        //$rootScope.$broadcast('changeModalMsg');

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                    }
                    $rootScope.$broadcast('changeModalMsg');
                },
                function error(response) {
                    console.log(response);
                });
        };

        $scope.setCBRS = function () {
            if ($scope.dataSource.cashBack.SettingType === 1) {
                $scope.dataSource.gameRoomTypeListData.forEach(p => {
                    for (var i = 1; i <= 6; i++) {
                        var cbr = {};
                        cbr.GameRoomID = p.GameRoomID;
                        cbr.UserLevelID = i;
                        cbr.LotteryClassID = 0;
                        cbr.CashBackRebate = $scope.dataSource.allRebate;
                        cbr.PayType = $scope.dataSource.cashBack.PayType;
                        cbr.MinLoss = $scope.dataSource.cashBack.MinLoss;
                        cbr.MaxLoss = $scope.dataSource.cashBack.MaxLoss;
                        $scope.dataSource.cashBack.CBRS.push(cbr);
                    }
                });
            } else if ($scope.dataSource.cashBack.SettingType === 2) {
                $scope.dataSource.gameRoomTypeListData.forEach(p => {
                    for (var i = 1; i <= 6; i++) {
                        var cbr = {};
                        cbr.GameRoomID = p.GameRoomID;
                        cbr.UserLevelID = i;
                        cbr.LotteryClassID = 0;
                        cbr.CashBackRebate = p.rebates[i - 1];
                        cbr.PayType = p.PayType;
                        cbr.MinLoss = p.MinLoss;
                        cbr.MaxLoss = p.MaxLoss;
                        $scope.dataSource.cashBack.CBRS.push(cbr);
                    }
                });
            } else {
                $scope.dataSource.gameRoomTypeListData.forEach(p => {
                    p.lotteryClassListData.forEach(q => {
                        for (var i = 1; i <= 6; i++) {
                            var cbr = {};
                            cbr.GameRoomID = 0;
                            cbr.UserLevelID = i;
                            cbr.LotteryClassID = q.LotteryClassID;
                            cbr.CashBackRebate = q.rebates[i - 1];
                            cbr.PayType = q.PayType;
                            cbr.MinLoss = q.MinLoss;
                            cbr.MaxLoss = q.MaxLoss;
                            $scope.dataSource.cashBack.CBRS.push(cbr);
                        }
                    });
                });
            }
        };

        $scope.delete = function (cashBack) {
            $scope.dataSource.cashBack = cashBack;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.type = '000';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function () {
            cbrsService.delete($scope.dataSource.cashBack).then(
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
                    console.log(response);
                });
        });

        $scope.clear = function () {
            $scope.dataSource.searchCondition = { CurrentPage: 1, PageSize: 10 };
        };

        $scope.initData = function () {
            $scope.dataSource.cashBack = {};
            $scope.dataSource.cashBack.RebateType = 1;
            $scope.dataSource.cashBack.SettingType = 1;
            // All
            $scope.dataSource.allRebate = '0.0000';

            // Games
            $scope.dataSource.gameRoomTypeListData.forEach(p => { p.rebates = ['0.0000', '0.0000', '0.0000', '0.0000', '0.0000', '0.0000']; });

            // Game
            $scope.dataSource.lotteryClassListData.forEach(p => { p.rebates = ['0.0000', '0.0000', '0.0000', '0.0000', '0.0000', '0.0000']; });
            $scope.dataSource.gameRoomTypeListData.forEach(p => {
                p.lotteryClassListData = $scope.dataSource.lotteryClassListData.filter(q => q.GameRoomID === p.GameRoomID);
            });
        };

        $scope.showAdd = function () {
            $scope.dataSource.pageStatus = 'addView';
            $scope.initData();
        };

        $scope.showEdit = function (cashBack) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.initData();

            cashBack.RebateType = 1;
            $scope.dataSource.cashBack = cashBack;
            $scope.dataSource.cashBack.DateS = new Date($scope.dataSource.cashBack.DateS);
            $scope.dataSource.cashBack.DateE = new Date($scope.dataSource.cashBack.DateE);

            //$scope.dataSource.cashBack.Weekly_ID = $scope.dataSource.listData.filter(p => p.Name === cashBack.Name && p.PayType === 35)[0].ID;
            //$scope.dataSource.cashBack.Weekly_MinLoss = $scope.dataSource.listData.filter(p => p.Name === cashBack.Name && p.PayType === 35)[0].MinLoss;
            //$scope.dataSource.cashBack.Weekly_MaxLoss = $scope.dataSource.listData.filter(p => p.Name === cashBack.Name && p.PayType === 35)[0].MaxLoss;
            //$scope.dataSource.cashBack.Monthly_ID = $scope.dataSource.listData.filter(p => p.Name === cashBack.Name && p.PayType === 36)[0].ID;
            //$scope.dataSource.cashBack.Monthly_MinLoss = $scope.dataSource.listData.filter(p => p.Name === cashBack.Name && p.PayType === 36)[0].MinLoss;
            //$scope.dataSource.cashBack.Monthly_MaxLoss = $scope.dataSource.listData.filter(p => p.Name === cashBack.Name && p.PayType === 36)[0].MaxLoss;

            if (cashBack.CashBackRs && cashBack.CashBackRs.length > 0) {
                // All
                $scope.dataSource.allRebate = cashBack.CashBackRs[0].CashBackRebate;
                $scope.dataSource.cashBack.PayType = cashBack.CashBackRs[0].PayType;
                $scope.dataSource.cashBack.MinLoss = cashBack.CashBackRs[0].MinLoss;
                $scope.dataSource.cashBack.MaxLoss = cashBack.CashBackRs[0].MaxLoss;

                // Games
                $scope.dataSource.gameRoomTypeListData.forEach(p => {
                    var cbrs = cashBack.CashBackRs.filter(q => q.GameRoomID === p.GameRoomID);
                    if (cbrs.length === 0) return;
                    p.rebates = [];
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 1)[0].CashBackRebate);
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 2)[0].CashBackRebate);
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 3)[0].CashBackRebate);
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 4)[0].CashBackRebate);
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 5)[0].CashBackRebate);
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 6)[0].CashBackRebate);
                    p.PayType = cbrs[0].PayType;
                    p.MinLoss = cbrs[0].MinLoss;
                    p.MaxLoss = cbrs[0].MaxLoss;
                });

                // Game
                $scope.dataSource.lotteryClassListData.forEach(p => {
                    var cbrs = cashBack.CashBackRs.filter(q => q.LotteryClassID === p.LotteryClassID);
                    if (cbrs.length === 0) return;
                    p.rebates = [];
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 1)[0].CashBackRebate);
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 2)[0].CashBackRebate);
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 3)[0].CashBackRebate);
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 4)[0].CashBackRebate);
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 5)[0].CashBackRebate);
                    p.rebates.push(cbrs.filter(q => q.UserLevelID === 6)[0].CashBackRebate);
                    p.PayType = cbrs[0].PayType;
                    p.MinLoss = cbrs[0].MinLoss;
                    p.MaxLoss = cbrs[0].MaxLoss;
                });

                $scope.dataSource.gameRoomTypeListData.forEach(p => {
                    p.lotteryClassListData = $scope.dataSource.lotteryClassListData.filter(q => q.GameRoomID === p.GameRoomID);
                });
            }

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