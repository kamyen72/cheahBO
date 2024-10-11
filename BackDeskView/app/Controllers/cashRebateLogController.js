'use strict';
app.controller('cashRebateLogController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'cbrsService',
    'systemConfigService',
    'userLevelService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        cbrsService, systemConfigService, userLevelService) {

        $scope.dataSource = {
            pageStatus: 'searchView',
            payType: 'Daily',
            payTypeID: 34,
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            listData: [],
            detailListData: [],
            payTypeDropDown: [],
            cashBack: {},
            modalMsg: {},
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
            $scope.dataSource.memberInfo = localStorageService.get('UserInfo');
            let dropdown1 = $scope.getSystemConfig();
            let dropdown2 = $scope.getUserLevels();

            Promise.all([dropdown1, dropdown2])
                .then(() => {
                    $scope.dateSearch(0, 0);
                });
        };

        $timeout($scope.init, 100);

        $scope.changeType = function (type) {
            $scope.dataSource.payType = type;
            switch (type) {
                case 'Daily':
                    $scope.dataSource.payTypeID = 34;
                    break;
                case 'Weekly':
                    $scope.dataSource.payTypeID = 35;
                    break;
                case 'Monthly':
                    $scope.dataSource.payTypeID = 36;
                    break;
            }

            $scope.search();
        };

        $scope.search = function () {
            blockUI.start();
            $scope.dataSource.listData = [];

            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            $scope.dataSource.searchCondition.CashRebatePending = false;
            //$scope.dataSource.searchCondition.CashRebatePayType = $scope.dataSource.payTypeID;
            $scope.dataSource.searchCondition.ReportType = 'CashRebate';

            cbrsService.findCBRReport($scope.dataSource.searchCondition)
                .then(
                    function success(response) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows;
                            //頁籤
                            //$scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                            //$scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                            //$scope.dataS ource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                            //$scope.dataSource.PagerObj["PageArray"] = [];
                            $scope.dataSource.listData.forEach(p => {
                                p.CashRebatePayType = $scope.dataSource.payTypeDropDown.filter(q => q.ID === p.CashRebatePayType)[0].ConfigName;

                                let levelSplit = p.ReferralLevel.split(',');
                                if (levelSplit && levelSplit.length > 1) {
                                    p.UserLevel = $scope.dataSource.userLevels.find(p => p.LevelID.toString() === levelSplit[0]).LevelName;
                                    p.Percentage = (parseFloat(levelSplit[1]) * 100).toFixed(2) + '%';
                                }
                            });
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
                        }
                        blockUI.stop();
                    },
                    function error(data) {
                        blockUI.stop();
                    });
        };

        $scope.getSystemConfig = function () {
            //AgentLevel DropDown
            systemConfigService.findSystemConfigChildren({ ListConfigName: ['PayType'] })
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.payTypeDropDown = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                        blockUI.stop();
                    },
                    function error(data, status, headers) {
                        blockUI.stop();
                    });
        };

        $scope.getUserLevels = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            return userLevelService.findUserLevel($scope.dataSource.searchCondition)
                .then(
                    function success(response) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.userLevels = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                    },
                    function error(data) {
                    });
        };

        $scope.showDetail = function (member) {
            $scope.dataSource.detailListData = member.DetailReportList;
            $scope.dataSource.modalMsg.title = 'Detail';
            $('#ShowDetailDialog').click();
        };

        $scope.dateSearch = function (dayS, dayE) {
            var nowDate = new Date();
            var dateS = new Date(Number(nowDate));
            dateS.setDate(nowDate.getDate() + dayS);
            var dateE = new Date(Number(nowDate));
            dateE.setDate(nowDate.getDate() + dayE);

            $scope.dataSource.searchCondition.DateS = dateS;
            $scope.dataSource.searchCondition.DateE = dateE;
            $scope.search();
        };

        $scope.clear = function () {
            $scope.dataSource.searchCondition = {};
        };

        $scope.showAdd = function () {
            $scope.dataSource.pageStatus = 'addView';
            $scope.dataSource.cashBack = {};
        };

        $scope.showEdit = function (cashBack) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.cashBack = cashBack;
        };

        $scope.showSearch = function () {
            $scope.dataSource.pageStatus = 'searchView';
            $scope.search();
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);