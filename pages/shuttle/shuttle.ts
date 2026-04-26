import * as api from '../../services/api';
import type { ShuttleTime } from '../../types/data';

interface IShuttleData {
  routeName: string;
  runNote: string;
  schedule: ShuttleTime[];
  stops: string[];
  contactPhone: string;
}

Page<IShuttleData, WechatMiniprogram.IAnyObject>({
  data: {
    routeName: '',
    runNote: '',
    schedule: [],
    stops: [],
    contactPhone: '',
  },

  async onLoad() {
    try {
      const [routeName, runNote, schedule, stops, contactPhone] = await Promise.all([
        api.getShuttleRouteName(),
        api.getShuttleRunNote(),
        api.getShuttleSchedule(),
        api.getShuttleStops(),
        api.getShuttleContactPhone(),
      ]);
      this.setData({ routeName, runNote, schedule, stops, contactPhone });
      this.updateScheduleStatus();
    } catch (err) {
      console.error('onLoad failed', err);
    }
  },

  onShow() {
    this.updateScheduleStatus();
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸班车信息',
      path: '/pages/shuttle/shuttle',
    };
  },

  updateScheduleStatus() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const updated = this.data.schedule.map((item: ShuttleTime) => {
      const [h, m] = item.time.split(':').map(Number);
      const itemTime = h * 60 + m;
      return {
        ...item,
        status: itemTime < currentTime ? 'passed' : (itemTime - currentTime <= 30 ? 'soon' : 'upcoming'),
      } as ShuttleTime;
    });

    this.setData({ schedule: updated });
  },

  onCallTap() {
    wx.makePhoneCall({
      phoneNumber: this.data.contactPhone,
      fail: () => {
        wx.showToast({ title: '拨打电话失败', icon: 'none' });
      },
    });
  },
});
