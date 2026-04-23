Page({
  data: {
    upcomingList: [],
    endedList: []
  },

  onLoad() {
    this.loadScheduleData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  onPullDownRefresh() {
    this.loadScheduleData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return {
      title: '水韵名邸便民安排',
      path: '/pages/schedule/schedule'
    };
  },

  loadScheduleData() {
    const schedules = [
      {
        id: 1,
        title: '社区义诊活动',
        date: '2025-04-26',
        time: '09:00-11:00',
        location: '中心花园',
        description: '邀请社区医院医生为业主免费测量血压、血糖，提供健康咨询。',
        status: 'upcoming',
        type: '健康'
      },
      {
        id: 2,
        title: '垃圾分类宣讲',
        date: '2025-04-26',
        time: '14:00-15:30',
        location: '物业会议室',
        description: '普及垃圾分类知识，现场演示正确分类方法，参与可领取环保袋。',
        status: 'upcoming',
        type: '环保'
      },
      {
        id: 3,
        title: '儿童绘画比赛',
        date: '2025-05-01',
        time: '10:00-12:00',
        location: '儿童游乐区',
        description: '以"我心中的家"为主题，现场提供画纸和彩笔，适合3-12岁儿童。',
        status: 'upcoming',
        type: '亲子'
      },
      {
        id: 4,
        title: '春季消防安全演练',
        date: '2025-04-20',
        time: '10:00-11:00',
        location: '小区广场',
        description: '消防器材使用演示、逃生疏散演练，欢迎业主积极参与。',
        status: 'ended',
        type: '安全'
      },
      {
        id: 5,
        title: '业主棋牌友谊赛',
        date: '2025-04-15',
        time: '14:00-17:00',
        location: '老年活动中心',
        description: '象棋、围棋、掼蛋三项比赛，设一二三等奖，奖品丰厚。',
        status: 'ended',
        type: '文体'
      }
    ];
    const upcoming = schedules.filter(s => s.status === 'upcoming');
    const ended = schedules.filter(s => s.status === 'ended');
    this.setData({ upcomingList: upcoming, endedList: ended });
  },

  onScheduleTap(e) {
    const { item } = e.currentTarget.dataset;
    wx.showModal({
      title: item.title,
      content: `${item.date} ${item.time}\n${item.location}\n\n${item.description}`,
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
