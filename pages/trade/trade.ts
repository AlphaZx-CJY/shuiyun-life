import type { TradeItem } from '../../types/data';
import * as api from '../../services/api';
import type { TradeCategory } from '../../types/data';

interface ITradeData {
  categories: { id: TradeCategory; name: string }[];
  activeCategory: TradeCategory;
  tradeList: TradeItem[];
  allTrades: TradeItem[];
  leftColumn: TradeItem[];
  rightColumn: TradeItem[];
  loading: boolean;
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
    leftColumn: [],
    rightColumn: [],
    loading: false,
  },

  onLoad() {
    this.loadTradeData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
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

  async loadTradeData() {
    this.setData({ loading: true });
    try {
      const trades = await api.getTradeList();
      const tradesWithMeta = trades.map((item) => ({
        ...item,
        discount: item.originalPrice > 0 ? Math.round((1 - item.price / item.originalPrice) * 100) : 0,
        categoryName: this.data.categories.find((c) => c.id === item.category)?.name || '',
      }));
      this.setData({ allTrades: tradesWithMeta, tradeList: tradesWithMeta, loading: false });
      this.splitColumns(tradesWithMeta);
    } catch (err) {
      console.error('loadTradeData failed', err);
      this.setData({ loading: false });
    }
  },

  splitColumns(list: TradeItem[]) {
    const left: TradeItem[] = [];
    const right: TradeItem[] = [];
    list.forEach((item, index) => {
      if (index % 2 === 0) left.push(item);
      else right.push(item);
    });
    this.setData({ leftColumn: left, rightColumn: right });
  },

  onCategoryTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: TradeCategory };
    this.setData({ activeCategory: id });
    this.filterTrades(id);
  },

  filterTrades(category: TradeCategory) {
    let filtered: TradeItem[];
    if (category === 'all') {
      filtered = this.data.allTrades;
    } else {
      filtered = this.data.allTrades.filter((item: TradeItem) => item.category === category);
    }
    this.setData({ tradeList: filtered });
    this.splitColumns(filtered);
  },

  onTradeTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number | string };
    wx.navigateTo({ url: `/pages/trade-detail/trade-detail?id=${id}` });
  },

  onPublishTap() {
    wx.navigateTo({ url: '/pages/trade-publish/trade-publish' });
  },
});
