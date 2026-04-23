Page({
  data: {
    categories: [
      { id: 'supermarket', name: '超市', icon: '🏪' },
      { id: 'market', name: '菜场', icon: '🥬' },
      { id: 'transport', name: '公共交通', icon: '🚌' },
      { id: 'school', name: '学校', icon: '🏫' }
    ],
    activeCategory: 'supermarket',
    serviceList: []
  },

  onLoad() {
    this.loadServiceData('supermarket');
  },

  onShareAppMessage() {
    return {
      title: '水韵名邸周边生活',
      path: '/pages/life-info/life-info'
    };
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ activeCategory: id });
    this.loadServiceData(id);
  },

  loadServiceData(category) {
    const serviceData = {
      supermarket: [
        {
          id: 1,
          name: '鲜生活生鲜超市',
          address: '福泉路188号',
          distance: '350m',
          hours: '07:00-22:00',
          phone: '021-87654321',
          tags: ['业主95折', '生鲜直供']
        },
        {
          id: 2,
          name: '联华超市',
          address: '金钟路456号',
          distance: '600m',
          hours: '08:00-21:30',
          phone: '021-65432109',
          tags: ['连锁超市', '品类齐全']
        },
        {
          id: 3,
          name: '全家便利店',
          address: '福泉路200号（东门旁）',
          distance: '150m',
          hours: '24小时',
          phone: '021-56789012',
          tags: ['24小时', '便当热食']
        }
      ],
      market: [
        {
          id: 4,
          name: '金钟路菜市场',
          address: '金钟路320号',
          distance: '500m',
          hours: '05:00-12:00',
          phone: '021-67890123',
          tags: ['蔬菜新鲜', '价格实惠']
        },
        {
          id: 5,
          name: '福泉路农贸市场',
          address: '福泉路256号',
          distance: '400m',
          hours: '05:30-11:30',
          phone: '021-78901234',
          tags: ['海鲜水产', '活禽宰杀']
        }
      ],
      transport: [
        {
          id: 6,
          name: '788路公交车站',
          address: '福泉路金钟路站',
          distance: '200m',
          hours: '06:00-22:30',
          phone: '',
          tags: ['途经淞虹路地铁站']
        },
        {
          id: 7,
          name: '地铁2号线淞虹路站',
          address: '天山西路淞虹路',
          distance: '1.2km',
          hours: '05:55-23:45',
          phone: '',
          tags: ['2号线', '可换乘']
        },
        {
          id: 8,
          name: '141路公交车站',
          address: '金钟路福泉路站',
          distance: '300m',
          hours: '06:00-21:00',
          phone: '',
          tags: ['直达中山公园']
        }
      ],
      school: [
        {
          id: 9,
          name: '长宁区实验小学',
          address: '金钟路380号',
          distance: '800m',
          hours: '08:00-16:00',
          phone: '021-89012345',
          tags: ['公办小学', '市重点']
        },
        {
          id: 10,
          name: '新泾中学',
          address: '福泉路300号',
          distance: '600m',
          hours: '07:30-17:00',
          phone: '021-90123456',
          tags: ['公办初中']
        },
        {
          id: 11,
          name: '水韵幼儿园',
          address: '小区配套（西门旁）',
          distance: '50m',
          hours: '07:30-16:30',
          phone: '021-01234567',
          tags: ['公办幼儿园', '小区内']
        }
      ]
    };
    this.setData({ serviceList: serviceData[category] || [] });
  },

  onServiceTap(e) {
    const { item } = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['查看地图', '拨打电话'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.openLocation({
            latitude: 31.216,
            longitude: 121.36,
            name: item.name,
            address: item.address
          });
        } else if (res.tapIndex === 1 && item.phone) {
          wx.makePhoneCall({ phoneNumber: item.phone });
        }
      }
    });
  }
});
