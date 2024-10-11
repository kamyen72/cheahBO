'use strict';
app.controller('instantTransactionController', [
    '$scope',
    '$rootScope',
    '$location',
    '$timeout',
    '$q',
    'localStorageService',
    'blockUI',
    'ngAuthSettings',
    'depositService',
    'withDrawalService',
    'cBankService',
    'acceptedBankService',
    'systemConfigService',
    function ($scope, $rootScope, $location, $timeout, $q, localStorageService, blockUI, ngAuthSettings,
        depositService, withDrawalService, cBankService, acceptedBankService, systemConfigService) {

        $scope.dataSource = {
            pageStatus: 'transaction',
            searchCondition: { CurrentPage: 1, PageSize: 10, DCType: 3 },
            memberInfo: {},
            listData: [],
            listDeposit: [],
            listWithdrawal: [],
            depositTypeList: [],
            memberList: [],
            depositList: [],
            selectFileList: [],
            selCBanks: [],
            transaction: {},
            selTransaction: {},
            transactionRemark: '',
            isReject: false,
            modalMsg: {},
            listCount: 0,
            oldListCount: 0,
            // imgUrl: serviceBase + '/Fileupload/UploadDocuments/',
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
            }
        };

        blockUI.start();

        //有新進交易聲音
        var audio = new Audio('./content/mp3/dingdong.mp3');
        var intervalId = 0;

        $scope.init = function () {
            $scope.dataSource.memberInfo = $rootScope.memberInfo;
            //$scope.search();
            $scope.getSystemConfig();
            $scope.getCBank();
            $scope.searchFile();
            $scope.searchDepositHasNoFile();

            //$scope.dataSource.listData.push({ CreateDate: new Date(), ID: 1, UserName: '123' });

            intervalId = setInterval($scope.search, 30000);
        };

        $timeout($scope.init, 100);

        $scope.changePage = function (page) {
            $scope.dataSource.pageStatus = page;
        };

        $scope.search = function () {
            $scope.dataSource.listCount = 0;

            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj.PageSize / 2;
            $scope.dataSource.searchCondition.DepositTypeSCID = $scope.dataSource.depositTypeList.filter(p => p.ConfigValues === '3')[0].ID;
            //$scope.dataSource.searchCondition.WithDrawalTypeSCID = $scope.dataSource.withdrawalTypeList.filter(p => p.ConfigValues === '3')[0].ID;
            $scope.dataSource.searchCondition.IsProcessing = true;

            //$scope.dataSource.listData = [];

            var deposit = depositService.find($scope.dataSource.searchCondition).then(
                function success(response, status, headers, config) {
                    console.log(response.data.Rows);
                    //alert(JSON.stringify(response.data.Rows.ListData));
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.listCount += response.data.Rows.ListData.length;
                        $scope.dataSource.listDeposit = response.data.Rows.ListData;
                        $scope.dataSource.listDeposit.forEach(p => p.Type = 1);
                        //頁籤
                        $scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                        $scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                        $scope.dataSource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                        $scope.dataSource.PagerObj["PageArray"] = [];
                    } else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        $rootScope.$broadcast('changeModalMsg');
                    }
                },
                function error(data, status, headers, config) {
                });

            var withdrawal = withDrawalService.find($scope.dataSource.searchCondition).then(
                function success(response, status, headers, config) {
                    //alert(JSON.stringify(response.data.Rows.ListData));
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.listCount += response.data.Rows.ListData.length;
                        $scope.dataSource.listWithdrawal = response.data.Rows.ListData;
                        $scope.dataSource.listWithdrawal.forEach(p => p.Type = 2);
                        //頁籤
                        $scope.dataSource.PagerObj = response.data.Rows.PagerObj;
                        $scope.dataSource.PagerObj["thisPage"] = $scope.dataSource.PagerObj.CurrentPage;
                        $scope.dataSource.PagerObj["thisPageSize"] = $scope.dataSource.PagerObj.PageSize;
                        $scope.dataSource.PagerObj["PageArray"] = [];
                    } else {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                    }
                },
                function error(data, status, headers, config) {
                });

            Promise.all([deposit, withdrawal])
                .then(() => {
                    blockUI.stop();
                    $scope.dataSource.listData = [];

                    //有新進交易聲音
                    if ($scope.dataSource.listCount > $scope.dataSource.oldListCount) {
                        $scope.dataSource.oldListCount = $scope.dataSource.listCount;
                        audio.play();
                    }

                    if ($scope.dataSource.searchCondition.DCType === 1) {
                        $scope.dataSource.listDeposit.forEach(p => { $scope.dataSource.listData.push(p); });
                    } else if ($scope.dataSource.searchCondition.DCType === 2) {
                        $scope.dataSource.listWithdrawal.forEach(p => { $scope.dataSource.listData.push(p); });
                    } else {
                        $scope.dataSource.listDeposit.forEach(p => { $scope.dataSource.listData.push(p); });
                        $scope.dataSource.listWithdrawal.forEach(p => { $scope.dataSource.listData.push(p); });
                    }

                    $scope.dataSource.listData.forEach(item => {
                        let { LoginIP } = item;
                        item.UserIP = '';
                        if (LoginIP) {
                            let ipList = LoginIP.split(',');
                            item.UserIP = (ipList[0] || '').replace('UserIP:', '');
                        }
                    });

                    $scope.dataSource.listData.sort(function (a, b) { return new Date(b.CreateDate) - new Date(a.CreateDate); });
                });
        };

        $scope.sort = function (sort) {
            $scope.dataSource.searchCondition.Sort = sort;
            $scope.dataSource.listData.reverse();
        };

        $scope.getSystemConfig = function () {
            var callStatus = true;
            var dropdown1 = systemConfigService.findSystemConfigChildren({ ListConfigName: ['DepositType'] })
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.depositTypeList = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            callStatus = false;
                        }
                    },
                    function error(data, status, headers) {
                        callStatus = false;
                    });
            var dropdown2 = systemConfigService.findSystemConfigChildren({ ListConfigName: ['WithDrawalType'] })
                .then(
                    function success(response, status, headers) {
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.withdrawalTypeList = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                            callStatus = false;
                        }
                    },
                    function error(data, status, headers) {
                        callStatus = false;
                    });

            Promise.all([dropdown1, dropdown2])
                .then(() => {
                    if (callStatus) $scope.dateSearch(0, 0);
                    else $rootScope.$broadcast('changeModalMsg');
                });
        };

        $scope.getCBank = function () {
            cBankService.find({ CurrentPage: 1, PageSize: 1000 })
                .then(
                    function success(response, status, headers) {
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.selCBanks = response.data.Rows.ListData;
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            $rootScope.$broadcast('changeModalMsg');
                        }
                    },
                    function error(data, status, headers) {
                        blockUI.stop();
                    });
        };

        $scope.updateTransaction = function (transaction, confirmType, doUpdate) {
            if (transaction.ID === 0) {
                ngAuthSettings.modalMsg.title = "Message";
                ngAuthSettings.modalMsg.msg = `This is bonus, please confirm receipt : ${transaction.Remark}.`;

                $rootScope.$broadcast('changeModalMsg');
                return;
            }

            $.extend($scope.dataSource.selTransaction, transaction);
            
            if ($scope.dataSource.selTransaction.Type === 1) {
                if (confirmType === 1) {
                    $scope.dataSource.modalMsg.title = 'InstantTransaction_ConfirmDeposit';
                    $scope.dataSource.isReject = false;
                } else {
                    $scope.dataSource.modalMsg.title = 'InstantTransaction_RejectDeposit';
                    $scope.dataSource.isReject = true;
                }

                $scope.dataSource.selTransaction.DepositTypeSCID = $scope.dataSource.depositTypeList.filter(p => p.ConfigValues === confirmType.toString())[0].ID;
                $('#ShowDialog').click();
                //$scope.confirmUpdateDeposit(transaction);
            } else {
                $scope.dataSource.selTransaction.WithDrawalTypeSCID = $scope.dataSource.withdrawalTypeList.filter(p => p.ConfigValues === confirmType.toString())[0].ID;

                //Confirm & Double Confirm
                if (confirmType === 1) {
                    $scope.dataSource.modalMsg.title = 'InstantTransaction_ConfirmWithdrawal';
                    $scope.dataSource.isReject = false;

                    if (doUpdate) {
                        if (confirm('Confirm withdrawal?')) {
                            $scope.confirmUpdateTransaction($scope.dataSource.selTransaction);
                            $('#CloseDetailDialog').click();
                        }
                    }
                    else {
                        $scope.showDetail($scope.dataSource.selTransaction);
                    }
                } else if (confirmType === 4) {
                    if (confirm('Confirm withdrawal?')) {
                        $scope.showDetail($scope.dataSource.selTransaction);
                        if (confirmType === 4 && doUpdate) {
                            $scope.confirmUpdateTransaction($scope.dataSource.selTransaction);
                        }
                    }
                } else {
                    $scope.dataSource.modalMsg.title = 'InstantTransaction_RejectWithdrawal';
                    $scope.dataSource.isReject = true;
                    $('#ShowDialog').click();
                }
                //$scope.confirmUpdateWithdrawal(transaction);
            }

        };

        $scope.confirmUpdateTransaction = function (transaction) {

            if ($scope.dataSource.isReject && !$scope.dataSource.transactionRemark) {
                ngAuthSettings.modalMsg.title = "Message";
                ngAuthSettings.modalMsg.msg = "PleaseEnterRejectReason";

                $rootScope.$broadcast('changeModalMsg');
                return;
            }

            transaction.Remark = $scope.dataSource.transactionRemark;
            
            if (transaction.Type === 1) {
                depositService.update(transaction).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            var model = $scope.dataSource.listData.find(p=>p.ID === transaction.ID && p.Type === transaction.Type);
                            if (model) {
                                var idx = $scope.dataSource.listData.indexOf(model);
                                if (idx > -1) {
                                    $scope.dataSource.listData.splice(idx, 1);

                                    clearInterval(intervalId);
                                    intervalId = setInterval($scope.search, 30000);
                                }
                            }
                            //$scope.search();

                            //$rootScope.$broadcast('changeModalMsg');
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
            } else {
                withDrawalService.update(transaction).then(
                    function success(response) {
                        if (response.data.APIRes.ResCode === '000') {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;

                            if ($scope.dataSource.selTransaction.WithDrawalTypeSCID !== 37) {
                                //$rootScope.$broadcast('changeModalMsg');

                                var model = $scope.dataSource.listData.find(p => p.ID === transaction.ID && p.Type === transaction.Type);
                                if (model) {
                                    var idx = $scope.dataSource.listData.indexOf(model);
                                    if (idx > -1) {
                                        $scope.dataSource.listData.splice(idx, 1);

                                        clearInterval(intervalId);
                                        intervalId = setInterval($scope.search, 30000);
                                    }
                                }
                            }

                            //$scope.search();
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
            }
        };

        $scope.showFile = function (transaction) {
            $scope.dataSource.modalMsg.title = 'InstantTransaction_UploadFile';
            $scope.dataSource.selTransaction = transaction;

            // 20210705 更新update file位置
            $scope.dataSource.selTransaction.DepositFiles.forEach(p => {
                p.ImgUrl =  p.Img; // $scope.dataSource.imgUrl + p.FileName;
            });
            $('#ShowFileDialog').click();
        };

        $scope.showDetail = function (transaction) {
            $scope.dataSource.modalMsg.title = 'InstantTransaction_ShowDetail';
            $scope.dataSource.selTransaction = transaction;

            if (!$scope.dataSource.selTransaction.CBank) {
                $scope.dataSource.selTransaction.CBankID = $scope.dataSource.selCBanks[0].ID;
            }
            $('#ShowDetailDialog').click();
        };

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

        $scope.searchDepositHasNoFile = function () {
            depositService.findDepositHasFile({ HasFile: false }).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        $scope.dataSource.depositList = response.data.Rows.ListData;

                        $scope.dataSource.memberList.push({ MemberID: -1, UserName: 'Please Choose' });
                        $scope.dataSource.depositList.forEach(p => {
                            if ($scope.dataSource.memberList.filter(m => m.MemberID === p.MemberID).length > 0) return;

                            $scope.dataSource.memberList.push(p);
                        });
                        console.log($scope.dataSource.memberList);
                    }
                    else {
                        ngAuthSettings.modalMsg.title = "FindLotteryClass";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                    }
                },
                function error(response) {
                    console.log(response);
                });
        };

        $scope.bindDepoist = function () {
            var msg = '';
            if ($scope.dataSource.bindDeposit.ID === 'Please Choose') {
                msg += 'Please Choose Dposit <br>';
            }
            if ($scope.dataSource.selectFileList.length === 0) {
                msg += 'Please Choose Files';
            }
            if (msg) {
                ngAuthSettings.modalMsg.title = "Message";
                ngAuthSettings.modalMsg.msg = msg;
                $rootScope.$broadcast('changeModalMsg');
                return;
            }

            var postData = {};
            postData.ID = $scope.dataSource.bindDeposit.ID;
            postData.DepositFileIDs = $scope.dataSource.selectFileList;

            depositService.update(postData).then(
                function success(response) {
                    if (response.data.APIRes.ResCode === '000') {
                        ngAuthSettings.modalMsg.title = "Message";
                        ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                        ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        ngAuthSettings.modalMsg.callBack = 'showSearch';
                        $rootScope.$broadcast('changeModalMsg');

                        $scope.searchFile();
                        $scope.searchDepositHasNoFile();
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

        $scope.selectBind = function (file) {
            if (file.check) {
                $scope.dataSource.selectFileList.push(file.ID);
            } else {
                $scope.dataSource.selectFileList = $scope.dataSource.selectFileList.filter(p => p !== file.ID);
            }
        };

        $scope.changeBindAccount = function (member) {
            if (member === -1) {
                $scope.dataSource.memberDepositList = [];
                $scope.dataSource.bindDeposit = {};
                return;
            }
            $scope.dataSource.memberDepositList = $scope.dataSource.depositList.filter(p => p.MemberID === member);
            $scope.dataSource.memberDepositList.unshift({ ID: 'Please Choose' });
            $scope.dataSource.bindDeposit = $scope.dataSource.memberDepositList[0];
        };

        $scope.searchFile = function () {
            $scope.dataSource.searchCondition.CurrentPage = $scope.dataSource.PagerObj2.CurrentPage;
            $scope.dataSource.searchCondition.PageSize = $scope.dataSource.PagerObj2.PageSize;

            depositService.findDepositFile($scope.dataSource.searchCondition)
                .then(
                    function success(response, status, headers, config) {
                        console.log(response.data.Rows);
                        //alert(JSON.stringify(response.data.Rows.ListData));
                        if (response.data.APIRes.ResCode === '000') {
                            $scope.dataSource.fileListData = response.data.Rows.ListData;
                            //頁籤
                            $scope.dataSource.PagerObj2 = response.data.Rows.PagerObj;
                            $scope.dataSource.PagerObj2["thisPage"] = $scope.dataSource.PagerObj2.CurrentPage;
                            $scope.dataSource.PagerObj2["thisPageSize"] = $scope.dataSource.PagerObj2.PageSize;
                            $scope.dataSource.PagerObj2["PageArray"] = [];
                        } else {
                            ngAuthSettings.modalMsg.title = "Message";
                            ngAuthSettings.modalMsg.msg = response.data.APIRes.ResMessage;
                            ngAuthSettings.modalMsg.type = response.data.APIRes.ResCode;
                        }
                    },
                    function error(data, status, headers, config) {
                    });
        };

        $scope.showFullScreen = function (file) {
            //var src = 'data:image/' + file.FileExtension + ';base64,' + file.Img;
            var src = file.ImgUrl;
            var modal;
            function removeModal() { modal.remove(); $('body').off('keyup.modal-close'); }

            modal = $('<div>').css({
                background: 'RGBA(0,0,0,.5) url(' + src + ') no-repeat center',
                backgroundSize: 'contain',
                width: '100%', height: '100%',
                position: 'fixed',
                zIndex: '999999',
                top: '0', left: '0',
                cursor: 'zoom-out'
            }).click(function () {
                removeModal();
            }).appendTo('body');

            //handling ESC
            $('body').on('keyup.modal-close', function (e) {
                if (e.key === 'Escape') { removeModal(); }
            });
        };

        //換頁
        $scope.PageChanged = function (page) {
            $scope.dataSource.PagerObj.CurrentPage = page;
            $scope.search();
        };

        $scope.$on("$destroy", function () {
            clearInterval(intervalId);
        });

    }]);