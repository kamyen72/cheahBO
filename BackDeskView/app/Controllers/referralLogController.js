'use strict';
app.controller('referralLogController', [
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
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        cbrsService, systemConfigService) {

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            listData: [],
            selMember: {},
            referral1_DetailList: [],
            referral2_DetailList: [],
            referral3_DetailList: [],
            payTypeDropDown: [],
            referral: {},
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
            $scope.getSystemConfig();
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            blockUI.start();
            $scope.dataSource.listData = [];

            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            //$scope.dataSource.searchCondition.CashRebateMoneyStatus = 1;

            cbrsService.findReferralReport($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows;
                            $scope.dataSource.listData.forEach(p => {
                                p.ReferralPayType = $scope.dataSource.payTypeDropDown.filter(q => q.ID === parseInt(p.ReferralPayType))[0].ConfigName;
                            });
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
                    function error(data, status, headers, config) {
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
                        $scope.dateSearch(0,0);
                        blockUI.stop();
                    },
                    function error(data, status, headers) {
                        blockUI.stop();
                    });
        };

        $scope.showDetail = function (member) {
            $scope.dataSource.selMember = member;

            $scope.dataSource.referral1_DetailList = [];
            $scope.dataSource.referral2_DetailList = [];
            $scope.dataSource.referral3_DetailList = [];
            $.extend($scope.dataSource.referral1_DetailList, member.Referral1_DetailList);
            $.extend($scope.dataSource.referral2_DetailList, member.Referral2_DetailList);
            $.extend($scope.dataSource.referral3_DetailList, member.Referral3_DetailList);

            var total = 0;
            member.Referral1_DetailList.forEach(p => {
                total += parseFloat(p.ReferralMoney);
                p.ReferralPercentage = parseFloat(p.ReferralLevel.split(',')[1]);
            });
            $scope.dataSource.referral1_DetailList.push({ ReferralMoney: total });

            total = 0;
            member.Referral2_DetailList.forEach(p => {
                total += parseFloat(p.ReferralMoney);
                p.ReferralPercentage = parseFloat(p.ReferralLevel.split(',')[1]);
            });

            $scope.dataSource.referral2_DetailList.push({ ReferralMoney: total });

            total = 0;
            member.Referral3_DetailList.forEach(p => {
                total += parseFloat(p.ReferralMoney);
                p.ReferralPercentage = parseFloat(p.ReferralLevel.split(',')[1]);
            });
            $scope.dataSource.referral3_DetailList.push({ ReferralMoney: total });

            $scope.dataSource.modalMsg.title = member.UserName;
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
            $scope.dataSource.referral = {};
        };

        $scope.showEdit = function (referral) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.referral = referral;
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