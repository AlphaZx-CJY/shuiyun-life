import * as api from '../../services/api';
import { formatDate } from '../../utils/util';
import type { VoiceItem } from '../../types/data';

interface IVoiceData {
  allVoiceList: VoiceItem[];
  filteredVoiceList: VoiceItem[];
  searchKeyword: string;
  showArchived: boolean;
  appBarHeight: number;
  scrollPaddingTop: number;
  refreshing: boolean;
  loading: boolean;
}

Page<IVoiceData, WechatMiniprogram.IAnyObject>({
  data: {
    allVoiceList: [],
    filteredVoiceList: [],
    searchKeyword: '',
    showArchived: false,
    appBarHeight: 0,
    scrollPaddingTop: 0,
    refreshing: false,
    loading: false,
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    const menu = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sys.statusBarHeight;
    const navBarHeight = (menu.top - statusBarHeight) * 2 + menu.height;
    const appBarHeight = statusBarHeight + navBarHeight;
    // fixed-header 精确高度 = padding-top(20) + search-bar(80) + gap(16) + archive-toggle(80) + padding-bottom(28) = 224rpx
    const fixedHeaderRpx = 224;
    const scrollPaddingTop = Math.round(appBarHeight + fixedHeaderRpx * sys.windowWidth / 750);
    this.setData({ appBarHeight, scrollPaddingTop });
    this.loadData();
  },

  onShow() {
    const needRefresh = wx.getStorageSync('voiceListNeedRefresh');
    if (needRefresh) {
      wx.removeStorageSync('voiceListNeedRefresh');
      this.loadData();
    }
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true });
    this.loadData();
  },

  onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
    return {
      title: '水韵名邸 - 社区心声',
      path: '/pages/voice/voice',
    };
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      const rawList = await api.getVoiceList();
      const voiceList = rawList.map((item) => {
        const deadlineDate = new Date(item.deadline);
        const isExpired = deadlineDate.getTime() < new Date().setHours(0, 0, 0, 0);
        return {
          ...item,
          expired: isExpired,
          createTime: formatDate(item.createTime),
          deadline: formatDate(item.deadline),
        };
      }) as unknown as VoiceItem[];
      const { showArchived, searchKeyword } = this.data;
      let filteredVoiceList = showArchived
        ? voiceList
        : voiceList.filter((item) => !item.expired);
      if (searchKeyword) {
        const keyword = searchKeyword.trim().toLowerCase();
        filteredVoiceList = filteredVoiceList.filter(
          (item) =>
            item.type.toLowerCase().includes(keyword) ||
            item.content.toLowerCase().includes(keyword)
        );
      }
      this.setData({ allVoiceList: voiceList, filteredVoiceList, loading: false, refreshing: false });
    } catch (err) {
      console.error('loadData failed', err);
      this.setData({ loading: false, refreshing: false });
    }
  },

  onVoiceTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset as { id: number | string };
    wx.navigateTo({ url: `/pages/detail/detail?type=voice&id=${id}` });
  },

  onSearchInput(e: WechatMiniprogram.Input) {
    const keyword = e.detail.value.trim().toLowerCase();
    const { allVoiceList, showArchived } = this.data;
    let list = showArchived ? allVoiceList : allVoiceList.filter((item) => !item.expired);
    const filteredVoiceList = keyword
      ? list.filter((item) =>
          item.type.toLowerCase().includes(keyword) ||
          item.content.toLowerCase().includes(keyword)
        )
      : list;
    this.setData({ searchKeyword: e.detail.value, filteredVoiceList });
  },

  onSearchClear() {
    const { allVoiceList, showArchived } = this.data;
    const filteredVoiceList = showArchived
      ? allVoiceList
      : allVoiceList.filter((item) => !item.expired);
    this.setData({ searchKeyword: '', filteredVoiceList });
  },

  onToggleArchived() {
    const showArchived = !this.data.showArchived;
    const { allVoiceList, searchKeyword } = this.data;
    let list = showArchived ? allVoiceList : allVoiceList.filter((item) => !item.expired);
    if (searchKeyword) {
      const keyword = searchKeyword.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.type.toLowerCase().includes(keyword) ||
          item.content.toLowerCase().includes(keyword)
      );
    }
    this.setData({ showArchived, filteredVoiceList: list });
  },

  onPublishTap() {
    wx.navigateTo({ url: '/pages/voice-publish/voice-publish' });
  },

});
