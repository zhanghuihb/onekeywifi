const app = getApp()

Page({
  data: {
    layerModel: false, // 打开GPS定位提示框控制
    wifiList:[{
      wifiName: "jinghan",
      wifiPwd: "Jinghanit123"
    },{
      wifiName: "ChinaNet-NTET",
      wifiPwd: "jvctv4sq"
    }],
    onWifiConnectedList: [],
  },
  onLoad: function () {
    this.getLocationFun();
  },

  // 获取地址
  getLocationFun() {
    let _self = this;
    wx.getLocation({
        type: 'gcj02',
        success: function (res) {
            wx.setStorageSync('latitude', res.latitude);
            wx.setStorageSync('longitude', res.longitude);
        },
        fail: function () {
            _self.openConfirm()
        }
    });
},

// 用户首次进入拒绝授权地理位置，刷新后可再此弹出授权框
openConfirm: function () {
    let _self = this;
    wx.showModal({
        content: '您的位置信息将用于更稳定、更快捷的连接WIFI',
        confirmText: "去授权",
        showCancel: false,
        success: function (res) {
            if (res.confirm) {
                wx.openSetting({
                    success: (res) => {
                        if (res.authSetting['scope.userLocation']) {
                            _self.getLocationFun();
                        }
                    }
                })
            } else {
                console.log('用户点击取消');
            }
        }
    });
},

  /**
   * 一键链接WIFI
   */
  oneKeyConnectWifi:function(e) {
    let chooseWifi = e.currentTarget.dataset.item;
    wx.startWifi({
      success: (res) => {
        wx.connectWifi({
          SSID: chooseWifi.wifiName,
          password: chooseWifi.wifiPwd,
          maunal:false,
          complete: function(res){
            console.log("---res--", res)
            wx.getConnectedWifi({
              complete: function (res2) {
                console.log("---res2--", res2)
                let onWifiConnectedList = [];
                if(res2.wifi){
                    if(res2.wifi.SSID){
                      if(res2.wifi.SSID === chooseWifi.wifiName){
                        wx.showToast({ title: '连接成功',icon:'none',duration: 2000})
                      } else {
                        wx.showToast({ title: 'WIFI切换失败',icon:'none',duration: 2000})
                      }
                      return;
                    }
                }
                wx.onWifiConnected((res3) => {
                  console.log("--res3---", res3)
                  if(res3.wifi){
                    onWifiConnectedList.push(res3.wifi)
                  }
                })
                
                console.log("----onWifiConnectedList-----", onWifiConnectedList)
                if(onWifiConnectedList && onWifiConnectedList > 0){
                  for(var wifi in onWifiConnectedList){
                      if(wifi.SSID){
                        if(wifi.SSID === chooseWifi.wifiName){
                          wx.showToast({ title: '连接成功',icon:'none',duration: 2000})
                        } else {
                          wx.showToast({ title: 'WIFI切换失败',icon:'none',duration: 2000})
                        }
                        return;
                      }
                  }
                }
                if(res.errCode == 12001){
                  wx.showToast({ title: '当前系统不支持相关能力',icon:'none',duration: 2000})
                }else if(res.errCode == 12002){
                  wx.showToast({ title: '密码错误',icon:'none',duration: 2000});
                }else if(res.errCode == 12003){
                  wx.showToast({ title: '连接超时',icon:'none',duration: 2000});
                }else if(res.errCode == 12004){
                  wx.showToast({ title: '重复连接 Wi-Fi',icon:'none',duration: 2000})
                }else  if(res.errCode == 12005){
                  wx.showToast({ title: '未打开 Wi-Fi 开关',icon:'none',duration: 2000})
                }else if(res.errCode == 12006){
                  wx.showToast({ title: '未打开 GPS 定位开关',icon:'none',duration: 2000})
                }else if(res.errCode == 12007){
                  wx.showToast({ title: '用户拒绝授权链接 Wi-Fi',icon:'none',duration: 2000})
                }else if(res.errCode == 12008){
                  wx.showToast({ title: '无效 SSID',icon:'none',duration: 2000})
                }else if(res.errCode == 12009){
                  wx.showToast({ title: '系统运营商配置拒绝连接 Wi-Fi',icon:'none',duration: 2000})
                }else if(res.errCode == 12010){
                  wx.showToast({ title: 'wifi连接失败',icon:'none',duration: 2000});
                }else if(res.errCode == 12011){
                  wx.showToast({ title: '应用在后台无法配置 Wi-Fi',icon:'none',duration: 2000})
                }else if(res.errCode == 12013){
                  wx.showToast({ title: '系统保存的 Wi-Fi 配置过期，建议忘记 Wi-Fi 后重试',icon:'none',duration: 2000})
                }else{
                  wx.showToast({ title: 'wifi连接失败',icon:'none',duration: 2000});
                }
              }
            })
          }
        })
      },fail:function(res){
        console.log(res,"------fail------")
      }
    })
  }
})
