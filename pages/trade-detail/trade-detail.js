Page({
  data: {
    tradeId: null,
    trade: null
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ tradeId: id });
    this.loadTradeDetail(id);
  },

  onShareAppMessage() {
    return {
      title: this.data.trade?.title || '商品详情',
      path: `/pages/trade-detail/trade-detail?id=${this.data.tradeId}`
    };
  },

  loadTradeDetail(id) {
    const tradeData = {
      1: {
        id: 1,
        title: '宜家双人沙发，9成新',
        price: 800,
        originalPrice: 2999,
        category: 'furniture',
        images: ['/images/banners/banner1.jpg'],
        seller: '3号楼王先生',
        time: '2小时前',
        location: '3号楼1202室',
        phone: '13800135678',
        description: '搬家转让，使用2年，保养很好，无破损。沙发尺寸：长2米，宽0.9米。颜色为深灰色布艺，可拆洗。仅限自提，可协助搬下楼。'
      },
      2: {
        id: 2,
        title: '小米空气净化器Pro',
        price: 350,
        originalPrice: 899,
        category: 'appliance',
        images: ['/images/banners/banner2.jpg'],
        seller: '5号楼李女士',
        time: '5小时前',
        location: '5号楼801室',
        phone: '13900131234',
        description: '滤网刚换，功能完好，因升级换新转让。适用面积35-60平方米，支持米家APP远程控制。'
      },
      3: {
        id: 3,
        title: '婴儿推车（可坐可躺）',
        price: 200,
        originalPrice: 1200,
        category: 'baby',
        images: ['/images/banners/banner3.jpg'],
        seller: '8号楼张妈妈',
        time: '1天前',
        location: '8号楼1503室',
        phone: '13600139876',
        description: '宝宝大了用不上了，轮子顺滑，可折叠。重量约7kg，可登机。附赠雨罩和蚊帐。'
      },
      4: {
        id: 4,
        title: '考研英语全套书籍',
        price: 50,
        originalPrice: 280,
        category: 'books',
        images: [],
        seller: '2号楼小陈',
        time: '2天前',
        location: '2号楼602室',
        phone: '15000134321',
        description: '红宝书+真题解析+作文模板，部分有笔记。2024版，内容变动不大，性价比高。'
      },
      5: {
        id: 5,
        title: '动感单车家用健身器材',
        price: 600,
        originalPrice: 1800,
        category: 'others',
        images: [],
        seller: '6号楼刘先生',
        time: '3天前',
        location: '6号楼1101室',
        phone: '13700138765',
        description: '磁控静音，阻力可调，占地面积小。带平板支架和心率监测。使用1年，功能完好。'
      }
    };
    let trade = tradeData[id] || null;

    // 从已发布数据中查找
    if (!trade) {
      const published = wx.getStorageSync('publishedTrades') || [];
      trade = published.find(item => String(item.id) === String(id)) || null;
    }

    if (trade) {
      trade.discount = Math.round((trade.originalPrice - trade.price) / trade.originalPrice * 100);
      // 兼容旧数据：单张图片转数组
      if (trade.image && !trade.images) {
        trade.images = [trade.image];
      }
      if (!trade.images) {
        trade.images = [];
      }
    }
    this.setData({ trade });
  },

  onCallTap() {
    const phone = this.data.trade?.phone;
    if (phone) {
      wx.makePhoneCall({ 
        phoneNumber: phone,
        fail: () => {
          wx.showToast({ title: '拨打电话失败', icon: 'none' });
        }
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
  }
});
