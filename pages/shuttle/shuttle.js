Page({
  data: {
    routeName: '社区 ⇋ 淞虹路地铁站',
    activeDirection: 'go',
    directions: [
      { id: 'go', name: '去程' },
      { id: 'back', name: '返程' }
    ],
    goSchedule: [
      { time: '07:00', status: 'passed' },
      { time: '07:30', status: 'passed' },
      { time: '08:00', status: 'upcoming' },
      { time: '08:30', status: 'upcoming' },
      { time: '09:00', status: 'upcoming' },
      { time: '17:30', status: 'upcoming' },
      { time: '18:00', status: 'upcoming' },
      { time: '18:30', status: 'upcoming' },
      { time: '19:00', status: 'upcoming' }
    ],
    backSchedule: [
      { time: '07:20', status: 'passed' },
      { time: '07:50', status: 'passed' },
      { time: '08:20', status: 'upcoming' },
      { time: '08:50', status: 'upcoming' },
      { time: '09:20', status: 'upcoming' },
      { time: '17:50', status: 'upcoming' },
      { time: '18:20', status: 'upcoming' },
      { time: '18:50', status: 'upcoming' },
      { time: '19:20', status: 'upcoming' }
    ],
    stops: {
      go: ['东门', '西门', '金钟路福泉路', '淞虹路地铁站'],
      back: ['淞虹路地铁站', '金钟路福泉路', '西门', '东门']
    },
    contactPhone: '021-12345678'
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

    const updateList = (list) => {
      return list.map(item => {
        const [h, m] = item.time.split(':').map(Number);
        const itemTime = h * 60 + m;
        return {
          ...item,
          status: itemTime < currentTime ? 'passed' : (itemTime - currentTime <= 30 ? 'soon' : 'upcoming')
        };
      });
    };

    this.setData({
      goSchedule: updateList(this.data.goSchedule),
      backSchedule: updateList(this.data.backSchedule)
    });
  },

  onDirectionTap(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ activeDirection: id });
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
