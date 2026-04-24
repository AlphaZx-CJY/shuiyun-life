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

import {
  banners,
  quickEntries,
  latestNews,
  todaySchedules,
  allNews,
  newsDetails,
  trades,
  tradeDetails,
  tradeCategories,
  serviceCategories,
  serviceData,
  schedules,
  payments,
  paymentDetails,
  shuttleSchedule,
  shuttleStops,
  shuttleContactPhone,
  shuttleRouteName,
  shuttleRunNote,
  profileItems,
  contactPhones,
} from '../data/mock';

/** ========== 首页 ========== */

export function getBanners(): Banner[] {
  return banners;
}

export function getQuickEntries(): QuickEntry[] {
  return quickEntries;
}

export function getLatestNews(): NewsItem[] {
  return latestNews;
}

export function getTodaySchedules(): Pick<ScheduleItem, 'id' | 'title' | 'time' | 'location' | 'status'>[] {
  return todaySchedules;
}

/** ========== 新闻资讯 ========== */

export function getNewsList(): NewsItem[] {
  return allNews;
}

export function getNewsDetail(id: number): NewsDetail | null {
  return newsDetails[id] || null;
}

/** ========== 闲置交易 ========== */

export function getTradeCategories(): Category[] {
  return tradeCategories;
}

export function getTradeList(): TradeItem[] {
  return trades;
}

export function getTradeDetail(id: number): TradeDetail | null {
  // 先从 mock 数据中查找
  let detail = tradeDetails[id] || null;

  // 再从已发布数据中查找
  if (!detail) {
    const published = wx.getStorageSync('publishedTrades') as TradeItem[] || [];
    const found = published.find(item => String(item.id) === String(id));
    if (found) {
      detail = { ...found };
    }
  }

  if (detail) {
    detail.discount = Math.round((detail.originalPrice - detail.price) / detail.originalPrice * 100);
    // 兼容旧数据：单张图片转数组
    if ((detail as TradeItem & { image?: string }).image && !detail.images) {
      detail.images = [(detail as TradeItem & { image?: string }).image!];
    }
    if (!detail.images) {
      detail.images = [];
    }
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
  return serviceCategories;
}

export function getServiceList(category: string): ServiceItem[] {
  return serviceData[category] || [];
}

/** ========== 便民安排 ========== */

export function getSchedules(): ScheduleItem[] {
  return schedules;
}

/** ========== 缴费知识 ========== */

export function getPaymentList(): PaymentItem[] {
  return payments;
}

export function getPaymentDetail(id: number): PaymentDetail | null {
  return paymentDetails[id] || null;
}

/** ========== 班车信息 ========== */

export function getShuttleSchedule(): ShuttleTime[] {
  return shuttleSchedule.map(item => ({ ...item }));
}

export function getShuttleStops(): string[] {
  return shuttleStops;
}

export function getShuttleContactPhone(): string {
  return shuttleContactPhone;
}

export function getShuttleRouteName(): string {
  return shuttleRouteName;
}

export function getShuttleRunNote(): string {
  return shuttleRunNote;
}

/** ========== 个人中心 ========== */

export function getProfileItems(): ProfileItem[] {
  return profileItems;
}

export function getContactPhones(): { label: string; number: string }[] {
  return contactPhones;
}
