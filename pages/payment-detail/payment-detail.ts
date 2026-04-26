import * as api from '../../services/api';
import type { PaymentDetail } from '../../types/data';

interface IPaymentDetailData {
  paymentId: string | null;
  payment: PaymentDetail | null;
}

Page<IPaymentDetailData, WechatMiniprogram.IAnyObject>({
  data: {
    paymentId: null,
    payment: null,
  },

  async onLoad(options: Record<string, string>) {
    const { id } = options;
    this.setData({ paymentId: id });
    try {
      const detail = await api.getPaymentDetail(Number(id));
      this.setData({ payment: detail });
    } catch (err) {
      console.error('loadPaymentDetail failed', err);
    }
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: this.data.payment?.title || '缴费详情',
      path: `/pages/payment-detail/payment-detail?id=${this.data.paymentId}`,
    };
  },


});
