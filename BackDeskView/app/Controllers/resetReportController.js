'use strict';
app.controller('resetReportController', [
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
	'mplayerService',
	function ($q, $scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService, lotteryService, mplayerService) {

		$scope.dataSource = {
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

		// 查詢今日投注
		$scope.search = function () {
			mplayerService.findVwMPlayerByReset({
				DateS: $scope.dataSource.searchCondition.DateS,
				DateE: $scope.dataSource.searchCondition.DateE
			})
				.then(
					function success(response, status, headers, config) {
						if (response.data.APIRes.ResCode === '000') {
							$scope.dataSource.listData = response.data.Rows.ListData;
							console.log($scope.dataSource.listData)
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

		$scope.showDetail = function (mPlayer) {
			$scope.dataSource.mPlayerDetail = JSON.parse(JSON.stringify(mPlayer));
			if ($scope.dataSource.mPlayerDetail.vwMPlayers && $scope.dataSource.mPlayerDetail.vwMPlayers.length > 0) {
				for (var i = 0; i < $scope.dataSource.mPlayerDetail.vwMPlayers.length; i++) {
					let selectedPlayType = $scope.dataSource.mPlayerDetail.vwMPlayers[i].LotteryInfoName.split('_');
					if (selectedPlayType.length > 1) {
						let SelectedTxtData = $scope.dataSource.mPlayerDetail.vwMPlayers[i].SelectedTxt.split('|');
						$scope.dataSource.mPlayerDetail.vwMPlayers[i].SelectedTxt = selectedPlayType[0] + '|' + SelectedTxtData[1] + '|' + SelectedTxtData[2];
					}
				}
			}
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
			$scope.dataSource.showDetailMemberID = member.MemberID;
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