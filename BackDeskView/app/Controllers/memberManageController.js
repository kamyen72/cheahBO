'use strict';
app.controller('memberManageController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'memberShipService',
    'systemConfigService',
    'bankService',
    'transactionsService',
    'statementService',
    'userLevelService',
    'promotionSettingsService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        memberShipService, systemConfigService, bankService, transactionsService, statementService, userLevelService, promotionSettingsService) {

        $scope.changeConsole = function () {
            console.log($scope.dataSource.selMemberInfo);
        };

        $scope.dataSource = {
            pageStatus: 'searchView',
            apiType: '', // Platform & API
            searchCondition: {
                CurrentPage: 1, PageSize: 10, MemberUser: '', Address: '', Email: '', UserName: '', Phone: ''
            },
            modalMsg: {},
            resetInfo: {},
            listData: [],
            userLevel: [],
            subListData: [],
            selMemberInfoList: [],
            transactionData: [],
            statementData: [],
            promotions: [],
            mPromotionList: [],
            parentData: [
                { level: 1, selData: {}, listData: [] },
                { level: 2, selData: {}, listData: [] },
                { level: 3, selData: {}, listData: [] }
            ],
            payTypeDropDown: [],
            memberInfo: {},
            selMemberInfo: {},
            selBank: {},
            selStatement: {},
            parentInfo: { agentParent: {}, level: 1, agentParentMap: [] },
            changePwdObj: { MemberOldPwd: '', MemberNewPwd: '' },
            status: 0,
            userTypeDropDown: [{ text: 'Please Choose', value: -1 }, { text: 'System Manager', value: '0' }, { text: 'Customer Service', value: '1' }, { text: 'Agent', value: '2' }],
            agentLevelDropDown: [],
            showAgentLevelDropDown: [],
            AcceptedBanks: [],
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
            DateS: {},
            DateE: {},
            platformOptions: [],
            ConfirmMsg: {},
            clickRegister: false,
            clickSavePwd: false,
            isShowModifyPwd: false,
            isHideAdd: false,
            isLockEdit: false,
            isMaster: IS_MASTER,
            isShowPlatform: false, //下拉選單
            isShowSelPlatform: false //checkbox
        };

        $scope.init = function () {
            ngAuthSettings.menuShow = true;
            ngAuthSettings.pagitationShow = true;


            $scope.editType = $location.path() === '/memberManage' ? 'editView' : 'personEditView';
            $scope.dataSource.pageStatus = $location.path() === '/memberManage' ? 'searchView' : 'editView';

            $scope.dataSource.memberInfo = localStorageService.get('UserInfo');

            $scope.dataSource.apiType = localStorageService.get("ApiType");

            // 取出登入帳號平台列表
            $scope.dataSource.allPlatformOptions = (localStorageService.get('PlatformSettings') || [])
                .map(item => ({
                    label: item.PlatformName,
                    value: item.TypeCode === 'API' ? item.APICode : item.ShortName, // API用APICode Platform用ShortName
                    ID: item.ID,
                    TypeCode: item.TypeCode,
                }));
            $scope.dataSource.platformOptions = $scope.dataSource.allPlatformOptions.filter(item => $scope.dataSource.apiType === item.TypeCode);

            // 非Master admin不能新增會員
            if (!IS_MASTER && ($scope.dataSource.memberInfo.AgentLevelSCID === 38 || $scope.dataSource.memberInfo.AgentLevelSCID === 28)) {
                $scope.dataSource.isHideAdd = true;
            }

            //SubCompany, SubAdmin
            if ($scope.dataSource.memberInfo.AgentLevelSCID === 38 || $scope.dataSource.memberInfo.AgentLevelSCID === 39) {
                var agentParentMap = $scope.dataSource.memberInfo.AgentParentMap.split('/');
                $scope.dataSource.memberInfo.UserName = agentParentMap[agentParentMap.length - 2];
                $scope.dataSource.memberInfo.MemberID = $scope.dataSource.memberInfo.AgentParentID;
                $scope.dataSource.memberInfo.AgentLevelSCID = $scope.dataSource.memberInfo.AgentLevelSCID === 38 ? 28 : 31;
                $scope.dataSource.memberInfo.AgentPositionTakingTebate = 1;
            }

            var nowDate = new Date();
            var dateS = new Date(Number(nowDate));
            dateS.setDate(nowDate.getDate() - 7);
            var dateE = new Date(Number(nowDate));
            dateE.setDate(nowDate.getDate() + 0);

            $scope.dataSource.DateS = dateS;
            $scope.dataSource.DateE = dateE;

            $scope.dropDownInit();
            $scope.findAcceptedBank();
        };

        //抓取介紹費PayType下拉
        $scope.dropDownInit = function () {
            //PayType DropDown
            var dropDown1 = systemConfigService.findSystemConfigChildren({ ListConfigName: ['PayType'] })
                .then(
                    function success(response, status, headers) {
                        //console.log(response.data.Rows.ListData);
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.payTypeDropDown = response.data.Rows.ListData;
                            $scope.dataSource.payTypeDropDown.unshift({ ID: -1, ConfigName: 'Please Choose' });
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

            //AgentLevel DropDown
            var dropDown2 = systemConfigService.findSystemConfigChildren({ ListConfigName: ['AgentLevel'] })
                .then(
                    function success(response, status, headers) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            // 取得所有等級列表
                            $scope.dataSource.agentLevelDropDown = response.data.Rows.ListData;
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

            //TransactionType
            var dropDown3 = systemConfigService.findSystemConfigChildren({ ListConfigName: ['DepositType', 'WithDrawalType'] })
                .then(
                    function success(response, status, headers) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.transactionTypeDropDown = response.data.Rows.ListData;
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

            var userLevel = userLevelService.findUserLevel($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
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
                        blockUI.stop();
                    });

            Promise.all([dropDown1, dropDown2, dropDown3, userLevel])
                .then(() => {
                    if ($scope.editType !== 'personEditView') {
                        $scope.search();
                    }

                    if ($scope.dataSource.memberInfo && $scope.dataSource.pageStatus !== 'searchView') {
                        $scope.showEdit($scope.dataSource.memberInfo);
                    }
                });
        };

        $timeout($scope.init, 100);

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

        $scope.search = function (setDefault, pageChange) {
            blockUI.start();

            if (!pageChange) {
                $scope.dataSource.PagerObj = {
                    CurrentPage: 1,
                    PageSize: 10,
                    TotalItems: 0,
                    PageArray: [],
                    PageRangeMax: 10,
                    PageRangeMin: 1,
                    thisPage: 1
                };
            }

            // $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            // $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            // $scope.dataSource.searchCondition.AgentParentID = $scope.dataSource.memberInfo.MemberID;
            // $scope.dataSource.searchCondition.IsTree = true;

            $scope.dataSource.listData = [];

            var ajaxData = {
                ...$scope.dataSource.searchCondition,
                CurrentPage: $scope.dataSource.PagerObj.CurrentPage,
                PageSize: $scope.dataSource.PagerObj.PageSize,
                AgentParentID: $scope.dataSource.memberInfo.MemberID,
                IsTree: true,
            };
            if (!IS_MASTER && ngAuthSettings.platformCode && ajaxData.UserName && !ajaxData.UserName.includes('_')) {
                // 不在IS_MASTER 加上當前平台前綴 串出UserName
                ajaxData.UserName = ngAuthSettings.platformCode + '_' + ajaxData.UserName;
            }

            // 20210723 agnet subAgent只會搜尋到member
            if ($scope.dataSource.memberInfo.AgentLevelSCID === 31 || $scope.dataSource.memberInfo.AgentLevelSCID === 39) {
                ajaxData.AgentLevelSCID = 32;
            }

            let fetchFindUser = $scope.dataSource.apiType === 'API' ? memberShipService.findGameDealerUser : memberShipService.findUser;
            fetchFindUser(ajaxData)
                .then(
                    function success(response, status, headers) {
                        blockUI.stop();
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.allListData = response.data.Rows.ListData.filter(p => p.AgentParentMap.includes($scope.dataSource.memberInfo.UserName));
                            $scope.dataSource.listData = response.data.Rows.ListData.filter(p => p.AgentParentID === $scope.dataSource.memberInfo.MemberID);
                            //alert($scope.dataSource.memberInfo.AgentLevelSCID);
                            $scope.dataSource.listData.forEach(p => {
                                p.UserLevelName = $scope.dataSource.userLevels.filter(q => q.LevelID === p.UserLevelID)[0].LevelName;
                                p.AgentLevel = ($scope.dataSource.agentLevelDropDown.filter(q => q.ID === parseInt(p.AgentLevelSCID))[0] || {}).ConfigName;
                                p.AgentLevelValue = ($scope.dataSource.agentLevelDropDown.filter(q => q.ID === parseInt(p.AgentLevelSCID))[0] || {}).ConfigValues;
                                p.isLockEdit = (IS_MASTER && (p.AgentLevelSCID === 31 || p.AgentLevelSCID === 32 || p.AgentLevelSCID === 39)); //在master 不能修改agent subAgent member
                            });

                            $scope.dataSource.memberInfo.SubNodes = $scope.dataSource.listData;
                            $scope.dataSource.selMemberInfoList = [];
                            $scope.dataSource.selMemberInfoList.push($scope.dataSource.memberInfo);

                            if (setDefault) {
                                var member = $scope.dataSource.listData.find(p => p.MemberID === $scope.dataSource.selMemberInfo.MemberID);
                                $.extend($scope.dataSource.selMemberInfo, member);
                            }

                            if ($scope.dataSource.searchCondition.UserName || $scope.dataSource.searchCondition.Email || $scope.dataSource.searchCondition.Phone) {
                                $scope.dataSource.listData = $scope.dataSource.allListData;
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
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                    },
                    function error(data, status, headers) {
                        blockUI.stop();
                    });
        };

        $scope.getSubMember = function (member) {
            if (member.SubNodes.length === 0) {
                return;
            }
            $scope.dataSource.selMemberInfoList.push(member);

            $scope.dataSource.listData = member.SubNodes;
            $scope.dataSource.listData.forEach(p => {
                p.AgentLevel = $scope.dataSource.agentLevelDropDown.filter(q => q.ID === parseInt(p.AgentLevelSCID))[0].ConfigName;
                p.AgentLevelValue = $scope.dataSource.agentLevelDropDown.filter(q => q.ID === parseInt(p.AgentLevelSCID))[0].ConfigValues;
            });
        };

        $scope.showChangePassword = function (member) {
            member.isShowChangePassword = true;
            member.MemberNewPwd = '';
            member.NewPwdError = '';
            member.clickChangePwd = false;
        };

        $scope.showEyeEvent = function (member) {
            member.isShowPwd = !member.isShowPwd;
        };

        $scope.showModifyPwdEyeEvent = function () {
            $scope.dataSource.isShowModifyPwd = !$scope.dataSource.isShowModifyPwd;
        };

        $scope.changePassword = function (form, member) {
            member.clickChangePwd = true;
            if ($rootScope.valid(form)) return;

            var ajaxData = {
                MemberID: member.MemberID,
                UserName: member.UserName,
                MemberNewPwd: member.MemberNewPwd
            };
            let fetchChangePwdMemberByBack = $scope.dataSource.apiType === 'API' ? memberShipService.changeGameDealerPwdMemberByBack : memberShipService.changePwdMemberByBack;
            fetchChangePwdMemberByBack(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        // ngAuthSettings.modalMsg.callBack = 'showSearch';

                        member.isShowChangePassword = false;
                        // 填完訊息後顯示訊息框
                        $rootScope.$broadcast('changeModalMsg', false);
                    }
                    else {
                        member.NewPwdError = response.data.APIRes.ResMessage;
                        // ngAuthSettings.modalMsg.title = "Message";
                        // ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        // ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        // $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        // return;
                    }

                },
                function error(response) {

                });
        };
        //function searchSubMember (memberList) {
        //    memberList.forEach(p => {
        //        if (p.UserName === $scope.dataSource.searchCondition.UserName) {
        //            return p;
        //        } else {
        //            var loopResult = searchSubMember(p.SubNodes);
        //            if (loopResult) {
        //                $scope.dataSource.subListData.push(p);
        //                return loopResult;
        //            }
        //        }
        //    });
        //}

        $scope.changeMember = function (member, index) {
            var popCount = $scope.dataSource.selMemberInfoList.length - index;

            if (popCount > 0) {
                for (var i = 0; i < popCount; i++) {
                    $scope.dataSource.selMemberInfoList.pop();
                }
                $scope.getSubMember(member);
            }
        };

        $scope.searchParent = function (userName, level) {
            blockUI.start();

            var searchCondition = {};
            searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;
            searchCondition.UserName = userName;
            searchCondition.IsTree = true;

            let fetchGetMember = $scope.dataSource.apiType === 'API' ? memberShipService.getGameDealerMember : memberShipService.getMember;
            fetchGetMember(searchCondition)
                .then(
                    function success(response, status, headers) {
                        //console.log(response.data.Rows.ListData);
                        //console.log(response.data.Rows);
                        if (response.data.APIRes.ResCode === '000') {
                            var parentData = $scope.dataSource.parentData.find(p => p.level === level);
                            parentData.listData = response.data.Rows.SubNodes;
                            parentData.listData.unshift({ MemberID: -1, UserName: 'Please Choose' });

                            if ($scope.dataSource.parentInfo.agentParentMap[level]) {
                                parentData.listData.forEach((p, idx) => {
                                    if (p.UserName === $scope.dataSource.parentInfo.agentParentMap[level]) {
                                        parentData.selData = parentData.listData[idx];
                                    }
                                });
                            } else {
                                parentData.selData = parentData.listData[0];
                            }

                            $scope.changeParent(parentData, level + 1);

                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                        blockUI.stop();
                    },
                    function error(data, status, headers) {
                        blockUI.stop();
                    });
        };

        //代理人下拉選單Change
        $scope.changeParent = function (parent, level) {
            var selData = parent.selData;
            var nowParent = $scope.dataSource.parentData.find(p => p.level === level);

            if (level < $scope.dataSource.parentInfo.level) {
                var popIdx = $scope.dataSource.parentInfo.level - level + 1;
                for (var i = 0; i < popIdx; i++) {
                    $scope.dataSource.parentInfo.agentParentMap.pop();
                }
            }

            if (selData.MemberID === -1) {
                //alert($scope.dataSource.parentInfo.level + ',' + level + ',' + $scope.dataSource.parentInfo.agentParentMap);
                $scope.dataSource.parentInfo.level = level - 1;

                if (level === 2) {
                    $scope.dataSource.parentInfo.agentParent = $scope.dataSource.memberInfo;
                    return;
                } else {
                    $scope.dataSource.parentInfo.agentParent = $scope.dataSource.parentData.find(p => p.level === level - 2).selData;
                }
            }
            else {
                $scope.dataSource.parentInfo.level = level;
                //$.extend($scope.dataSource.parentInfo.agentParent, selData);
                $scope.dataSource.parentInfo.agentParent = selData;
                if (!$scope.dataSource.parentInfo.agentParentMap.includes(selData.UserName))
                    $scope.dataSource.parentInfo.agentParentMap.push(selData.UserName);


                //alert(level + ',' + $scope.dataSource.parentInfo.agentParentMap[level + 2]);
                if (level === 4) return;

                nowParent.listData = selData.SubNodes;
                if (!nowParent.listData) nowParent.listData = [];
                if (nowParent.listData.filter(p => p.MemberID === -1).length === 0)
                    nowParent.listData.unshift({ MemberID: -1, UserName: 'Please Choose' });

                if ($scope.dataSource.parentInfo.agentParentMap[level]) {
                    //agentmap有對應時自動帶入
                    var check = false;
                    nowParent.listData.forEach((p, idx) => {
                        if (p.UserName === $scope.dataSource.parentInfo.agentParentMap[level]) {
                            nowParent.selData = nowParent.listData[idx];
                            $scope.changeParent(nowParent, level + 1);
                            check = true;
                        }
                    });
                    if (!check) nowParent.selData = nowParent.listData[0];
                } else {
                    nowParent.selData = nowParent.listData[0];
                }
            }
        };

        $scope.changeAgentLevel = function () {
            // SM 與 M 才會出現
            $scope.dataSource.isShowSelPlatform = IS_MASTER && ($scope.dataSource.selMemberInfo.AgentLevelSCID === 29 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 30);
            $scope.dataSource.parentInfo.level = $scope.dataSource.agentLevelDropDown.filter(q => q.ID === parseInt($scope.dataSource.selMemberInfo.AgentLevelSCID))[0].ConfigValues - 1;
        };

        //清除搜尋條件
        $scope.clear = function () {
            $scope.dataSource.searchCondition = {};
        };

        //回搜尋頁面
        $scope.showSearch = function () {
            $scope.dataSource.pageStatus = 'searchView';
            $scope.dataSource.parentInfo = { agentParent: {}, level: 1, agentParentMap: [] };
            $scope.dataSource.memberInfo = localStorageService.get('UserInfo');

            //SubCompany, SubAdmin
            if ($scope.dataSource.memberInfo.AgentLevelSCID === 38 || $scope.dataSource.memberInfo.AgentLevelSCID === 39) {
                var agentParentMap = $scope.dataSource.memberInfo.AgentParentMap.split('/');
                $scope.dataSource.memberInfo.UserName = agentParentMap[agentParentMap.length - 2];
                $scope.dataSource.memberInfo.MemberID = $scope.dataSource.memberInfo.AgentParentID;
                $scope.dataSource.memberInfo.AgentLevelSCID = $scope.dataSource.memberInfo.AgentLevelSCID === 38 ? 28 : 31;
                $scope.dataSource.memberInfo.AgentPositionTakingTebate = 1;
            }
            $scope.search();
        };

        $scope.$on('showSearch', $scope.showSearch);

        //顯示新增頁
        $scope.showAdd = function () {
            if (!$scope.dataSource.memberInfo.AgentPositionTakingRebate) {
                ngAuthSettings.modalMsg.title = 'Message';
                ngAuthSettings.modalMsg.msg = 'Please call upline to set your position taking first.';
                ngAuthSettings.modalMsg.type = '000';
                $rootScope.$broadcast('changeModalMsg');
                return;
            }

            $scope.dataSource.clickRegister = false;
            $scope.dataSource.pageStatus = 'addView';
            $scope.dataSource.ConfirmMsg = {};


            // 新增會員 列出登入帳號可建立的等級列表
            var uplineLevel = $scope.dataSource.agentLevelDropDown.filter(p => p.ID === $scope.dataSource.memberInfo.AgentLevelSCID)[0].ConfigValues;
            $scope.dataSource.showAgentLevelDropDown = $scope.dataSource.agentLevelDropDown.filter(p =>
                p.ConfigValues > parseInt(uplineLevel) && p.ConfigValues <= (parseInt(uplineLevel) + 1) &&
                p.ID !== 38 && p.ID !== 39 // 20210724 subCompany跟subAdmin要在subAdminManage裡面建立
            );
            $scope.dataSource.showAgentLevelDropDown.unshift({ ID: -1, ConfigName: 'Please Choose' });

            //預設代理人為建立者
            $scope.dataSource.parentInfo.agentParent = $scope.dataSource.memberInfo;
            $scope.dataSource.status = $scope.dataSource.memberInfo.AgentLevelValue;
            $scope.dataSource.parentInfo.level = $scope.dataSource.status;

            $scope.dataSource.selMemberInfo = {};

            var agentParentMap = '';

            if ($scope.dataSource.parentInfo.agentParent.AgentParentMap) agentParentMap = $scope.dataSource.parentInfo.agentParent.AgentParentMap + $scope.dataSource.parentInfo.agentParent.UserName + '/';
            else agentParentMap = $scope.dataSource.parentInfo.agentParent.UserName + '/';

            $scope.dataSource.selMemberInfo.AgentParentMap = agentParentMap;
            $scope.dataSource.selMemberInfo.AgentParentName = $scope.dataSource.parentInfo.agentParent.UserName;
            $scope.dataSource.selMemberInfo.AgentParentID = $scope.dataSource.parentInfo.agentParent.MemberID;
            $scope.dataSource.selMemberInfo.UserType = -1;
            $scope.dataSource.selMemberInfo.AgentLevelSCID = $scope.dataSource.parentInfo.agentParent.AgentLevelSCID + 1;
            $scope.dataSource.selMemberInfo.ReferralPayType = -1;
            $scope.dataSource.selMemberInfo.CashRebatePayType = -1;
            $scope.dataSource.selMemberInfo.CashBackRebatePayType = -1;
            $scope.dataSource.selMemberInfo.UserLevelName = ($scope.dataSource.userLevels.find(q => q.LevelID === 1) || {}).LevelName;
            $scope.dataSource.selMemberInfo.IsEditEmail = false;
            $scope.dataSource.selMemberInfo.IsEditPhone = true;
            // console.warn('$rootScope.PlatformSettings', localStorageService.get('PlatformSettings'))

            // 用當前網址取得預設前綴
            $scope.dataSource.selMemberInfo.selPlatformCode = ngAuthSettings.platformCode;
            // 新增在master 且登入為 M(新增的會是agent) 要show下拉代理平台
            $scope.dataSource.isShowPlatform = IS_MASTER && $scope.dataSource.memberInfo.AgentLevelSCID === 30;

            // 在MASTER中 新增SM或M 才能看到platform checkbox
            $scope.dataSource.isShowSelPlatform = IS_MASTER && ($scope.dataSource.selMemberInfo.AgentLevelSCID === 29 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 30);
            $scope.dataSource.selMemberInfo.selPlatform = [];
            if (IS_MASTER) {
                // admin或subAdmin新增SM 顯示 全平台都可勾選
                if ($scope.dataSource.memberInfo.AgentLevelSCID === 28 ||
                    $scope.dataSource.memberInfo.AgentLevelSCID === 38) {
                    $scope.dataSource.selMemberInfo.selPlatform = $scope.dataSource.platformOptions.map(item => ({
                        ...item,
                        IsEnable: false,
                        IsDisabled: false
                    }));
                }
                // SM新增M 顯示 SM全部且全選不可改
                if ($scope.dataSource.memberInfo.AgentLevelSCID === 29) {
                    $scope.dataSource.selMemberInfo.selPlatform = $scope.dataSource.platformOptions.map(item => ({
                        ...item,
                        IsEnable: true,
                        IsDisabled: true
                    }));
                }
                // M新增Agent 顯示M全部且擇一 預設為當前平台
                if ($scope.dataSource.memberInfo.AgentLevelSCID === 30) {
                    $scope.dataSource.selMemberInfo.selPlatform = $scope.dataSource.platformOptions.map(item => ({
                        ...item,
                        IsEnable: item.value === $scope.dataSource.selMemberInfo.selPlatformCode,
                        IsDisabled: false
                    }));
                }
            } else {
                // 非Master 不顯示checkbox 預設為當前平台 且不能改
                $scope.dataSource.selMemberInfo.selPlatform = $scope.dataSource.platformOptions.map(item => ({
                    ...item,
                    IsEnable: item.value === $scope.dataSource.selMemberInfo.selPlatformCode,
                    IsDisabled: true
                }));
            }

            //帶入預設代理人之parentMap
            //$scope.dataSource.parentInfo.agentParentMap.push($scope.dataSource.parentInfo.agentParent.UserName);

            var parentMap = agentParentMap.split('/');
            parentMap.forEach(p => { if (p) $scope.dataSource.parentInfo.agentParentMap.push(p); });

            $scope.searchParent(parentMap[0], 1);
        };

        //顯示編輯頁
        $scope.showEdit = function (member) {
            $scope.dataSource.clickRegister = false;
            $scope.dataSource.ConfirmMsg = {};
            $scope.dataSource.pageStatus = $scope.editType;
            $scope.dataSource.status = member.AgentLevelValue - 2;

            if (member.Birthday) member.Birthday = new Date(member.Birthday);
            if (member.ReferralPayType) member.ReferralPayType = parseInt(member.ReferralPayType);
            if (member.CashBackPayType) member.CashBackPayType = parseInt(member.CashBackPayType);
            if (member.CashRebatePayType) member.CashRebatePayType = parseInt(member.CashRebatePayType);

            $.extend($scope.dataSource.selMemberInfo, member);
            $.extend($scope.dataSource.resetInfo, $scope.dataSource.selMemberInfo);

            // 修改 會員等級只顯示當前會員的等級
            $scope.dataSource.showAgentLevelDropDown = $scope.dataSource.agentLevelDropDown.filter(p => p.ID === $scope.dataSource.selMemberInfo.AgentLevelSCID);

            $scope.dataSource.selMemberInfo.UserLevelName = ($scope.dataSource.userLevels.find(q => q.LevelID === $scope.dataSource.selMemberInfo.UserLevelID) || {}).LevelName;
            //SubCompany, SubAdmin
            //if ($scope.dataSource.selMemberInfo.AgentLevelSCID === 38 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 39) {
            //    var agentParentMap = $scope.dataSource.selMemberInfo.AgentParentMap.split('/');
            //    $scope.dataSource.selMemberInfo.UserName = agentParentMap[agentParentMap.length - 2];
            //    $scope.dataSource.selMemberInfo.MemberID = $scope.dataSource.selMemberInfo.AgentParentID;
            //    $scope.dataSource.selMemberInfo.AgentLevelSCID = $scope.dataSource.selMemberInfo.AgentLevelSCID === 38 ? 28 : 31;
            //    $scope.dataSource.memberInfo.AgentPositionTakingTebate = 1;
            //}

            // 在master 是agent subAgent member 就要show下拉代理平台
            $scope.dataSource.isShowPlatform = IS_MASTER &&
                ($scope.dataSource.selMemberInfo.AgentLevelSCID === 31 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 32 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 39);
            // 不在IS_MASTER 或 有show下拉代理平台  從userName取出PlatformCode與Account
            var userNameSplit = (member.UserName || '').split('_');
            if ((!IS_MASTER || $scope.dataSource.isShowPlatform) && userNameSplit.length > 1) {
                $scope.dataSource.selMemberInfo.Account = userNameSplit[1];
                $scope.dataSource.selMemberInfo.selPlatformCode = userNameSplit[0];
            } else {
                $scope.dataSource.selMemberInfo.Account = member.UserName;
                $scope.dataSource.selMemberInfo.selPlatformCode = '';
            }

            // 在MASTER中 顯示平台checkbox
            $scope.dataSource.isShowSelPlatform = IS_MASTER && ($scope.dataSource.selMemberInfo.AgentLevelSCID === 29 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 30);
            $scope.dataSource.selMemberInfo.selPlatform = [];
            if (IS_MASTER) {
                // 看自己會員中心時 顯示自己全部的且全選不可改
                if ($scope.dataSource.pageStatus === 'personEditView') {
                    $scope.dataSource.selMemberInfo.selPlatform = $scope.dataSource.platformOptions.map(item => ({
                        ...item,
                        IsEnable: true,
                        IsDisabled: true
                    }));
                }
                //查看agent subAgent member 只顯示selPlatformCode的平台 且不可改
                else if ($scope.dataSource.selMemberInfo.AgentLevelSCID === 31 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 32 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 39) {
                    $scope.dataSource.platformOptions.forEach(item => {
                        if (item.value === $scope.dataSource.selMemberInfo.selPlatformCode) {
                            $scope.dataSource.selMemberInfo.selPlatform.push({
                                ...item,
                                IsEnable: true,
                                IsDisabled: true
                            });
                        }
                    });
                }
                // 查看M時 只呈現M有的平台 且全選不可改
                else if ($scope.dataSource.selMemberInfo.AgentLevelSCID === 30) {
                    // 取出平台選擇情況
                    let PlatformSettings = $scope.dataSource.selMemberInfo.PlatformSettings || [];
                    $scope.dataSource.platformOptions.forEach(item => {
                        if (PlatformSettings.some(platform => platform.ID === item.ID)) {
                            $scope.dataSource.selMemberInfo.selPlatform.push({
                                ...item,
                                IsEnable: true,
                                IsDisabled: true
                            });
                        }
                    });
                }
                // 查看SM時 呈現所有平台 且可改
                else if ($scope.dataSource.selMemberInfo.AgentLevelSCID === 29) {
                    // 取出平台選擇情況
                    let PlatformSettings = $scope.dataSource.selMemberInfo.PlatformSettings || [];
                    $scope.dataSource.selMemberInfo.selPlatform = $scope.dataSource.platformOptions.map(item => {
                        let enablePlatform = PlatformSettings.find(platform => platform.ID === item.ID);
                        if (enablePlatform) {
                            return {
                                ...item,
                                IsEnable: true,
                                IsDisabled: enablePlatform.IsDisable
                            };
                        }
                        return {
                            ...item,
                            IsEnable: false,
                            IsDisabled: false
                        };
                    });
                }
            } else {
                // 非Master 不顯示checkbox 預設為當前平台 且不能改
                $scope.dataSource.selMemberInfo.selPlatform = $scope.dataSource.platformOptions.map(item => ({
                    ...item,
                    IsEnable: item.value === $scope.dataSource.selMemberInfo.selPlatformCode,
                    IsDisabled: true
                }));
            }

            // 在master 不能修改agent subAgent member的東西
            $scope.dataSource.isLockEdit = false;
            if (IS_MASTER &&
                ($scope.dataSource.selMemberInfo.AgentLevelSCID === 31 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 32 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 39)) {
                $scope.dataSource.isLockEdit = true;
            }

            // // 從fullName取出RealFullName
            // if (member.FullName && member.FullName.includes('_')) {
            //     $scope.dataSource.selMemberInfo.RealFullName = member.FullName.split('_').slice(1).join('_');
            // } else {
            //     $scope.dataSource.selMemberInfo.RealFullName = member.FullName;
            // }

            //目前map為UserName,搜尋需要ID
            //帶入預設代理人之parentMap
            var parentMap = $scope.dataSource.selMemberInfo.AgentParentMap.split('/');
            $scope.dataSource.selMemberInfo.AgentParentName = parentMap[parentMap.length - 2];
            $scope.dataSource.parentInfo.agentParent.UserName = $scope.dataSource.selMemberInfo.AgentParentName;
            $scope.dataSource.parentInfo.agentParent.MemberID = $scope.dataSource.selMemberInfo.AgentParentID;

            parentMap.forEach(function (element) {
                if (element) $scope.dataSource.parentInfo.agentParentMap.push(element);
            });

            //$scope.dataSource.parentInfo.agentParentMap.push(parentMap[0]);
            if (parentMap[0])
                $scope.searchParent(parentMap[0], 1);
            else
                $scope.searchParent('Admin', 1);

        };

        //復原修改資料
        $scope.resetInfo = function () {
            $.extend($scope.dataSource.selMemberInfo, $scope.dataSource.resetInfo);
        };

        // $scope.deleteMember = function (member) {
        //     $scope.dataSource.selMemberInfo = member;
        //     ngAuthSettings.modalMsg.title = 'Confirm';
        //     ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
        //     ngAuthSettings.modalMsg.type = '000';
        //     ngAuthSettings.modalMsg.callBack = 'confirmDel';
        //     $rootScope.$broadcast('changeModalMsg', true);
        // };

        // $scope.$on('confirmDel', function (event) {
        //     memberShipService.delMember($scope.dataSource.selMemberInfo)
        //         .then(
        //             function success(response, status, headers) {
        //                 if (response.data.APIRes.ResCode === '000') {
        //                     ngAuthSettings.modalMsg.title = "Message";
        //                     ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
        //                     ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
        //                     ngAuthSettings.modalMsg.callBack = 'showSearch';
        //                     $rootScope.$broadcast('changeModalMsg', false);
        //                     $scope.search();
        //                 }
        //                 else {
        //                     ngAuthSettings.modalMsg.title = "Message";
        //                     ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
        //                     ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
        //                     $rootScope.$broadcast('changeModalMsg', false);

        //                     $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
        //                     return;
        //                 }
        //             },
        //             function error(data, status, headers) {
        //             });
        // });

        $scope.addMember = function (form) {
            $scope.dataSource.clickRegister = true;

            if ($rootScope.valid(form)) return;

            var ajaxData = {};
            $.extend(ajaxData, $scope.dataSource.selMemberInfo);
            // 有show下拉代理平台 需加上選擇的平台前綴 串出UserName
            if ($scope.dataSource.isShowPlatform && ajaxData.selPlatformCode) {
                ajaxData.UserName = ajaxData.selPlatformCode + '_' + ajaxData.Account;
            }
            else if (!IS_MASTER && ngAuthSettings.platformCode) {
                // 不在IS_MASTER 加上當前平台前綴 串出UserName
                ajaxData.UserName = ngAuthSettings.platformCode + '_' + ajaxData.Account;
            } else {
                ajaxData.UserName = ajaxData.Account;
            }

            // 20210415 yark說全部都要帶上PlatformSettingIDs
            ajaxData.PlatformSettingIDs = [];
            $scope.dataSource.selMemberInfo.selPlatform.forEach(item => {
                if (item.IsEnable) {
                    ajaxData.PlatformSettingIDs.push(item.ID);
                }
            });

            blockUI.start();
            let fetchAddMember = $scope.dataSource.apiType === 'API' ? memberShipService.addGameDealerMember : memberShipService.addMember;
            fetchAddMember(ajaxData).then(
                function success(response) {
                    blockUI.stop();

                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.clickRegister = false;
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';
                        $rootScope.$broadcast('changeModalMsg', false);

                        $scope.search();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        $rootScope.$broadcast('changeModalMsg', false);

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        return;
                    }
                },
                function error(response) {
                    console.log(response);
                    blockUI.stop();
                });
        };

        $scope.saveMember = function (form) {
            $scope.dataSource.clickRegister = true;
            if ($rootScope.valid(form)) return;

            var ajaxData = {};
            $.extend(ajaxData, $scope.dataSource.selMemberInfo);

            // 20210415 yark說全部都要帶上PlatformSettingIDs
            ajaxData.PlatformSettingIDs = [];
            $scope.dataSource.selMemberInfo.selPlatform.forEach(item => {
                if (item.IsEnable) {
                    ajaxData.PlatformSettingIDs.push(item.ID);
                }
            });

            let fetchUpdateMember = $scope.dataSource.apiType === 'API' ? memberShipService.updateGameDealerMember : memberShipService.updateMember;
            fetchUpdateMember(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.clickRegister = false;
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        //ngAuthSettings.modalMsg.callBack = 'showSearch';

                        // 填完訊息後顯示訊息框
                        $rootScope.$broadcast('changeModalMsg', false);
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        $rootScope.$broadcast('changeModalMsg', false);
                    }
                },
                function error(response) {

                });
        };

        $scope.openPasswordEditView = function () {
            $scope.dataSource.pageStatus = 'passwordEditView';
            $scope.dataSource.clickSavePwd = false;
        };

        $scope.savePwd = function (form) {
            $scope.dataSource.clickSavePwd = true;
            if ($rootScope.valid(form)) return;

            if ($scope.dataSource.changePwdObj.MemberNewPwd !== $scope.dataSource.changePwdObj.ConfirmPwd) {
                ngAuthSettings.modalMsg.title = 'Alert';
                ngAuthSettings.modalMsg.msg = 'PasswordDifferentDetail';
                $rootScope.$broadcast('changeModalMsg', false);
                return;
            }

            if ($scope.dataSource.changePwdObj.MemberOldPwd === $scope.dataSource.changePwdObj.MemberNewPwd) {
                ngAuthSettings.modalMsg.title = 'Alert';
                ngAuthSettings.modalMsg.msg = 'PasswordSameDetail';
                $rootScope.$broadcast('changeModalMsg', false);
                return;
            }

            let fetchChangePwdMember = $scope.dataSource.apiType === 'API' ? memberShipService.changeGameDealerPwdMember : memberShipService.changePwdMember;
            fetchChangePwdMember($scope.dataSource.changePwdObj).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        $scope.dataSource.pageStatus = 'personEditView';
                        // 填完訊息後顯示訊息框
                        $rootScope.$broadcast('changeModalMsg', false);
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Alert";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        // $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        // 填完訊息後顯示訊息框
                        $rootScope.$broadcast('changeModalMsg', false);
                        return;
                    }

                },
                function error(response) {

                });
        };

        $scope.updateSelPlatform = function (selPlatform) {
            // 若是在更改agent 則會把值改入selPlatformCode 並只能擇一
            if ($scope.dataSource.isShowPlatform) {
                $scope.dataSource.selMemberInfo.selPlatformCode = selPlatform.value;
                $scope.dataSource.selMemberInfo.selPlatform = $scope.dataSource.selMemberInfo.selPlatform.map(item => ({
                    ...item,
                    IsEnable: item.value === $scope.dataSource.selMemberInfo.selPlatformCode
                }));
            }
        };

        // 檢查註冊資料
        $scope.checkRegisterData = function (column) {
            if ($scope.dataSource.pageStatus !== 'addView') {
                return;
            }

            var sendObj = {};
            if (column === 'UserName') {
                if (!$scope.dataSource.selMemberInfo.Account) return;

                // 有show下拉代理平台 需加上選擇的平台前綴 串出UserName
                if ($scope.dataSource.isShowPlatform && $scope.dataSource.selMemberInfo.selPlatformCode) {
                    sendObj.UserName = $scope.dataSource.selMemberInfo.selPlatformCode + '_' + $scope.dataSource.selMemberInfo.Account;
                }
                // 不在IS_MASTER 加上當前平台前綴 串出UserName
                else if (!IS_MASTER && ngAuthSettings.platformCode) {
                    sendObj.UserName = ngAuthSettings.platformCode + '_' + $scope.dataSource.selMemberInfo.Account;
                } else {
                    sendObj.UserName = $scope.dataSource.selMemberInfo.Account;
                }
            }
            // 20210316 FullName不需要判斷是否重複
            // else if (column === 'FullName') {
            //     if (!$scope.dataSource.selMemberInfo.RealFullName) return;
            //     // 需加上網站前綴
            //     sendObj.FullName = platformCode + '_' + $scope.dataSource.selMemberInfo.RealFullName;
            // }
            else if (column === 'Email') {
                sendObj.Email = $scope.dataSource.selMemberInfo.Email;
                if (!$scope.dataSource.selMemberInfo.Email) return;
            }
            else if (column === 'Phone') {
                sendObj.Phone = $scope.dataSource.selMemberInfo.Phone;
                if (!$scope.dataSource.selMemberInfo.Phone) return;
            }

            let fetchCheckRegisterData = $scope.dataSource.apiType === 'API' ? memberShipService.checkGameDealerRegisterData : memberShipService.checkRegisterData;
            fetchCheckRegisterData(sendObj).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.ConfirmMsg[column] = '';
                    }
                    else if (response.data.APIRes.ResCode === '400') {
                        if (column === 'UserName')
                            $scope.dataSource.ConfirmMsg.UserName = 'MemberManage_UsernameNotAvailable';
                        // else if (column === 'FullName')
                        //     $scope.dataSource.ConfirmMsg.FullName = 'MemberManage_FullNameNotAvailable';
                        else if (column === 'Email')
                            $scope.dataSource.ConfirmMsg.Email = 'MemberManage_EmailNotAvailable';
                        else if (column === 'Phone')
                            $scope.dataSource.ConfirmMsg.Phone = 'MemberManage_PhoneNotAvailable';
                    }
                    else {
                        $scope.dataSource.ConfirmMsg[column] = response.data.APIRes.ResMessage;
                    }
                },
                function error() {
                }
            );
        };

        $scope.resetPwd = function () {
            if (!confirm('Confirm reset password?')) return;

            let fetchForgetPwd = $scope.dataSource.apiType === 'API' ? memberShipService.forgetGameDealerPwd : memberShipService.forgetPwd;
            fetchForgetPwd($scope.dataSource.selMemberInfo).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.authToken = response.data.AuthToken;
                        ngAuthSettings.modalMsg.title = "ForgotPassword";
                        ngAuthSettings.modalMsg.msg = 'PasswordSentDetail';

                        // Put cookie
                        //localStorageService.set('UserToken', response.data.AuthToken);
                        //localStorageService.set('userInfo', response.data.Rows);

                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        authService.fillAuthData();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "ForgotPassword";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                    }

                    // 填完訊息後顯示訊息框
                    $rootScope.$broadcast('changeModalMsg', false);
                },
                function error(response) {

                });
        };

        $scope.changeAndSave = function (member) {
            $scope.dataSource.selMemberInfo = member;
            //20210520 暫時先把整個selMemberInfo.selPlatform取得方法放過來 用來獲得PlatformSettingIDs
            $scope.dataSource.selMemberInfo.selPlatform = [];
            if (IS_MASTER) {
                //查看agent subAgent member 只顯示selPlatformCode的平台 且不可改
                if ($scope.dataSource.selMemberInfo.AgentLevelSCID === 31 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 32 || $scope.dataSource.selMemberInfo.AgentLevelSCID === 39) {
                    $scope.dataSource.platformOptions.forEach(item => {
                        if (item.value === $scope.dataSource.selMemberInfo.selPlatformCode) {
                            $scope.dataSource.selMemberInfo.selPlatform.push({
                                ...item,
                                IsEnable: true,
                                IsDisabled: true
                            });
                        }
                    });
                }
                // 查看M時 只呈現M有的平台 且全選不可改
                else if ($scope.dataSource.selMemberInfo.AgentLevelSCID === 30) {
                    // 取出平台選擇情況
                    let PlatformSettings = $scope.dataSource.selMemberInfo.PlatformSettings || [];
                    $scope.dataSource.platformOptions.forEach(item => {
                        if (PlatformSettings.some(platform => platform.ID === item.ID)) {
                            $scope.dataSource.selMemberInfo.selPlatform.push({
                                ...item,
                                IsEnable: true,
                                IsDisabled: true
                            });
                        }
                    });
                }
                // 查看SM時 呈現所有平台 且可改
                else if ($scope.dataSource.selMemberInfo.AgentLevelSCID === 29) {
                    // 取出平台選擇情況
                    let PlatformSettings = $scope.dataSource.selMemberInfo.PlatformSettings || [];
                    $scope.dataSource.selMemberInfo.selPlatform = $scope.dataSource.platformOptions.map(item => {
                        let enablePlatform = PlatformSettings.find(platform => platform.ID === item.ID);
                        if (enablePlatform) {
                            return {
                                ...item,
                                IsEnable: true,
                                IsDisabled: enablePlatform.IsDisable
                            };
                        }
                        return {
                            ...item,
                            IsEnable: false,
                            IsDisabled: false
                        };
                    });
                }
            } else {
                // 非Master 不顯示checkbox 預設為當前平台 且不能改
                $scope.dataSource.selMemberInfo.selPlatform = $scope.dataSource.platformOptions.map(item => ({
                    ...item,
                    IsEnable: item.value === $scope.dataSource.selMemberInfo.selPlatformCode,
                    IsDisabled: true
                }));
            }
            $scope.saveMember();
        };


        //顯示銀行頁
        $scope.showBank = function (member) {
            $scope.dataSource.selMemberInfo = member;
            $scope.dataSource.modalMsg.title = 'MemberManage_Bank';
            $scope.dataSource.modalMsg.type = 'Bank';
            $('#ShowDetailDialog').click();
        };

        //銀行編輯視窗
        $scope.showBankDialog = function (bank) {
            if (bank) {
                $scope.dataSource.selBank = bank;
                $scope.dataSource.selBank.BankInfo = $scope.dataSource.AcceptedBanks.filter(p => p.BankCode === bank.BankCode)[0];
            }
            else {
                $scope.dataSource.selBank = {};
                $scope.dataSource.selBank.MemberID = $scope.dataSource.selMemberInfo.MemberID;
                $scope.dataSource.selBank.BankInfo = $scope.dataSource.AcceptedBanks[0];
            }

            $('#ShowBankDialog').click();
        };

        // 查詢AcceptedBank
        $scope.findAcceptedBank = function () {
            let ajaxData = {};
            ajaxData["CurrentPage"] = 1;
            ajaxData["PageSize"] = 100;

            bankService.findAcceptedBank(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.AcceptedBanks = response.data.Rows.ListData;
                        $scope.dataSource.AcceptedBanks.splice(0, 0, { BankCode: '--Select Bank--', BankName: '', BankNumber: '' });
                        ngAuthSettings.modalMsg.title = "Success";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.Msg;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "FindLotteryClass";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                    }

                    //// 填完訊息後顯示訊息框
                    //ngAuthSettings.modalMsg.callBack = "";
                    //$rootScope.$broadcast('changeModalMsg');
                    //$('#ModalShow').click();
                },
                function error(response) {
                    console.log(response);
                }
            );
        };

        $scope.addOrEditBank = function () {
            if ($scope.dataSource.selBank.ID) {
                bankService.updateBank($scope.dataSource.selBank).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                            $scope.search(true);
                        }
                        else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);

                            $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                            return;
                        }


                    },
                    function error(response) {

                    });
            } else {
                bankService.addBank($scope.dataSource.selBank).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                            $scope.search(true);
                        }
                        else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);

                            $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                            return;
                        }


                    },
                    function error(response) {

                    });
            }
        };

        $scope.deleteBank = function (bank) {
            if (!confirm('Confirm Delete?')) return;

            bankService.delBank(bank).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        $rootScope.$broadcast('changeModalMsg', false);
                        $scope.search(true);
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        $rootScope.$broadcast('changeModalMsg', false);

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        return;
                    }
                },
                function error(response) {
                    console.log(response);
                });
        };

        $scope.showWallet = function (member) {
            $scope.dataSource.selMemberInfo = member;
            $scope.dataSource.modalMsg.title = 'MemberManage_Wallet';
            $scope.dataSource.modalMsg.type = 'Wallet';
            $('#ShowDetailDialog').click();
        };

        $scope.showTransaction = function () {
            $scope.dataSource.pageStatus = 'transactionView';
            $scope.dataSource.PagerObj2.CurrentPage = 1;
            $scope.dataSource.PagerObj2.PageSize = 10;

            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj2.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj2.PageSize;
            $scope.dataSource.searchCondition.MemberID = $scope.dataSource.selMemberInfo.MemberID;
            $scope.dataSource.searchCondition.DateS = $scope.dataSource.DateS;
            $scope.dataSource.searchCondition.DateE = $scope.dataSource.DateE;

            transactionsService.findTransactionsHistory($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            console.log(response.data.Rows.ListData);
                            $scope.dataSource.transactionData = response.data.Rows.ListData;

                            $scope.dataSource.transactionData.forEach(p => {
                                p.Status = $scope.dataSource.transactionTypeDropDown.filter(q => q.ID === parseInt(p.TransacitonsTypeSCID))[0].ConfigName;
                            });

                            //頁籤
                            $scope.dataSource.PagerObj2 = response.data.Rows.PagerObj;
                            $scope.dataSource.PagerObj2["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                            $scope.dataSource.PagerObj2["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                            $scope.dataSource.PagerObj2["PageArray"] = [];
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                        }
                    },
                    function error(data, status, headers) {
                    });
        };

        // 查詢今日投注
        $scope.showStatement = function () {
            blockUI.start();
            $scope.dataSource.pageStatus = 'statementView';

            var ajaxData = {
                'CurrentPage': $scope.dataSource.PagerObj3.CurrentPage,
                'PageSize': $scope.dataSource.PagerObj3.PageSize,
                'LotteryType': $scope.dataSource.searchCondition.LotteryType,
                'DateS': $scope.dataSource.DateS,
                'DateE': $scope.dataSource.DateE,
                'Status': $scope.dataSource.searchCondition.Status,
                'MemberID': $scope.dataSource.selMemberInfo.MemberID
            };

            statementService.findStatement(ajaxData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.statementData = response.data.Rows.ListData;
                        //頁籤
                        $scope.dataSource.PagerObj3 = response.data.Rows.PagerObj;
                        $scope.dataSource.PagerObj3["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                        $scope.dataSource.PagerObj3["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                        $scope.dataSource.PagerObj3["PageArray"] = [];
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Error";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.Msg;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        // 填完訊息後顯示訊息框
                        ngAuthSettings.modalMsg.callBack = "";
                        $rootScope.$broadcast('changeModalMsg');
                    }
                    blockUI.stop();
                },
                function error(response) { blockUI.stop(); }
            );
        };

        $scope.showDetail = function (statement, status) {
            //mPlayer.ResultList = mPlayer.Result.split(',');
            $scope.dataSource.selStatement = statement;
        };

        $scope.showPromotion = function (pageStatus) {
            $scope.dataSource.mPromotionList = [];
            $scope.dataSource.pageStatus = pageStatus;

            promotionSettingsService.findPromotions($scope.dataSource.searchCondition)
                .then(
                    function success(response) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.promotions = response.data.Rows.ListData;
                            $scope.getMPromotions();
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
                        }
                    },
                    function error(response) {
                        console.log(response);
                    });

        };

        $scope.getMPromotions = function () {
            var sendObj = {};
            sendObj.CurrentPage = $scope.dataSource.PagerObj4.CurrentPage;
            sendObj.PageSize = $scope.dataSource.PagerObj4.PageSize;
            sendObj.MemberID = $scope.dataSource.selMemberInfo.MemberID;
            promotionSettingsService.findMPromotions(sendObj).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.mPromotionList = response.data.Rows.ListData;
                        $scope.dataSource.mPromotionList.forEach(p => {
                            p.promotion = $scope.dataSource.promotions.find(q => q.ID === p.PromotionID);
                            if (!p.TotalPlayerAmount) p.TotalPlayerAmount = 0;
                            if (!p.TotalPlayerWinAmount) p.TotalPlayerWinAmount = 0;
                            if (!p.TurnOverAmount) p.TurnOverAmount = 0;
                            p.WinLoseMoney = p.TotalPlayerWinAmount - p.TotalPlayerAmount;
                            p.RemainingTurnover = p.UnlockWithdrawalTask - p.TurnOverAmount;
                            
                            p.TotalDepositAmount = parseFloat(p.DepositAmount) + parseFloat(p.TotalBonus);
                            p.LossUnlockAmount = p.TotalDepositAmount * 0.99;
                            
                            p.Status = p.Remark.includes('Cancel') ? 'Canceled' : p.IslockWithdrawal ? 'Lock' : 'Unlock';
                            //p.Status = p.Remark.includes('Cancel') ? 'Canceled' : 'Approved';

                            if (new Date(p.promotion.PromotionPeriodE) > new Date()) {
                                p.InProgress = true;
                            }
                        });
                        console.log($scope.dataSource.mPromotionList);
                        //頁籤
                        $scope.dataSource.PagerObj4 = response.data.Rows.PagerObj;
                        $scope.dataSource.PagerObj4["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                        $scope.dataSource.PagerObj4["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                        $scope.dataSource.PagerObj4["PageArray"] = [];
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
                    console.log(response);
                });
        };

        $scope.cancelPromotion = function (promotion) {
            if (!confirm('Confirm cancel promotion?')) return;
            blockUI.start();

            promotion.IslockWithdrawal = false;

            promotionSettingsService.updateMPromotion(promotion).then(
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
                    blockUI.stop();
                },
                function error(response) {
                    blockUI.stop();
                });
        };

        // 訊息框處理事件
        $scope.confirmAgent = function () {
            //alert($scope.dataSource.selMemberInfo.AgentLevelSCID + ',' + $scope.dataSource.parentInfo.agentParentMap.length);
            //alert(JSON.stringify($scope.dataSource.parentInfo.agentParentMap))
            var msg = '';
            switch ($scope.dataSource.selMemberInfo.AgentLevelSCID) {
                case 30:
                    if ($scope.dataSource.parentInfo.agentParentMap.length !== 2) msg = 'Please Choose Agent SM.';
                    break;
                case 31:
                    if ($scope.dataSource.parentInfo.agentParentMap.length !== 3) msg = 'Please Choose Agent M.';
                    break;
                case 32:
                    if ($scope.dataSource.parentInfo.agentParentMap.length !== 4) msg = 'Please Choose Agent AG.';
                    break;
            }
            if (msg) {
                ngAuthSettings.modalMsg.title = "Message";
                ngAuthSettings.modalMsg.msg = msg;
                $rootScope.$broadcast('changeModalMsg');
                return;
            }
            //alert(JSON.stringify($scope.dataSource.parentInfo.agentParent))
            $scope.dataSource.selMemberInfo.AgentParentName = $scope.dataSource.parentInfo.agentParent.UserName;
            $scope.dataSource.selMemberInfo.AgentParentID = $scope.dataSource.parentInfo.agentParent.MemberID;
            $scope.dataSource.selMemberInfo.AgentParentMap = $scope.dataSource.parentInfo.agentParentMap.join('/') + '/';
            //$scope.dataSource.selMemberInfo.ReferralLink = ngAuthSettings.referralLinkDomain + $scope.dataSource.parentInfo.referralLink.join('/');
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search(null, true);
        };

        //換頁
        $scope.PageChanged2 = function (page) {
            $scope.dataSource.PagerObj2.CurrentPage = page;
            $scope.showTransaction();
        };

        //換頁
        $scope.PageChanged3 = function (page) {
            $scope.dataSource.PagerObj3.CurrentPage = page;
            $scope.showStatement();
        };

        //換頁
        $scope.PageChanged4 = function (page) {
            $scope.dataSource.PagerObj4.CurrentPage = page;
            $scope.showPromotion();
        };

        $scope.handleChangeApiType = function (type) {
            // 只有admin 和subCompany 能切換平台或API對接
            if ($scope.dataSource.memberInfo.AgentLevelSCID !== 28 && $scope.dataSource.memberInfo.AgentLevelSCID !== 38) {
                return;
            }
            $scope.dataSource.apiType = type;
            if ($scope.dataSource.pageStatus === 'searchView') {
                $scope.search();
            }
            $scope.dataSource.platformOptions = $scope.dataSource.allPlatformOptions.filter(item => $scope.dataSource.apiType === item.TypeCode);
        };
    }]);