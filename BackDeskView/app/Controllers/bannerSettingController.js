'use strict';
app.controller('bannerSettingController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'authService',
    'bannerSettingService',
    function ($scope, $rootScope, $location, $timeout, localStorageService, blockUI, ngAuthSettings, authService,
        bannerSettingService) {
        blockUI.start();
        $scope.imageModel = [];

        function f_showModel(obj) {
            angular.extend(ngAuthSettings.modalMsg, obj);
            $rootScope.$broadcast('changeModalMsg', false);
        }

        function f_dataInit(obj) {
            obj.DateS = null;
            obj.DateE = null;
            obj.BannerNotice = null;
            //obj.BannerImg = null;
            //obj.FileName = null;
            //obj.FileExtension = null;
            obj.IsEnable = true;
        }

        $scope.dataSource = {
            pageStatus: 'searchView',
            searchCondition: {
                CurrentPage: 1,
                PageSize: 10
            },
            required: ["DateS", "DateE", "BannerNotice"],
            listData: [],
            PostData: {},
            // bannerUrl: serviceBase + '/Fileupload/UploadDocuments/',
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
            $scope.search();
        };

        $timeout($scope.init, 100);

        $scope.search = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize;

            bannerSettingService.find($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.listData = response.data.Rows.ListData;

                            for (var i = 0; i < $scope.dataSource.listData.length; i++) {
                                // 20210705 更新update file位置
                                $scope.dataSource.listData[i].ImgUrl = $scope.dataSource.listData[i].FileName; // $scope.dataSource.bannerUrl + $scope.dataSource.listData[i].FileName;
                                //$scope.dataSource.listData.Img = `data:image/${$scope.dataSource.listData[i].FileExtension};base64,${$scope.dataSource.listData[i].Img}`;
                                //if (_banner.filter(p => p.type === $scope.dataSource.listData[i].FamilyBigID).length > 0) {
                                //    if ($scope.dataSource.listData[i].FamilyMiddleID.toUpperCase() === 'BACK') {
                                //        _banner.filter(p => p.type === $scope.dataSource.listData[i].FamilyBigID)[0].backImg = `data:image/${$scope.dataSource.listData[i].FileExtension};base64,${$scope.dataSource.listData[i].Img}`;
                                //        _banner.filter(p => p.type === $scope.dataSource.listData[i].FamilyBigID)[0].backImgUrl = $scope.dataSource.bannerUrl + $scope.dataSource.listData[i].FileName;
                                //    } else {
                                //        _banner.filter(p => p.type === $scope.dataSource.listData[i].FamilyBigID)[0].frontImg = `data:image/${$scope.dataSource.listData[i].FileExtension};base64,${$scope.dataSource.listData[i].Img}`;
                                //        _banner.filter(p => p.type === $scope.dataSource.listData[i].FamilyBigID)[0].frontImgUrl = $scope.dataSource.bannerUrl + $scope.dataSource.listData[i].FileName;
                                //    }
                                //} 
                            }

                            //頁籤
                            $scope.dataSource.PagerObj.length = 0;
                            $scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                            $scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                            $scope.dataSource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                            $scope.dataSource.PagerObj["PageArray"] = [];
                        } else {
                            f_showModel({
                                title: "Message",
                                msg: response.data.APIRes.ResMessage,
                                type: response.data.APIRes.ResCode
                            });
                        }
                        blockUI.stop();
                    },
                    function error(data, status, headers, config) {
                        blockUI.stop();
                    });
        };

        function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }


        $scope.add = function (form) {
            if ($scope.imageModel.length) {
                $scope.dataSource.PostData["BannerImg"] = $scope.imageModel[0]["file"];
                $scope.dataSource.PostData["FileName"] = $scope.imageModel[0]["name"];
                $scope.dataSource.PostData["FileExtension"] = $scope.imageModel[0]["extension"];
            } else {
                $scope.dataSource.PostData["BannerImg"] = "";
                $scope.dataSource.PostData["FileName"] = "";
                $scope.dataSource.PostData["FileExtension"] = "";
            }

            if ($rootScope.valid(form)) return;

            bannerSettingService.add($scope.dataSource.PostData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode,
                            callBack: 'showSearch'
                        });
                    }
                    else {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode,
                            callBack: ''
                        });
                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                    }
                });
        };

        $scope.update = function (form) {
            if ($scope.imageModel.length) {
                $scope.dataSource.PostData.OrigFileName = $scope.dataSource.PostData.FileName;
                $scope.dataSource.PostData.BannerImg = $scope.imageModel[0]["file"];
                $scope.dataSource.PostData.FileName = $scope.imageModel[0]["name"];
                $scope.dataSource.PostData.FileExtension = $scope.imageModel[0]["extension"];
            } else {
                $scope.dataSource.PostData.BannerImg = form.Img;
                $scope.dataSource.PostData.FileName = form.FileName;
                $scope.dataSource.PostData.FileExtension = form.FileExtension;
            }

            if (form) if ($rootScope.valid(form)) return;

            bannerSettingService.update($scope.dataSource.PostData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode,
                            callBack: 'showSearch'
                        });
                    }
                    else {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode,
                            callBack: ''
                        });
                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                    }
                });
        };


        $scope.delete = function (data) {
            //if (!confirm('Confirm刪除?')) return;
            $scope.dataSource.PostData = data;
            ngAuthSettings.modalMsg.title = 'Confirm';
            ngAuthSettings.modalMsg.msg = 'ConfirmDelete';
            ngAuthSettings.modalMsg.type = '000';
            ngAuthSettings.modalMsg.callBack = 'confirmDel';
            $rootScope.$broadcast('changeModalMsg', true);
        };

        $scope.$on('confirmDel', function (event) {
            bannerSettingService.del($scope.dataSource.PostData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode,
                            callBack: 'showSearch'
                        });

                        $scope.search();
                    }
                    else {
                        f_showModel({
                            title: "Message",
                            msg: response.data.APIRes.ResMessage,
                            type: response.data.APIRes.ResCode,
                            callBack: ''
                        });
                        $scope.dataSource.errorMsg = response.data.APIRes.ResMessage;
                    }
                });
        });

        $scope.changeAndSave = function (data) {
            data.DateS = new Date(data.DateS);
            data.DateE = new Date(data.DateE);
            $scope.dataSource.PostData = data;
            $scope.update(data);
        };

        $scope.clear = function () {
            f_dataInit($scope.dataSource.searchCondition);
        };

        $scope.showAdd = function () {
            $scope.dataSource.pageStatus = 'addView';
            $scope.dataSource.PostData = {};
            $scope.dataSource.PostData.IsEnable = true;
            $scope.imageModel = [];
        };

        $scope.showEdit = function (data) {
            data.DateS = new Date(data.DateS);
            data.DateE = new Date(data.DateE);
            data.BannerImg = data.Img;
            $scope.dataSource.pageStatus = 'editView';
            $scope.dataSource.PostData = data;
            $scope.imageModel = [];

            //if (data.Img) {
            //    $scope.imageModel.push({
            //        file: data.Img,
            //        extension: data.FileExtension,
            //        name: data.FileName
            //    });
            //}

            if (data.ImgUrl) {
                $scope.imageModel.push({
                    //file: data.ImgUrl,
                    url: data.ImgUrl,
                    extension: data.FileExtension,
                    name: data.FileName
                });
            }
        };

        $scope.showSearch = function () {
            $scope.imageModel = [];
            $scope.dataSource.pageStatus = 'searchView';
            $scope.search();
        };

        $scope.$on('showSearch', $scope.showSearch);


        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

    }]);