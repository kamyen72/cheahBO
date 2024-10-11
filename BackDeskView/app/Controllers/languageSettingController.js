'use strict';
app.controller('languageSettingController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'languageService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        languageService) {
        blockUI.start();

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: { CurrentPage: 1, PageSize: 10 },
            listData: [],
            languageSetting: {},
            languageSettings: [],
            DNSs: [],
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
            $scope.findLanguageType();
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            languageService.findFieldType($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
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
                    function error(data, status, headers, config) {
                        blockUI.stop();
                    });
        };

        $scope.findLanguageType = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            languageService.findLanguageType($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.languageTypeList = response.data.Rows.ListData;
                            $scope.dataSource.languageTypeList.unshift({ LanguageTypeID: -1, LanguageAbbreviation: 'Please Choose' });
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

        $scope.add = function (form) {
            if ($rootScope.valid(form)) return;

            languageService.addFieldType($scope.dataSource.languageSetting).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';

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

        $scope.update = function (form) {
            if ($rootScope.valid(form)) return;

            $scope.dataSource.languageSetting.FieldValue = JSON.stringify($scope.dataSource.languageSettings);

            $scope.dataSource.languageSetting.DNS = '';
            $scope.dataSource.DNSs.forEach(function(value,idx){
                $scope.dataSource.languageSetting.DNS += value.value;
                if (idx < $scope.dataSource.DNSs.length -1) $scope.dataSource.languageSetting.DNS += '|';
            });

            languageService.updateFieldType($scope.dataSource.languageSetting).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';

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

        $scope.delete = function (languageSetting) {
            $scope.dataSource.languageSetting = languageSetting;

            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.type = '000';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);

        };

        $scope.$on('confirmDel', function (event) {
            languageService.delFieldType($scope.dataSource.languageSetting).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';

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
        });

        $scope.clear = function () {
            $scope.dataSource.searchCondition = { CurrentPage: 1, PageSize: 10 };
        };

        $scope.showAdd = function () {
            $scope.dataSource.pageStatus = 'addView';
            $scope.dataSource.languageSetting = {};
            $scope.dataSource.languageSetting.LanguageTypeID = -1;
        };

        $scope.showEdit = function (languageSetting) {
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.languageSetting = languageSetting;

            $scope.dataSource.languageSettings = [];
            $scope.dataSource.DNSs = [];

            $scope.dataSource.languageSettings = JSON.parse($scope.dataSource.languageSetting.FieldValue);
            $scope.dataSource.languageSetting.DNS.split('|').forEach(p => {
                $scope.dataSource.DNSs.push({ 'value': p });
            });
        };

        $scope.showSearch = function () {
            $scope.dataSource.pageStatus = 'searchView';
            $scope.search();
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);