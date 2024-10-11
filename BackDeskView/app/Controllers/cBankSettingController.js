'use strict';
app.controller('cBankSettingController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'cBankService',
    'acceptedBankService',
    'userLevelService',
    'bankPayMainTypeService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        cBankService, acceptedBankService, userLevelService, bankPayMainTypeService) {

        $scope.dataSource = {
            pageStatus: 'searchView',
            status: '',
            searchCondition: { CurrentPage: 1, PageSize: 10, IsEnable: true, PMTID: -1 },
            cBank: {},
            selAcceptedBank: {},
            listData: [],
            userLevels: [],
            payMainTypes: [],
            acceptedBanks: [],
            allAcceptedBanks: [],
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
            $scope.getUserLevels();
            $scope.getPayMainTypes();
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            blockUI.start();
            cBankService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;
                            console.log($scope.dataSource.listData);
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
                    function error(data, status, headers) {
                        blockUI.stop();
                    });
        };

        $scope.getUserLevels = function () {
            userLevelService.findUserLevel({ CurrentPage: 1, PageSize: 10000 })
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.userLevels = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                    },
                    function error(response) {
                        console.log(response);
                    });
        };

        $scope.getPayMainTypes = function () {
            blockUI.start();

            bankPayMainTypeService.find({})
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.payMainTypes = response.data.Rows.ListData;
                            $scope.dataSource.searchCondition.PMTID = $scope.dataSource.payMainTypes[0].PMTID;

                            $scope.search();
                            $scope.getAcceptedBanks();
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                        blockUI.stop();
                    },
                    function error(response) {
                        console.log(response);
                        blockUI.stop();
                    });
        };

        $scope.getAcceptedBanks = function () {
            acceptedBankService.find({ CurrentPage: 1, PageSize: 10000 })
                .then(
                    function success(response, status, headers) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.allAcceptedBanks = response.data.Rows.ListData;
                            $scope.dataSource.acceptedBanks = $scope.dataSource.allAcceptedBanks.filter(p => p.PMTID === $scope.dataSource.searchCondition.PMTID);
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

        $scope.changePayMainType = function () {
            $scope.dataSource.acceptedBanks = $scope.dataSource.allAcceptedBanks.filter(p => p.PMTID === $scope.dataSource.searchCondition.PMTID);
            $scope.search();
        };

        $scope.addOrEdit = function (form) {

            if ($rootScope.valid(form)) return;
            
            if ($scope.dataSource.selAcceptedBank.AcceptableID > 0) {
                $scope.dataSource.cBank.AcceptableID = $scope.dataSource.selAcceptedBank.AcceptableID;
            }

            $scope.dataSource.cBank.UserLevels = $scope.dataSource.userLevels.filter(p => p.checked);

            if ($scope.dataSource.cBank.ID) {
                cBankService.update($scope.dataSource.cBank).then(
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
                            return;
                        }
                    },
                    function error(response) {

                    });
            } else {

                cBankService.add($scope.dataSource.cBank).then(
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
                            return;
                        }
                    },
                    function error(response) {

                    });
            }
        };

        $scope.delete = function (cbank) {
            $scope.dataSource.cBank = cbank;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.type = '000';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function (event) {

            blockUI.start();
            cBankService.delete($scope.dataSource.cBank).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = '';
                        $rootScope.$broadcast('changeModalMsg');
                        $scope.search();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = '';
                        $rootScope.$broadcast('changeModalMsg');

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                    }
                    blockUI.stop();
                },
                function error(response) {
                    blockUI.stop();
                });
        });

        $scope.changeAndSave = function (bank) {
            $scope.dataSource.cBank = bank;
            $scope.addOrEdit();
        };

        $scope.clear = function () {
            $scope.dataSource.searchCondition = { CurrentPage: 1, PageSize: 10 };
        };

        $scope.showAdd = function () {
            $scope.dataSource.status = 'add';
            $('#ShowEditDialog').click();
            $scope.dataSource.cBank = {};
            $scope.dataSource.selAcceptedBank = $scope.dataSource.acceptedBanks[0];
        };

        $scope.showEdit = function (cBank) {
            $scope.dataSource.status = 'edit';
            $('#ShowEditDialog').click();
            $scope.dataSource.cBank = cBank;
            $scope.dataSource.selAcceptedBank = $scope.dataSource.acceptedBanks.find(p => p.AcceptableID === cBank.AcceptableID);
            $scope.dataSource.userLevels.forEach(p => {
                if (cBank.userLevels.map(m => m.LevelID).includes(p.LevelID)) p.checked = true;
                else p.checked = false;
            });
        };

        $scope.showSearch = function () {
            $scope.dataSource.pageStatus = 'searchView';
            $scope.search();
        };

        $scope.$on('showSearch', $scope.showSearch);

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);