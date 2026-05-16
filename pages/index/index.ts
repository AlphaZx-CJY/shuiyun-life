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
  nextShuttle: ShuttleTime | null;
  shuttleModalVisible: boolean;
  shuttleStops: string[];
  shuttleSchedule: ShuttleTime[];
  shuttleContactPhone: string;
}

Page<IIndexData, WechatMiniprogram.IAnyObject>({
  data: {
    quickEntries: [
      { id: 1, label: '周边生活', path: '/pages/discover/discover', tab: 'service', icon: 'storefront' },
      { id: 2, label: '缴费知识', path: '/pages/discover/discover', tab: 'payment', icon: 'receipt_long' },
      { id: 3, label: '社区活动', path: '/pages/discover/discover', tab: 'schedule', icon: 'event' },
      { id: 4, label: '闲置交易', path: '/pages/trade/trade', icon: 'sync_alt' },
    ],
    noticeNews: [],
    recentSchedules: [],
    routeName: '',
    runNote: '',
    nextShuttle: null,
    shuttleModalVisible: false,
    shuttleStops: [],
    shuttleSchedule: [],
    shuttleContactPhone: '',
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
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
      const [noticeNewsArr, policyNewsArr, aroundNewsArr, recentSchedulesRaw, routeName, runNote, shuttleSchedule, shuttleStops, shuttleContactPhone] = await Promise.all([
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
      const nextShuttle = shuttleSchedule.find((s: ShuttleTime) => s.status !== 'passed') || shuttleSchedule[shuttleSchedule.length - 1] || null;
      const today = new Date().toISOString().slice(0, 10);
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const recentSchedules = recentSchedulesRaw.map((s) => {
        let dateLabel = s.date.slice(5).replace('-', '/');
        if (s.date === today) dateLabel = '今天';
        if (s.date === tomorrow) dateLabel = '明天';
        return { ...s, dateLabel };
      });
      this.setData({ noticeNews, recentSchedules, routeName, runNote, shuttleSchedule, shuttleStops, shuttleContactPhone, nextShuttle });
    } catch (err) {
      console.error('loadData failed', err);
    }
  },

  onShuttleBannerTap() {
    this.setData({ shuttleModalVisible: true });
  },

  onShuttleModalClose() {
    this.setData({ shuttleModalVisible: false });
  },

  onShuttleCallTap() {
    const { shuttleContactPhone } = this.data;
    if (shuttleContactPhone) {
      wx.makePhoneCall({
        phoneNumber: shuttleContactPhone,
        fail: () => {
          wx.showToast({ title: '拨打电话失败', icon: 'none' });
        },
      });
    }
  },

  onShuttleSheetTap() {
    // 阻止事件冒泡，防止点击弹窗内容时关闭弹窗
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
