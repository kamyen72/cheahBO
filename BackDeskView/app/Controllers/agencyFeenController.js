'use strict';
app.controller('agencyFeenController', [
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
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        memberShipService, systemConfigService) {

        $scope.dataSource = {
            pageStatus: 'agencyView',
            apiType: '', // Platform & API
            isMaster: IS_MASTER,
            searchCondition: { CurrentPage: 1, PageSize: 10, MemberUser: '', Address: '', EMail: '', UserName: '', CellPhone: '' },
            listData: [],
            memberInfo: {},
            selMemberInfo: {},
            rateOption: [],
            parentTotalPercent: 0,
            modalMsg: { title: 'Modify' },
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
            $scope.dataSource.memberInfo = localStorageService.get('UserInfo');
            if ($scope.dataSource.memberInfo && $scope.dataSource.memberInfo.AgentPositionTakingRebate)
                $scope.dataSource.memberInfo.AgentPositionTakingRebate = (parseFloat($scope.dataSource.memberInfo.AgentPositionTakingRebate) * 100) + '%';

            $scope.dataSource.apiType = localStorageService.get("ApiType");

            $scope.dataSource.rateOption = [];
            //var agentPositionTakingRebate = (parseFloat($scope.dataSource.memberInfo.AgentPositionTakingRebate) * 100).toFixed();
            //for (var i = agentPositionTakingRebate; i >= 1; i--)
            //    $scope.dataSource.rateOption.push(i + '%');

            //$scope.dataSource.rateOption = ['1%', '2%', '3%', '4%', '5%', '6%', '7%', '8%', '9%', '10%'];
            $scope.getSystemConfig();
        };

        $scope.getSystemConfig = function () {
            blockUI.start();
            //AgentLevel DropDown
            systemConfigService.findSystemConfigChildren({ ListConfigName: ['AgentLevel'] })
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            //Agent & Member無法做此設定
                            var config = response.data.Rows.ListData.filter(p => p.ID === $scope.dataSource.memberInfo.AgentLevelSCID)[0];
                            if (config && config.ConfigValues >= 4) {
                                ngAuthSettings.modalMsg.title = "Message";
                                ngAuthSettings.modalMsg.msg = 'AgentOrMemberCanNotSet';
                                ngAuthSettings.modalMsg.type = '000';
                                ngAuthSettings.modalMsg.linkTo = 'home';
                                $rootScope.$broadcast('changeModalMsg');
                            } else {
                                $scope.search();
                            }
                            blockUI.stop();
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            $rootScope.$broadcast('changeModalMsg', false);
                            blockUI.stop();
                        }
                    },
                    function error(data, status, headers) {
                        blockUI.stop();
                    });
        };

        $timeout($scope.init, 100);

        //$scope.search = function () {
        //    $scope.dataSource.listData = [{ UserName: '1111', agentPositionTakingRebate: '10%' }];
        //};

        $scope.search = function () {
            blockUI.start();
            $scope.dataSource.listData = [];
            $scope.dataSource.rateOption = [];

            let fetchFindAgentMember = $scope.dataSource.apiType === 'API' ? memberShipService.findGameDealerAgentMember : memberShipService.findAgentMember;
            fetchFindAgentMember({})
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows.ListData));

                        if (response.data.APIRes.ResCode === '000') {
                            var member = response.data.Rows;
                            //$scope.dataSource.parentTotalPercent = parseFloat(member.AgentPositionTakingRebate.split(',')[1]);
                            $scope.dataSource.parentTotalPercent = parseFloat(member.AgentPositionTakingRebate);
                            var percent = $scope.dataSource.parentTotalPercent.toFixed(2) * 100;
                            for (var i = percent; i >= 1; i--)
                                $scope.dataSource.rateOption.push(i + '%');
                            member.SubNodes.forEach(p => {
                                if (p.AgentLevelSCID !== 32) $scope.dataSource.listData.push(p);
                            });

                            $scope.dataSource.listData.forEach(p => { if (p.AgentPositionTakingRebate) p.AgentPositionTakingRebate = (parseFloat(p.AgentPositionTakingRebate) * 100).toFixed(0) + '%'; });
                            //$scope.dataSource.listData.forEach(p => { p.ReferralCashRebate = (parseFloat(p.ReferralCashRebate) * 100).toFixed(0) + '%'; });
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

        //$scope.getTreeMember = function (memberList) {
        //    memberList.forEach(member => {
        //        if (member.SubNodes.length > 0) {
        //            $scope.dataSource.listData.push(member);
        //            $scope.getTreeMember(member.SubNodes);
        //        } else {
        //            $scope.dataSource.listData.push(member);
        //            //alert(JSON.stringify(memberList));
        //            //memberList.forEach(p => { $scope.dataSource.listData.push(p); });
        //        }
        //    });
        //};

        $scope.showEdit = function (member) {
            $.extend($scope.dataSource.selMemberInfo, member);
            $('#ShowRateDialog').click();
        };

        $scope.modalMsgConfirmEvent = function () {
            $scope.dataSource.selMemberInfo.AgentPositionTakingRebate = parseInt($scope.dataSource.selMemberInfo.AgentPositionTakingRebate) / 100;
            //$scope.dataSource.selMemberInfo.ReferralCashRebate = parseInt($scope.dataSource.selMemberInfo.ReferralCashRebate) / 100;

            //if ($scope.dataSource.selMemberInfo.AgentPositionTakingRebate + $scope.dataSource.parentTotalPercent > 1) {
            //    ngAuthSettings.modalMsg.title = "Message";
            //    ngAuthSettings.modalMsg.msg = 'Total Agent Percent cant be bigger than 100%';
            //    $rootScope.$broadcast('changeModalMsg');
            //    return;
            //}

            let fetchUpdateMember = $scope.dataSource.apiType === 'API' ? memberShipService.updateGameDealerMember : memberShipService.updateMember;
            fetchUpdateMember($scope.dataSource.selMemberInfo).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';

                        // 填完訊息後顯示訊息框
                        $rootScope.$broadcast('changeModalMsg');

                        $scope.search();
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                        $rootScope.$broadcast('changeModalMsg');
                    }

                },
                function error(response) {

                });
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

        $scope.handleChangeApiType = function(type) {
            // 只有admin 和subCompany 能切換平台或API對接
            if($scope.dataSource.memberInfo.AgentLevelSCID !== 28 && $scope.dataSource.memberInfo.AgentLevelSCID !== 38) {
                return ;
            }
            $scope.dataSource.apiType = type;
            $scope.search();
        }

        $scope.realRositionTaking = function (memberPositionTaking) {
            if(!memberPositionTaking) {
                return '';
            }
            return parseInt($scope.dataSource.memberInfo.AgentPositionTakingRebate.split('%')[0]) - parseInt(memberPositionTaking.split('%')[0]) + '%';
        };
    }]);