Page({
  data: {
    categories: [
      { id: 'furniture', name: '家具' },
      { id: 'appliance', name: '电器' },
      { id: 'baby', name: '母婴' },
      { id: 'books', name: '书籍' },
      { id: 'others', name: '其他' }
    ],
    categoryIndex: 0,
    images: [],
    form: {
      title: '',
      price: '',
      originalPrice: '',
      description: '',
      seller: '',
      phone: '',
      location: ''
    }
  },

  onLoad() {
    // 尝试获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.nickName) {
      this.setData({ 'form.seller': userInfo.nickName });
    }
  },

  onShareAppMessage() {
    return {
      title: '发布闲置物品',
      path: '/pages/trade-publish/trade-publish'
    };
  },

  onCategoryChange(e) {
    this.setData({ categoryIndex: e.detail.value });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({ [`form.${field}`]: value });
  },

  onChooseImage() {
    const remain = 3 - this.data.images.length;
    if (remain <= 0) return;
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath);
        this.setData({ images: [...this.data.images, ...newImages] });
      }
    });
  },

  onRemoveImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    });
  },

  onSubmit() {
    const { form, categories, categoryIndex, images } = this.data;

    // 表单验证
    if (!form.title.trim()) {
      wx.showToast({ title: '请输入商品标题', icon: 'none' });
      return;
    }
    if (!form.price.trim()) {
      wx.showToast({ title: '请输入售价', icon: 'none' });
      return;
    }
    if (!form.seller.trim()) {
      wx.showToast({ title: '请输入联系人', icon: 'none' });
      return;
    }
    if (!form.phone.trim()) {
      wx.showToast({ title: '请输入联系电话', icon: 'none' });
      return;
    }

    const trade = {
      id: Date.now(),
      title: form.title.trim(),
      price: parseFloat(form.price) || 0,
      originalPrice: parseFloat(form.originalPrice) || 0,
      category: categories[categoryIndex].id,
      images: images,
      seller: form.seller.trim(),
      time: '刚刚',
      location: form.location.trim() || '小区',
      description: form.description.trim() || '暂无描述'
    };

    // 读取已有数据
    let published = wx.getStorageSync('publishedTrades') || [];
    published.unshift(trade);
    
    // 最多保存50条
    if (published.length > 50) {
      published = published.slice(0, 50);
    }
    
    wx.setStorageSync('publishedTrades', published);

    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  },

  onCancel() {
    wx.navigateBack();
  }
});
