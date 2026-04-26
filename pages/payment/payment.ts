import * as api from '../../services/api';
import type { PaymentItem } from '../../types/data';

interface IPaymentData {
  paymentList: PaymentItem[];
}

Page<IPaymentData, WechatMiniprogram.IAnyObject>({
  data: {
    paymentList: [],
  },

  onLoad() {
    this.loadPaymentData();
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸缴费知识',
      path: '/pages/payment/payment',
    };
  },

  async loadPaymentData() {
    const paymentList = await api.getPaymentList();
    this.setData({ paymentList });
  },

  onPaymentTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number | string };
    wx.navigateTo({ url: `/pages/payment-detail/payment-detail?id=${id}` });
  },
});
