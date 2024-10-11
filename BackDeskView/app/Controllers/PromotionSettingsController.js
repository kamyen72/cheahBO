'use strict';
app.controller('promotionSettingsController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'promotionSettingsService',
    'systemConfigService',
    'userLevelService',
    'lotteryService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        promotionSettingsService, systemConfigService, userLevelService, lotteryService) {

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10, IsEnable: true },
            promotion: {},
            mPromotion: {},
            mPromotionList: {},
            promotionTypeDropDown: [],
            userTypeDropDown: [],
            lotteryTypeDropDown: [],
            imageModel: [],
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
            $scope.dropDownInit();
        };

        $scope.dropDownInit = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            var callStatus = true;

            //SystemConfig DropDown
            var dropdown1 = systemConfigService.findSystemConfigChildren({ ListConfigName: ['PromotionType'] })
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.promotionTypeDropDown = response.data.Rows.ListData;
                            $scope.dataSource.promotionTypeDropDown.unshift({ ID: -1, ConfigName: 'Please Choose' });
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            callStatus = false;
                        }
                    },
                    function error(data, status, headers, config) {
                        callStatus = false;
                    });

            //userLevel DropDown
            var dropdown2 = userLevelService.findUserLevel({})
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.userTypeDropDown = response.data.Rows.ListData;
                            //$scope.dataSource.userTypeDropDown.unshift({ LevelID: -1, LevelName: 'Please Choose' });
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            callStatus = false;
                        }
                    },
                    function error(data, status, headers, config) {
                        callStatus = false;
                    });

            //lotteryType DropDown
            var dropdown3 = lotteryService.findLotteryType({})
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.lotteryTypeDropDown = response.data.Rows.ListData;
                            //$scope.dataSource.lotteryTypeDropDown.unshift({ LotteryTypeID: -1, LotteryTypeName: 'Please Choose' });
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            callStatus = false;
                        }
                    },
                    function error(data, status, headers, config) {
                        callStatus = false;
                    });


            Promise.all([dropdown1, dropdown2, dropdown3])
                .then(() => {
                    if (callStatus) $scope.search();
                    else $rootScope.$broadcast('changeModalMsg');
                });
        };

        $scope.search = function () {
            blockUI.start();

            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            promotionSettingsService.findPromotions($scope.dataSource.searchCondition)
                .then(
                    function success(response) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;

                            $scope.dataSource.listData.forEach(p => {
                                p.BonusPercentage = p.BonusPercentage * 100;
                                p.UnlockLossPercentage = p.UnlockLossPercentage * 100;

                                var userLevelName = '';
                                p.UserLevelID.split(',').forEach(q => {
                                    if (userLevelName) userLevelName += ',';
                                    userLevelName += $scope.dataSource.userTypeDropDown.find(r => r.LevelID === parseInt(q)).LevelName;
                                });
                                p.LevelName = userLevelName;

                                var lotteryTypeName = '';
                                p.LotteryTypeID.split(',').forEach(q => {
                                    if (lotteryTypeName) lotteryTypeName += ',';
                                    lotteryTypeName += $scope.dataSource.lotteryTypeDropDown.find(r => r.LotteryTypeID === parseInt(q)) ? $scope.dataSource.lotteryTypeDropDown.find(r => r.LotteryTypeID === parseInt(q)).LotteryTypeName : '';
                                });
                                p.LotteryTypeName = lotteryTypeName;

                                //p.LevelName = $scope.dataSource.userTypeDropDown.filter(q => p.UserLevelID.split(',').includes(q.LevelID)).map(q => { alert(q.LevelName); return q.LevelName; }).join(',');
                            });
                            //$scope.dataSource.listData.forEach(p => {
                            //    p.PromotionType = $scope.dataSource.promotionTypeDropDown.filter(d => d.ID === p.SystemConfigTypeID)[0].ConfigName;
                            //});
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

        $scope.addPromotion = function (form) {
            if ($rootScope.valid(form)) return;

            if ($scope.dataSource.imageModel) {
                $scope.dataSource.promotion.Img = $scope.dataSource.imageModel;
            }

            var selectUserLevels = [];
            $scope.dataSource.userTypeDropDown.forEach(p => { if (p.checked) selectUserLevels.push(p.LevelID); });
            var selectedTypes = [];
            $scope.dataSource.lotteryTypeDropDown.forEach(p => { if (p.checked) selectedTypes.push(p.LotteryTypeID); });

            var ajaxData = {};
            $.extend(ajaxData, $scope.dataSource.promotion);

            ajaxData.UserLevelID = selectUserLevels.join(',');
            ajaxData.LotteryTypeID = selectedTypes.join(',');

            ajaxData.BonusPercentage = parseFloat($scope.dataSource.promotion.BonusPercentage) / 100.0;
            ajaxData.UnlockLossPercentage = parseFloat($scope.dataSource.promotion.UnlockLossPercentage) / 100.0; 

            promotionSettingsService.addPromotion(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';
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

        };

        $scope.updatePromotion = function (form, enable) {
            if ($rootScope.valid(form)) return;

            if ($scope.dataSource.imageModel) {
                $scope.dataSource.promotion.Img = $scope.dataSource.imageModel;
            }

            var ajaxData = {};
            $.extend(ajaxData, $scope.dataSource.promotion);

            if (!enable) {
                var selectUserLevels = [];
                $scope.dataSource.userTypeDropDown.forEach(p => { if (p.checked) selectUserLevels.push(p.LevelID); });
                var selectedTypes = [];
                $scope.dataSource.lotteryTypeDropDown.forEach(p => { if (p.checked) selectedTypes.push(p.LotteryTypeID); });
                
                ajaxData.UserLevelID = selectUserLevels.join(',');
                ajaxData.LotteryTypeID = selectedTypes.join(',');
            }

            ajaxData.BonusPercentage = parseFloat($scope.dataSource.promotion.BonusPercentage) / 100.0;
            ajaxData.UnlockLossPercentage = parseFloat($scope.dataSource.promotion.UnlockLossPercentage) / 100.0; 

            promotionSettingsService.updatePromotion(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';
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
        };

        $scope.deletePromotion = function (promotion) {
            $scope.dataSource.promotion = promotion;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.type = '000';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function (event) {
            promotionSettingsService.delPromotion($scope.dataSource.promotion).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';
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
        });

        $scope.addMPromotion = function (form) {
            if ($rootScope.valid(form)) return;

            promotionSettingsService.addMPromotion($scope.dataSource.mPromotion).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';
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
        };

        $scope.updateMPromotion = function (form) {
            if ($rootScope.valid(form)) return;

            promotionSettingsService.updateMPromotion($scope.dataSource.mPromotion).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';

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
        };

        $scope.cancelMember = function (mPromotion) {
            if (!mPromotion.IslockWithdrawal) {
                ngAuthSettings.modalMsg.title = "Message";
                ngAuthSettings.modalMsg.msg = "This promotion already done.";
                $rootScope.$broadcast('changeModalMsg');
                return;
            }

            if (!confirm('Confirm to cancel this promotion?')) return;

            mPromotion.IslockWithdrawal = false;
            promotionSettingsService.updateMPromotion(mPromotion).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';

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
        };

        //$scope.countUnlockWithdrawalTask = function () {
        //    //alert($scope.dataSource.mPromotion.DepositAmount + ',' + $scope.dataSource.promotion.BonusPercentage);
        //    var percent = parseFloat($scope.dataSource.promotion.BonusPercentage);// / 100.0;
        //    $scope.dataSource.mPromotion.UnlockWithdrawalTask = parseFloat(parseFloat($scope.dataSource.mPromotion.DepositAmount) * percent);
        //    //alert($scope.dataSource.mPromotion.TotalPlayerAmount + ',' + $scope.dataSource.mPromotion.UnlockWithdrawalTask);

        //    //當TotalPlayerAmount >= UnlockWithdrawTask 時 => lslockWithdrawal 解除 (ex.10000 * 10% = 1000, total > 1000 => unlock)
        //    if (parseInt($scope.dataSource.mPromotion.TotalPlayerAmount) >= $scope.dataSource.mPromotion.UnlockWithdrawalTask)
        //        $scope.dataSource.mPromotion.IsLockWithDrawal = false;
        //    else
        //        $scope.dataSource.mPromotion.IsLockWithDrawal = true;
        //    //alert($scope.dataSource.mPromotion.UnlockWithdrawalTask);
        //};

        $scope.changeAndSave = function (promotion) {
            $scope.dataSource.promotion = promotion;
            $scope.updatePromotion(null,true);
        };  

        $scope.showMemberDialog = function () {
            $scope.dataSource.memberDialogStatus = 'add';
            $scope.dataSource.mPromotion = {};
            $scope.dataSource.mPromotion.PromotionID = $scope.dataSource.promotion.ID;
            $scope.dataSource.mPromotion.IsLockWithDrawal = true;
            $('#ShowMemberDialog').click();
        };

        $scope.showEditMemberDialog = function (mPromotion) {
            $scope.dataSource.memberDialogStatus = 'edit';
            $('#ShowMemberDialog').click();
            $scope.dataSource.mPromotion = mPromotion;
            $scope.dataSource.mPromotion.JoinDate = new Date($scope.dataSource.mPromotion.JoinDate);
        };

        $scope.showAdd = function () {
            $scope.dataSource.pageStatus = 'addView';
            $scope.dataSource.imageModel = [];
            $scope.dataSource.promotion = {};
            $scope.dataSource.promotion.SystemConfigTypeID = -1;
            $scope.dataSource.promotion.UserLevelID = -1;
            $scope.dataSource.promotion.LotteryTypeID = -1;
        };

        $scope.showEdit = function (promotion) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.imageModel = [];
            $scope.dataSource.userTypeDropDown.forEach(p => { p.checked = false; });
            $scope.dataSource.lotteryTypeDropDown.forEach(p => { p.checked = false; });
            if (promotion.PromotionPeriodS) promotion.PromotionPeriodS = new Date(promotion.PromotionPeriodS);
            if (promotion.PromotionPeriodE) promotion.PromotionPeriodE = new Date(promotion.PromotionPeriodE);

            var selectedUserLevels = promotion.UserLevelID.split(',');
            selectedUserLevels.forEach(p => {
                var userType = $scope.dataSource.userTypeDropDown.find(q => q.LevelID === parseInt(p));
                if (userType) userType.checked = true;
            });

            var selectedTypes = promotion.LotteryTypeID.split(',');
            selectedTypes.forEach(p => {
                var lotteryType = $scope.dataSource.lotteryTypeDropDown.find(q => q.LotteryTypeID === parseInt(p));
                if (lotteryType) lotteryType.checked = true;
            });

            $scope.dataSource.promotion = promotion;
            
            //ajaxData["Img"] = dataObj.Img[0].file;
            //ajaxData["FileName"] = dataObj.Img[0].name;
            //ajaxData["FileExtension"] = dataObj.Img[0].extension;
            $scope.dataSource.imageModel.push({
                file: $scope.dataSource.promotion.Img,
                extension: 'png',
                name: 'test'
            });
        };

        $scope.showSearch = function () {
            $scope.dataSource.pageStatus = 'searchView';
            $scope.search();
        };

        $scope.showMemberList = function (promotion) {
            $scope.dataSource.promotion = promotion;
            $scope.dataSource.pageStatus = 'memberListView';

            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            $scope.dataSource.searchCondition.PromotionID = promotion.ID;
            promotionSettingsService.findMPromotions($scope.dataSource.searchCondition).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.mPromotionList = response.data.Rows.ListData;
                        //頁籤
                        //$scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                        //$scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                        //$scope.dataSource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                        //$scope.dataSource.PagerObj["PageArray"] = [];
                        //$timeout($scope.CountdownforTime, 1000);
                        //$scope.CalculatorPageArray();
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
        };

        $scope.$on('showSearch', $scope.showSearch);

        $timeout(function () { $scope.init(); }, 100);

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);