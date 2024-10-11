'use strict';
app.controller('adjustmentController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'memberShipService',
    'depositService',
    'withDrawalService',
    'promotionSettingsService',
    'cBankService',
    'bankService',
    'systemConfigService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        memberShipService, depositService, withDrawalService, promotionService, cBankService, bankService, systemConfigService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            dialogStatus : '',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            listData: [],
            promotions: [],
            cBanks: [],
            mBanks:[],
            depositData: {},
            withdrawalData: {},
            transactionData: {},
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
            $scope.search();
            $scope.getSystemConfig();

            $timeout(function () {
                blockUI.stop();
            }, 1000);
        };

        $timeout(function () { $scope.init(); }, 100);

        $scope.search = function () {
            // $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            // $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            var ajaxData = {
                ...$scope.dataSource.searchCondition,
                CurrentPage: $scope.dataSource.PagerObj.CurrentPage,
                PageSize: $scope.dataSource.PagerObj.PageSize,
            };
            if (!IS_MASTER && ngAuthSettings.platformCode && ajaxData.UserName && !ajaxData.UserName.includes('_')) {
                // 不在IS_MASTER 加上當前平台前綴 串出UserName
                ajaxData.UserName = ngAuthSettings.platformCode + '_' + ajaxData.UserName;
            }

            ajaxData.AgentLevelSCID = 32;

            memberShipService.findUser(ajaxData)
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;
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
                    },
                    function error(data, status, headers) {
                    });
        };

        $scope.showDeposit = function (member, pageStatus) {
            $scope.dataSource.dialogStatus = pageStatus;
            $scope.dataSource.memberInfo = member;
            //$scope.findPromotion();

            $scope.findMBank();
            $scope.findCBank();
            $('#ShowDepositDialog').click();
        };

        $scope.confirmDeposit = function (transactionData) {
            var ajaxData = {};
            ajaxData.MemberID = $scope.dataSource.memberInfo.MemberID;
            ajaxData.Amount = transactionData.Amount;
            ajaxData.Remark = transactionData.Remark;
            ajaxData.CBankID = transactionData.cBank.ID;
            ajaxData.MBankID = transactionData.mBank.ID;
            ajaxData.PromotionID = transactionData.PromotionID;
            ajaxData.RefCode = transactionData.RefCode;
            ajaxData.DepositPayMothed = "Adjustment";

            if ($scope.dataSource.dialogStatus === 'depositDialog') {
                var msg = '';

                if (!transactionData.cBank.ID) {
                    msg += "Please select bank. <br>";
                }
                if (!transactionData.Amount) {
                    msg +=  "Please enter adjust amount. <br>";
                }
                if (!transactionData.Remark) {
                    msg +=  "Please select reason. <br>";
                }

                //Cbank有金額限制值判斷
                //if (transactionData.cBank.MinAmount && transactionData.cBank.MaxAmount) {
                //    if (parseFloat(transactionData.cBank.MinAmount) > parseFloat(transactionData.Amount)) {
                //        msg += 'Bank ' + transactionData.cBank.BankCode + ' ' + transactionData.cBank.BankNumber
                //            + ' minimum deposit amount:' + transactionData.cBank.MinAmount;
                //    }
                //    if (parseFloat(transactionData.cBank.MaxAmount) < parseFloat(transactionData.Amount)) {
                //        msg += 'Bank ' + transactionData.cBank.BankCode + ' ' + transactionData.cBank.BankNumber
                //            + ' maximum deposit amount:' + transactionData.cBank.MaxAmount;
                //    }
                //} else {
                    //如無則用預設限制值
                var maxAmount = $scope.dataSource.minMaxConfig.filter(p => p.ConfigNotice === 'MaxDepositAmount')[0].ConfigValues;
                var minAmount = $scope.dataSource.minMaxConfig.filter(p => p.ConfigNotice === 'MinDepositAmount')[0].ConfigValues;

                if (parseFloat(minAmount) > parseFloat(transactionData.Amount)) {
                    msg += 'Minimun deposit amoun:' + minAmount;
                }
                if (parseFloat(maxAmount) < parseFloat(transactionData.Amount)) {
                    msg += 'Minimun deposit amoun:' + maxAmount;
                }
                //}

                if (msg) {
                    ngAuthSettings.modalMsg.title = "Message";
                    ngAuthSettings.modalMsg.msg = msg;
                    $rootScope.$broadcast('changeModalMsg');
                    return;
                }

                ajaxData.Remark = 'Adjustment-' + ajaxData.Remark;

                depositService.add(ajaxData).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
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
                    function error(response) {

                    });
            } else {
                msg = '';

                if (!transactionData.mBank.ID) {
                    msg += "Please select bank. <br>";
                }
                if (!transactionData.Remark) {
                    msg += "Please select reason. <br>";
                }

                if (parseFloat(transactionData.Amount) > parseFloat($scope.dataSource.memberInfo.TotalBalance)) {
                    msg += "Withdrawal amount can not more than balance. <br>";
                }

                maxAmount = $scope.dataSource.minMaxConfig.filter(p => p.ConfigNotice === 'MaxWithdrawalAmount')[0].ConfigValues;
                minAmount = $scope.dataSource.minMaxConfig.filter(p => p.ConfigNotice === 'MinWithdrawalAmount')[0].ConfigValues;

                if (parseFloat(minAmount) > parseFloat(transactionData.Amount)) {
                    msg += 'Minimun withdrawal amoun:' + minAmount;
                }
                if (parseFloat(maxAmount) < parseFloat(transactionData.Amount)) {
                    msg += 'Minimun withdrawal amoun:' + maxAmount;
                }

                if (msg) {
                    ngAuthSettings.modalMsg.title = "Message";
                    ngAuthSettings.modalMsg.msg = msg;
                    $rootScope.$broadcast('changeModalMsg');
                    return;
                }

                ajaxData.Remark = 'Adjustment-' + ajaxData.Remark;

                withDrawalService.add(ajaxData).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
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
                    function error(response) {

                    });
            }
        };

        // 查詢Promotion
        $scope.findPromotion = function () {
            let ajaxData = {};
            ajaxData["CurrentPage"] = $scope.dataSource.PagerObj.CurrentPage;
            ajaxData["PageSize"] = $scope.dataSource.PagerObj.PageSize;
            ajaxData["MemberID"] = $scope.dataSource.memberInfo.MemberID;

            promotionService.findPromotions(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.promotions = response.data.Rows.ListData;
                        $scope.dataSource.promotions.splice(0, 0, { PromotionName: '--Select Promotion--' });
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "FindPromotionError";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        // 填完訊息後顯示訊息框
                        ngAuthSettings.modalMsg.callBack = "home";
                        $rootScope.$broadcast('changeModalMsg');
                        $('#ModalShow').click();
                    }

                },
                function error(response) {

                }
            );
        };

        // 查詢CBank
        $scope.findCBank = function () {
            let ajaxData = {};
            ajaxData["CurrentPage"] = 1;
            ajaxData["PageSize"] = 100;

            cBankService.find(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.cBanks = response.data.Rows.ListData;
                        $scope.dataSource.cBanks.forEach(item => {
                            item.label = item.bankAcceptable.BankName + ' - ' + (item.BankAccount || '') + ' ' + item.AccountNumber;
                        });
                        $scope.dataSource.cBanks.splice(0, 0, { label: '--Select Bank--', BankName: '', BankAccount: '', AccountNumber: '' });
                        $scope.dataSource.transactionData.cBank = $scope.dataSource.cBanks[0];
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Error";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        // 填完訊息後顯示訊息框
                        ngAuthSettings.modalMsg.callBack = "home";
                        $rootScope.$broadcast('changeModalMsg');
                        $('#ModalShow').click();
                    }
                },
                function error(response) {

                }
            );
        };
        // 查詢MBank
        $scope.findMBank = function () {
            let ajaxData = {};
            ajaxData["MemberID"] = $scope.dataSource.memberInfo.MemberID;

            bankService.findBank(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.mBanks = response.data.Rows.ListData;
                        $scope.dataSource.mBanks.splice(0, 0, { BankCode: '--Select Bank--', BankName: '', BankNumber: '' });
                        $scope.dataSource.transactionData.mBank = $scope.dataSource.mBanks[0];
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Error";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        // 填完訊息後顯示訊息框
                        ngAuthSettings.modalMsg.callBack = "home";
                        $rootScope.$broadcast('changeModalMsg');
                        $('#ModalShow').click();
                    }

                },
                function error(response) {

                }
            );
        };

        $scope.getSystemConfig = function () {
            //AgentLevel DropDown
            systemConfigService.findSystemConfigChildren({ ListConfigName: ['DepositAmount', 'WithdrawalAmount'] })
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.minMaxConfig = response.data.Rows.ListData;
                            console.log($scope.dataSource.minMaxConfig);
                            //$scope.dataSource.UserInfo.ReferralPayType = $scope.dataSource.payTypeDropDown.filter(q => q.ID.toString() === $scope.dataSource.UserInfo.ReferralPayType)[0].ConfigName;
                        } else {
                            ngAuthSettings.modalMsg.title = "InformationMessage";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            ngAuthSettings.modalMsg.callBack = "home";
                            $rootScope.$broadcast('changeModalMsg', false);
                        }

                    },
                    function error(data, status, headers) {
                    });
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);