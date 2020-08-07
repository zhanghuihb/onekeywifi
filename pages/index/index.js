const app = getApp()

Page({
  data: {
    wifiList:[{
      wifiName: "jinghan",
      wifiPwd: "Jinghanit123"
    }]
  },
  onLoad: function () {
  },

  /**
   * 一键链接WIFI
   */
  oneKeyConnectWifi:function(e) {
      wx.startWifi({
        success: (res) => {
          wx.connectWifi({
            SSID: this.data.wifiList[0].wifiName,
            password: this.data.wifiList[0].wifiPwd,
            maunal:false,
            complete: function(res){
              console.log("------connectWifi-------",res);
              wx.getConnectedWifi({
                complete: function (result) {
                  console.log("------getConnectedWifi-------",result);
                  if(res.errCode == 0){
                    console.log('链接成功')
                  }else {
                    if(res.errCode == 12000){
                      console.log('未先调用 startWifi 接口')
                    }else if(res.errCode == 12001){
                      wx.showToast({ title: '当前系统不支持相关能力',icon:'none',duration: 2000})
                    }else if(res.errCode == 12002){
                      wx.showToast({ title: '密码错误',icon:'none',duration: 2000});
                    }else if(res.errCode == 12003){
                      wx.showToast({ title: '连接超时',icon:'none',duration: 2000});
                    }else if(res.errCode == 12004){
                      wx.showToast({ title: '重复连接 Wi-Fi',icon:'none',duration: 2000})
                    }else  if(res.errCode == 12005){
                      wx.showToast({ title: '请检查设备是否已开启WLAN网络',icon:'none',duration: 2000})
                    }else if(res.errCode == 12006){
                      that.triggerEvent("openGPSView");
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
                  wx.onWifiConnected((result) => {
                    console.log("------onWifiConnected-------",result);
                    
                  })
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
