import * as api from '../../services/api';
import type { ScheduleItem } from '../../types/data';

interface IScheduleGroup {
  type: string;
  list: ScheduleItem[];
}

interface IScheduleData {
  groups: IScheduleGroup[];
}

function computeStatus(item: ScheduleItem): 'upcoming' | 'ended' {
  const now = new Date();
  const itemDateTime = new Date(`${item.date}T${item.time}`);
  return itemDateTime < now ? 'ended' : 'upcoming';
}

Page<IScheduleData, WechatMiniprogram.IAnyObject>({
  data: {
    groups: [],
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
      title: '水韵名邸活动安排',
      path: '/pages/schedule/schedule',
    };
  },

  async loadScheduleData() {
    const schedules = await api.getSchedules();
    const now = new Date();
    const map = new Map<string, ScheduleItem[]>();

    schedules.forEach((s) => {
      const status = computeStatus(s);
      const key = s.type || '其他';
      const item = { ...s, status };
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });

    // 即将开始的排前面，同类型内按日期时间排序
    const groups = Array.from(map.entries()).map(([type, list]) => {
      list.sort((a, b) => {
        const da = new Date(`${a.date}T${a.time}`).getTime();
        const db = new Date(`${b.date}T${b.time}`).getTime();
        return da - db;
      });
      return { type, list };
    });

    // 有 upcoming 的组排前面
    groups.sort((a, b) => {
      const aHasUpcoming = a.list.some((s) => s.status === 'upcoming');
      const bHasUpcoming = b.list.some((s) => s.status === 'upcoming');
      return bHasUpcoming ? 1 : aHasUpcoming ? -1 : 0;
    });

    this.setData({ groups });
  },

  onScheduleTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: string | number };
    wx.navigateTo({ url: `/pages/schedule-detail/schedule-detail?id=${id}` });
  },
});
