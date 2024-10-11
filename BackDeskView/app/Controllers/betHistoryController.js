'use strict';
app.controller('betHistoryController', [
    '$q',
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'lotteryService',
    function ($q, $scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService, lotteryService) {

        $scope.dataSource = {
            tagStatus: 'BetHistory',
            pageStatus: 'searchView',
            lotteryClassObj: [],
            SelectLotteryClass: {},
            mPlayerDetail: {},
            mPlayerObj: [],
            subMemberList: [],
            searchCondition: { StatusCode: 1 },
            showDetailMemberID: null,
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

        $scope.hot_btn_click = function () {
            $(".bonus_bottom").toggle();
        };

        $scope.init = function () {
            $scope.dataSource.memberInfo = localStorageService.get('UserInfo');

            $scope.dataSource.searchCondition.DateS = new Date();
            $scope.dataSource.searchCondition.DateE = new Date();
            //$scope.findLotteryClass();
            $scope.search();
        };

        setTimeout($scope.init, 300);

        $scope.changePage = function (tagStatus) {
            $scope.dataSource.pageStatus = 'searchView';
            $scope.dataSource.tagStatus = tagStatus;
            $scope.search();
        };

        // 查詢今日投注
        $scope.search = function () {
            //if (!$scope.dataSource.SelectLotteryType) {
            //    ngAuthSettings.modalMsg.title = "Information";
            //    ngAuthSettings.modalMsg.msg = "Please select game.";

            //    // 填完訊息後顯示訊息框
            //    $('#ModalShow').click();
            //    ngAuthSettings.modalMsg.callBack = "";
            //    $rootScope.$broadcast('changeModalMsg');
            //    return;
            //}

            var agentParentMap = $scope.dataSource.memberInfo.AgentParentMap.split('/');

            var ajaxData = {
                'CurrentPage': $scope.dataSource.PagerObj.CurrentPage,
                'PageSize': $scope.dataSource.PagerObj.PageSize,
                'StatusCode': $scope.dataSource.tagStatus === 'Pending' ? 0 : 1,
                'DateS': $scope.dataSource.searchCondition.DateS,
                'DateE': $scope.dataSource.searchCondition.DateE,
                'Status': $scope.dataSource.searchCondition.status,
                'UserName': ($scope.dataSource.memberInfo.AgentLevelSCID === 38 || $scope.dataSource.memberInfo.AgentLevelSCID === 39) ?
                    agentParentMap[agentParentMap.length - 2] : $scope.dataSource.memberInfo.UserName,
                'Type': !IS_MASTER ? 2 : 1
            };

            blockUI.start();
            lotteryService.findVwMPlayerReport(ajaxData).then(
                function success(response) {
                    console.log(response);
                    if (response.data.APIRes.ResCode === '000') {
                        blockUI.stop();
                        $scope.dataSource.subMemberList = response.data.Rows.ListData;
                        //console.log($scope.dataSource.mPlayerObj);
                        if ($scope.dataSource.subMemberList.length > 0) {
                            $scope.dataSource.subMemberList.push({
                                'UserName': 'Total' ,
                                'Turnover': $scope.dataSource.subMemberList.reduce(sumFunction('Turnover'), 0),
                                'BetAmounts': $scope.dataSource.subMemberList.reduce(sumFunction('BetAmounts'), 0)
                            });

                            $scope.dataSource.subMemberList.push({
                                'UserName':'Grand Total',
                                'Turnover': response.data.Rows.QryData.TotalTurnover,
                                'BetAmounts': response.data.Rows.QryData.TotalBetAmount
                            });
                        }
                        //頁籤
                        $scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                        $scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                        $scope.dataSource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                        $scope.dataSource.PagerObj["PageArray"] = [];
                    }
                    else {
                        blockUI.stop();
                        ngAuthSettings.modalMsg.title = "Information";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = "home";

                        // 填完訊息後顯示訊息框
                        $rootScope.$broadcast('changeModalMsg');
                        $('#ModalShow').click();
                    }
                },
                function error(response) {
                    blockUI.stop();
                }
            );
        };

        $scope.searchDetail = function () {
            $scope.dataSource.mPlayerObj = [];
            //var lotteryTypeIDs = [];
            //if ($scope.dataSource.SelectLotteryType && $scope.dataSource.SelectLotteryType.LotteryTypeID > 0) {
            //	lotteryTypeIDs.push($scope.dataSource.SelectLotteryType.LotteryTypeID);
            //} else {
            //	$scope.dataSource.SelectLotteryClass.lotteryTypes.forEach(p => { if (p.LotteryTypeID) lotteryTypeIDs.push(p.LotteryTypeID); });
            //}

            blockUI.start();

            var ajaxData = {
                'CurrentPage': $scope.dataSource.PagerObj2.CurrentPage,
                'PageSize': $scope.dataSource.PagerObj2.PageSize,
                'MemberID': $scope.dataSource.showDetailMember.MemberID,
                //'LotteryTypeIDs': lotteryTypeIDs,
                'StatusCode': $scope.dataSource.tagStatus === 'Pending' ? 0 : 1,
                'DateS': $scope.dataSource.searchCondition.DateS,
                'DateE': $scope.dataSource.searchCondition.DateE,
                'Status': $scope.dataSource.searchCondition.status,
                'ByReport': true,
                'ByGameDealer': false
            };

            if ($scope.dataSource.showDetailMember.UserName.split('_')[0] !== 'ghl' &&
                $scope.dataSource.showDetailMember.UserName.split('_')[0] !== 'tok') {
                ajaxData.ByGameDealer = true;
            }

            lotteryService.findVwMPlayerByBack(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        blockUI.stop();
                        $scope.dataSource.mPlayerObj = response.data.Rows.ListData;
                        //console.log($scope.dataSource.mPlayerObj);
                        if ($scope.dataSource.mPlayerObj.length > 0) {
                            $scope.dataSource.mPlayerObj.push({
                                'TurnOver': $scope.dataSource.mPlayerObj.reduce(sumFunction('TurnOver'), 0),
                                'BetAmount': $scope.dataSource.mPlayerObj.reduce(sumFunction('BetAmount'), 0),
                                'WinMoney': $scope.dataSource.mPlayerObj.reduce(sumFunction('WinMoney'), 0),
                                'WinLose': $scope.dataSource.mPlayerObj.reduce(sumFunction('WinLose'), 0)
                            });
                        }
                        //頁籤
                        $scope.dataSource.PagerObj2 = response.data.Rows.PagerObj;
                        $scope.dataSource.PagerObj2["thisPage"] = $scope.dataSource.PagerObj2.CurrentPage;
                        $scope.dataSource.PagerObj2["thisPageSize"] = $scope.dataSource.PagerObj2.PageSize;
                        $scope.dataSource.PagerObj2["PageArray"] = [];
                    }
                    else {
                        blockUI.stop();
                        ngAuthSettings.modalMsg.title = "Information";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = "home";

                        // 填完訊息後顯示訊息框
                        $rootScope.$broadcast('changeModalMsg');
                        $('#ModalShow').click();
                    }
                },
                function error(response) {
                    blockUI.stop();
                }
            );
        };

        // 查詢彩種
        $scope.findLotteryClass = function () {
            var today = new Date();
            var ajaxData = {
                'CurrentPage': 1,
                'PageSize': 100000,
                'DateS': today,
                'DateE': today,
                'Status': true
            };

            lotteryService.findLotteryClass(ajaxData, ngAuthSettings.headers).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.lotteryClassObj = response.data.Rows.ListData;
                        $scope.dataSource.lotteryClassObj.unshift({ ID: 0, LotteryClassName: 'All', lotteryTypes: [] });
                        $scope.dataSource.lotteryClassObj.unshift({ ID: -1, LotteryClassName: '--Game Class--', lotteryTypes: [] });
                        $scope.dataSource.SelectLotteryClass = $scope.dataSource.lotteryClassObj[0];
                        $scope.dataSource.lotteryClassObj.forEach(p => {
                            if (!p.lotteryTypes) return;
                            p.lotteryTypes.unshift({ ID: 0, LotteryTypeCode: 'All' });
                            p.lotteryTypes.unshift({ ID: -1, LotteryTypeCode: '--Game Type--' });
                        });
                        $scope.secondSelected();
                        $scope.search();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "FindLotteryClass";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                    }
                },
                function error(response) {
                    console.log(response);
                }
            );
        };

        // 關聯式選單
        $scope.secondSelected = function () {
            $scope.dataSource.lotteryTypes = [];
            if (!$scope.dataSource.SelectLotteryClass.lotteryTypes) {
                $scope.dataSource.SelectLotteryType = $scope.dataSource.lotteryTypes[0];
                return;
            }

            $scope.dataSource.lotteryTypes = $scope.dataSource.SelectLotteryClass.lotteryTypes;
            $scope.dataSource.SelectLotteryType = $scope.dataSource.lotteryTypes[0];
        };

        $scope.showList = function (member) {
            $scope.dataSource.pageStatus = 'detailView';
            $scope.dataSource.showDetailMember = member;
            $scope.searchDetail();
        };

        $scope.showDetail = function (mPlayer) {
            console.log(mPlayer);

            $scope.dataSource.mPlayerDetail = JSON.parse(JSON.stringify(mPlayer));
            if ($scope.dataSource.mPlayerDetail.vwMPlayers && $scope.dataSource.mPlayerDetail.vwMPlayers.length > 0) {
                for (var i = 0; i < $scope.dataSource.mPlayerDetail.vwMPlayers.length; i++) {
                    let selectedPlayType = $scope.dataSource.mPlayerDetail.vwMPlayers[i].LotteryInfoName.split('_');
                    if (selectedPlayType.length > 1) {
                        let SelectedTxtData = $scope.dataSource.mPlayerDetail.vwMPlayers[i].SelectedTxt.split('|');
                        $scope.dataSource.mPlayerDetail.vwMPlayers[i].SelectedTxt = selectedPlayType[0] + '|' + SelectedTxtData[1] + '|' + SelectedTxtData[2];
                    }
                }

                if ($scope.dataSource.mPlayerDetail.vwMPlayers[0].LotteryClassID === 5) {
                    $scope.dataSource.mPlayerDetail.oLottery.Result = $scope.dataSource.mPlayerDetail.oLottery.Result.split(',').reverse().join(',');
                }

                $scope.dataSource.mPlayerDetail.vwMPlayers.push({
                    'UserName': '',
                    'Price': $scope.dataSource.mPlayerDetail.vwMPlayers.reduce(sumFunction('Price'), 0),
                    'DiscountPrice': $scope.dataSource.mPlayerDetail.vwMPlayers.reduce(sumFunction('DiscountPrice'), 0),
                    'WinMoney': $scope.dataSource.mPlayerDetail.vwMPlayers.reduce(sumFunction('WinMoney'), 0),
                    'WinLose': $scope.dataSource.mPlayerDetail.vwMPlayers.reduce(sumFunction('WinLose'), 0)
                });
            }
            console.log($scope.dataSource.mPlayerDetail);
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

        $scope.PageChanged2 = function (page) {
            $scope.dataSource.PagerObj2.CurrentPage = page;
            $scope.searchDetail();
        };

    }]);