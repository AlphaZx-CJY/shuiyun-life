import * as api from '../../services/api';

interface IPaymentData {
  paymentList: ReturnType<typeof api.getPaymentList>;
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

  loadPaymentData() {
    this.setData({ paymentList: api.getPaymentList() });
  },

  onPaymentTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number };
    wx.navigateTo({ url: `/pages/payment-detail/payment-detail?id=${id}` });
  },
});
