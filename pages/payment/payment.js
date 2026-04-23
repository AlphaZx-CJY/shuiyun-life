Page({
  data: {
    paymentList: []
  },

  onLoad() {
    this.loadPaymentData();
  },

  onShareAppMessage() {
    return {
      title: '水韵名邸缴费知识',
      path: '/pages/payment/payment'
    };
  },

  loadPaymentData() {
    const payments = [
      {
        id: 1,
        title: '物业费缴纳指南',
        summary: '2025年度物业费缴纳方式、优惠政策及常见问题解答',
        tag: '物业费',
        tagType: 'blue',
        date: '2025-04-20',
        hot: true
      },
      {
        id: 2,
        title: '水费缴纳流程',
        summary: '线上缴纳水费的详细步骤，支持微信/支付宝/银行APP',
        tag: '水费',
        tagType: 'green',
        date: '2025-04-15',
        hot: false
      },
      {
        id: 3,
        title: '电费阶梯计价说明',
        summary: '上海市居民用电阶梯价格标准及省电小贴士',
        tag: '电费',
        tagType: 'orange',
        date: '2025-04-10',
        hot: true
      },
      {
        id: 4,
        title: '燃气费查询与缴纳',
        summary: '燃气表读数查询方法、缴费渠道及安全用气须知',
        tag: '燃气费',
        tagType: 'gray',
        date: '2025-04-05',
        hot: false
      },
      {
        id: 5,
        title: '停车费月租办理',
        summary: '地下停车位月租费用、办理流程及注意事项',
        tag: '停车费',
        tagType: 'blue',
        date: '2025-04-01',
        hot: false
      }
    ];
    this.setData({ paymentList: payments });
  },

  onPaymentTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/payment-detail/payment-detail?id=${id}` });
  }
});
