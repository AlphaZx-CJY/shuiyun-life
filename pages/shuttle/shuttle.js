Page({
  data: {
    routeName: '小区 → 赵巷地铁站一号口',
    runNote: '工作日及节假日均运行',
    schedule: [
      { time: '06:30', status: 'upcoming' },
      { time: '07:20', status: 'upcoming' },
      { time: '08:10', status: 'upcoming' },
      { time: '09:00', status: 'upcoming' },
      { time: '16:30', status: 'upcoming' },
      { time: '17:20', status: 'upcoming' },
      { time: '18:10', status: 'upcoming' },
      { time: '19:00', status: 'upcoming' }
    ],
    stops: ['小区（起点）', '赵巷地铁站一号口（终点）'],
    contactPhone: '15001713063'
  },

  onLoad() {
    this.updateScheduleStatus();
  },

  onShow() {
    this.updateScheduleStatus();
  },

  onShareAppMessage() {
    return {
      title: '水韵名邸班车信息',
      path: '/pages/shuttle/shuttle'
    };
  },

  updateScheduleStatus() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const updated = this.data.schedule.map(item => {
      const [h, m] = item.time.split(':').map(Number);
      const itemTime = h * 60 + m;
      return {
        ...item,
        status: itemTime < currentTime ? 'passed' : (itemTime - currentTime <= 30 ? 'soon' : 'upcoming')
      };
    });

    this.setData({ schedule: updated });
  },

  onCallTap() {
    wx.makePhoneCall({
      phoneNumber: this.data.contactPhone,
      fail: () => {
        wx.showToast({ title: '拨打电话失败', icon: 'none' });
      }
    });
  }
});
