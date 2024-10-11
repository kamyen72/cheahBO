'use strict';
app.controller('transactionsHistoryController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'transactionsService',
    'systemConfigService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        transactionsService, systemConfigService) {

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: {
                CurrentPage: 1,
                PageSize: 10,
                DepositType: -1,
                WithDrawalType: -1,
                DCType: -1
            },
            listData: [],
            totalData: {},
            PagerObj: {
                CurrentPage: 1,
                PageSize: 10,
                TotalItems: 0,
                PageArray: [],
                PageRangeMax: 10,
                PageRangeMin: 1,
                thisPage: 1
            },
            modalMsg: {},
            selTransaction: {}
        };

        $scope.init = function () {
            $scope.dataSource.searchCondition.DateS = new Date();
            $scope.dataSource.searchCondition.DateE = new Date();

            $scope.dropDownInit();
            $scope.search();
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            blockUI.start();

            // $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            // $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            if ($scope.dataSource.searchCondition.DCType === 1) {
                if ($scope.dataSource.searchCondition.DepositType === -1)
                    $scope.dataSource.searchCondition.TransactionsTypeID = -1;
                else
                    $scope.dataSource.searchCondition.TransactionsTypeID = $scope.dataSource.searchCondition.DepositType;
            }
            else if ($scope.dataSource.searchCondition.DCType === 2) {
                if ($scope.dataSource.searchCondition.WithDrawalType === -1)
                    $scope.dataSource.searchCondition.TransactionsTypeID = -2;
                else
                    $scope.dataSource.searchCondition.TransactionsTypeID = $scope.dataSource.searchCondition.WithDrawalType;
            } else {
                $scope.dataSource.searchCondition.TransactionsTypeID = 0;
            }

            var ajaxData = {
                ...$scope.dataSource.searchCondition,
                CurrentPage: $scope.dataSource.PagerObj.CurrentPage,
                PageSize: $scope.dataSource.PagerObj.PageSize,
            };
            if (!IS_MASTER && ngAuthSettings.platformCode && ajaxData.UserName && !ajaxData.UserName.includes('_')) {
                // 不在IS_MASTER 加上當前平台前綴 串出UserName
                ajaxData.UserName = ngAuthSettings.platformCode + '_' + ajaxData.UserName;
            }

            transactionsService.findTransactionsHistory(ajaxData)
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            console.log(response.data.Rows.ListData);
                            $scope.dataSource.listData = response.data.Rows.ListData;
                            $scope.dataSource.showListData = response.data.Rows.ListData;

                            if ($scope.dataSource.showListData.length > 0) {
                                $scope.dataSource.totalData = {
                                    'DebitAmount': $scope.dataSource.showListData.reduce(sumFunction('DebitAmount'), 0),
                                    'CreditAmount': $scope.dataSource.showListData.reduce(sumFunction('CreditAmount'), 0)
                                };
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

        $scope.dropDownInit = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            //SystemConfig DropDown
            systemConfigService.findSystemConfigChildren({ ListConfigName: ['DepositType'] })
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.depositDropDown = response.data.Rows.ListData;
                            $scope.dataSource.depositDropDown.pop();
                            $scope.dataSource.depositDropDown.unshift({ ID: -1, ConfigName: 'Please Choose' });
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg');
                        }
                    },
                    function error(data, status, headers, config) {
                    });

            systemConfigService.findSystemConfigChildren({ ListConfigName: ['WithDrawalType'] })
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.withdrawalDropDown = response.data.Rows.ListData;
                            $scope.dataSource.withdrawalDropDown.pop();
                            $scope.dataSource.withdrawalDropDown.unshift({ ID: -1, ConfigName: 'Please Choose' });

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

        $scope.clear = function () {
            $scope.dataSource.searchCondition = {
                pageStatus: 'searchView',
                DepositType: -1,
                WithDrawalType: -1,
                DCType: -1
            };

        };

        $scope.showFile = function (transaction) {
            $scope.dataSource.modalMsg.title = 'TransactionHistory_UploadFile';
            $scope.dataSource.selTransaction = transaction;
            $('#ShowFileDialog').click();
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
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

        $scope.quickSearch = function () {
            if (!$scope.dataSource.quickSearchString) {
                $scope.dataSource.showListData = $scope.dataSource.listData;
                return;
            }

            var keys = Object.keys($scope.dataSource.listData[0]);
            $scope.dataSource.showListData = [];

            $scope.dataSource.listData.forEach(data => {
                keys.forEach(key => {
                    if (data[key] && data[key].toString().includes($scope.dataSource.quickSearchString)) {
                        $scope.dataSource.showListData.push(data);
                    }
                });
            });

            if ($scope.dataSource.showListData.length > 0) {
                $scope.dataSource.totalData = {
                    'DebitAmount': $scope.dataSource.showListData.reduce(sumFunction('DebitAmount'), 0),
                    'CreditAmount': $scope.dataSource.showListData.reduce(sumFunction('CreditAmount'), 0)
                };
            }
        };

        $scope.copy = function () {
            var body = document.body, range, sel;
            copy(body, document, 'transactionHistory');
        };

        $scope.excel = function () {
            excel(document, ['transactionHistory'], 'transactionHistory' + '.xls');
        };

        $scope.print = function () {
            print(document, 'transactionHistory');
        };

    }]);