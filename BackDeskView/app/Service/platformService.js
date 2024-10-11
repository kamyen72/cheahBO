'use strict';
app.factory('platformService', ['$q', 'RepositoryHelper', function ($q, Repository) {
    var factory = {};

    var _callRepository = function (deferred, ajaxData) {
        Repository.post(ajaxData).then(
            function success(response, status, headers) {
                deferred.resolve(response);
            }, function error(data, status, headers) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

    var _find = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/PlatformSetting/FindPlatformSetting';
        ajaxData["PlatformName"] = dataObj.PlatformName;
        ajaxData["TypeCode"] = dataObj.TypeCode;
        ajaxData["CurrentPage"] = dataObj.CurrentPage;
        ajaxData["PageSize"] = dataObj.PageSize;
        // API
        ajaxData["CompanyName"] = dataObj.CompanyName;
        ajaxData["APICode"] = dataObj.APICode;
        // ajaxData["APID"] = dataObj.APID;

        return _callRepository(deferred, ajaxData);
    };

    var _add = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/PlatformSetting/AddPlatformSetting';
        ajaxData["TypeCode"] = dataObj.TypeCode;
        ajaxData["PlatformName"] = dataObj.PlatformName;
        ajaxData["URL"] = dataObj.URL;
        ajaxData["ShortName"] = dataObj.ShortName;
        // API
        ajaxData["CompanyName"] = dataObj.CompanyName;
        ajaxData["APICode"] = dataObj.APICode;
        ajaxData["CompanyDNS"] = dataObj.CompanyDNS;
        ajaxData["APID"] = dataObj.APID;
        ajaxData["PlayTokenStatus"] = dataObj.PlayTokenStatus;
        ajaxData["IsTest"] = dataObj.IsTest;  

        return _callRepository(deferred, ajaxData);
    };

    var _update = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        //ShortName 不能改
        ajaxData["ApiPath"] = '/api/PlatformSetting/UpdatePlatformSetting';
        ajaxData["ID"] = dataObj.ID;
        ajaxData["TypeCode"] = dataObj.TypeCode;
        ajaxData["PlatformName"] = dataObj.PlatformName;
        ajaxData["URL"] = dataObj.URL;
        // API
        ajaxData["CompanyName"] = dataObj.CompanyName;
        ajaxData["APICode"] = dataObj.APICode;
        ajaxData["CompanyDNS"] = dataObj.CompanyDNS;
        ajaxData["APID"] = dataObj.APID;
        ajaxData["PlayTokenStatus"] = dataObj.PlayTokenStatus;
        ajaxData["IsTest"] = dataObj.IsTest;  
        ajaxData["IsMaintain"] = dataObj.IsMaintain;  

        return _callRepository(deferred, ajaxData);
    };

    var _addGameDealerCB = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/GameDealerCB/AddGameDealerCB';
        ajaxData["GameDealerCBs"] = dataObj.GameDealerCBs;

        return _callRepository(deferred, ajaxData);
    };

    var _updateGameDealerCB = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/GameDealerCB/UpdateGameDealerCB';
        ajaxData["GameDealerCBs"] = dataObj.GameDealerCBs;

        return _callRepository(deferred, ajaxData);
    };

    factory.add = _add;
    factory.find = _find;
    factory.update = _update;
    factory.addGameDealerCB = _addGameDealerCB;
    factory.updateGameDealerCB = _updateGameDealerCB;
    return factory;
}]);