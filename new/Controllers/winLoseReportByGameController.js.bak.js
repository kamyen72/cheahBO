'use strict';
app.controller('winLoseReportByGameController', 
    [
        '$scope',
        '$rootScope',
        '$location',
        '$timeout',
        'localStorageService',
        'blockUI',
        'ngAuthSettings',
        'authService',
        'mplayerService',
        'lotteryService',
        function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
            mplayerService, lotteryService /* , SetDates */ ) {

        $scope.dataSource = {
            pageStatus: 'SearchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            selDetailReport: {},
            gameType: {},
            listData: [],
            detailListData: [],
            detailInfoListData: [],
            memberListData: [], 
            selLotteryTypeList: [],
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
            nowAgentLayer: 0
        };

        $scope.init = function () {
            $scope.dataSource.memberInfo = localStorageService.get('UserInfo');
            console.log("abc");
            console.log("Before SetDates");
            $scope.SetDates();
            // alert("wooi");
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            $scope.dataSource.pageStatus = 'SearchView';

            blockUI.start();
            $scope.dataSource.listData = [];

            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            if (!IS_MASTER) $scope.dataSource.searchCondition.PlatformID = ngAuthSettings.platformID;

            mplayerService.findWinLoseReportByGameTotal($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows;

                            $scope.dataSource.listData.forEach(p => {
                                p.TotalBet = p.TotalBet - p.TotalPending;
                                p.LotteryTypeName = $scope.dataSource.selLotteryTypeList.find(l => l.LotteryTypeID === p.LotteryTypeID).LotteryTypeName;
                            });

                            $scope.dataSource.listData.push({
                                'LotteryTypeName': 'Total',
                                'TotalBet': $scope.dataSource.listData.reduce(sumFunction('TotalBet'), 0),
                                'TurnOver': $scope.dataSource.listData.reduce(sumFunction('TurnOver'), 0),
                                'TotalPending': $scope.dataSource.listData.reduce(sumFunction('TotalPending'), 0),
                                'TotalWinLose': $scope.dataSource.listData.reduce(sumFunction('TotalWinLose'), 0),
                                'CTotalWinLose': $scope.dataSource.listData.reduce(sumFunction('CTotalWinLose'), 0),
                                'SMTotalWinLose': $scope.dataSource.listData.reduce(sumFunction('SMTotalWinLose'), 0),
                                'MTotalWinLose': $scope.dataSource.listData.reduce(sumFunction('MTotalWinLose'), 0),
                                'AGTotalWinLose': $scope.dataSource.listData.reduce(sumFunction('AGTotalWinLose'), 0),
                                'UpperWinLose': $scope.dataSource.listData.reduce(sumFunction('UpperWinLose'), 0)
                            });
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
                        console.log(response);
                    });
        };

        $scope.Test = function() {
            var d = new Date();
            d.setDate(d.getDate() - 7);
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();

            var tm = "";
            var td = "";

            if (month < 10) {
              tm = "0" + month.toString();
            }
            else {
              tm = month.toString();
            }

            if (day < 10) {
              td = "0" + day.toString();
            }
            else {
              td = day.toString();
            }
            var startdate = year.toString() + "-" + tm + "-" + td;
            document.getElementById("dtDateS").value = startdate;
        }

        $scope.SetDates = function () {
            var d = new Date();
            d.setDate(d.getDate() - 0);
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();

            var tm = "";
            var td = "";

            if (month < 10) {
              tm = "0" + month.toString();
            }
            else {
              tm = month.toString();
            }

            if (day < 10) {
              td = "0" + day.toString();
            }
            else {
              td = day.toString();
            }
            var startdate = year.toString() + "-" + tm + "-" + td;
            document.getElementById("dtDateS").value = startdate;

            var d2 = new Date();
            var dd = d2.getDate();
            var mm = d2.getMonth() + 1;
            var yy = d2.getFullYear();

            if (mm < 10) {
              tm = "0" + mm.toString();
            }
            else {
              tm = mm.toString();
            }

            if (dd < 10) {
              td = "0" + dd.toString();
            }
            else {
              td = dd.toString();
            }

            var enddate = yy.toString() + "-" + tm + "-" + td;
            document.getElementById("dtDateE").value = enddate;
        }

        $scope.pop_Ticket = function () {
            console.log("pop_Ticket");
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
        }

        $scope.close_Ticket = function () {
            console.log("close_Ticket");
            var modal = document.getElementById("myModal");
            modal.style.display = "none";
        }

        $scope.showDetail = function (report) {
            $scope.dataSource.gameType = report;
            $scope.dataSource.pageStatus = 'DetailView';
            $scope.dataSource.detailListData = [];
            $scope.dataSource.detailInfoListData = [];

            var sendObj = {};
            sendObj.DateS = $scope.dataSource.searchCondition.DateS;
            sendObj.DateE = $scope.dataSource.searchCondition.DateE;
            sendObj.LotteryTypeID = report.LotteryTypeID;
            sendObj.IsDetailReport = true;
            sendObj.ShowPending = true;
            if (!IS_MASTER) sendObj.PlatformID = ngAuthSettings.platformID;

            mplayerService.findWinLoseReportByGame(sendObj)
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            var listData = response.data.Rows;
                            
                            $scope.dataSource.detailListData = listData.filter(p => p.SelectedNums === '');
                            $scope.dataSource.detailInfoListData = listData.filter(p => p.SelectedNums !== '');
                            $scope.dataSource.detailListData.forEach(p => {
                                p.LotteryTypeName = $scope.dataSource.selLotteryTypeList.find(l => l.LotteryTypeID === p.LotteryTypeID).LotteryTypeName;
                            });
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

        $scope.showMemberDetail = function (detailReport) {
            $scope.dataSource.gameType = detailReport;
            $scope.dataSource.selDetailReport = detailReport;
            $scope.dataSource.pageStatus = 'MemberView';
            $scope.dataSource.memberListData = [];

            var sendObj = {};
            sendObj.DateS = $scope.dataSource.searchCondition.DateS;
            sendObj.DateE = $scope.dataSource.searchCondition.DateE;
            sendObj.LotteryTypeID = detailReport.LotteryTypeID;

            mplayerService.findWinLoseReportByGameMember(sendObj)
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.memberListData = response.data.Rows;
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
                        console.log(response);
                    });
        };

        // 查詢今日投注
        $scope.searchBetDetail = function (detailReport) {
            //$scope.dataSource.mPlayerObj = detailReport;
            $scope.dataSource.selDetailReport = detailReport;
            //$scope.dataSource.mPlayerObj = [];

            console.log(detailReport)
            var ajaxData = {
                'CurrentPage': 1,
                'PageSize': 1000,
                'LotteryTypeIDs': [detailReport.LotteryTypeID],
                'MemberID': detailReport.MemberID,
                'GameDealerMemberID': detailReport.GameDealerMemberID,
                'DateS': $scope.dataSource.searchCondition.DateS,
                'DateE': $scope.dataSource.searchCondition.DateE
            };

            var callMplayer = detailReport.MemberID > 0 ?
                lotteryService.findVwMPlayer :
                lotteryService.findVwGameDealerMPlayerByBack;

            callMplayer(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.mPlayerObj = response.data.Rows.ListData;
                        console.log($scope.dataSource.mPlayerObj);

                        $('#ShowDetailDialog').click();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Information";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        // 填完訊息後顯示訊息框
                        $rootScope.$broadcast('changeModalMsg');
                        $('#ModalShow').click();
                    }
                },
                function error(response) { }
            );
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

        $scope.searchLotteryType = function () {
            var sendObj = {};
            sendObj.CurrentPage = 1;
            sendObj.PageSize = 1000;

            lotteryService.findLotteryType(sendObj)
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            console.log(response.data.Rows.ListData);
                            $scope.dataSource.selLotteryTypeList = response.data.Rows.ListData;
                            $scope.dataSource.selLotteryTypeList.unshift({ LotteryTypeID: -1, LotteryTypeName: '--Select Game--' });
                            $scope.dataSource.searchCondition.LotteryTypeID = -1;
                            //$scope.dateSearch(-2, 0);
                            $scope.dateSearch(0, 0);
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
                        }
                        blockUI.stop();
                    },
                    function error(response) {
                        console.log(response);
                        blockUI.stop();
                    });
        };

        $scope.showBetDetail = function (period) {
            $scope.dataSource.mPlayerDetail = period;
            if ($scope.dataSource.mPlayerDetail.oLottery.Result) {
                $scope.dataSource.mPlayerDetail.oLottery.ResultList = $scope.dataSource.mPlayerDetail.oLottery.Result.split(',');
                $scope.dataSource.mPlayerDetail.oLottery.SequenceResultList = $scope.dataSource.mPlayerDetail.oLottery.ResultList.reverse();
            }
            $('#ShowReceiptModal').click();
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search($scope.dataSource.memberInfo.UserName, $scope.dataSource.memberInfo.AgentLevelSCID);
        };

        $scope.copy = function () {
            var body = document.body, range, sel;
            copy(body, document, $scope.dataSource.pageStatus);
        };

        $scope.excel = function () {
            excel(document, [$scope.dataSource.pageStatus], $scope.dataSource.pageStatus + '.xls');
        };

        $scope.print = function () {
            print(document, $scope.dataSource.pageStatus);
        };

        }
    ]);

// alert("hmm ...");