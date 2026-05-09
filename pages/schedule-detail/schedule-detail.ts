import * as api from '../../services/api';
import type { ScheduleItem } from '../../types/data';

interface IScheduleDetailData {
  schedule: ScheduleItem | null;
  statusLabel: string;
  statusClass: string;
}

Page<IScheduleDetailData, WechatMiniprogram.IAnyObject>({
  data: {
    schedule: null,
    statusLabel: '',
    statusClass: '',
  },

  async onLoad(options) {
    const id = options?.id;
    if (!id) {
      wx.showToast({ title: '活动信息缺失', icon: 'none' });
      return;
    }
    await this.loadDetail(id);
  },

  async loadDetail(id: string | number) {
    try {
      const schedules = await api.getSchedules();
      const item = schedules.find((s) => String(s.id) === String(id));
      if (!item) {
        wx.showToast({ title: '活动不存在', icon: 'none' });
        return;
      }
      const now = new Date();
      const itemDateTime = new Date(`${item.date}T${item.time}`);
      const isEnded = itemDateTime < now;
      this.setData({
        schedule: item,
        statusLabel: isEnded ? '已结束' : '即将开始',
        statusClass: isEnded ? 'ended' : 'upcoming',
      });
    } catch (err) {
      console.error('loadDetail failed', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    const schedule = this.data.schedule;
    return {
      title: schedule ? schedule.title : '活动详情',
      path: `/pages/schedule-detail/schedule-detail?id=${schedule?.id || ''}`,
    };
  },
});
