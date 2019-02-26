var plugin = requirePlugin("myPlugin")
var devicesList;
Page({
  data: {
    searching: false,
    devicesList: []
  },
  onLoad: function () {
    plugin.initPrintBle()
  },
  //点击“搜索蓝牙打印机”的按钮
  Search: function () {
    var that = this;
    that.setData({
      devicesList: ""
    })

    wx.closeBluetoothAdapter({
      complete: function (res) {
        console.log(res)
        // 初始化蓝牙模块
        wx.openBluetoothAdapter({
          success: function (res) {
            console.log('==============================')
            console.log(res)
            console.log('==============================')
            //获取本机蓝牙适配器状态。
            wx.getBluetoothAdapterState({
              success: function (res) {
                console.log(res)
                wx.showLoading({
                  title: '搜索中',
                })
                plugin.Search("", function success(res, res2) {
                  wx.hideLoading()
                  that.setData({
                    devicesList: res
                  })
                  devicesList = res.slice(0);
                  if (devicesList.length == 0) {
                    wx.showModal({
                      showCancel: false,
                      title: '提示',
                      content: '没有搜索到，请重试',
                    });
                  }
                }, 4);
              }
            })
          },
          fail: function (res) {
            console.log(res)
            wx.showModal({
              title: '提示',
              content: '请检查手机蓝牙是否打开',
              showCancel: false,
              success: function (res) {
                that.setData({
                  searching: false
                })
              }
            })
          }
        })
      }
    })

  },
  //点击搜索到的打印机，开始连接
  Connect: function (e) {
    wx.showLoading({
      title: '正在连接...',
    })
    var name;
    console.log("%%%%%%%%%%" + devicesList.length)
    for (var i = 0; i < devicesList.length; i++) {
      console.log("$$$$$$$$$" + devicesList[i].deviceId);
      if (e.currentTarget.id == devicesList[i].deviceId) {
        console.log("&&&&&&&&&&&&&" + devicesList[i].name)
        name = devicesList[i].name
        break;
      }
    }
    plugin.Connect(name,
      e.currentTarget.id,
      function success(res) {
        wx.hideLoading()

        if (res.Code == 0) {
          wx.navigateTo({
            url: '../device/device?connectedDeviceId=' + e.currentTarget.id + '&name=' + name
          })
        } else {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '连接失败:' + res.errMsg,
          });
        }
      })
  }
})