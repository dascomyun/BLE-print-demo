var plugin = requirePlugin("myPlugin")
Page({
  data: {
    inputText: '欢迎使用 得实DP系列 打印机',
    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true
  },
  bindInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
    console.log(e.detail.value)
  },

  //点击“发送”按钮，把输入框中的内容打印出来
  Send: function () {
    var that = this
    if (that.data.connected) {
      var strP = "^XA^LL406^FO10,10^A0,24,24^FD" + that.data.inputText + "^FS^XZ";
      plugin.getBinaryArrayData(strP, function resultCallBack(resBinary) {
        console.log(resBinary)
        plugin.sendToPrint(resBinary,
          function (res) {
            console.log(res)
          }
        )
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  //发送数据给蓝牙打印机，参数vardata为预发送的数据（字节形式），可为任意长度
  SendSampleContinue: function (remainData) {
    var that = this
    if (remainData.length > 20) {
      var buffer = new ArrayBuffer(20);
      var dataView = new Uint8Array(buffer);
      for (var i = 0; i < 20; i++) {
        dataView[i] = remainData[i];
      }
      var a = remainData.slice(20);
      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[0].uuid,
        characteristicId: that.data.characteristics[1].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送成功，继续发送')
          that.SendSampleContinue(a);
        },
        fail: function (res) {
          // fail
          console.log('发送失败' + res)
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '数据发送失败，请重试',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }
      })
    } else {
      var buffer = new ArrayBuffer(remainData.length);
      var dataView = new Uint8Array(buffer);
      for (var i = 0; i < remainData.length; i++) {
        dataView[i] = remainData[i];
      }

      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[0].uuid,
        characteristicId: that.data.characteristics[1].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送成功，开始打印')
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '发送成功，开始打印',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        },
        fail: function (res) {
          // fail
          console.log('发送失败' + res)
          console.dir(res)
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '数据发送失败，请重试',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }
      })
    }
  },
  //点击“打印小票”按钮，打印一个固定内容的小票
  SendSample: function () {

    var that = this
    if (that.data.connected) {

      var a = new Array(94, 88, 65, 126, 83, 68, 50, 48, 94, 76, 76, 54, 48, 57, 94, 70, 79, 49, 51, 48, 44, 49, 48, 94, 65, 48, 78, 44, 51, 48, 44, 51, 48, 94, 70, 68, 181, 195, 202, 181, 180, 242, 211, 161, 187, 250, 178, 226, 202, 212, 209, 249, 213, 197, 94, 70, 83, 94, 70, 79, 49, 53, 48, 44, 53, 48, 94, 65, 48, 78, 44, 50, 52, 44, 50, 52, 94, 70, 68, 181, 195, 202, 181, 179, 208, 197, 181, 163, 172, 210, 187, 186, 244, 176, 217, 211, 166, 163, 161, 94, 70, 83, 94, 70, 79, 57, 48, 44, 57, 48, 94, 65, 48, 78, 44, 50, 52, 44, 50, 52, 94, 70, 68, 184, 252, 182, 224, 207, 234, 199, 233, 199, 235, 183, 195, 206, 202, 181, 195, 202, 181, 188, 175, 205, 197, 185, 217, 183, 189, 205, 248, 213, 190, 163, 186, 94, 70, 83, 94, 70, 79, 57, 48, 44, 49, 51, 48, 94, 65, 48, 78, 44, 50, 54, 44, 50, 54, 94, 70, 68, 104, 116, 116, 112, 58, 47, 47, 119, 119, 119, 46, 100, 97, 115, 99, 111, 109, 46, 99, 111, 109, 46, 99, 110, 47, 94, 70, 83, 94, 70, 79, 49, 53, 48, 44, 49, 56, 48, 94, 66, 81, 78, 44, 50, 44, 54, 94, 70, 68, 104, 116, 116, 112, 58, 47, 47, 119, 119, 119, 46, 100, 97, 115, 99, 111, 109, 46, 99, 111, 109, 46, 99, 110, 47, 181, 195, 202, 181, 179, 208, 197, 181, 163, 172, 210, 187, 186, 244, 176, 217, 211, 166, 163, 161, 94, 70, 83, 94, 88, 90)
      //that.SendSampleContinue(a);
      plugin.sendToPrint(a, function success(res) {
        console.log(res)
      });
    }
    else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this
    console.log("加载打印页面")
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId
    })

    plugin.realtimeConnectStatusChange(function (res) {
      console.log(res)
      that.setData({
        connected: res
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    console.log("go into onHide")
  },
  //断开蓝牙的连接
  onUnload: function () {
    console.log("onUnLoad and closeBLEConnection")
    var that = this;
    wx.closeBLEConnection({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log(res)
        console.log("onUnload" + that.data.connectedDeviceId)
        that.setData({
          connectedDeviceId: ""
        })
      },
      fail: function (res) {
        console.log("failed")
        console.log(res)
      }
    })
  }
})