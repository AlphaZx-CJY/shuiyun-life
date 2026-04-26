import * as api from '../../services/api';
import type { ScheduleItem } from '../../types/data';

interface IScheduleData {
  upcomingList: ScheduleItem[];
  endedList: ScheduleItem[];
}

Page<IScheduleData, WechatMiniprogram.IAnyObject>({
  data: {
    upcomingList: [],
    endedList: [],
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

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸便民安排',
      path: '/pages/schedule/schedule',
    };
  },

  async loadScheduleData() {
    const schedules = await api.getSchedules();
    const upcoming = schedules.filter(s => s.status === 'upcoming');
    const ended = schedules.filter(s => s.status === 'ended');
    this.setData({ upcomingList: upcoming, endedList: ended });
  },

  onScheduleTap(e: WechatMiniprogram.TouchEvent) {
    const { item } = e.currentTarget.dataset as { item: ScheduleItem };
    wx.showModal({
      title: item.title,
      content: `${item.date} ${item.time}\n${item.location}\n\n${item.description}`,
      showCancel: false,
      confirmText: '知道了',
    });
  },
});
