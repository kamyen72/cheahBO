'use strict';
app.controller('userLevelSummaryController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'memberShipService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        memberShipService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            levelStatus: 'all',
            levelID: 0,
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            listData: [],
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
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            $scope.dataSource.searchCondition.UserLevelID = $scope.dataSource.levelID;

            $scope.dataSource.listData = [];
            memberShipService.findUser($scope.dataSource.searchCondition)
                .then(
                    function success(response) {
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
                        blockUI.stop();
                    },
                    function error(response) {
                        console.log(response);
                        blockUI.stop();
                    });
        };

        $scope.checkLevel = function (level) {
            $scope.dataSource.levelStatus = level;

            switch (level) {
                case 'all':
                    $scope.dataSource.levelID = 0;
                    break;
                case 'new':
                    $scope.dataSource.levelID = 1;
                    break;
                case 'regular':
                    $scope.dataSource.levelID = 2;
                    break;
                case 'silver':
                    $scope.dataSource.levelID = 3;
                    break;
                case 'gold':
                    $scope.dataSource.levelID = 4;
                    break;
                case 'platinum':
                    $scope.dataSource.levelID = 5;
                    break;
                case 'vip':
                    $scope.dataSource.levelID = 6;
                    break;
            }

            $scope.dataSource.PagerObj.PageSize = 10;
            $scope.PageChanged(1);
        };


        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);