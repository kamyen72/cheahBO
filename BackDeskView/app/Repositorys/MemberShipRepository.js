'use strict';
app.factory('MemberShipRepository', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {
    var factory = {};

    function checkResposeLogin(resCode) {
        if (resCode === '200') {
            $location.path('login');
        }
    }

    var _checkLoginByBack = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/Login';
        ajaxData["ApiPath"] = '/api/MemberShip/CheckLoginByBack';

        //return $http.post(ngAuthSettings.apiServiceBaseUri, ajaxData).then(
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _findSiteMap = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/Login';
        ajaxData["ApiPath"] = '/api/MemberShip/FindSiteMap';

        //return $http.post(ngAuthSettings.apiServiceBaseUri, ajaxData).then(
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                checkResposeLogin(response.data.APIRes.ResCode);
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _findUser = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/Login';
        ajaxData["ApiPath"] = '/api/MemberShip/FindMember';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                checkResposeLogin(response.data.APIRes.ResCode);
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _findGameDealerUser = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/FindMember';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                checkResposeLogin(response.data.APIRes.ResCode);
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };
    
    var _findAgentMember = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/FindAgentMember';
        ajaxData["ApiPath"] = '/api/MemberShip/FindAgentMember';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                checkResposeLogin(response.data.APIRes.ResCode);
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };
    
    var _findGameDealerAgentMember = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/FindAgentMember';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                checkResposeLogin(response.data.APIRes.ResCode);
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _getMember = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/MemberShip/GetMember';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                checkResposeLogin(response.data.APIRes.ResCode);
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _getGameDealerMember = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/GetMember';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                checkResposeLogin(response.data.APIRes.ResCode);
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _findLoginHistory = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/findLoginHistory';
        ajaxData["ApiPath"] = '/api/MemberShip/findLoginHistory';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                checkResposeLogin(response.data.APIRes.ResCode);
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _forgetPwd = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/Login';
        ajaxData["ApiPath"] = '/api/MemberShip/ForgetPwd';
        //return $http.post(ngAuthSettings.apiServiceBaseUri, ajaxData).then(
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _forgetGameDealerPwd = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/ForgetPwd';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _login = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/Login';
        ajaxData["ApiPath"] = '/api/MemberShip/Login';
        //return $http.post(ngAuthSettings.apiServiceBaseUri, ajaxData).then(
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _loginGameDealer = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/Login';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _logout = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/Logout';
        ajaxData["ApiPath"] = '/api/MemberShip/Logout';

        //return $http.post(ngAuthSettings.apiServiceBaseUri, ajaxData).then(
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _logoutGameDealer = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/Logout';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _addMember = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/MemberShip/AddMember';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _addGameDealerMember = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/AddMember';
        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };
    
    var _updateMember = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/MemberShip/UpdateMember';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };
    
    var _updateGameDealerMember = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/UpdateMember';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _delMember = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/Login';
        ajaxData["ApiPath"] = '/api/MemberShip/DelMember';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };
    
    var _checkRegisterData = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/MemberShip/CheckRegisterData';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };
    
    var _checkGameDealerRegisterData = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/CheckRegisterData';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _changePwdMember = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/ChangePwdMember';
        ajaxData["ApiPath"] = '/api/MemberShip/ChangePwdMember';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _changeGameDealerPwdMember = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/ChangePwdMember';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _changePwdMemberByBack = function (ajaxData) {
        //ajaxData["ApiPath"] = '/proxy/api/MemberShip/ChangePwdMemberByBack';
        ajaxData["ApiPath"] = '/api/MemberShip/ChangePwdMemberByBack';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };

    var _changeGameDealerPwdMemberByBack = function (ajaxData) {
        ajaxData["ApiPath"] = '/api/GameDealerMemberShip/ChangePwdMemberByBack';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };
    
    var _genValidatorCode = function () {
        var ajaxData = {};
        ajaxData["ApiPath"] = '/api/MemberShip/GenValidatorCode';

        return $http.post(ngAuthSettings.apiServiceBaseUri + ajaxData["ApiPath"], ajaxData).then(
            function success(response, status) {
                return response;
            },
            function error(data, status) {
                return data;
            }
        );
    };    

    factory.checkLoginByBack = _checkLoginByBack;
    factory.findSiteMap = _findSiteMap;
    factory.findUser = _findUser; 
    factory.findGameDealerUser = _findGameDealerUser;
    factory.findAgentMember = _findAgentMember;
    factory.findGameDealerAgentMember = _findGameDealerAgentMember;
    factory.getMember = _getMember; 
    factory.getGameDealerMember = _getGameDealerMember; 
    factory.findLoginHistory = _findLoginHistory;
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