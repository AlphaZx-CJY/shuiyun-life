import * as api from '../../services/api';
import { SCHEDULE_TYPE_MAP } from '../../types/data';
import type { DiscoverItem } from '../../types/data';

interface IDiscoverData {
  feedList: DiscoverItem[];
  filteredList: DiscoverItem[];
  activeCategory: string;
  categories: { id: string; name: string }[];
  loading: boolean;
}

const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'news', name: '资讯' },
  { id: 'schedule', name: '活动' },
  { id: 'payment', name: '缴费' },
];

Page<IDiscoverData, WechatMiniprogram.IAnyObject>({
  data: {
    feedList: [],
    filteredList: [],
    activeCategory: 'all',
    categories: CATEGORIES,
    loading: false,
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    const pendingTab = wx.getStorageSync('discover_tab');
    if (pendingTab && CATEGORIES.find((c) => c.id === pendingTab)) {
      wx.removeStorageSync('discover_tab');
      const { feedList } = this.data;
      const filteredList = pendingTab === 'all' ? feedList : feedList.filter((item) => item.type === pendingTab);
      this.setData({ activeCategory: pendingTab, filteredList });
    }
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸 - 发现',
      path: '/pages/discover/discover',
    };
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      const [newsList, paymentList, scheduleList] = await Promise.all([
        api.getNewsList(),
        api.getPaymentList(),
        api.getSchedules(),
      ]);

      const feedList: DiscoverItem[] = [
        ...newsList.map((item) => ({
          id: item.id,
          type: 'news' as const,
          title: item.title,
          summary: item.summary,
          date: item.date,
          tag: item.tag || '资讯',
          icon: 'article',
          containerClass: 'feed-icon--primary',
          url: `/pages/detail/detail?type=news&id=${item.id}`,
        })),
        ...paymentList.map((item) => ({
          id: item.id,
          type: 'payment' as const,
          title: item.title,
          summary: item.summary,
          date: item.date,
          tag: item.tag || '缴费',
          icon: 'receipt_long',
          containerClass: 'feed-icon--payment',
          url: `/pages/detail/detail?type=payment&id=${item.id}`,
        })),
        ...scheduleList.map((item) => ({
          id: item.id,
          type: 'schedule' as const,
          title: item.title,
          summary: `${item.date} ${item.time} · ${item.location}`,
          date: item.date,
          tag: SCHEDULE_TYPE_MAP[item.type] || item.type || '活动',
          icon: 'event',
          containerClass: 'feed-icon--tertiary',
          url: `/pages/detail/detail?type=schedule&id=${item.id}`,
        })),
      ];

      feedList.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));

      const { activeCategory } = this.data;
      const filteredList = activeCategory === 'all' ? feedList : feedList.filter((item) => item.type === activeCategory);
      this.setData({ feedList, filteredList, loading: false });
    } catch (err) {
      console.error('loadData failed', err);
      this.setData({ loading: false });
    }
  },

  onCategoryTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: string };
    const { feedList } = this.data;
    const filteredList = id === 'all' ? feedList : feedList.filter((item) => item.type === id);
    this.setData({ activeCategory: id, filteredList });
  },

  onFeedTap(e: WechatMiniprogram.TouchEvent) {
    const { url } = e.currentTarget.dataset as { url: string };
    if (url) {
      wx.navigateTo({ url });
    }
  },


});
