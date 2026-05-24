import * as api from '../../services/api';
import type { TradeItem } from '../../types/data';

const CATEGORY_NAMES: Record<string, string> = {
  furniture: '家具',
  appliance: '电器',
  baby: '母婴',
  books: '书籍',
  others: '其他',
};

interface IMyTradeData {
  tradeList: TradeItem[];
  leftColumn: TradeItem[];
  rightColumn: TradeItem[];
  loading: boolean;
}

Page<IMyTradeData, WechatMiniprogram.IAnyObject>({
  data: {
    tradeList: [],
    leftColumn: [],
    rightColumn: [],
    loading: false,
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      const list = await api.getMyTradeList();
      const tradesWithMeta = list.map((item) => ({
        ...item,
        discount: item.originalPrice > 0 ? Math.round((1 - item.price / item.originalPrice) * 100) : 0,
        categoryName: CATEGORY_NAMES[item.category] || '',
        imageError: false,
      }));
      const leftColumn: TradeItem[] = [];
      const rightColumn: TradeItem[] = [];
      tradesWithMeta.forEach((item, index) => {
        if (index % 2 === 0) {
          leftColumn.push(item);
        } else {
          rightColumn.push(item);
        }
      });
      this.setData({ tradeList: tradesWithMeta, leftColumn, rightColumn, loading: false });
    } catch (err) {
      console.error('load my trades failed', err);
      this.setData({ loading: false });
    }
  },

  onTradeTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: string };
    wx.navigateTo({ url: `/pages/trade-publish/trade-publish?id=${id}` });
  },

  onTradeLongPress(e: WechatMiniprogram.TouchEvent) {
    const id = String(e.currentTarget.dataset.id);
    const title = String(e.currentTarget.dataset.title || '');
    wx.showModal({
      title: '确认删除',
      content: `确定要删除「${title || '此物品'}」吗？`,
      confirmColor: '#BA1A1A',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '删除中...' });
            await api.deleteTrade(id);
            wx.hideLoading();
            wx.showToast({ title: '已删除', icon: 'success' });
            wx.setStorageSync('tradeListNeedRefresh', true);
            this.loadData();
          } catch (err) {
            wx.hideLoading();
            console.error('delete trade failed', err);
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      },
    });
  },

  onImageError(e: WechatMiniprogram.ImageError) {
    const { id } = e.currentTarget.dataset as { id: string };
    const { leftColumn, rightColumn } = this.data;
    const updateImageError = (col: TradeItem[]) => {
      const idx = col.findIndex((item) => item.id === id);
      if (idx !== -1) {
        const key = col === leftColumn ? 'leftColumn' : 'rightColumn';
        const newCol = [...col];
        newCol[idx] = { ...newCol[idx]!, imageError: true };
        this.setData({ [key]: newCol });
      }
    };
    updateImageError(leftColumn);
    updateImageError(rightColumn);
  },
});
