import * as api from '../../services/api';
import type { NewsItem, ShuttleTime, ScheduleItem } from '../../types/data';

interface IQuickEntry {
  id: number;
  label: string;
  path: string;
  icon: string;
}

interface IIndexData {
  quickEntries: IQuickEntry[];
  noticeNews: NewsItem[];
  todaySchedules: Pick<ScheduleItem, 'id' | 'title' | 'time' | 'location' | 'status'>[];
  routeName: string;
  nextShuttle: ShuttleTime | null;
}

const ICON_LIFE = '🏪';
const ICON_NOTICE = '📢';
const ICON_SCHEDULE = '📅';
const ICON_SERVICE = '💡';
const ICON_TRADE = '🛍️';
const ICON_VOICE = '📢';

Page<IIndexData, WechatMiniprogram.IAnyObject>({
  data: {
    quickEntries: [
      { id: 1, label: '周边生活', path: '/pages/life-info/life-info', icon: ICON_LIFE },
      { id: 2, label: '社区通知', path: '/pages/news/news', icon: ICON_NOTICE },
      { id: 3, label: '便民安排', path: '/pages/schedule/schedule', icon: ICON_SCHEDULE },
      { id: 4, label: '缴费知识', path: '/pages/payment/payment', icon: ICON_SERVICE },
      { id: 5, label: '闲置交易', path: '/pages/trade/trade', icon: ICON_TRADE },
      { id: 6, label: '邻里互助', path: '/pages/voice/voice', icon: ICON_VOICE },
    ],
    noticeNews: [],
    todaySchedules: [],
    routeName: '',
    shuttlePreview: [],
    nextShuttle: null,
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
      const [noticeNews, todaySchedules, routeName, shuttleSchedule] = await Promise.all([
        api.getNoticeNews(1),
        api.getTodaySchedules(),
        api.getShuttleRouteName(),
        api.getShuttleSchedule(),
      ]);
      const nextShuttle = shuttleSchedule.find((s: ShuttleTime) => s.status !== 'passed') || shuttleSchedule[shuttleSchedule.length - 1] || null;
      this.setData({ noticeNews, todaySchedules, routeName, shuttleSchedule, nextShuttle });
    } catch (err) {
      console.error('loadData failed', err);
    }
  },

  onShuttleBannerTap() {
    wx.navigateTo({ url: '/pages/shuttle/shuttle' });
  },

  onEntryTap(e: WechatMiniprogram.TouchEvent) {
    const { path } = e.currentTarget.dataset as { path: string };
    const tabBarPages = ['/pages/index/index', '/pages/news/news', '/pages/trade/trade', '/pages/schedule/schedule', '/pages/profile/profile'];
    if (tabBarPages.includes(path)) {
      wx.switchTab({ url: path });
    } else {
      wx.navigateTo({ url: path });
    }
  },

  onNoticeTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number | string };
    wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${id}` });
  },

  onMoreNoticeTap() {
    wx.switchTab({ url: '/pages/news/news' });
  },

  onScheduleTap(e: WechatMiniprogram.TouchEvent) {
    wx.switchTab({ url: '/pages/schedule/schedule' });
  },

  onMoreScheduleTap() {
    wx.switchTab({ url: '/pages/schedule/schedule' });
  },
});
