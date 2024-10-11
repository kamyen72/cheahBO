'use strict';
app.factory('lotteryService', ['$q', 'RepositoryHelper', function ($q, RepositoryHelper) {
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

    var _addLotteryClass = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/Lottery/AddLotteryClass';
        ajaxData["LotteryClassName"] = dataObj.LotteryClassName;
        ajaxData["Notice"] = dataObj.Notice;
        ajaxData["GameRoomID"] = dataObj.GameRoomID;
        ajaxData["LotteryClass_TableID"] = dataObj.LotteryClass_TableID;
        ajaxData["Status"] = dataObj.Status;

        return _callRepository(deferred, ajaxData);
    };

    var _findLotteryClass = function (dataObj) {
        var deferred = $q.defer();

        var ajaxData = {};
        ajaxData["ApiPath"] = '/api/Lottery/FindLotteryClass';
        ajaxData["CurrentPage"] = dataObj.CurrentPage;
        ajaxData["PageSize"] = dataObj.PageSize;
        ajaxData["DateS"] = getDateS(dataObj.DateS);
        ajaxData["DateE"] = getDateE(dataObj.DateE);
        ajaxData["LotteryClassName"] = dataObj.LotteryClassName;
        ajaxData["GameRoomID"] = dataObj.GameRoomID;
        ajaxData["LotteryClass_TableID"] = dataObj.LotteryClass_TableID;
        ajaxData["Status"] = dataObj.Status;

        return _callRepository(deferred, ajaxData);
    };

    var _delLotteryClass = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/Lottery/DelLotteryClass';
        ajaxData["LotteryClassID"] = dataObj.LotteryClassID;

        return _callRepository(deferred, ajaxData);
    };

    var _updateLotteryClass = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/Lottery/UpdateLotteryClass';
        ajaxData["LotteryClassID"] = dataObj.LotteryClassID;
        ajaxData["LotteryClassName"] = dataObj.LotteryClassName;
        ajaxData["Notice"] = dataObj.Notice;
        ajaxData["GameRoomID"] = dataObj.GameRoomID;
        ajaxData["LotteryClass_TableID"] = dataObj.LotteryClass_TableID;
        ajaxData["Status"] = dataObj.Status;
        ajaxData["IsMaintain"] = dataObj.IsMaintain;

        return _callRepository(deferred, ajaxData);
    };

    var _addLotteryType = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/Lottery/AddLotteryType';
        ajaxData["LotteryTypeName"] = dataObj.LotteryTypeName;
        ajaxData["LotteryTypeCode"] = dataObj.LotteryTypeCode;
        ajaxData["LotteryClassID"] = dataObj.LotteryClassID;
        ajaxData["PeriodInterval"] = dataObj.PeriodInterval;
        ajaxData["MaxBonusMoneyPool"] = dataObj.MaxBonusMoneyPool;
        ajaxData["DrawBonusPercentage"] = dataObj.DrawBonusPercentage;
        ajaxData["IsEnableAI"] = dataObj.IsEnableAI;
        ajaxData["AIType"] = dataObj.AIType;
        ajaxData["CompanyWinPercentage"] = dataObj.CompanyWinPercentage; 
        ajaxData["UserWinPercentage"] = dataObj.UserWinPercentage;
        ajaxData["CompanyPresetCompensation"] = dataObj.CompanyPresetCompensation;
        ajaxData["Status"] = dataObj.Status;
        ajaxData["LotteryType_TableID"] = dataObj.LotteryType_TableID;

        return _callRepository(deferred, ajaxData);
    };

    var _findLotteryType = function (dataObj) {
        var deferred = $q.defer();

        var ajaxData = {};
        ajaxData["ApiPath"] = '/api/Lottery/FindLotteryType';
        ajaxData["CurrentPage"] = dataObj.CurrentPage;
        ajaxData["PageSize"] = dataObj.PageSize;
        ajaxData["DateS"] = getDateS(dataObj.DateS);
        ajaxData["DateE"] = getDateE(dataObj.DateE);
        ajaxData["LotteryTypeName"] = dataObj.LotteryTypeName;
        ajaxData["LotteryTypeCode"] = dataObj.LotteryTypeCode;
        ajaxData["LotteryClassID"] = dataObj.LotteryClassID;
        ajaxData["IsOfficial"] = dataObj.IsOfficial;
        ajaxData["Status"] = dataObj.Status;
        ajaxData["LotteryType_TableID"] = dataObj.LotteryType_TableID;

        return _callRepository(deferred, ajaxData);
    };

    var _delLotteryType = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/Lottery/DelLotteryType';
        ajaxData["LotteryTypeID"] = dataObj.LotteryTypeID;

        return _callRepository(deferred, ajaxData);
    };

    var _updateLotteryType = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/Lottery/UpdateLotteryType';
        ajaxData["LotteryTypeID"] = dataObj.LotteryTypeID;
        ajaxData["LotteryTypeName"] = dataObj.LotteryTypeName;
        ajaxData["LotteryTypeCode"] = dataObj.LotteryTypeCode;
        ajaxData["LotteryClassID"] = dataObj.LotteryClassID;
        ajaxData["PeriodInterval"] = dataObj.PeriodInterval;
        ajaxData["MaxBonusMoneyPool"] = dataObj.MaxBonusMoneyPool;
        ajaxData["DrawBonusPercentage"] = dataObj.DrawBonusPercentage;
        ajaxData["IsEnableAI"] = dataObj.IsEnableAI;
        ajaxData["AIType"] = dataObj.AIType;
        ajaxData["CompanyWinPercentage"] = dataObj.CompanyWinPercentage;
        ajaxData["UserWinPercentage"] = dataObj.UserWinPercentage; 
        ajaxData["CompanyPresetCompensation"] = dataObj.CompanyPresetCompensation;
        ajaxData["Status"] = dataObj.Status;
        ajaxData["IsCloseGame"] = dataObj.IsCloseGame;
        ajaxData["IsMaintain"] = dataObj.IsMaintain;
        ajaxData["LotteryType_TableID"] = dataObj.LotteryType_TableID; 
        ajaxData["LimitMapData"] = dataObj.LimitMapData; 

        return _callRepository(deferred, ajaxData);
    };

    var _addLotteryInfo = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/Lottery/AddLotteryInfo';
        ajaxData["LotteryInfoName"] = dataObj.LotteryInfoName;
        ajaxData["LotteryInfoNotice"] = dataObj.LotteryInfoNotice;
        ajaxData["LotteryClassID"] = dataObj.LotteryClassID;
        ajaxData["LotteryTypeID"] = dataObj.LotteryTypeID;
        ajaxData["Status"] = dataObj.Status;
        ajaxData["LotteryInfo_TableID"] = dataObj.LotteryInfo_TableID;
        ajaxData["MinBet"] = dataObj.MinBet;
        ajaxData["MaxBet"] = dataObj.MaxBet;
        ajaxData["DisCount"] = dataObj.DisCount;
        ajaxData["SelectArray"] = dataObj.SelectArray;

        return _callRepository(deferred, ajaxData);
    };

    var _findLotteryInfo = function (dataObj) {
        var deferred = $q.defer();

        var ajaxData = {};
        ajaxData["ApiPath"] = '/api/Lottery/FindLotteryInfo';
        ajaxData["CurrentPage"] = dataObj.CurrentPage;
        ajaxData["PageSize"] = dataObj.PageSize;
        ajaxData["DateS"] = getDateS(dataObj.DateS);
        ajaxData["DateE"] = getDateE(dataObj.DateE);
        ajaxData["LotteryInfoName"] = dataObj.LotteryInfoName;
        ajaxData["LotteryInfoCode"] = dataObj.LotteryInfoCode;
        ajaxData["LotteryTypeID"] = dataObj.LotteryTypeID;
        ajaxData["LotteryClassID"] = dataObj.LotteryClassID;
        ajaxData["Status"] = dataObj.Status;
        ajaxData["LotteryInfo_TableID"] = dataObj.LotteryInfo_TableID;

        return _callRepository(deferred, ajaxData);
    };

    var _delLotteryInfo = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/Lottery/DelLotteryInfo';
        ajaxData["LotteryInfoID"] = dataObj.LotteryInfoID;

        return _callRepository(deferred, ajaxData);
    };

    var _updateLotteryInfo = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/Lottery/UpdateLotteryInfo';
        ajaxData["LotteryInfoID"] = dataObj.LotteryInfoID;
        ajaxData["LotteryInfoName"] = dataObj.LotteryInfoName;
        ajaxData["LotteryInfoNotice"] = dataObj.LotteryInfoNotice;
        ajaxData["LotteryClassID"] = dataObj.LotteryClassID;
        ajaxData["LotteryTypeID"] = dataObj.LotteryTypeID;
        ajaxData["Status"] = dataObj.Status;
        ajaxData["LotteryInfo_TableID"] = dataObj.LotteryInfo_TableID; 
        ajaxData["MinBet"] = dataObj.MinBet;
        ajaxData["MaxBet"] = dataObj.MaxBet;
        ajaxData["DisCount"] = dataObj.DisCount;
        ajaxData["SelectArray"] = dataObj.SelectArray;
        ajaxData["LimitMapData"] = dataObj.LimitMapData; 

        return _callRepository(deferred, ajaxData);
    }; 

    var _manualOpenLottery = function (dataObj) {
        var deferred = $q.defer();
        var ajaxData = {};

        ajaxData["ApiPath"] = '/api/OLottery/ManualOpenLottery';
        ajaxData["InputResult"] = dataObj.InputResult;
        ajaxData["CurrentPeriod"] = dataObj.CurrentPeriod;
        ajaxData["LotteryTypeID"] = dataObj.LotteryTypeID; 
        ajaxData["GamePwd"] = dataObj.GamePwd;

        return _callRepository(deferred, ajaxData);
    };

    var _findVwMPlayer = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["CurrentPage"] = dataObj.CurrentPage;
        ajaxData["PageSize"] = dataObj.PageSize;
        ajaxData["StatusCode"] = dataObj.StatusCode;
        ajaxData["DateS"] = getDateS(dataObj.DateS);
        ajaxData["DateE"] = getDateE(dataObj.DateE);
        ajaxData["MemberID"] = dataObj.MemberID;
        ajaxData["ByReport"] = dataObj.ByReport; 
        ajaxData["ByGameDealer"] = dataObj.ByGameDealer;
        ajaxData["LotteryInfoID"] = dataObj.LotteryInfoID;
        ajaxData["LotteryTypeIDs"] = dataObj.LotteryTypeIDs;

        if (dataObj.MemberID > 0) {
            ajaxData["ApiPath"] = '/api/MPlayer/FindVwMPlayerByBack';
        } else {
            ajaxData["ApiPath"] = '/api/MPlayer/FindVwMPlayer';
        }

        return _callRepository(deferred, ajaxData, config);
    };

    var _findVwMPlayerByBack = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["CurrentPage"] = dataObj.CurrentPage;
        ajaxData["PageSize"] = dataObj.PageSize;
        ajaxData["StatusCode"] = dataObj.StatusCode;
        ajaxData["DateS"] = getDateS(dataObj.DateS);
        ajaxData["DateE"] = getDateE(dataObj.DateE);
        ajaxData["MemberID"] = dataObj.MemberID;
        ajaxData["LotteryInfoID"] = dataObj.LotteryInfoID;
        ajaxData["LotteryTypeIDs"] = dataObj.LotteryTypeIDs;
        ajaxData["SelectNums"] = dataObj.SelectNums;
        ajaxData["StatusCode"] = dataObj.StatusCode;
        ajaxData["ByGameDealer"] = dataObj.ByGameDealer;
        ajaxData["ByReport"] = dataObj.ByReport;
        ajaxData["ApiPath"] = '/api/MPlayer/FindVwMPlayerByBack';

        return _callRepository(deferred, ajaxData, config);
    };

    var _findVwGameDealerMPlayerByBack = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["CurrentPage"] = dataObj.CurrentPage;
        ajaxData["PageSize"] = dataObj.PageSize;
        ajaxData["StatusCode"] = dataObj.StatusCode;
        ajaxData["DateS"] = getDateS(dataObj.DateS);
        ajaxData["DateE"] = getDateE(dataObj.DateE);
        ajaxData["MemberID"] = dataObj.GameDealerMemberID;
        ajaxData["LotteryInfoID"] = dataObj.LotteryInfoID;
        ajaxData["LotteryTypeIDs"] = dataObj.LotteryTypeIDs;
        ajaxData["ApiPath"] = '/api/GameDealerMPlayer/FindVwMPlayerByBack';

        return _callRepository(deferred, ajaxData, config);
    };

    var _findVwMPlayerReport = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["CurrentPage"] = dataObj.CurrentPage;
        ajaxData["PageSize"] = dataObj.PageSize;
        ajaxData["StatusCode"] = dataObj.StatusCode;
        ajaxData["DateS"] = getDateS(dataObj.DateS);
        ajaxData["DateE"] = getDateE(dataObj.DateE); 
        ajaxData["UserName"] = dataObj.UserName;
        ajaxData["LotteryInfoIDs"] = dataObj.LotteryInfoIDs;
        ajaxData["SelectNums"] = dataObj.SelectNums; 
        ajaxData["Type"] = dataObj.Type;
        ajaxData["ApiPath"] = '/api/MPlayer/FindVwMPlayerReport';

        return _callRepository(deferred, ajaxData, config);
    };

    var _addOLottery = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["LotteryTypeID"] = dataObj.LotteryTypeID;
        ajaxData["CurrentPeriod"] = dataObj.CurrentPeriod;
        ajaxData["CurrentLotteryTime"] = dataObj.CurrentLotteryTime;
        ajaxData["CloseTime"] = dataObj.CloseTime;
        ajaxData["ApiPath"] = '/api/OLottery/AddOLottery';

        return _callRepository(deferred, ajaxData, config);
    };

    var _findLotteryTypeByOfficial = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["PageSize"] = dataObj.PageSize;
        ajaxData["StatusCode"] = dataObj.StatusCode;
        ajaxData["DateS"] = getDateS(dataObj.DateS);
        ajaxData["DateE"] = getDateE(dataObj.DateE);
        ajaxData["LotteryTypeID"] = dataObj.LotteryTypeID;
        ajaxData["LotteryTypeIDs"] = dataObj.LotteryTypeIDs;
        ajaxData["IsOpen"] = dataObj.IsOpen;
        ajaxData["ApiPath"] = '/api/OLottery/FindLotteryTypeByOfficial';

        return _callRepository(deferred, ajaxData, config);
    };

    var _manualResetOLottery = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["LotteryTypeID"] = dataObj.LotteryTypeID;
        ajaxData["CurrentPeriod"] = dataObj.CurrentPeriod;
        ajaxData["NewResult"] = dataObj.NewResult;
        ajaxData["ApiPath"] = '/api/OLottery/ManualResetOLottery';

        return _callRepository(deferred, ajaxData, config);
    };


    var _deleteOLottery = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["ID"] = dataObj.ID;
        ajaxData["OriLotteryTypeID"] = dataObj.OriLotteryTypeID;
        ajaxData["OriCurrentPeriod"] = dataObj.OriCurrentPeriod;
        ajaxData["ApiPath"] = '/api/OLottery/DeleteManualOLottery';

        return _callRepository(deferred, ajaxData, config);
    };
    
    var _updateOLottery = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["ID"] = dataObj.ID;
        ajaxData["OriLotteryTypeID"] = dataObj.OriLotteryTypeID;
        ajaxData["OriCurrentPeriod"] = dataObj.OriCurrentPeriod;
        ajaxData["LotteryTypeID"] = dataObj.LotteryTypeID;
        ajaxData["CurrentPeriod"] = dataObj.CurrentPeriod;
        ajaxData["CurrentLotteryTime"] = dataObj.CurrentLotteryTime;
        ajaxData["CloseTime"] = dataObj.CloseTime;
        ajaxData["ApiPath"] = '/api/OLottery/UpdateManualOLottery';

        return _callRepository(deferred, ajaxData, config);
    };

    var _findOLottery = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["DateS"] = getDateS(dataObj.DateS);
        ajaxData["DateE"] = getDateE(dataObj.DateE);
        ajaxData["ApiPath"] = '/api/OLottery/FindOLottery';

        return _callRepository(deferred, ajaxData, config);
    };

    var _checkGamePwd = function (dataObj, config) {
        let deferred = $q.defer();
        let ajaxData = {};

        ajaxData["CheckGamePwd"] = dataObj.GamePwd;
        ajaxData["ApiPath"] = '/api/OLottery/CheckGamePwd';

        return _callRepository(deferred, ajaxData, config);
    };

    factory.addLotteryClass = _addLotteryClass;
    factory.findLotteryClass = _findLotteryClass;
    factory.updateLotteryClass = _updateLotteryClass;
    factory.delLotteryClass = _delLotteryClass;

    factory.addLotteryType = _addLotteryType;
    factory.findLotteryType = _findLotteryType;
    factory.updateLotteryType = _updateLotteryType;
    factory.delLotteryType = _delLotteryType;

    factory.addLotteryInfo = _addLotteryInfo;
    factory.findLotteryInfo = _findLotteryInfo;
    factory.updateLotteryInfo = _updateLotteryInfo;
    factory.delLotteryInfo = _delLotteryInfo;

    factory.findVwMPlayer = _findVwMPlayer; 
    factory.findVwMPlayerByBack = _findVwMPlayerByBack;
    factory.findVwGameDealerMPlayerByBack = _findVwGameDealerMPlayerByBack;
    factory.findVwMPlayerReport = _findVwMPlayerReport;

    factory.manualOpenLottery = _manualOpenLottery;
    factory.addOLottery = _addOLottery;
    factory.deleteOLottery = _deleteOLottery;
    factory.updateOLottery = _updateOLottery;
    factory.findLotteryTypeByOfficial = _findLotteryTypeByOfficial;
    factory.manualResetOLottery = _manualResetOLottery;
    factory.findOLottery = _findOLottery;
    factory.checkGamePwd = _checkGamePwd;
    return factory;
}]);