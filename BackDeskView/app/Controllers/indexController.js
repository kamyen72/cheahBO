'use strict';
app.controller('indexController',
    [
        '$scope',
        '$rootScope',
        '$location',
        '$translate',
        'localStorageService',
        '$timeout',
        '$http',
        '$q',
        'authService',
        '$route',
        'ngAuthSettings',
        'platformService',
        'memberShipService',
        function ($scope, $rootScope, $location, $translate, localStorageService, $timeout,
            $http, $q, authService, $route, ngAuthSettings, platformService, memberShipService) {

            // 登入驗證
            $scope.authentication = authService.authentication;
            $scope.ngAuthSettings = ngAuthSettings;
            $scope.location = $location;

            $scope.dataSource = {
                memberInfo: {},
                menuList: [
                    //{ Text: "Notifications", URL: "#/history" },
                    // { Text: "MainPage", URL: "#!/home", DropDownList: false, Enable: true },
                    // {
                    //     Text: "Member",
                    //     URL: 'javascript:void(0)',
                    //     DropDownList: true,
                    //     Items: [
                    //         { Text: "MemberManage", URL: "#!/memberManage", DropDownList: false, Enable: true },
                    //         { Text: "SubAdminManage", URL: "#!/subAdminManage", DropDownList: false, Enable: true, EnableOther: 'SubAdmin' },
                    //         { Text: "AgencyFeeSetting", URL: "#!/agencyFee", DropDownList: false, Enable: true, EnableWeb: 'Master'},
                    //         { Text: "UserLevelSummary", URL: "#!/userLevelSummary", DropDownList: false, Enable: true },
                    //         { Text: "UserLevelSetting", URL: "#!/userLevelSetting", DropDownList: false, Enable: true, EnableWeb: 'Agent'},
                    //         { Text: "OnlineMember", URL: "#!/memberOnline", DropDownList: false, Enable: true },
                    //         { Text: "MemberIP", URL: "#!/checkMemberIP", DropDownList: false, Enable: true }
                    //     ],
                    //     Enable: true
                    // },
                    // {
                    //     Text: "Transaction",
                    //     URL: 'javascript:void(0)',
                    //     DropDownList: true,
                    //     Items: [
                    //         { Text: "InstantTransaction", URL: "#!/instantTransaction", DropDownList: false, Enable: true },
                    //         { Text: "TransactionHistory", URL: "#!/transactionsHistory", DropDownList: false, Enable: true },
                    //         { Text: "Adjustment", URL: "#!/adjustment", DropDownList: false, Enable: true }
                    //     ],
                    //     EnableWeb: 'Agent',
                    //     Enable: true
                    // },
                    // {
                    //     Text: "Comission",
                    //     URL: 'javascript:void(0)',
                    //     DropDownList: true,
                    //     Items: [
                    //         { Text: "CashRebate", URL: "#!/cashRebate", DropDownList: false, EnableWeb: 'Agent', Enable: true },
                    //         { Text: "CashRebateLog", URL: "#!/cashRebateLog", DropDownList: false, Enable: true },
                    //         { Text: "CashBack", URL: "#!/cashBack", DropDownList: false, EnableWeb: 'Agent', Enable: true },
                    //         { Text: "CashBackLog", URL: "#!/cashBackLog", DropDownList: false, Enable: true },
                    //         { Text: "ReferralLog", URL: "#!/referralLog", DropDownList: false, Enable: true }
                    //     ],
                    //     Enable: true,
                    //     EnableWeb: 'Agent'
                    // },
                    // {
                    //     Text: "GameSetting",
                    //     URL: 'javascript:void(0)',
                    //     DropDownList: true,
                    //     Items: [
                    //         { Text: "GameSetting", URL: "#!/gameRoomType", DropDownList: false, Enable: true },
                    //         { Text: "BetLimitSetting", URL: "#!/betLimitSetting", DropDownList: false, Enable: true },
                    //         { Text: "ManualOpenLottery", URL: "#!/manualOpenLottery", DropDownList: false, Enable: true }
                    //     ],
                    //     EnableWeb: 'Master',
                    //     EnableLevel: 'Company',
                    //     Enable: true
                    // },
                    // {
                    //     Text: "AdminSetting",
                    //     URL: 'javascript:void(0)',
                    //     DropDownList: true,
                    //     Items: [
                    //         { Text: "PromotionSetting", URL: "#!/promotionSettings", DropDownList: false, Enable: true, EnableWeb: 'Agent' },
                    //         { Text: "ReferralSetting", URL: "#!/referralSetting", DropDownList: false, Enable: true, EnableWeb: 'Agent' },
                    //         { Text: "CashRebateSetting", URL: "#!/cashRebateSetting", DropDownList: false, Enable: true, EnableWeb: 'Agent' },
                    //         { Text: "CashBackSetting", URL: "#!/cashBackSetting", DropDownList: false, Enable: true, EnableWeb: 'Agent' },
    
                    //         { Text: "CBankSetting", URL: "#!/cBankSetting", DropDownList: false, Enable: true, EnableWeb: 'Agent'},
                    //         { Text: "BankGroupSetting", URL: "#!/cBankGroup", DropDownList: false, Enable: true, EnableWeb: 'Agent'},
                    //         { Text: "AcceptedBankSetting", URL: "#!/acceptedBank", DropDownList: false, Enable: true, EnableWeb: 'Agent'},
                    //         { Text: "ThirdPartyCompanySetting", URL: "#!/gameDealerCompany", DropDownList: false, Enable: true, EnableWeb: 'Master'},
                    //         { Text: "PlatformSetting", URL: "#!/platformSetting", DropDownList: false, Enable: true, EnableWeb: 'Master'},
                    //         //{ Text: "SystemConfigSetting", URL: "#!/systemConfig", DropDownList: false, Enable: true, EnableWeb: 'Master'}
                    //     ],
                    //     Enable: true
                    // },
                    // {
                    //     Text: "WebSiteSetting",
                    //     URL: 'javascript:void(0)',
                    //     DropDownList: true,
                    //     Items: [
                    //         { Text: "BulletinSetting", URL: "#!/bulletin", DropDownList: false, Enable: true },
                    //         { Text: "BannerSetting", URL: "#!/banner", DropDownList: false, Enable: true },
                    //         //{ Text: "ErrorCodeSetting", URL: "#!/errorCode", DropDownList: false, Enable: true },
                    //         { Text: "SEOSetting", URL: "#!/seoSetting", DropDownList: false, Enable: true },
                    //         { Text: "WebSiteSetting", URL: "#!/webSiteSetting", DropDownList: false, Enable: true }
                    //         //{ Text: "LanguageSetting", URL: "#!/languageSetting", DropDownList: false, Enable: true },
                    //     ],
                    //     EnableWeb: 'Agent',
                    //     Enable: true
                    // },

                    // {
                    //     Text: "Report",
                    //     URL: 'javascript:void(0)',
                    //     DropDownList: true,
                    //     Items: [
                    //         { Text: "BetHistory", URL: "#!/betHistory", DropDownList: false, Enable: true },
                    //         { Text: "WinLostReport", URL: "#!/winLoseReport", DropDownList: false, Enable: true },
                    //         { Text: "WinLostReportByGame", URL: "#!/winLoseReportByGame", DropDownList: false, Enable: true },
                    //         { Text: "OutstandingReport", URL: "#!/outstandingReport", DropDownList: false, Enable: true },
                    //         { Text: "PragmaticPlaySlotReport", URL: "#!/slotReport", DropDownList: false, Enable: true }
                    //     ],
                    //     Enable: true
                    // },
                    // {
                    //     Text: "FunctionPermission",
                    //     URL: 'javascript:void(0)',
                    //     DropDownList: true,
                    //     Items: [
                    //         { Text: "MemberGroup", URL: "#!/memberGroup", DropDownList: false, Enable: true },
                    //         { Text: "FunctionGroup", URL: "#!/functionGroup", DropDownList: false, Enable: true },
                    //         { Text: "ApiDefault", URL: "#!/apiDefault", DropDownList: false, Enable: true }
                    //     ],
                    //     EnableLevel: 'Company',
                    //     Enable: true
                    // }
                ],
                menuShow: false,
                topBarShow: false,
                selectMenu: {},
                modalMsg: {},
                subMenuIndex: -1,
                siteMapPath: '',
                languageRead: 'en'
            };

            $scope.init = function () {
                if ($rootScope.isLogin) {
                    //$location.path('home');
                    // 檢查登入帳號是不是後台權限
                    memberShipService.checkLoginByBack().then(
                        function success(response) {
                            if (response.data.APIRes && response.data.APIRes.ResCode === '200') {
                                //頁籤
                                ngAuthSettings.modalMsg.title = "Message";
                                ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                                ngAuthSettings.modalMsg.linkTo = 'login';
                                $location.path('login');
                                $rootScope.$broadcast('changeModalMsg', false);
                                return;
                            }
                        },
                        function error() {
                        }
                    );
                } else {
                    $location.path('login');
                }

                $scope.getPlatform();

                $rootScope.memberInfo = localStorageService.get('UserInfo');
                $scope.dataSource.memberInfo = $rootScope.memberInfo;
                if (localStorageService.get('LanguageRead')) {
                    $scope.dataSource.languageRead = localStorageService.get('LanguageRead');
                    $translate.use($scope.dataSource.languageRead);
                } else {
                    localStorageService.set('LanguageRead', $scope.dataSource.languageRead);
                }
                //ngAuthSettings.headers = {
                //    headers: { 'UserName': localStorageService.get('UserName') === undefined ? '' : localStorageService.get('UserName') }
                //};
                $rootScope.$broadcast('setMenuPermission');
            };

            $timeout($scope.init, 100);

            // Logout
            $scope.logout = function () {
                var ajaxData = { 'UserName': localStorageService.get('UserName') };
                authService.logOut(ajaxData);
            };

			$scope.getPlatform = function () {
				return platformService.find({ TypeCode: 'Platform' }).then(
					function success(response) {
						if (response.data.APIRes.ResCode === '000') {
							if (response.data.Rows.ListData && response.data.Rows.ListData.length > 0) {
                                let ListData = response.data.Rows.ListData;
                                
                                let hostname = window.location.hostname;

                                let hostNameCheck = hostname;
                                // 20210728先去掉www、agent跟master
                                if (hostname.indexOf("www") === 0) {
                                    hostNameCheck = hostname.replace("www.","");
                                }
                                if (hostname.indexOf("agent") === 0) {
                                    hostNameCheck = hostname.replace("agent.","");
                                }
                                if (hostname.indexOf("master") === 0) {
                                    hostNameCheck = hostname.replace("master.","");
                                }
                                // 忽略後面com跟net
                                let hostFirstName = hostNameCheck.split('.')[0];

                                let platformData = ListData.find(data => data.URL.indexOf(hostFirstName) > -1);

                                if (platformData) {
                                    ngAuthSettings.platformID = platformData.ID;
                                    ngAuthSettings.platformCode = platformData.ShortName;
                                    ngAuthSettings.platformLogo = `${platformData.ShortName}-logo`;
                                } else {
                                    //TODO: 不再列表 則暫時用ghl
                                    ngAuthSettings.platformID = 1;
                                    ngAuthSettings.platformCode = 'ghl';
                                    ngAuthSettings.platformLogo = 'ghl-logo';
                                }
                                // console.log('platformCode:', ngAuthSettings.platformCode);
                                $rootScope.$broadcast('updatePlatformLogo');
							}
						}
					},
					function error(response) {
                        console.log(response);
					}
				);
			};

            $scope.personProfile = function () {
                $scope.dataSource.subMenuIndex = -1;
                $location.path('personProfile');
                //if ($location.path() === '/memberManage') $route.reload();
                //else $location.path('memberManage');
            };

            $scope.siteMapPath = function (menuVal, subMenuIndex) {
                if (menuVal.URL === 'javascript:void(0)' && subMenuIndex === -1) return;

                $scope.dataSource.selectMenu = menuVal;
                $scope.dataSource.subMenuIndex = subMenuIndex;
                if (subMenuIndex >= 0) {
                    $scope.dataSource.siteMapPath = menuVal.Text + ' ➔ ' + menuVal.Items[subMenuIndex].Text;
                }
                else {
                    $scope.dataSource.siteMapPath = menuVal.Text;
                }
            };

            $scope.changeLanguage = function () {
                $translate.use($scope.dataSource.languageRead);
                localStorageService.set('LanguageRead', $scope.dataSource.languageRead);
            };

            //broadCast event

            // 訊息框內容更換
            $rootScope.$on('setMenuPermission', function () {

                let MemberFunction = localStorageService.get('MemberFunction') || {};
                let FunctionGroups = MemberFunction.FunctionGroups || [];
                
                $scope.dataSource.menuList = []; // { Text: "MainPage", URL: "#!/home", DropDownList: false, Enable: true }];

                FunctionGroups.forEach(fItem => {
                    if(fItem.IsBO) {
                        let newMenuItem = {
                            Text: fItem.LKey,
                            URL: fItem.FURL,
                            DropDownList: false,
                            Enable: true,
                            Sort: fItem.Sort,
                        }
                        if(fItem.DrawDwonFunction && fItem.DrawDwonFunction.length > 0) {
                            newMenuItem.DropDownList = true;
                            newMenuItem.Items = fItem.DrawDwonFunction.map(ddfItem => ({
                                Text: ddfItem.LKey,
                                URL: ddfItem.FURL,
                                DropDownList: false,
                                Enable: true,
                                Sort: ddfItem.Sort,
                            }));
                        }
                        // newMenuItem.Items.sort((a,b) => a.Sort - b.Sort);
                        $scope.dataSource.menuList.push(newMenuItem);
                    }
                })
                
                // $scope.dataSource.menuList.sort((a,b) => a.Sort - b.Sort);
                
                // $scope.dataSource.menuList.forEach(p => {
                //     if (p.EnableLevel === 'Company') {
                //         if ($scope.dataSource.memberInfo.AgentLevelSCID !== 28 && $scope.dataSource.memberInfo.AgentLevelSCID !== 38) {
                //             p.Enable = false;
                //         } else {
                //             p.Enable = true;
                //         }
                //     }

                //     if (p.EnableWeb === 'Master' && !IS_MASTER) {
                //         p.Enable = false;
                //     }
                //     if (p.EnableWeb === 'Agent' && IS_MASTER) {
                //         p.Enable = false;
                //     }

                //     if (p.Items) {
                //         p.Items.forEach(i => {
                //             if (i.EnableWeb === 'Master' && !IS_MASTER) {
                //                 i.Enable = false;
                //             }
                //             if (i.EnableWeb === 'Agent' && IS_MASTER) {
                //                 i.Enable = false;
                //             }
                //             if (i.EnableLevel === 'Company') {
                //                 if ($scope.dataSource.memberInfo.AgentLevelSCID !== 28 && $scope.dataSource.memberInfo.AgentLevelSCID !== 38) {
                //                     i.Enable = false;
                //                 } else {
                //                     i.Enable = true;
                //                 }
                //             }
                //             if(i.EnableOther === 'SubAdmin') { // SubAdminManage 只有Company在Master 以及 Admin在Agent看得到 
                //                 if (($scope.dataSource.memberInfo.AgentLevelSCID !== 28 && IS_MASTER) || 
                //                     ($scope.dataSource.memberInfo.AgentLevelSCID !== 31 && !IS_MASTER)) {
                //                     i.Enable = false;
                //                 } else {
                //                     i.Enable = true;
                //                 }
                //             }
                //         });
                //     }
                // });
            });

            // 訊息框內容更換
            $rootScope.$on('changeModalMsg', function (event, showCancel) {
                //$scope.dataSource.modalMsg.title = title;
                //$scope.dataSource.modalMsg.msg = msg;
                //$scope.dataSource.modalMsg.type = type;
                //$scope.dataSource.modalMsg.linkTo = linkTo;
                //$scope.dataSource.modalMsg.callBack = callBack;
                $scope.dataSource.modalMsg = ngAuthSettings.modalMsg;
                //$scope.dataSource.loginStatus = ngAuthSettings.isLogin;
                //console.log(ngAuthSettings.modalMsg);

                if (showCancel) $('#ModalCancel').show();
                else $('#ModalCancel').hide();

                if (!$('#exampleModalLong').hasClass('in')) $('#ModalShow').click();

            });

            // Menu是否顯示
            $rootScope.$on('changeMenuShow', function (event) {
                $scope.dataSource.topBarShow = ngAuthSettings.topBarShow;
                $scope.dataSource.menuShow = ngAuthSettings.menuShow;
            });

            // 更新MemberInfo
            $rootScope.$on('changeMemberInfo', function (event) {
                $rootScope.memberInfo = localStorageService.get('UserInfo');
                $scope.dataSource.memberInfo = $rootScope.memberInfo;
            });

            // 訊息框處理事件
            $scope.modalMsgConfirmEvent = function (values) {
                $('#exampleModalLong').modal('hide');

                if (values) {
                    //Confirmevent
                    if ($scope.dataSource.modalMsg.callBack) setTimeout(function () {
                        $rootScope.$broadcast($scope.dataSource.modalMsg.callBack);
                    }, 500);
                } else {
                    //Cancelevent
                }

                if ($scope.dataSource.modalMsg.linkTo) $location.path($scope.dataSource.modalMsg.linkTo);
            };

            //驗證Form欄位資料
            $rootScope.valid = function (form) {
                var errorMsg = '';
                if (form && form.$invalid) {
                    if (form.$error.required) {
                        errorMsg += "{{ 'Required' | translate }}:<br>";
                        form.$error.required.forEach(p => {
                            let langkey = (p.$$attr || {}).langkey || p.$name;
                            errorMsg += `{{ '${langkey}' | translate }}. `;
                        });
                    }

                    if (form.$error.myValidator) {
                        if (errorMsg) errorMsg += "<br><br>";
                        errorMsg += "{{ 'FormatError' | translate }}:<br>";
                        form.$error.myValidator.forEach(p => {
                            let attr = p.$$attr || {}
                            let langkey = attr.langkey || p.$name;
                            if (attr.myValidator === "password") {
                                errorMsg += `{{ '${langkey}' | translate }}({{ 'Verify_Password' | translate }}). `;
                            } else if (attr.myValidator === "url") {
                                errorMsg += `{{ '${langkey}' | translate }}({{ 'Verify_Url' | translate }}). `;
                            } else {
                                errorMsg += `{{ '${langkey}' | translate }}. `;
                            }
                        });
                    }

                    ngAuthSettings.modalMsg = {};
                    ngAuthSettings.modalMsg.title = "Message";
                    ngAuthSettings.modalMsg.msg = errorMsg;
                    ngAuthSettings.modalMsg.type = '100';
                    $rootScope.$broadcast('changeModalMsg', false);
                }

                return errorMsg;
            };



        }
    ]
);