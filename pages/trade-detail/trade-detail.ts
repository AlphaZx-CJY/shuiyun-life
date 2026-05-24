import * as api from '../../services/api';
import type { TradeDetail } from '../../types/data';

interface ITradeDetailData {
  tradeId: string | null;
  trade: TradeDetail | null;
  loading: boolean;
  loadError: boolean;
}

Page<ITradeDetailData, WechatMiniprogram.IAnyObject>({
  data: {
    tradeId: null,
    trade: null,
    loading: false,
    loadError: false,
  },

  onLoad(options: Record<string, string>) {
    const { id } = options;
    this.setData({ tradeId: id, loading: true, loadError: false });
    this.loadTradeDetail(id);
  },

  async loadTradeDetail(id: string) {
    try {
      const detail = await api.getTradeDetail(id);
      if (detail) {
        this.setData({ trade: detail, loading: false });
      } else {
        this.setData({ loadError: true, loading: false });
      }
    } catch (err) {
      console.error('loadTradeDetail failed', err);
      this.setData({ loadError: true, loading: false });
    }
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: this.data.trade?.title || '商品详情',
      path: `/pages/trade-detail/trade-detail?id=${this.data.tradeId}`,
    };
  },

  onCallTap() {
    const phone = this.data.trade?.phone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: (err) => {
          if (err.errMsg && err.errMsg.includes('cancel')) {
            return;
          }
          wx.showToast({ title: '拨打电话失败', icon: 'none' });
        },
      });
    } else {
      wx.showToast({ title: '暂无联系方式', icon: 'none' });
    }
  },

  onImageTap(e: WechatMiniprogram.TouchEvent) {
    const images = this.data.trade?.images;
    const current = e.currentTarget.dataset.current as string;
    if (images && images.length > 0) {
      wx.previewImage({ urls: images, current });
    }
  },
});
