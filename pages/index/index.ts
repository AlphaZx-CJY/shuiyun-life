import * as api from '../../services/api';
import type { NewsItem, ShuttleTime, ScheduleItem } from '../../types/data';

interface IQuickEntry {
  id: number;
  label: string;
  path: string;
  icon: string;
  tab?: string;
}

interface IRecentSchedule extends Pick<ScheduleItem, 'id' | 'title' | 'time' | 'location' | 'status' | 'date'> {
  dateLabel: string;
}

interface IIndexData {
  quickEntries: IQuickEntry[];
  noticeNews: NewsItem[];
  recentSchedules: IRecentSchedule[];
  routeName: string;
  runNote: string;
  nextShuttle: (ShuttleTime & { minutesUntil?: number; allPassed?: boolean; hoursUntil?: number; remainingMinutes?: number; firstShuttleTime?: string }) | null;
  shuttleSchedule: (ShuttleTime & { status: string; minutesUntil: number })[];
  timeRow1: (ShuttleTime & { status: string; minutesUntil: number })[];
  timeRow2: (ShuttleTime & { status: string; minutesUntil: number })[];
  shuttleStops: string[];
  shuttleContactPhone: string;
  shuttleModalVisible: boolean;
  isReady: boolean;
}

Page<IIndexData, WechatMiniprogram.IAnyObject>({
  data: {
    quickEntries: [
      { id: 1, label: '周边生活', path: '/pages/service/service', icon: 'storefront' },
      { id: 2, label: '社区心声', path: '/pages/voice/voice', icon: 'article' },
    ],
    noticeNews: [],
    recentSchedules: [],
    routeName: '',
    runNote: '',
    nextShuttle: null,
    shuttleSchedule: [],
    timeRow1: [],
    timeRow2: [],
    shuttleStops: [],
    shuttleContactPhone: '',
    shuttleModalVisible: false,
    isReady: false,
  },

  onLoad() {
    this.setData({ isReady: false });
    this.loadData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    this.updateShuttleStatus();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '新长宁水韵名邸生活号',
      path: '/pages/index/index',
    };
  },

  async loadData() {
    try {
      const [noticeNewsArr, policyNewsArr, aroundNewsArr, recentSchedulesRaw, routeName, runNote, shuttleScheduleRaw, shuttleStops, shuttleContactPhone] = await Promise.all([
        api.getLatestNewsByCategory('notice', 1),
        api.getLatestNewsByCategory('policy', 1),
        api.getLatestNewsByCategory('around', 1),
        api.getRecentSchedules(),
        api.getShuttleRouteName(),
        api.getShuttleRunNote(),
        api.getShuttleSchedule(),
        api.getShuttleStops(),
        api.getShuttleContactPhone(),
      ]);
      const noticeNews = [...noticeNewsArr, ...policyNewsArr, ...aroundNewsArr];
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const allPassed = shuttleScheduleRaw.length > 0 && shuttleScheduleRaw.every((s: ShuttleTime) => s.status === 'passed');
      let nextShuttle = shuttleScheduleRaw.find((s: ShuttleTime) => s.status !== 'passed') || shuttleScheduleRaw[shuttleScheduleRaw.length - 1] || null;
      const shuttleSchedule = shuttleScheduleRaw.map((item: ShuttleTime) => {
        const [h, m] = item.time.split(':').map(Number);
        const itemTime = h * 60 + m;
        const diff = itemTime - currentTime;
        return {
          ...item,
          status: itemTime < currentTime ? 'passed' : (diff <= 30 ? 'soon' : 'upcoming'),
          minutesUntil: diff > 0 ? diff : 0,
        } as ShuttleTime & { status: string; minutesUntil: number };
      });
      const half = Math.ceil(shuttleSchedule.length / 2);
      const timeRow1 = shuttleSchedule.slice(0, half);
      const timeRow2 = shuttleSchedule.slice(half);
      const firstShuttleTime = shuttleScheduleRaw.length > 0 ? shuttleScheduleRaw[0].time : '';
      if (nextShuttle) {
        const [h, m] = nextShuttle.time.split(':').map(Number);
        const itemTime = h * 60 + m;
        const minutesUntil = itemTime - currentTime;
        const hoursUntil = Math.floor(minutesUntil / 60);
        const remainingMinutes = minutesUntil % 60;
        nextShuttle = { ...nextShuttle, minutesUntil: minutesUntil > 0 ? minutesUntil : 0, allPassed, hoursUntil, remainingMinutes, firstShuttleTime } as ShuttleTime & { minutesUntil?: number; allPassed?: boolean; hoursUntil?: number; remainingMinutes?: number; firstShuttleTime?: string };
      }
      const today = new Date().toISOString().slice(0, 10);
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const recentSchedules = recentSchedulesRaw.map((s) => {
        let dateLabel = s.date.slice(5).replace('-', '/');
        if (s.date === today) dateLabel = '今天';
        if (s.date === tomorrow) dateLabel = '明天';
        return { ...s, dateLabel };
      });
      this.setData({ noticeNews, recentSchedules, routeName, runNote, nextShuttle, shuttleSchedule, timeRow1, timeRow2, shuttleStops, shuttleContactPhone, isReady: true });
    } catch (err) {
      console.error('loadData failed', err);
      this.setData({ isReady: true });
    }
  },

  updateShuttleStatus() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const { shuttleSchedule } = this.data;
    if (shuttleSchedule.length === 0) return;
    const updated = shuttleSchedule.map((item) => {
      const [h, m] = item.time.split(':').map(Number);
      const itemTime = h * 60 + m;
      const diff = itemTime - currentTime;
      return {
        ...item,
        status: itemTime < currentTime ? 'passed' : (diff <= 30 ? 'soon' : 'upcoming'),
        minutesUntil: diff > 0 ? diff : 0,
      } as ShuttleTime & { status: string; minutesUntil: number };
    });
    const half = Math.ceil(updated.length / 2);
    this.setData({ shuttleSchedule: updated, timeRow1: updated.slice(0, half), timeRow2: updated.slice(half) });
  },

  onShuttleBannerTap() {
    this.setData({ shuttleModalVisible: true });
  },

  onShuttleModalClose() {
    this.setData({ shuttleModalVisible: false });
  },

  onModalSheetTap() {
    // 阻止事件冒泡，防止点击弹窗内容时关闭
  },

  preventTouchMove() {
    // 阻止弹窗显示时底层页面滚动
  },

  onShuttleCallTap() {
    const { shuttleContactPhone } = this.data;
    if (shuttleContactPhone) {
      wx.makePhoneCall({
        phoneNumber: shuttleContactPhone,
      });
    }
  },

  onEntryTap(e: WechatMiniprogram.TouchEvent) {
    const { path, tab } = e.currentTarget.dataset as { path: string; tab?: string };
    if (tab) {
      wx.setStorageSync('discover_tab', tab);
    }
    const tabBarPages = ['/pages/index/index', '/pages/discover/discover', '/pages/trade/trade', '/pages/profile/profile'];
    if (tabBarPages.includes(path)) {
      wx.switchTab({ url: path });
    } else {
      wx.navigateTo({ url: path });
    }
  },

  onNoticeTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number | string };
    wx.navigateTo({ url: `/pages/detail/detail?type=news&id=${id}` });
  },

  onMoreNoticeTap() {
    wx.setStorageSync('discover_tab', 'news');
    wx.switchTab({ url: '/pages/discover/discover' });
  },

  onScheduleTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number | string };
    if (id) {
      wx.navigateTo({ url: `/pages/detail/detail?type=schedule&id=${id}` });
    } else {
      wx.switchTab({ url: '/pages/discover/discover' });
    }
  },

  onMoreScheduleTap() {
    wx.setStorageSync('discover_tab', 'schedule');
    wx.switchTab({ url: '/pages/discover/discover' });
  },
});
