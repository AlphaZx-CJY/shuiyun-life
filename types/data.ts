/** ========== 通用类型 ========== */

export type NewsCategory = 'all' | 'notice' | 'policy' | 'around';
export type TradeCategory = 'all' | 'furniture' | 'appliance' | 'baby' | 'books' | 'others';
export type ServiceCategory = 'supermarket' | 'market' | 'food' | 'hotel' | 'transport' | 'school' | 'leisure';
export type ScheduleStatus = 'upcoming' | 'ended';
export type ShuttleStatus = 'passed' | 'soon' | 'upcoming';

/** ========== 首页 ========== */

export interface Banner {
  id: number;
  image: string;
  title: string;
}

export interface QuickEntry {
  id: number;
  icon: string;
  label: string;
  color: string;
  path: string;
}

/** ========== 新闻资讯 ========== */

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  tag: string;
  category: Exclude<NewsCategory, 'all'>;
  cover: string;
}

export interface NewsDetail extends NewsItem {
  content: string;
  viewCount: number;
}

/** ========== 闲置交易 ========== */

export interface TradeItem {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  category: Exclude<TradeCategory, 'all'>;
  images: string[];
  seller: string;
  time: string;
  location: string;
  description: string;
}

export interface TradeDetail extends TradeItem {
  phone?: string;
  discount?: number;
}

export interface TradeForm {
  title: string;
  price: string;
  originalPrice: string;
  description: string;
  seller: string;
  phone: string;
  location: string;
}

/** ========== 周边生活 ========== */

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  address: string;
  distance: string;
  hours: string;
  phone: string;
  tags: string[];
}

/** ========== 便民安排 ========== */

export interface ScheduleItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: ScheduleStatus;
  type: string;
}

/** ========== 缴费知识 ========== */

export interface PaymentItem {
  id: number;
  title: string;
  summary: string;
  tag: string;
  tagType: string;
  date: string;
  hot: boolean;
}

export interface PaymentDetail {
  id: number;
  title: string;
  tag: string;
  content: string;
  date: string;
}

/** ========== 班车信息 ========== */

export interface ShuttleTime {
  time: string;
  status: ShuttleStatus;
}

/** ========== 个人中心 ========== */

export interface ProfileItem {
  id: number;
  title: string;
  icon: string;
  path: string;
}
