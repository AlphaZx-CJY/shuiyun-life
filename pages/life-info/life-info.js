Page({
  data: {
    categories: [
      { id: 'supermarket', name: '超市', icon: '超' },
      { id: 'market', name: '菜场', icon: '菜' },
      { id: 'food', name: '美食', icon: '食' },
      { id: 'hotel', name: '酒店', icon: '住' },
      { id: 'transport', name: '交通', icon: '交' },
      { id: 'school', name: '学校', icon: '学' },
      { id: 'leisure', name: '休闲', icon: '休' }
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
          name: '吉买盛超市（重固店）',
          address: '重固镇福泉山路518号',
          distance: '1.2km',
          hours: '08:00-21:30',
          phone: '021-69291234',
          tags: ['综合超市', '生鲜日用']
        },
        {
          id: 2,
          name: '世纪联华',
          address: '重固镇赵重公路2811号',
          distance: '1.8km',
          hours: '08:00-22:00',
          phone: '021-69292345',
          tags: ['连锁超市', '品类齐全']
        },
        {
          id: 3,
          name: '全家便利店',
          address: '重固镇重固大街162号',
          distance: '900m',
          hours: '24小时',
          phone: '021-69293456',
          tags: ['24小时', '便当热食']
        }
      ],
      market: [
        {
          id: 4,
          name: '重固菜市场',
          address: '重固镇重固大街',
          distance: '800m',
          hours: '05:00-12:00',
          phone: '021-69294567',
          tags: ['蔬菜新鲜', '价格实惠', '本地农户']
        },
        {
          id: 5,
          name: '福泉山路农贸市场',
          address: '重固镇福泉山路',
          distance: '1.1km',
          hours: '05:30-11:30',
          phone: '021-69295678',
          tags: ['海鲜水产', '肉类禽蛋']
        }
      ],
      transport: [
        {
          id: 6,
          name: '重固1路',
          address: '重固汽车站',
          distance: '1.0km',
          hours: '06:00-20:30',
          phone: '',
          tags: ['重固镇内环线', '途经轨交站']
        },
        {
          id: 7,
          name: '松重线',
          address: '赵重公路福泉山路站',
          distance: '1.3km',
          hours: '05:30-21:00',
          phone: '',
          tags: ['直达松江', '途经轨交站']
        },
        {
          id: 8,
          name: '地铁17号线赵巷站',
          address: '青浦区赵巷镇',
          distance: '2.3km',
          hours: '05:55-22:30',
          phone: '',
          tags: ['17号线', '可换乘2/10号线']
        }
      ],
      school: [
        {
          id: 9,
          name: '上海师范大学附属青浦实验学校',
          address: '重固镇福泉山路',
          distance: '1.5km',
          hours: '08:00-16:30',
          phone: '021-69296789',
          tags: ['九年一贯制', '区重点']
        },
        {
          id: 10,
          name: '重固中学',
          address: '重固镇重固大街',
          distance: '1.0km',
          hours: '07:30-17:00',
          phone: '021-69297890',
          tags: ['公办初中', '百年老校']
        },
        {
          id: 11,
          name: '重固中心小学',
          address: '重固镇福泉山路',
          distance: '1.2km',
          hours: '08:00-16:00',
          phone: '021-69298901',
          tags: ['公办小学', '市行为规范示范校']
        },
        {
          id: 12,
          name: '重固幼儿园',
          address: '重固镇福泉山路',
          distance: '1.1km',
          hours: '07:30-16:30',
          phone: '021-69299012',
          tags: ['公办幼儿园', '区示范园']
        }
      ],
      leisure: [
        {
          id: 13,
          name: '重固公园',
          address: '重固镇重固大街东侧',
          distance: '1.0km',
          hours: '05:00-21:00',
          phone: '',
          tags: ['免费开放', '晨练', '儿童游乐']
        },
        {
          id: 14,
          name: '福泉山公园',
          address: '重固镇福泉山路',
          distance: '1.4km',
          hours: '06:00-20:00',
          phone: '',
          tags: ['生态绿地', '健身步道', '观景平台']
        },
        {
          id: 15,
          name: '章堰古镇',
          address: '重固镇章堰村',
          distance: '3.5km',
          hours: '全天开放',
          phone: '',
          tags: ['历史文化', '江南水乡', '短途出游']
        },
        {
          id: 16,
          name: '重固健康主题公园',
          address: '重固镇北青公路附近',
          distance: '2.0km',
          hours: '06:00-21:00',
          phone: '',
          tags: ['健身器材', '广场舞', '慢跑道']
        }
      ],
      food: [
        {
          id: 17,
          name: '重固老饭店',
          address: '重固镇重固大街88号',
          distance: '900m',
          hours: '10:00-21:00',
          phone: '021-69291001',
          tags: ['本帮菜', '农家土菜', '聚餐']
        },
        {
          id: 18,
          name: '小杨生煎（福泉山路店）',
          address: '重固镇福泉山路216号',
          distance: '1.1km',
          hours: '07:00-20:30',
          phone: '021-69291002',
          tags: ['生煎包', '快餐', '早餐']
        },
        {
          id: 19,
          name: '沙县小吃（重固大街店）',
          address: '重固镇重固大街156号',
          distance: '800m',
          hours: '06:30-22:00',
          phone: '021-69291003',
          tags: ['特色小吃', '经济实惠', '夜宵']
        },
        {
          id: 20,
          name: '兰州拉面（赵重公路店）',
          address: '重固镇赵重公路1838号',
          distance: '1.5km',
          hours: '08:00-22:00',
          phone: '021-69291004',
          tags: ['西北风味', '面食', '清真']
        }
      ],
      hotel: [
        {
          id: 21,
          name: '如家商旅酒店（赵巷店）',
          address: '赵巷镇赵华路301号',
          distance: '2.8km',
          hours: '24小时',
          phone: '021-69292001',
          tags: ['经济型', '商务出行', '含早餐']
        },
        {
          id: 22,
          name: '汉庭酒店（青浦重固店）',
          address: '重固镇福泉山路508号',
          distance: '1.3km',
          hours: '24小时',
          phone: '021-69292002',
          tags: ['连锁酒店', '干净舒适', '近地铁']
        },
        {
          id: 23,
          name: '全季酒店（青浦新城店）',
          address: '青浦区外青松公路6188号',
          distance: '6.5km',
          hours: '24小时',
          phone: '021-69292003',
          tags: ['中高端', '品质住宿', '免费停车']
        },
        {
          id: 24,
          name: '格林豪泰（赵巷地铁站店）',
          address: '赵巷镇盈港东路7799号',
          distance: '3.2km',
          hours: '24小时',
          phone: '021-69292004',
          tags: ['快捷酒店', '近地铁站', '性价比高']
        }
      ]
    };
    this.setData({ serviceList: serviceData[category] || [] });
  },

  onServiceTap(e) {
    const { item } = e.currentTarget.dataset;
    const itemList = ['查看地图'];
    if (item.phone) {
      itemList.push('拨打电话');
    }
    wx.showActionSheet({
      itemList,
      success: (res) => {
        const action = itemList[res.tapIndex];
        if (action === '查看地图') {
          wx.openLocation({
            latitude: 31.220,
            longitude: 121.200,
            name: item.name,
            address: item.address
          });
        } else if (action === '拨打电话') {
          wx.makePhoneCall({ phoneNumber: item.phone });
        }
      }
    });
  }
});
