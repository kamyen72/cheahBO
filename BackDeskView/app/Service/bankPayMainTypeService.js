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

        ajaxData["ApiPath"] = '/api/bankPayMainType/AddbankPayMainType';
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

        ajaxData["ApiPath"] = '/api/bankPayMainType/FindbankPayMainType';
        ajaxData["PMTName"] = dataObj.PMTName;
        ajaxData["PMTCode"] = dataObj.PMTCode;

        return _callRepository(deferred, ajaxData);
    };

    var _delete = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/bankPayMainType/DelbankPayMainType';
        ajaxData["PMTID"] = dataObj.PMTID;

        return _callRepository(deferred, ajaxData);
    };

    var _update = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/bankPayMainType/UpdatebankPayMainType';
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