'use strict';
app.controller('loginController', [
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

        $scope.dataSource = {
            pageStatus: 'loginView',
            Language: [
                { text: '中文', values: 'zh-TW' },
                { text: 'English', values: 'En' }
            ],
            userDataObj: {
                UserName: '',
                Pwd: ''
            },
            forgetPwdObj: {
                UserName: '',
                Email: ''
            },
            isShowPwd: false,
            isShowForget: false,
            validObj: {},
            platformLogo: '',
            isMaster: IS_MASTER,
            apiType: 'Platform', // Platform & API
        };

        $scope.init = function () {
            $scope.dataSource.platformLogo = ngAuthSettings.platformLogo;
            
            ngAuthSettings.topBarShow = false;
            ngAuthSettings.menuShow = false;
            ngAuthSettings.pagitationShow = false;
            
            if (localStorageService.get("Remember")) {
                $scope.dataSource.userDataObj.UserName = localStorageService.get("UserName");
                $scope.dataSource.userDataObj.Pwd = localStorageService.get("Password");
                $scope.dataSource.Remember = localStorageService.get("Remember");
            }
            if (localStorageService.get("ApiType")) {
                ngAuthSettings.apiType = localStorageService.get("ApiType");
                $scope.dataSource.apiType = ngAuthSettings.apiType;
            }

            $scope.genValidatorCode();
            blockUI.stop();
        };

        $timeout($scope.init, 100);

        // 更新Logo
        $rootScope.$on('updatePlatformLogo', function () {
            $scope.dataSource.platformLogo = ngAuthSettings.platformLogo;
        });

        $scope.genValidatorCode = function () {
            memberShipService.genValidatorCode().then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.validObj = response.data.Rows;
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "ForgotPassword";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        $rootScope.$broadcast('changeModalMsg', false);
                    }
                },
                function error(response) {

                }
            );
        };

        $scope.showEyeEvent = function () {
            $scope.dataSource.isShowPwd = !$scope.dataSource.isShowPwd;
            if (!$scope.dataSource.isShowPwd) {
                $('#pwdShow').removeClass('active');
                $('#pwd').prop('type', 'password');
            }
            else {
                $('#pwdShow').addClass('active');
                $('#pwd').prop('type', 'text');
            }
        };

        $scope.showForgetEvent = function () {
            $scope.dataSource.isShowForget = !$scope.dataSource.isShowForget;
        };

        $scope.login = function (form) {
            // blockUI.start();
            /*
            if ($rootScope.valid(form)) {
                blockUI.stop();
                return;
            }
            */
            $scope.dataSource.userDataObj.PlateForm = 'BackDesk';
            // $scope.dataSource.userDataObj.InputCode = $scope.dataSource.validObj.InputCode;
            // $scope.dataSource.userDataObj.ValidatorCode = $scope.dataSource.validObj.ValidatorCode;

            if ($scope.dataSource.Remember) {
                localStorageService.set("UserName", $scope.dataSource.userDataObj.UserName);
                localStorageService.set("Password", $scope.dataSource.userDataObj.Pwd);
                localStorageService.set("Remember", true);
            } else {
                localStorageService.remove("UserName");
                localStorageService.remove("Password");
                localStorageService.remove("Remember");
            }

            alert("finally");
            ngAuthSettings.apiType = $scope.dataSource.apiType;
            localStorageService.set('ApiType', $scope.dataSource.apiType);

            // var login = authService.login($scope.dataSource.userDataObj, $scope.dataSource.Remember);
            var login = true; // hardcoded by cheah on 15/05/2024
            
            Promise.all([login])
                .then(() => {
                    $rootScope.$broadcast('setMenuPermission');
                });
        };

        $scope.forget = function (form) {
            if ($rootScope.valid(form)) return;

            let ajaxData = {
                Email: $scope.dataSource.forgetPwdObj.Email,
            };
            if (!IS_MASTER && ngAuthSettings.platformCode) {
                // 不在IS_MASTER 加上當前平台前綴 串出UserName
                ajaxData.UserName = ngAuthSettings.platformCode + '_' + $scope.dataSource.forgetPwdObj.UserName;
            } else {
                ajaxData.UserName = $scope.dataSource.forgetPwdObj.UserName;
            }

            memberShipService.forgetPwd(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.authToken = response.data.AuthToken;
                        ngAuthSettings.modalMsg.title = "ForgotPassword";
                        ngAuthSettings.modalMsg.msg = 'PasswordSentDetail';

                        // Put cookie
                        //localStorageService.set('UserToken', response.data.AuthToken);
                        //localStorageService.set('userInfo', response.data.Rows);

                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        //authService.fillAuthData();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "ForgotPassword";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                    }

                    $rootScope.$broadcast('changeModalMsg', false);
                },
                function error(response) {

                }
            );
        };

        $scope.showLogin = function () {
            $scope.dataSource.pageStatus = 'loginView';
        };

        $scope.showRegister = function () {
            $scope.dataSource.pageStatus = 'registerView';
        };

    }]);