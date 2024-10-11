'use strict';
app.controller('slotReportController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'thirdPartyService',
    'memberShipService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        thirdPartyService, memberShipService) {

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            memberInfo: {},
            selMemberInfo: {},
            selMemberInfoList: [],
            betDetailData: {},
            agentLevel: 0,
            nowAgentLevel: 0,
            config: {},
            listData: [],
            showListData: [],
            smListData: [],
            mListData: [],
            agListData: [],
            modalMsg: {},
            PagerObj: {
                CurrentPage: 1,
                PageSize: 10,
                TotalItems: 0,
                PageArray: [],
                PageRangeMax: 10,
                PageRangeMin: 1,
                thisPage: 1
            },
            PagerObj2: {
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

            //sub admin, sub company
            var agentParentMap = $scope.dataSource.memberInfo.AgentParentMap.split('/');
            if ($scope.dataSource.memberInfo.AgentLevelSCID === 38) {
                $scope.dataSource.memberInfo.UserName = agentParentMap[agentParentMap.length - 2];
                $scope.dataSource.memberInfo.AgentLevelSCID = 28;
            }
            if ($scope.dataSource.memberInfo.AgentLevelSCID === 39) {
                $scope.dataSource.memberInfo.UserName = agentParentMap[agentParentMap.length - 2];
                $scope.dataSource.memberInfo.AgentLevelSCID = 31;
            }
            //$scope.searchMember();
            $scope.dateSearch(0, 0);
            $scope.findLotteryClass();
        };

        //$scope.getSystemConfig = function () {
        //    AgentLevel DropDown
        //    systemConfigService.findSystemConfigChildren({ ListConfigName: ['AgentLevel'] })
        //        .then(
        //            function success(response, status, headers) {
        //                if (response.data.APIRes.ResCode === '000') {
        //                    Agent & Member無法做此設定
        //                    $scope.dataSource.config = response.data.Rows.ListData.filter(p => p.ID === $scope.dataSource.memberInfo.AgentLevelSCID)[0];
        //                    $scope.dataSource.agentLevel = parseInt($scope.dataSource.config.ConfigValues);
        //                    $scope.dataSource.nowAgentLevel = parseInt($scope.dataSource.config.ConfigValues);

        //                    $scope.dateSearch(0, 0);
        //                } else {
        //                    ngAuthSettings.modalMsg.title = "Message";
        //                    ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
        //                    ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
        //                    $rootScope.$broadcast('changeModalMsg', false);
        //                }
        //                blockUI.stop();
        //            },
        //            function error(data, status, headers) {
        //                blockUI.stop();
        //            });
        //};

        $timeout($scope.init, 100);

        $scope.search = function () {
            blockUI.start();
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            //$scope.dataSource.searchCondition.MemberID = 7613;//$scope.dataSource.memberInfo.MemberID;
            $scope.dataSource.searchCondition.UserName = $scope.dataSource.memberInfo.UserName;

            $scope.dataSource.listData = [];
            thirdPartyService.findSlotMPlayer($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            console.log(response.data.Rows);
                            $scope.dataSource.listData = response.data.Rows.ListData;

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
                    function error(data, status, headers, config) {
                        blockUI.stop();
                    });
        };

        $scope.findLotteryClass = function () {
            var ajaxData = {
                GameRoomID: 2
            };
            thirdPartyService.findLotteryClass(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.classInfoList = response.data.Rows.ListData;
                        //$scope.dataSource.selectSlotGameInfoList = $scope.dataSource.classInfoList[0].slotTypes;
                        $scope.dataSource.classInfoList[0].slotTypes.unshift({ SlotTypeID: 0, SlotTypeName: 'Please Choose' });
                        $scope.dataSource.searchCondition.SlotTypeID = $scope.dataSource.classInfoList[0].slotTypes[0].SlotTypeID;
                    }
                });
        };

        $scope.showDetail = function (report) {
            $scope.dataSource.selReport = report;
            $('#ShowDetailDialog').click();

            $scope.searchDetail(report);
        };

        $scope.searchDetail = function (report) {
            blockUI.start();

            var sendObj = {};
            sendObj.DateS = $scope.dataSource.searchCondition.DateS;
            sendObj.DateE = $scope.dataSource.searchCondition.DateE;
            sendObj.CurrentPage = $scope.dataSource.PagerObj2.CurrentPage;
            sendObj.PageSize = $scope.dataSource.PagerObj2.PageSize;
            //$scope.dataSource.searchCondition.MemberID = 7613;//$scope.dataSource.memberInfo.MemberID;
            sendObj.MemberID = report.MemberID;
            sendObj.SlotTypeID = $scope.dataSource.searchCondition.SlotTypeID;

            thirdPartyService.findSlotMPlayerDetail(sendObj)
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            //console.log(response.data.Rows);
                            $scope.dataSource.detailListData = response.data.Rows.ListData;

                            $scope.dataSource.PagerObj2 = response.data.Rows.PagerObj;
                            $scope.dataSource.PagerObj2["thisPage"] = $scope.dataSource.PagerObj2.CurrentPage;
                            $scope.dataSource.PagerObj2["thisPageSize"] = $scope.dataSource.PagerObj2.PageSize;
                            $scope.dataSource.PagerObj2["PageArray"] = [];
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

        $scope.showBetDetail = function (reposrtDetail) {
            $scope.dataSource.betDetailData = reposrtDetail;
            $('#ShowBetDetailDialog').click();
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

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

        $scope.PageChanged2 = function (page) {
            $scope.dataSource.PagerObj2.CurrentPage = page;
            $scope.searchDetail($scope.dataSource.selReport);
        };

        $scope.copy = function () {
            var body = document.body, range, sel;
            copy(body, document, 'slotReport');
        };

        $scope.excel = function () {
            excel(document, ['slotReport'], 'slotReport' + '.xls');
        };

        $scope.print = function () {
            print(document, 'slotReport');
        };

    }]);