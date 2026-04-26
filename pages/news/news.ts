import type { NewsItem } from '../../types/data';
import * as api from '../../services/api';
import type { NewsCategory } from '../../types/data';

interface INewsData {
  categories: { id: NewsCategory; name: string }[];
  activeCategory: NewsCategory;
  newsList: NewsItem[];
  allNews: NewsItem[];
}

Page<INewsData, WechatMiniprogram.IAnyObject>({
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'notice', name: '社区通知' },
      { id: 'policy', name: '政策解读' },
      { id: 'around', name: '周边动态' },
    ],
    activeCategory: 'all',
    newsList: [],
    allNews: [],
  },

  onLoad() {
    this.loadNewsData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  onPullDownRefresh() {
    this.loadNewsData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸资讯',
      path: '/pages/news/news',
    };
  },

  async loadNewsData() {
    const allNews = await api.getNewsList();
    this.setData({ allNews, newsList: allNews });
  },

  onCategoryTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: NewsCategory };
    this.setData({ activeCategory: id });
    this.filterNews(id);
  },

  filterNews(category: NewsCategory) {
    if (category === 'all') {
      this.setData({ newsList: this.data.allNews });
      return;
    }
    const filtered = this.data.allNews.filter((item: NewsItem) => item.category === category);
    this.setData({ newsList: filtered });
  },

  onNewsTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number | string };
    wx.navigateTo({ url: `/pages/news-detail/news-detail?id=${id}` });
  },
});
