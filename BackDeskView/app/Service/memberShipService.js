'use strict';
app.factory('memberShipService', ['$q', 'MemberShipRepository', 'RepositoryHelper',
    function ($q, MemberShipRepository, RepositoryHelper) {
        var factory = {};

        var _callRepository = function (deferred, ajaxData) {
            RepositoryHelper.post(ajaxData).then(
                function success(response, status, headers) {
                    deferred.resolve(response);
                }, function error(data, status, headers) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        // 查選單
        var _checkLoginByBack = function () {
            var deferred = $q.defer();
            var ajaxData = {};

            MemberShipRepository.checkLoginByBack(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        // 查選單
        var _findSiteMap = function () {
            var deferred = $q.defer();
            var ajaxData = {};

            MemberShipRepository.findSiteMap(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        var _findUser = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["CurrentPage"] = userDataObj.CurrentPage;
            ajaxData["PageSize"] = userDataObj.PageSize;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["EMail"] = userDataObj.EMail;
            ajaxData["Address"] = userDataObj.Address;
            ajaxData["Phone"] = userDataObj.Phone;
            ajaxData["UserLevelID"] = userDataObj.UserLevelID;
            ajaxData["AgentLevelSCID"] = userDataObj.AgentLevelSCID;
            ajaxData["AgentParentID"] = userDataObj.AgentParentID;
            ajaxData["IsTree"] = userDataObj.IsTree;
            ajaxData["DateS"] = getDateS(userDataObj.DateS);
            ajaxData["DateE"] = getDateE(userDataObj.DateE);

            MemberShipRepository.findUser(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        var _findGameDealerUser = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["CurrentPage"] = userDataObj.CurrentPage;
            ajaxData["PageSize"] = userDataObj.PageSize;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["EMail"] = userDataObj.EMail;
            ajaxData["Address"] = userDataObj.Address;
            ajaxData["Phone"] = userDataObj.Phone;
            ajaxData["UserLevelID"] = userDataObj.UserLevelID;
            ajaxData["AgentLevelSCID"] = userDataObj.AgentLevelSCID;
            ajaxData["AgentParentID"] = userDataObj.AgentParentID;
            ajaxData["IsTree"] = userDataObj.IsTree;
            ajaxData["DateS"] = getDateS(userDataObj.DateS);
            ajaxData["DateE"] = getDateE(userDataObj.DateE);

            MemberShipRepository.findGameDealerUser(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        var _findAgentMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["CurrentPage"] = userDataObj.CurrentPage;
            ajaxData["PageSize"] = userDataObj.PageSize;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["EMail"] = userDataObj.Email;
            ajaxData["Address"] = userDataObj.Address;
            ajaxData["Phone"] = userDataObj.Phone;
            ajaxData["UserLevelID"] = userDataObj.UserLevelID;
            ajaxData["AgentParentID"] = userDataObj.AgentParentID;
            ajaxData["IsTree"] = userDataObj.IsTree;

            MemberShipRepository.findAgentMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        var _findGameDealerAgentMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["CurrentPage"] = userDataObj.CurrentPage;
            ajaxData["PageSize"] = userDataObj.PageSize;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["EMail"] = userDataObj.Email;
            ajaxData["Address"] = userDataObj.Address;
            ajaxData["Phone"] = userDataObj.Phone;
            ajaxData["UserLevelID"] = userDataObj.UserLevelID;
            ajaxData["AgentParentID"] = userDataObj.AgentParentID;
            ajaxData["IsTree"] = userDataObj.IsTree;

            MemberShipRepository.findGameDealerAgentMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        var _getMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["IsTree"] = userDataObj.IsTree;

            MemberShipRepository.getMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        var _getGameDealerMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["IsTree"] = userDataObj.IsTree;

            MemberShipRepository.getGameDealerMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        var _findLoginHistory = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["CurrentPage"] = userDataObj.CurrentPage;
            ajaxData["PageSize"] = userDataObj.PageSize;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["LoginIP"] = userDataObj.LoginIP;
            ajaxData["LoginTimeS"] = userDataObj.LoginTimeS;
            ajaxData["LoginTimeE"] = userDataObj.LoginTimeE;
            ajaxData["ActionOS"] = userDataObj.ActionOS;
            ajaxData["Platform"] = userDataObj.Platform;

            MemberShipRepository.findLoginHistory(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        var _findMPositionProfitMap = function (dataObj) {
            let deferred = $q.defer();
            let ajaxData = {};

            ajaxData["CurrentPage"] = dataObj.CurrentPage;
            ajaxData["PageSize"] = dataObj.PageSize;
            ajaxData["AgentParentMap"] = dataObj.AgentParentMap;
            ajaxData["MemberID"] = dataObj.MemberID;
            ajaxData["SubMemberID"] = dataObj.SubMemberID;
            ajaxData["CompanyID"] = dataObj.CompanyID;

            ajaxData["ApiPath"] = '/api/MPositionProfit/FindMPositionProfitMap';

            return _callRepository(deferred, ajaxData);
        };

        // 取得登入系統
        var _forgetPwd = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["Email"] = userDataObj.Email;

            MemberShipRepository.forgetPwd(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        var _forgetGameDealerPwd = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["Email"] = userDataObj.Email;

            MemberShipRepository.forgetGameDealerPwd(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        // 取得登入系統
        var _login = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["Pwd"] = userDataObj.Pwd;
            ajaxData["PlateForm"] = userDataObj.PlateForm;
            ajaxData["InputCode"] = userDataObj.InputCode;
            ajaxData["ValidatorCode"] = userDataObj.ValidatorCode;

            MemberShipRepository.login(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        // 取得登入系統
        var _loginGameDealer = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["Pwd"] = userDataObj.Pwd;
            ajaxData["PlateForm"] = userDataObj.PlateForm;
            ajaxData["InputCode"] = userDataObj.InputCode;
            ajaxData["ValidatorCode"] = userDataObj.ValidatorCode;

            MemberShipRepository.loginGameDealer(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        // 登出系統
        var _logout = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["UserName"] = userDataObj.UserName;

            MemberShipRepository.logout(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };


        // 登出系統
        var _logoutGameDealer = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["UserName"] = userDataObj.UserName;

            MemberShipRepository.logoutGameDealer(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        //新增會員
        var _addMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["WalletIsLock"] = userDataObj.WalletIsLock;
            ajaxData["UserType"] = userDataObj.UserType;
            ajaxData["IsMultiLogin"] = userDataObj.IsMultiLogin;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["Pwd"] = userDataObj.Pwd;
            ajaxData["Birthday"] = userDataObj.Birthday;
            ajaxData["MoneyPwd"] = userDataObj.MoneyPwd;
            ajaxData["FullName"] = userDataObj.FullName;
            ajaxData["NickName"] = userDataObj.NickName;
            ajaxData["Status"] = userDataObj.Status;
            ajaxData["Email"] = userDataObj.Email;
            ajaxData["Phone"] = (userDataObj.Phone || '').includes('*') ? '' : userDataObj.Phone; //含*字號代表未修改
            ajaxData["AgentLevelSCID"] = userDataObj.AgentLevelSCID;
            ajaxData["AgentParentID"] = userDataObj.AgentParentID;
            ajaxData["AgentParentMap"] = userDataObj.AgentParentMap;
            ajaxData["ReferralLink"] = userDataObj.ReferralLink;
            ajaxData["ReferralPayType"] = userDataObj.ReferralPayType;
            ajaxData["CashRebatePayType"] = userDataObj.CashRebatePayType;
            ajaxData["CashBackRebatePayType"] = userDataObj.CashBackRebatePayType;
            ajaxData["PlatformSettingIDs"] = userDataObj.PlatformSettingIDs;

            MemberShipRepository.addMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        //新增會員
        var _addGameDealerMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["WalletIsLock"] = userDataObj.WalletIsLock;
            ajaxData["UserType"] = userDataObj.UserType;
            ajaxData["IsMultiLogin"] = userDataObj.IsMultiLogin;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["Pwd"] = userDataObj.Pwd;
            ajaxData["Birthday"] = userDataObj.Birthday;
            ajaxData["MoneyPwd"] = userDataObj.MoneyPwd;
            ajaxData["FullName"] = userDataObj.FullName;
            ajaxData["NickName"] = userDataObj.NickName;
            ajaxData["Status"] = userDataObj.Status;
            ajaxData["Email"] = userDataObj.Email;
            ajaxData["Phone"] = (userDataObj.Phone || '').includes('*') ? '' : userDataObj.Phone; //含*字號代表未修改
            ajaxData["AgentLevelSCID"] = userDataObj.AgentLevelSCID;
            ajaxData["AgentParentID"] = userDataObj.AgentParentID;
            ajaxData["AgentParentMap"] = userDataObj.AgentParentMap;
            ajaxData["ReferralLink"] = userDataObj.ReferralLink;
            ajaxData["ReferralPayType"] = userDataObj.ReferralPayType;
            ajaxData["CashRebatePayType"] = userDataObj.CashRebatePayType;
            ajaxData["CashBackRebatePayType"] = userDataObj.CashBackRebatePayType;
            ajaxData["PlatformSettingIDs"] = userDataObj.PlatformSettingIDs;

            MemberShipRepository.addGameDealerMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };
        
        // 更新
        var _updateMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["MemberID"] = userDataObj.MemberID;
            ajaxData["UserType"] = userDataObj.UserType;
            ajaxData["WalletIsLock"] = userDataObj.WalletIsLock;
            ajaxData["IsMultiLogin"] = userDataObj.IsMultiLogin;
            ajaxData["IsEditPhone"] = userDataObj.IsEditPhone;
            ajaxData["IsEmailValidator"] = userDataObj.IsEmailValidator;
            ajaxData["IsEditEmail"] = userDataObj.IsEditEmail;
            ajaxData["IsLock"] = userDataObj.IsLock;
            ajaxData["IsEnable"] = userDataObj.IsEnable;
            ajaxData["MaxWinAmount"] = userDataObj.MaxWinAmount;
            ajaxData["UserLevelID"] = userDataObj.UserLevelID;
            ajaxData["AgentRebate"] = userDataObj.AgentRebate;
            ajaxData["TotalBalance"] = userDataObj.TotalBalance;
            ajaxData["MonthDeposit"] = userDataObj.MonthDeposit;
            ajaxData["TotalDeposit"] = userDataObj.TotalDeposit;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["Pwd"] = userDataObj.Pwd;
            ajaxData["Birthday"] = userDataObj.Birthday;
            ajaxData["MoneyPwd"] = userDataObj.MoneyPwd;
            ajaxData["FullName"] = userDataObj.FullName;
            ajaxData["NickName"] = userDataObj.NickName;
            ajaxData["Status"] = userDataObj.Status;
            ajaxData["Email"] = userDataObj.Email;
            ajaxData["Phone"] = (userDataObj.Phone || '').includes('*') ? '' : userDataObj.Phone; //含*字號代表未修改
            ajaxData["AgentLevelSCID"] = userDataObj.AgentLevelSCID;
            ajaxData["AgentParentID"] = userDataObj.AgentParentID;
            ajaxData["AgentParentMap"] = userDataObj.AgentParentMap;
            ajaxData["AgentPositionTakingRebate"] = userDataObj.AgentPositionTakingRebate;
            ajaxData["ReferralLink"] = userDataObj.ReferralLink;
            ajaxData["ReferralRebate"] = userDataObj.ReferralRebate;
            ajaxData["ReferralPayType"] = userDataObj.ReferralPayType;
            ajaxData["ReferralLayerID"] = userDataObj.ReferralLayerID;
            ajaxData["ReferralMap"] = userDataObj.ReferralMap;
            ajaxData["ReferralCashRebate"] = userDataObj.ReferralCashRebate;
            ajaxData["CashRebatePayType"] = userDataObj.CashRebatePayType;
            ajaxData["CashBackRebatePayType"] = userDataObj.CashBackRebatePayType;
            ajaxData["PlatformSettingIDs"] = userDataObj.PlatformSettingIDs;

            MemberShipRepository.updateMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };
        
        // 更新
        var _updateGameDealerMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["MemberID"] = userDataObj.MemberID;
            ajaxData["UserType"] = userDataObj.UserType;
            ajaxData["WalletIsLock"] = userDataObj.WalletIsLock;
            ajaxData["IsMultiLogin"] = userDataObj.IsMultiLogin;
            ajaxData["IsEditPhone"] = userDataObj.IsEditPhone;
            ajaxData["IsEmailValidator"] = userDataObj.IsEmailValidator;
            ajaxData["IsEditEmail"] = userDataObj.IsEditEmail;
            ajaxData["IsLock"] = userDataObj.IsLock;
            ajaxData["IsEnable"] = userDataObj.IsEnable;
            ajaxData["MaxWinAmount"] = userDataObj.MaxWinAmount;
            ajaxData["UserLevelID"] = userDataObj.UserLevelID;
            ajaxData["AgentRebate"] = userDataObj.AgentRebate;
            ajaxData["TotalBalance"] = userDataObj.TotalBalance;
            ajaxData["MonthDeposit"] = userDataObj.MonthDeposit;
            ajaxData["TotalDeposit"] = userDataObj.TotalDeposit;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["Pwd"] = userDataObj.Pwd;
            ajaxData["Birthday"] = userDataObj.Birthday;
            ajaxData["MoneyPwd"] = userDataObj.MoneyPwd;
            ajaxData["FullName"] = userDataObj.FullName;
            ajaxData["NickName"] = userDataObj.NickName;
            ajaxData["Status"] = userDataObj.Status;
            ajaxData["Email"] = userDataObj.Email;
            ajaxData["Phone"] = (userDataObj.Phone || '').includes('*') ? '' : userDataObj.Phone; //含*字號代表未修改
            ajaxData["AgentLevelSCID"] = userDataObj.AgentLevelSCID;
            ajaxData["AgentParentID"] = userDataObj.AgentParentID;
            ajaxData["AgentParentMap"] = userDataObj.AgentParentMap;
            ajaxData["AgentPositionTakingRebate"] = userDataObj.AgentPositionTakingRebate;
            ajaxData["ReferralLink"] = userDataObj.ReferralLink;
            ajaxData["ReferralRebate"] = userDataObj.ReferralRebate;
            ajaxData["ReferralPayType"] = userDataObj.ReferralPayType;
            ajaxData["ReferralLayerID"] = userDataObj.ReferralLayerID;
            ajaxData["ReferralMap"] = userDataObj.ReferralMap;
            ajaxData["ReferralCashRebate"] = userDataObj.ReferralCashRebate;
            ajaxData["CashRebatePayType"] = userDataObj.CashRebatePayType;
            ajaxData["CashBackRebatePayType"] = userDataObj.CashBackRebatePayType;
            ajaxData["PlatformSettingIDs"] = userDataObj.PlatformSettingIDs;

            MemberShipRepository.updateGameDealerMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        //刪除會員
        var _delMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["MemberID"] = userDataObj.MemberID;
            MemberShipRepository.delMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        var _checkRegisterData = function (dataObj) {
            let deferred = $q.defer();
            let ajaxData = {};
            ajaxData["UserName"] = dataObj.UserName;
            ajaxData["FullName"] = dataObj.FullName;
            ajaxData["NickName"] = dataObj.NickName;
            ajaxData["Email"] = dataObj.Email;
            ajaxData["Phone"] = dataObj.Phone;
            
            MemberShipRepository.checkRegisterData(ajaxData)
                .then(
                    function success(response, status, headers) {
                        deferred.resolve(response);
                    },
                    function error(data, status, headers) {
                        deferred.reject(data);
                    }
                );
            return deferred.promise;
        };

        var _checkGameDealerRegisterData = function (dataObj) {
            let deferred = $q.defer();
            let ajaxData = {};
            ajaxData["UserName"] = dataObj.UserName;
            ajaxData["FullName"] = dataObj.FullName;
            ajaxData["NickName"] = dataObj.NickName;
            ajaxData["Email"] = dataObj.Email;
            ajaxData["Phone"] = dataObj.Phone;
            
            MemberShipRepository.checkGameDealerRegisterData(ajaxData)
                .then(
                    function success(response, status, headers) {
                        deferred.resolve(response);
                    },
                    function error(data, status, headers) {
                        deferred.reject(data);
                    }
                );
            return deferred.promise;
        };
        
        //更新密碼
        var _changePwdMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["MemberOldPwd"] = userDataObj.MemberOldPwd;
            ajaxData["MemberNewPwd"] = userDataObj.MemberNewPwd;
            MemberShipRepository.changePwdMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        //更新密碼
        var _changeGameDealerPwdMember = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["MemberOldPwd"] = userDataObj.MemberOldPwd;
            ajaxData["MemberNewPwd"] = userDataObj.MemberNewPwd;
            MemberShipRepository.changeGameDealerPwdMember(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        //重置會員密碼
        var _changePwdMemberByBack = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["MemberID"] = userDataObj.MemberID;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["MemberNewPwd"] = userDataObj.MemberNewPwd;
            MemberShipRepository.changePwdMemberByBack(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };

        //重置會員密碼
        var _changeGameDealerPwdMemberByBack = function (userDataObj) {
            var deferred = $q.defer();
            var ajaxData = {};
            ajaxData["MemberID"] = userDataObj.MemberID;
            ajaxData["UserName"] = userDataObj.UserName;
            ajaxData["MemberNewPwd"] = userDataObj.MemberNewPwd;
            MemberShipRepository.changeGameDealerPwdMemberByBack(ajaxData)
                .then(
                    function success(response, status) {
                        deferred.resolve(response);
                    },
                    function error(data, status) {
                        deferred.reject(data);
                    }
                );

            return deferred.promise;
        };
        
        //產生登入驗證碼
        var _genValidatorCode = function () {
            return MemberShipRepository.genValidatorCode();
        };

        factory.checkLoginByBack = _checkLoginByBack;
        factory.findSiteMap = _findSiteMap;
        factory.findUser = _findUser;
        factory.findGameDealerUser = _findGameDealerUser;
        factory.getMember = _getMember;
        factory.getGameDealerMember = _getGameDealerMember;
        factory.findAgentMember = _findAgentMember;
        factory.findGameDealerAgentMember = _findGameDealerAgentMember;
        factory.findLoginHistory = _findLoginHistory;
        factory.findMPositionProfitMap = _findMPositionProfitMap;
        factory.forgetPwd = _forgetPwd;
        factory.forgetGameDealerPwd = _forgetGameDealerPwd;
        factory.login = _login;
        factory.loginGameDealer = _loginGameDealer;
        factory.logout = _logout;
        factory.logoutGameDealer = _logoutGameDealer;
        factory.addMember = _addMember;
        factory.addGameDealerMember = _addGameDealerMember;
        factory.updateMember = _updateMember;
        factory.updateGameDealerMember = _updateGameDealerMember;
        factory.delMember = _delMember;
        factory.checkRegisterData = _checkRegisterData;
        factory.checkGameDealerRegisterData = _checkGameDealerRegisterData;
        factory.changePwdMember = _changePwdMember;
        factory.changeGameDealerPwdMember = _changeGameDealerPwdMember;
        factory.changePwdMemberByBack = _changePwdMemberByBack;
        factory.changeGameDealerPwdMemberByBack = _changeGameDealerPwdMemberByBack;
        factory.genValidatorCode = _genValidatorCode;
        return factory;
    }]);