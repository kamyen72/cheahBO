'use strict';
app.controller('gameRoomTypeController', [
	'$scope',
	'$rootScope',
	'$location',
	'$timeout',
	'localStorageService',
	'blockUI',
	'ngAuthSettings',
	'authService',
	'gameRoomService',
	'lotteryService',
	'betLimitSettingService',
	function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
		gameRoomService, lotteryService, betLimitSettingService) {
		blockUI.start();

		$scope.dataSource = {
			pageStatus: 'lotteryTypeView',
			searchCondition: { CurrentPage: 1, PageSize: 500 },
			gameRoomTypeListData: [],
			gameRoomTypeInfo: {},
			lotteryClassListData: [],
			lotteryClassInfo: {},
			lotteryTypeListData: [],
			lotteryTypeInfo: { vwLotteryTypeLimit: [] },
			lotteryInfoListData: [],
			lotteryInfo: { vwLotteryInfoLimit: [] },
			betLimitList: [],
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
			},
			PagerObj3: {
				CurrentPage: 1,
				PageSize: 10,
				TotalItems: 0,
				PageArray: [],
				PageRangeMax: 10,
				PageRangeMin: 1,
				thisPage: 1
			},
			PagerObj4: {
				CurrentPage: 1,
				PageSize: 10,
				TotalItems: 0,
				PageArray: [],
				PageRangeMax: 10,
				PageRangeMin: 1,
				thisPage: 1
			},
			openData: {},
			EditPassword: {
				isShow: true,
				type: null,
				Pwd: null,
				ConfirmPwd: null
			},
			callBack: null,
			parameter: {}
		};

		$scope.init = function () {
			$scope.searchLotteryClass();
			$scope.searchLotteryType();
			//$scope.searchGameRoomType();
			$scope.searchBetLimit();
		};

		$timeout($scope.init, 100);

		$scope.updateEditPassword = function (form) {
			if ($rootScope.valid(form) || !$scope.dataSource.EditPassword.type) {
				$scope.searchLotteryType();
				return;
			}

			$scope.checkGamePwd();
		};

		$scope.closePwd = function () {
			$scope.searchLotteryType();
		};

		$scope.checkGamePwd = function () {
			$scope.dataSource.openData.GamePwd = $scope.dataSource.EditPassword.Pwd;

			lotteryService.checkGamePwd($scope.dataSource.openData).then(
				function success(response) {
					if (response.data.APIRes.ResCode === '000') {
						//
						$scope.dataSource.callBack($scope.dataSource.parameter);
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
		};

		$scope.checkPwd = function (callBack, parameter) {
			$scope.dataSource.parameter = parameter !== undefined ? parameter : {};
			$scope.dataSource.callBack = callBack;//callBack;

			//if ($scope.dataSource.EditPassword.isShow) {
			//	$scope.dataSource.EditPassword.type = 'GameSetting';
			//	$scope.dataSource.EditPassword.Pwd = null;
			//	$scope.dataSource.EditPassword.ConfirmPwd = null;
			//	$('#ShowPasswordDialog').click();
			//}

            //Boss說移除密碼
            callBack(parameter);
		};

		$scope.searchBetLimit = function () {
			betLimitSettingService.find({ CurrentPage: 1, PageSize: 10000 })
				.then(
					function success(response, status, headers, config) {
						//alert(JSON.stringify(response.data.Rows.ListData));
						if (response.data.APIRes.ResCode === '000') {
							$scope.dataSource.betLimitList = response.data.Rows.ListData;
						} else {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
							$rootScope.$broadcast('changeModalMsg');
						}
					},
					function error(data, status, headers, config) {
					});
		};

		$scope.searchGameRoomType = function () {
			$scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
			$scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

			gameRoomService.find($scope.dataSource.searchCondition)
				.then(
					function success(response, status, headers, config) {
						if (response.data.APIRes.ResCode === '000') {
							$scope.dataSource.gameRoomTypeListData = response.data.Rows.ListData;
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

		$scope.addOrEditGameRoomType = function (form) {
			if ($rootScope.valid(form)) return;

			if ($scope.dataSource.gameRoomTypeInfo.GameRoomID) {
				gameRoomService.update($scope.dataSource.gameRoomTypeInfo).then(
					function success(response) {
						if (response.data.APIRes.ResCode === '000') {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
							$scope.searchGameRoomType();
						}
						else {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}
					},
					function error(data, status, headers, config) {
					});
			} else {
				gameRoomService.add($scope.dataSource.gameRoomTypeInfo).then(
					function success(response) {
						if (response.data.APIRes.ResCode === '000') {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
							$scope.searchGameRoomType();
						}
						else {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}
					},
					function error(data, status, headers, config) {
					});
			}
		};

		$scope.deleteGameRoomType = function (gameRoomTypeInfo) {
			$scope.dataSource.gameRoomTypeInfo = gameRoomTypeInfo;
			ngAuthSettings.modalMsg.title = 'Confirm';
			ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
			ngAuthSettings.modalMsg.type = '000';
			ngAuthSettings.modalMsg.callBack = 'confirmDelGameRoomType';
			$rootScope.$broadcast('changeModalMsg', true);
		};

		$scope.$on('confirmDelGameRoomType', function (event) {
			gameRoomService.delete($scope.dataSource.gameRoomTypeInfo).then(
				function success(response) {
					if (response.data.APIRes.ResCode === '000') {
						ngAuthSettings.modalMsg.title = "Message";
						ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
						ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
						ngAuthSettings.modalMsg.callBack = 'showSearch';

						$rootScope.$broadcast('changeModalMsg');
						$scope.searchGameRoomType();
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
				function error(data, status, headers, config) {
				});
		});

		$scope.changeAndSaveGameRoomType = function (gameRoomType) {
			$scope.dataSource.gameRoomTypeInfo = gameRoomType;
			$scope.addOrEditGameRoomType();
		};

		$scope.showGameRoomAdd = function () {
			$scope.dataSource.gameRoomTypeInfo = {};
			$('#ShowGameRoomDialog').click();
		};

		$scope.showGameRoomEdit = function (gameRoom) {
			$scope.dataSource.gameRoomTypeInfo = gameRoom;
			$('#ShowGameRoomDialog').click();
		};

		$scope.showLotteryClass = function (gameRoom) {
			$scope.dataSource.gameRoomTypeInfo = gameRoom;
			$scope.dataSource.pageStatus = 'lotteryClassView';
			$scope.dataSource.lotteryClassListData = [];
			$scope.dataSource.lotteryClassInfo = {};
			$scope.dataSource.lotteryTypeListData = [];
			$scope.dataSource.lotteryTypeInfo = {};
			$scope.dataSource.lotteryInfoListData = [];
			$scope.dataSource.lotteryInfo = {};
			$scope.searchLotteryClass();
		};

		$scope.searchLotteryClass = function () {
			$scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj2.CurrentPage;
			$scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj2.PageSize;
			$scope.dataSource.searchCondition.GameRoomID = $scope.dataSource.gameRoomTypeInfo.GameRoomID;

			lotteryService.findLotteryClass($scope.dataSource.searchCondition)
				.then(
					function success(response, status, headers, config) {
						if (response.data.APIRes.ResCode === '000') {
							console.log(response.data.Rows.ListData);
							$scope.dataSource.lotteryClassListData = response.data.Rows.ListData;
							$scope.dataSource.lotteryClassListData.unshift({ LotteryClassID: -1, LotteryClassName: 'All', GameRoomID: 1 });

							$scope.dataSource.lotteryClassInfo = $scope.dataSource.lotteryClassListData[0];
							//頁籤
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

		$scope.addOrEditLotteryClass = function (form) {
			if ($rootScope.valid(form)) return;
			
			if ($scope.dataSource.lotteryClassInfo.LotteryClassID) {
				lotteryService.updateLotteryClass($scope.dataSource.lotteryClassInfo).then(
					function success(response) {
						if (response.data.APIRes.ResCode === '000') {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
							//$scope.searchLotteryClass();
						}
						else {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}
					},
					function error(data, status, headers, config) {
					});
			} else {
				lotteryService.addLotteryClass($scope.dataSource.lotteryClassInfo).then(
					function success(response) {
						if (response.data.APIRes.ResCode === '000') {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
							//$scope.searchLotteryClass();
						}
						else {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}
					},
					function error(response) {

					});
			}
		};

		$scope.deleteLotteryClass = function (lotteryClassInfo) {
			$scope.dataSource.lotteryClassInfo = lotteryClassInfo;
			ngAuthSettings.modalMsg.title = 'Confirm';
			ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
			ngAuthSettings.modalMsg.type = '000';
			ngAuthSettings.modalMsg.callBack = 'confirmDelLotteryClassInfo';
			$rootScope.$broadcast('changeModalMsg', true);
		};

		$scope.$on('confirmDelLotteryClassInfo', function (event) {
			lotteryService.delLotteryClass($scope.dataSource.lotteryClassInfo).then(
				function success(response) {
					if (response.data.APIRes.ResCode === '000') {
						ngAuthSettings.modalMsg.title = "Message";
						ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
						ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
						ngAuthSettings.modalMsg.callBack = 'showSearch';

						$rootScope.$broadcast('changeModalMsg');
						$scope.searchLotteryClass();
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
				function error(data, status, headers, config) {
				});
		});

		$scope.changeAndSaveLotteryClass = function (lotteryClass) {
			$scope.dataSource.lotteryClassInfo = lotteryClass;
			$scope.addOrEditLotteryClass();
		};

		$scope.showLotteryClassAdd = function () {
			$scope.dataSource.lotteryClassInfo = {};
			$('#ShowLotteryClassDialog').click();
		};

		$scope.showLotteryClassEdit = function (lotteryClass) {
			$scope.dataSource.lotteryClassInfo = lotteryClass;
			$('#ShowLotteryClassDialog').click();
		};


		$scope.showLotteryType = function (lotteryClass) {
			$scope.dataSource.lotteryClassInfo = lotteryClass;
			$scope.dataSource.pageStatus = 'lotteryTypeView';

			$scope.dataSource.lotteryTypeListData = [];
			$scope.dataSource.lotteryTypeInfo = {};
			$scope.dataSource.lotteryInfoListData = [];
			$scope.dataSource.lotteryInfo = {};
			$scope.searchLotteryType();
		};

		$scope.searchLotteryType = function () {
			//blockUI.start();
			$scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj3.CurrentPage;
			$scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj3.PageSize;
			$scope.dataSource.searchCondition.LotteryClassID = $scope.dataSource.lotteryClassInfo.LotteryClassID;

			lotteryService.findLotteryType($scope.dataSource.searchCondition)
				.then(
					function success(response, status, headers, config) {
						blockUI.stop();
						if (response.data.APIRes.ResCode === '000') {
							console.log(response.data.Rows.ListData);
							$scope.dataSource.lotteryTypeListData = response.data.Rows.ListData;
							//頁籤
							$scope.dataSource.PagerObj3 = response.data.Rows.PagerObj;
							$scope.dataSource.PagerObj3["thisPage"] = $scope.dataSource.PagerObj3.CurrentPage;
							$scope.dataSource.PagerObj3["thisPageSize"] = $scope.dataSource.PagerObj3.PageSize;
							$scope.dataSource.PagerObj3["PageArray"] = [];
						} else {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}
						//blockUI.stop();
					},
					function error(data, status, headers, config) {
						//blockUI.stop();
					});
		};

		$scope.addOrEditLotteryType = function (form) {
			if ($rootScope.valid(form)) return;

			blockUI.start();
			//$scope.dataSource.lotteryTypeInfo.LotteryClassID = $scope.dataSource.lotteryClassInfo.LotteryClassID;
			$scope.dataSource.lotteryTypeInfo.LimitMapData = $scope.dataSource.lotteryTypeInfo.vwLotteryTypeLimit.filter(p => p.LimitID > 0).map(p => {
				return {
					ID: p.LotteryBetLimitMapID, LimitID: p.LimitID, LotteryClassID: p.LotteryClassID, LotteryTypeID: p.LotteryTypeID,
					LotteryInfoID: p.LotteryInfoID, ParentID: p.ParentID
				};
			});

			if ($scope.dataSource.lotteryTypeInfo.LotteryTypeID) {
				lotteryService.updateLotteryType($scope.dataSource.lotteryTypeInfo).then(
					function success(response) {
						blockUI.stop();
						if (response.data.APIRes.ResCode === '000') {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;// + ' － front end will be updated in 60sec';
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}
						else {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}

						$scope.searchLotteryType();
					},
					function error(data, status, headers, config) {
						blockUI.stop();
					});
			} else {
				lotteryService.addLotteryType($scope.dataSource.lotteryTypeInfo).then(
					function success(response) {
						if (response.data.APIRes.ResCode === '000') {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;// + ' － front end will be updated in 60sec';
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}
						else {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}

						$scope.searchLotteryType();
					},
					function error(data, status, headers, config) {
						blockUI.stop();
					});
			}
		};

		$scope.deleteLotteryType = function (lotteryTypeInfo) {
			$scope.dataSource.lotteryTypeInfo = lotteryTypeInfo;
			ngAuthSettings.modalMsg.title = 'Confirm';
			ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
			ngAuthSettings.modalMsg.type = '000';
			ngAuthSettings.modalMsg.callBack = 'confirmDelLotteryType';
			$rootScope.$broadcast('changeModalMsg', true);
		};

		$scope.$on('confirmDelLotteryType', function (event) {
			lotteryService.delLotteryType($scope.dataSource.lotteryTypeInfo).then(
				function success(response) {
					if (response.data.APIRes.ResCode === '000') {
						ngAuthSettings.modalMsg.title = "Message";
						ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;// + ' － front end will be updated in 60sec';
						ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
						ngAuthSettings.modalMsg.callBack = 'showSearch';

						$rootScope.$broadcast('changeModalMsg');
						$scope.searchLotteryType();
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
				function error(data, status, headers, config) {
				});
		});

		$scope.changeAndSaveLotteryType = function (lotteryType) {
			$scope.dataSource.lotteryTypeInfo = lotteryType;
			$scope.addOrEditLotteryType();
		};

		$scope.showLotteryTypeAdd = function () {
			$scope.dataSource.lotteryTypeInfo = { vwLotteryTypeLimit: [] };
			$('#ShowLotteryTypeDialog').click();
		};

		$scope.showLotteryTypeEdit = function (lotteryType) {
			$scope.dataSource.lotteryTypeInfo = lotteryType;
			$('#ShowLotteryTypeDialog').click();
		};


		$scope.showLotteryInfo = function (lotteryType) {
			$scope.dataSource.lotteryTypeInfo = lotteryType;
			$scope.dataSource.pageStatus = 'lotteryInfoView';

			$scope.dataSource.lotteryInfoListData = [];
			$scope.dataSource.lotteryInfo = {};
			$scope.searchLotteryInfo();
		};

		$scope.searchLotteryInfo = function () {
			$scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj4.CurrentPage;
			$scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj4.PageSize;
			$scope.dataSource.searchCondition.LotteryTypeID = $scope.dataSource.lotteryTypeInfo.LotteryTypeID;
			$scope.dataSource.searchCondition.Status = false;

			lotteryService.findLotteryInfo($scope.dataSource.searchCondition)
				.then(
					function success(response, status, headers, config) {
						if (response.data.APIRes.ResCode === '000') {
							console.log(response.data.Rows.ListData);
							$scope.dataSource.lotteryInfoListData = response.data.Rows.ListData;
							$scope.dataSource.lotteryInfoListData.forEach(p => {
								var selectArray = JSON.parse(p.SelectArray).map(m => {
									var result = '';
									if (m.odds) return m.text + ':' + m.odds;
									else return '';
								});
								selectArray = selectArray.filter(s => s !== '');
								p.ShowOdds = selectArray.join(',');
							});
							//頁籤
							$scope.dataSource.PagerObj4 = response.data.Rows.PagerObj;
							$scope.dataSource.PagerObj4["thisPage"] = $scope.dataSource.PagerObj4.CurrentPage;
							$scope.dataSource.PagerObj4["thisPageSize"] = $scope.dataSource.PagerObj4.PageSize;
							$scope.dataSource.PagerObj4["PageArray"] = [];
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

		$scope.addOrEditLotteryInfo = function (form) {
			if ($rootScope.valid(form)) return;

			//$scope.dataSource.lotteryInfo.LotteryClassID = $scope.dataSource.lotteryClassInfo.LotteryClassID;
			$scope.dataSource.lotteryInfo.LotteryTypeID = $scope.dataSource.lotteryTypeInfo.LotteryTypeID;
			$scope.dataSource.lotteryInfo.DisCount = $scope.dataSource.lotteryInfo.DisCount / 100;
			if ($scope.dataSource.lotteryInfo.SelectArrayModel) {
				$scope.dataSource.lotteryInfo.SelectArrayModel.forEach(p => {
					if (!p.odds) delete p["odds"];
					delete p["$$hashKey"];
				});
				$scope.dataSource.lotteryInfo.SelectArray = JSON.stringify($scope.dataSource.lotteryInfo.SelectArrayModel);
			}
			$scope.dataSource.lotteryInfo.LimitMapData = $scope.dataSource.lotteryInfo.vwLotteryInfoLimit.filter(p => p.LimitID > 0).map(p => {
				return {
					ID: p.LotteryBetLimitMapID, LimitID: p.LimitID, LotteryClassID: p.LotteryClassID, LotteryTypeID: p.LotteryTypeID,
					LotteryInfoID: p.LotteryInfoID, ParentID: p.ParentID
				};
			});

			if ($scope.dataSource.lotteryInfo.LotteryInfoID) {
				lotteryService.updateLotteryInfo($scope.dataSource.lotteryInfo).then(
					function success(response) {
						if (response.data.APIRes.ResCode === '000') {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
							$scope.searchLotteryInfo();
						}
						else {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}
					},
					function error(response) {
						console.log(response);
					});
			} else {
				lotteryService.addLotteryInfo($scope.dataSource.lotteryInfo).then(
					function success(response) {
						if (response.data.APIRes.ResCode === '000') {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
							$scope.searchLotteryInfo();
						}
						else {
							ngAuthSettings.modalMsg.title = "Message";
							ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
							ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

							$rootScope.$broadcast('changeModalMsg');
						}
					},
					function error(response) {

					});
			}
		};

		$scope.deleteLotteryInfo = function (lotteryInfo) {
			$scope.dataSource.lotteryInfo = lotteryInfo;
			ngAuthSettings.modalMsg.title = 'Confirm';
			ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
			ngAuthSettings.modalMsg.type = '000';
			ngAuthSettings.modalMsg.callBack = 'confirmDelLotteryInfo';
			$rootScope.$broadcast('changeModalMsg', true);
		};

		$scope.$on('confirmDelLotteryInfo', function (event) {
			lotteryService.delLotteryInfo($scope.dataSource.lotteryInfo).then(
				function success(response) {
					if (response.data.APIRes.ResCode === '000') {
						ngAuthSettings.modalMsg.title = "Message";
						ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
						ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
						ngAuthSettings.modalMsg.callBack = 'showSearch';

						$rootScope.$broadcast('changeModalMsg');
						$scope.searchLotteryInfo();
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
		});

		$scope.changeAndSaveLotteryInfo = function (lotteryInfo) {
			$scope.dataSource.lotteryInfo = lotteryInfo;
			$scope.addOrEditLotteryInfo();
		};

		$scope.showLotteryInfoAdd = function () {
			$scope.dataSource.lotteryInfo = {
				vwLotteryInfoLimit: [], SelectArrayModel: {}
			};
			$('#ShowLotteryInfoDialog').click();
		};

		$scope.showLotteryInfoEdit = function (lotteryInfo) {
			$scope.dataSource.lotteryInfo = {};
			$.extend($scope.dataSource.lotteryInfo, lotteryInfo);

			if ($scope.dataSource.lotteryInfo.SelectArray) $scope.dataSource.lotteryInfo.SelectArrayModel = JSON.parse($scope.dataSource.lotteryInfo.SelectArray);
			if ($scope.dataSource.lotteryInfo.DisCount) $scope.dataSource.lotteryInfo.DisCount = ($scope.dataSource.lotteryInfo.DisCount * 100).toFixed(2);
			$('#ShowLotteryInfoDialog').click();
		};

		$scope.addBetLimit = function (betLimitArray) {
			//$('#ShowBetLimitDialog').click();
			betLimitArray.push({
				LotteryClassID: $scope.dataSource.lotteryClassInfo.LotteryClassID ? $scope.dataSource.lotteryClassInfo.LotteryClassID : 0,
				LotteryTypeID: $scope.dataSource.lotteryTypeInfo.LotteryTypeID ? $scope.dataSource.lotteryTypeInfo.LotteryTypeID : 0,
				LotteryInfoID: $scope.dataSource.lotteryInfo.LotteryInfoID ? $scope.dataSource.lotteryInfo.LotteryInfoID : 0
			});
		};

		$scope.deleteBetLimit = function (betLimitArray, betLimit) {
			if (betLimit.LotteryBetLimitMapID > 0) {
				betLimitSettingService.deleteMap(betLimit).then(
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
			} else {
				var idx = betLimitArray.indexOf(betLimit);
				if (idx > -1) {
					betLimitArray.splice(idx, 1);
				}
			}
		};

		//換頁
		$scope.PageChanged = function (page) {
			$scope.dataSource.PagerObj.CurrentPage = page;
			$scope.searchGameRoomType();
		};

		//換頁
		$scope.PageChanged2 = function (page) {
			$scope.dataSource.PagerObj2.CurrentPage = page;
			$scope.searchLotteryClass();
		};

		//換頁
		$scope.PageChanged3 = function (page) {
			$scope.dataSource.PagerObj3.CurrentPage = page;
			$scope.searchLotteryType();
		};

		//換頁
		$scope.PageChanged4 = function (page) {
			$scope.dataSource.PagerObj4.CurrentPage = page;
			$scope.searchLotteryInfo();
		};

	}]);