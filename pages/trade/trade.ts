import type { TradeItem } from '../../types/data';
import * as api from '../../services/api';
import type { TradeCategory } from '../../types/data';

interface ITradeData {
  categories: { id: TradeCategory; name: string }[];
  activeCategory: TradeCategory;
  tradeList: ReturnType<typeof api.getTradeList>;
  allTrades: ReturnType<typeof api.getTradeList>;
}

Page<ITradeData, WechatMiniprogram.IAnyObject>({
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'furniture', name: '家具' },
      { id: 'appliance', name: '电器' },
      { id: 'baby', name: '母婴' },
      { id: 'books', name: '书籍' },
      { id: 'others', name: '其他' },
    ],
    activeCategory: 'all',
    tradeList: [],
    allTrades: [],
  },

  onLoad() {
    this.loadTradeData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    this.mergePublishedTrades();
  },

  onPullDownRefresh() {
    this.loadTradeData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸闲置交易',
      path: '/pages/trade/trade',
    };
  },

  loadTradeData() {
    const trades = api.getTradeList();
    this.setData({ allTrades: trades, tradeList: trades });
  },

  onCategoryTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: TradeCategory };
    this.setData({ activeCategory: id });
    this.filterTrades(id);
  },

  filterTrades(category: TradeCategory) {
    if (category === 'all') {
      this.setData({ tradeList: this.data.allTrades });
      return;
    }
    const filtered = this.data.allTrades.filter((item: TradeItem) => item.category === category);
    this.setData({ tradeList: filtered });
  },

  onTradeTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number };
    wx.navigateTo({ url: `/pages/trade-detail/trade-detail?id=${id}` });
  },

  onPublishTap() {
    wx.navigateTo({ url: '/pages/trade-publish/trade-publish' });
  },

  mergePublishedTrades() {
    const published = api.getPublishedTrades();
    if (published.length === 0) return;

    const baseTrades = api.getTradeList();
    const merged = [...published, ...baseTrades];
    this.setData({ allTrades: merged, tradeList: merged });
    this.filterTrades(this.data.activeCategory);
  },
});
