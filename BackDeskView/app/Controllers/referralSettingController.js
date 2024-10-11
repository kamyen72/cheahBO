'use strict';
app.controller('referralSettingController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'gameRoomService',
    'systemConfigService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        gameRoomService, systemConfigService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            listData: [],
            gameRoomType: {},
            referralLayers: [],
            payTypeDropDown: [],
            resetInfo: {},
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
            $scope.searchPayType();
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            gameRoomService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;
                            $scope.dataSource.listData.forEach(p => {
                                p.PayTypeName = $scope.dataSource.payTypeDropDown.find(x => x.ID === p.ReferralLayers[0].PayType).ConfigName;
                                p.ReferralLayers.forEach(r => { r.ReferralPercentage = (r.ReferralPercentage * 100).toFixed(4); });
                            });

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

        $scope.searchPayType = function () {
            systemConfigService.findSystemConfigChildren({ ListConfigName: ['PayType'] })
                .then(
                    function success(response) {
                        //console.log(response.data.Rows.ListData);
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.payTypeDropDown = response.data.Rows.ListData;
                            $scope.search();
                            //$scope.dataSource.payTypeDropDown.unshift({ ID: -1, ConfigName: 'Please Choose' });
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                    },
                    function error(response) {
                        console.log(response);
                        blockUI.stop();
                    });
        };

        $scope.addOrEdit = function (form) {
            if ($rootScope.valid(form)) return;
            
            $scope.dataSource.gameRoomType.ReferralLayers = $scope.dataSource.referralLayers;
            $scope.dataSource.gameRoomType.ReferralLayers.forEach(r => {
                r.ReferralPercentage = (r.ReferralPercentage / 100).toFixed(5);
            });
            
            if ($scope.dataSource.gameRoomType.GameRoomID) {
                gameRoomService.update($scope.dataSource.gameRoomType).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg');
                            $scope.search();
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
            } else {
                gameRoomService.add($scope.dataSource.gameRoomType).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg');
                            $scope.search();
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

        $scope.delete = function (gameRoomType) {
            if (!confirm('Confirm刪除?')) return;

            gameRoomService.delete(gameRoomType).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        $rootScope.$broadcast('changeModalMsg');
                        $scope.search();
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

        $scope.showAdd = function () {
            $scope.dataSource.gameRoomType = {};
            $('#ShowDetailDialog').click();
        };

        $scope.showEdit = function (gameRoomType) {

            $scope.dataSource.referralLayers = [];

            gameRoomType.ReferralLayers.forEach(p => {
                var ref = {};
                ref = $.extend(ref, p);
                $scope.dataSource.referralLayers.push(ref);
            });

            gameRoomType.PayType = gameRoomType.ReferralLayers[0].PayType;

            $.extend($scope.dataSource.gameRoomType, gameRoomType);

            $('#ShowDetailDialog').click();
            //alert($scope.dataSource.referralLayers[0].ReferralPercentage);
            //alert($scope.dataSource.listData[0].ReferralLayers[0].ReferralPercentage);
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };


    }]);