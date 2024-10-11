'use strict';
app.controller('winLoseReportController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'mplayerService',
    'systemConfigService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings,
        mplayerService, systemConfigService) {
        blockUI.start();

        $scope.dataSource = {
            apiType: '', // All & Platform & API
            searchCondition: { CurrentPage: 1, PageSize: 10, WebCode: '' },
            memberInfo: {},
            selReport: {},
            selMember: {},
            selMemberInfoList: [],
            betDetailData: {},
            agentLevel: 0,
            nowAgentLevel: 0,
            config: {},
            agentLevelList: [],
            listData: [],
            showListData: [],
            modalMsg: {},
            transactionType: 1, //1:Topup,2:Withdrawal
            PagerObj: {
                CurrentPage: 1,
                PageSize: 10,
                TotalItems: 0,
                PageArray: [],
                PageRangeMax: 10,
                PageRangeMin: 1,
                thisPage: 1
            },
            nowAgentLayer: 0,
            platformOptions: [],
            isMaster: IS_MASTER
        };

        $scope.init = function () {
            $scope.dataSource.apiType = localStorageService.get("ApiType");

            //重置agentLevel等級
            $scope.dataSource.selMemberInfoList = [];
            $scope.dataSource.memberInfo = localStorageService.get('UserInfo');
            $scope.dataSource.agentLevel = parseInt($scope.dataSource.config.ConfigValues);
            $scope.dataSource.nowAgentLevel = 1;
            $scope.dataSource.nowAgentLayer = $scope.dataSource.memberInfo.AgentParentMap.split('/').length;
            $scope.dataSource.platformOptions = (localStorageService.get('PlatformSettings') || []).map(item => ({ label: item.PlatformName, value: item.ShortName }));
            $scope.dataSource.platformOptions.unshift({ label: 'All', value: '' });

            $scope.getSystemConfig();

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
        };

        $scope.getSystemConfig = function () {
            //AgentLevel DropDown
            systemConfigService.findSystemConfigChildren({ ListConfigName: ['AgentLevel'] })
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.agentLevelList = response.data.Rows.ListData;
                            $scope.dataSource.config = response.data.Rows.ListData.filter(p => p.ID === $scope.dataSource.memberInfo.AgentLevelSCID)[0];
                            $scope.dataSource.agentLevel = parseInt($scope.dataSource.config.ConfigValues);
                            $scope.dataSource.nowAgentLevel = parseInt($scope.dataSource.config.ConfigValues);

                            $scope.dateSearch(0, 0);
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

        $timeout($scope.init, 100);

        $scope.search = function (userName, agentLevel, type) {
            if ($scope.dataSource.memberInfo.AgentLevelSCID !== 28 && (agentLevel - $scope.dataSource.memberInfo.AgentLevelSCID) > 1) {
                return;
            }

            var date1 = new Date($scope.dataSource.searchCondition.DateS);
            var date2 = new Date($scope.dataSource.searchCondition.DateE);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if(diffDays > 31) {
                ngAuthSettings.modalMsg.title = "Error";
                ngAuthSettings.modalMsg.msg = 'Date range cannot exceed 31 days';
                $rootScope.$broadcast('changeModalMsg');
                return;
            }
            
            blockUI.start();
            $scope.dataSource.listData = [];
            $scope.dataSource.showListData = [];

            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            $scope.dataSource.searchCondition.UserName = userName;
            $scope.dataSource.searchCondition.AgentLevelSCID = agentLevel;
            //$scope.dataSource.searchCondition.MemberID = $scope.dataSource.memberInfo.MemberID;

            if (type) $scope.dataSource.apiType = type;

            let fetchFindWinLoseReport = mplayerService.findWinLoseReport;
            switch ($scope.dataSource.apiType) {
                case 'All':
                    if (type === 'API') {
                        fetchFindWinLoseReport = mplayerService.findGameDealerWinLoseReport;
                    } else if (type === 'Platform') {
                        fetchFindWinLoseReport = mplayerService.findWinLoseReport;
                    } else {
                        fetchFindWinLoseReport = mplayerService.findTotalWinLoseReport;
                    }
                    break;
                case 'API':
                    fetchFindWinLoseReport = mplayerService.findGameDealerWinLoseReport;
                    break;
                case 'Platform':
                    fetchFindWinLoseReport = mplayerService.findWinLoseReport;
                    break;
            }
            fetchFindWinLoseReport($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        console.log(response.data);
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ObjectListData;

                            //console.log($scope.dataSource.listData);
                            $scope.dataSource.listData.forEach(p => {
                                p.AgentLevelName = $scope.dataSource.agentLevelList.filter(q => q.ID === p.AgentLevel)[0].ConfigName;
                            });

                            $scope.dataSource.showListData = $scope.dataSource.listData.slice();

                            if ($scope.dataSource.listData.length > 0) {
                                $scope.showReport(userName, agentLevel, parseInt($scope.dataSource.showListData[0].AgentLayer), type);
                            }

                            if (response.data.Rows.ObjectQryData && response.data.Rows.ObjectQryData.TotalTurnover) {
                                $scope.dataSource.showListData.push({
                                    'Name': 'Grand Total',
                                    'PR_TurnOver': response.data.Rows.ObjectQryData.TotalTurnover,
                                    'PR_BetAmount': response.data.Rows.ObjectQryData.TotalBetAmount,
                                    'PR_RecordMoney': response.data.Rows.ObjectQryData.TotalWinLose,
                                    'Agent_Profit': response.data.Rows.ObjectQryData.TotalAgentTotal,
                                    'PR_UperTotal': response.data.Rows.ObjectQryData.TotalUpper
                                });
                            }
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
                    function error(data, status, headers, config) {
                        blockUI.stop();
                    });
        };

        $scope.showReport = function (userName, agentLevel, agentLayer, type) {
            if (agentLevel === 32 && agentLayer === 2) agentLayer = $scope.dataSource.nowAgentLayer + 1;

            if ($scope.dataSource.nowAgentLayer < agentLayer)
                $scope.dataSource.selMemberInfoList.push({ name: userName, level: agentLevel, layer: agentLayer, type: type });
            else if ($scope.dataSource.nowAgentLayer > agentLayer) {
                for (var i = 0; i < $scope.dataSource.nowAgentLayer - agentLayer; i++)
                    $scope.dataSource.selMemberInfoList.pop();
            }

            $scope.dataSource.showListData = $scope.dataSource.listData.filter(p =>
                p.AgentLayer.toString() === agentLayer.toString() &&
                p.AgentParentMap.split('/').includes(userName)
            ).slice();

            $scope.dataSource.showListData.forEach(p => {
                if (p.AgentLevel === agentLevel) {
                    p.AgentLevelName = 'Sub' + p.AgentLevelName;
                }
            });

            $scope.dataSource.showListData.push({
                'Name': 'Total',
                'PR_TurnOver': $scope.dataSource.showListData.reduce(sumFunction('PR_TurnOver'), 0),
                'PR_BetAmount': $scope.dataSource.showListData.reduce(sumFunction('PR_BetAmount'), 0),
                'VIP_TurnOver': $scope.dataSource.showListData.reduce(sumFunction('VIP_TurnOver'), 0),
                'PR_RecordMoney': $scope.dataSource.showListData.reduce(sumFunction('PR_RecordMoney'), 0),
                'VIP_RecordMoney': $scope.dataSource.showListData.reduce(sumFunction('VIP_RecordMoney'), 0),
                'PR_Profit': $scope.dataSource.showListData.reduce(sumFunction('PR_Profit'), 0),
                'VIP_Profit': $scope.dataSource.showListData.reduce(sumFunction('VIP_Profit'), 0),
                'CrossComission': $scope.dataSource.showListData.reduce(sumFunction('CrossComission'), 0),
                'Angpao': $scope.dataSource.showListData.reduce(sumFunction('Angpao'), 0),
                'InitialCredit': $scope.dataSource.showListData.reduce(sumFunction('InitialCredit'), 0),
                'CreditBalance': $scope.dataSource.showListData.reduce(sumFunction('CreditBalance'), 0),
                'CashBalance': $scope.dataSource.showListData.reduce(sumFunction('CashBalance'), 0),
                'PR_UperTotal': $scope.dataSource.showListData.reduce(sumFunction('PR_UperTotal'), 0),
                'VIP_UperTotal': $scope.dataSource.showListData.reduce(sumFunction('VIP_UperTotal'), 0),
                'Agent_Profit': $scope.dataSource.showListData.reduce(sumFunction('Agent_Profit'), 0),
                'Master_Profit': $scope.dataSource.showListData.reduce(sumFunction('Master_Profit'), 0),
                'SMaster_Profit': $scope.dataSource.showListData.reduce(sumFunction('SMaster_Profit'), 0),
                'Company_Profit': $scope.dataSource.showListData.reduce(sumFunction('Company_Profit'), 0)
            });

            $scope.dataSource.nowAgentLevel = agentLevel;
            $scope.dataSource.nowAgentLayer = agentLayer;
        };

        //$scope.showDetail = function (report) {
        //    $scope.dataSource.detailListData = report.DetailReportList;
        //    $('#ShowDetailDialog').click();
        //};

        $scope.showDetail = function (report) {
            if ($scope.dataSource.apiType === 'API') {
                mplayerService.findGameDealerWinLoseReportDetail({
                    DateS: $scope.dataSource.searchCondition.DateS,
                    DateE: $scope.dataSource.searchCondition.DateE,
                    UserName: report.Name
                })
                    .then(
                        function success(response, status, headers, config) {
                            if (response.data.APIRes.ResCode === '000') {
                                var detailReportList = response.data.Rows;

                                $scope.dataSource.detailListData = detailReportList;
                                $('#ShowDetailDialog').click();
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
            } else {
                mplayerService.findWinLoseReportDetail({
                    DateS: $scope.dataSource.searchCondition.DateS,
                    DateE: $scope.dataSource.searchCondition.DateE,
                    UserName: report.Name
                })
                    .then(
                        function success(response, status, headers, config) {
                            if (response.data.APIRes.ResCode === '000') {
                                var detailReportList = response.data.Rows;

                                $scope.dataSource.detailListData = detailReportList;
                                $('#ShowDetailDialog').click();
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
            }

        };

        $scope.showBetDetail = function (reportDetail) {
            //console.log(reportDetail)
            $scope.dataSource.betDetailData = reportDetail;
            $scope.dataSource.betDetailData.Olottery.ResultList = $scope.dataSource.betDetailData.Olottery.Result.split(',');
            $scope.dataSource.betDetailData.Olottery.SequenceResultList = $scope.dataSource.betDetailData.Olottery.ResultList.reverse();

            switch ($scope.dataSource.betDetailData.Olottery.LotteryTypeID) {
                case 10:
                    $scope.dataSource.betDetailData.showType = 'marksix';
                    break;
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                case 25:
                case 26:
                    $scope.dataSource.betDetailData.showType = '4D';
                    break;
                default:
                    $scope.dataSource.betDetailData.showType = 'Normal';
                    break;
            }

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
            $scope.search($scope.dataSource.memberInfo.UserName, $scope.dataSource.memberInfo.AgentLevelSCID);
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search($scope.dataSource.searchCondition.UserName, $scope.dataSource.searchCondition.AgentLevelSCID);
        };

        $scope.handleChangeApiType = function (type) {
            // 只有admin 和subCompany 能切換平台或API對接
            if ($scope.dataSource.memberInfo.AgentLevelSCID !== 28 && $scope.dataSource.memberInfo.AgentLevelSCID !== 38) {
                return;
            }
            $scope.dataSource.apiType = type;
            $scope.search($scope.dataSource.memberInfo.UserName, $scope.dataSource.memberInfo.AgentLevelSCID);
        };

        $scope.copy = function () {
            var body = document.body, range, sel;
            copy(body, document, 'winLoseReport');
        };

        $scope.excel = function () {
            excel(document, ['winLoseReport'], 'winLoseReport' + '.xls');
        };

        $scope.print = function () {
            print(document, 'winLoseReport');
        };

    }]);