'use strict';
app.factory('bankPayMainTypeService', ['$q', 'RepositoryHelper', function ($q, Repository) {
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

    var _add = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/BankPayMainType/AddBankPayMainType';
        ajaxData["PMTName"] = dataObj.PMTName;
        ajaxData["PMTCode"] = dataObj.PMTCode;
        ajaxData["PMTMethod"] = dataObj.PMTMethod;
        ajaxData["PMTUrl"] = dataObj.PMTUrl;
        ajaxData["IsClose"] = dataObj.IsClose;
        ajaxData["Status"] = dataObj.Status;

        return _callRepository(deferred, ajaxData);
    };

    var _find = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/BankPayMainType/FindBankPayMainType';
        ajaxData["PMTName"] = dataObj.PMTName;
        ajaxData["PMTCode"] = dataObj.PMTCode;
        ajaxData["PMTMethod"] = dataObj.PMTMethod;

        return _callRepository(deferred, ajaxData);
    };

    var _delete = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/BankPayMainType/DelBankPayMainType';
        ajaxData["PMTID"] = dataObj.PMTID;

        return _callRepository(deferred, ajaxData);
    };

    var _update = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/BankPayMainType/UpdateBankPayMainType';
        ajaxData["PMTID"] = dataObj.PMTID;
        ajaxData["PMTName"] = dataObj.PMTName;
        ajaxData["PMTCode"] = dataObj.PMTCode;
        ajaxData["PMTMethod"] = dataObj.PMTMethod;
        ajaxData["PMTUrl"] = dataObj.PMTUrl;
        ajaxData["IsClose"] = dataObj.IsClose;
        ajaxData["Status"] = dataObj.Status;

        return _callRepository(deferred, ajaxData);
    };

    factory.add = _add;
    factory.find = _find;
    factory.update = _update;
    factory.delete = _delete;
    return factory;
}]);