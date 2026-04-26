import * as api from '../../services/api';
import type { TradeDetail } from '../../types/data';

interface ITradeDetailData {
  tradeId: string | null;
  trade: TradeDetail | null;
}

Page<ITradeDetailData, WechatMiniprogram.IAnyObject>({
  data: {
    tradeId: null,
    trade: null,
  },

  async onLoad(options: Record<string, string>) {
    const { id } = options;
    this.setData({ tradeId: id });
    try {
      const detail = await api.getTradeDetail(Number(id));
      this.setData({ trade: detail });
    } catch (err) {
      console.error('loadTradeDetail failed', err);
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
        fail: () => {
          wx.showToast({ title: '拨打电话失败', icon: 'none' });
        },
      });
    } else {
      wx.showToast({ title: '暂无联系方式', icon: 'none' });
    }
  },

  onImageTap() {
    const images = this.data.trade?.images;
    if (images && images.length > 0) {
      wx.previewImage({ urls: images });
    }
  },
});
