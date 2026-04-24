import type {
  Banner,
  QuickEntry,
  NewsItem,
  NewsDetail,
  TradeItem,
  TradeDetail,
  ServiceItem,
  ScheduleItem,
  PaymentItem,
  PaymentDetail,
  ShuttleTime,
  ProfileItem,
  Category,
} from '../types/data';

/** ========== 首页 ========== */

export function getBanners(): Banner[] {
  return [];
}

export function getQuickEntries(): QuickEntry[] {
  return [];
}

export function getLatestNews(): NewsItem[] {
  return [];
}

export function getTodaySchedules(): Pick<ScheduleItem, 'id' | 'title' | 'time' | 'location' | 'status'>[] {
  return [];
}

/** ========== 新闻资讯 ========== */

export function getNewsList(): NewsItem[] {
  return [];
}

export function getNewsDetail(_id: number): NewsDetail | null {
  return null;
}

/** ========== 闲置交易 ========== */

export function getTradeCategories(): Category[] {
  return [];
}

export function getTradeList(): TradeItem[] {
  return [];
}

export function getTradeDetail(id: number): TradeDetail | null {
  const published = wx.getStorageSync('publishedTrades') as TradeItem[] || [];
  const found = published.find(item => String(item.id) === String(id));
  if (!found) {
    return null;
  }

  const detail: TradeDetail = { ...found };
  detail.discount = Math.round((detail.originalPrice - detail.price) / detail.originalPrice * 100);
  if ((detail as TradeItem & { image?: string }).image && !detail.images) {
    detail.images = [(detail as TradeItem & { image?: string }).image!];
  }
  if (!detail.images) {
    detail.images = [];
  }

  return detail;
}

export function getPublishedTrades(): TradeItem[] {
  return wx.getStorageSync('publishedTrades') as TradeItem[] || [];
}

export function savePublishedTrade(trade: TradeItem): void {
  let published = getPublishedTrades();
  published.unshift(trade);
  if (published.length > 50) {
    published = published.slice(0, 50);
  }
  wx.setStorageSync('publishedTrades', published);
}

/** ========== 周边生活 ========== */

export function getServiceCategories(): Category[] {
  return [];
}

export function getServiceList(_category: string): ServiceItem[] {
  return [];
}

/** ========== 便民安排 ========== */

export function getSchedules(): ScheduleItem[] {
  return [];
}

/** ========== 缴费知识 ========== */

export function getPaymentList(): PaymentItem[] {
  return [];
}

export function getPaymentDetail(_id: number): PaymentDetail | null {
  return null;
}

/** ========== 班车信息 ========== */

export function getShuttleSchedule(): ShuttleTime[] {
  return [];
}

export function getShuttleStops(): string[] {
  return [];
}

export function getShuttleContactPhone(): string {
  return '';
}

export function getShuttleRouteName(): string {
  return '';
}

export function getShuttleRunNote(): string {
  return '';
}

/** ========== 个人中心 ========== */

export function getProfileItems(): ProfileItem[] {
  return [];
}

export function getContactPhones(): { label: string; number: string }[] {
  return [];
}
