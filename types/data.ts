/** ========== 通用类型 ========== */

export type NewsCategory = 'all' | 'notice' | 'policy' | 'around';
export type TradeCategory = 'all' | 'furniture' | 'appliance' | 'baby' | 'books' | 'others';
export type ServiceCategory = 'supermarket' | 'market' | 'food' | 'hotel' | 'transport' | 'school' | 'leisure' | 'medical' | 'mall';
export type ScheduleStatus = 'upcoming' | 'ended';
export type ShuttleStatus = 'passed' | 'soon' | 'upcoming';

export interface GeoPoint {
  longitude: number;
  latitude: number;
}

/** ========== 首页 ========== */

export interface QuickEntry {
  id: number;
  icon: string;
  label: string;
  color: string;
  path: string;
}

/** ========== 新闻资讯 ========== */

export interface NewsItem {
  id: number | string;
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
  id: number | string;
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

export type JumpType = 'miniprogram' | 'officialAccount';

export interface ServiceItem {
  id: number | string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  phone: string;
  tags: string[];
  location?: GeoPoint;
  jump?: {
    type: JumpType;
    appId?: string;
    username?: string;
    path?: string;
  };
}

/** ========== 便民安排 ========== */

export interface ScheduleItem {
  id: number | string;
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
  id: number | string;
  title: string;
  summary: string;
  tag: string;
  tagType: string;
  date: string;
  hot: boolean;
}

export interface PaymentDetail {
  id: number | string;
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
  id: number | string;
  title: string;
  icon: string;
  path: string;
}

/** ========== 物业联系方式 ========== */

export interface ContactItem {
  id: number | string;
  label: string;
  number: string;
}

/** ========== 社区心声 ========== */

export interface VoiceItem {
  id: number | string;
  type: string;
  content: string;
  contact: string;
  expired: boolean;
  deadline: string;
  createTime: Date;
}

export interface FeedbackItem {
  id: number | string;
  type: string;
  content: string;
  contact: string;
  status: string;
  createTime: Date;
}

/** ========== 反馈配置 ========== */

export interface FeedbackConfig {
  id: number | string;
  title: string;
  content: string;
  contactInfo: string;
}

/** ========== 使用指南 ========== */

export interface GuideItem {
  id: number | string;
  title: string;
  tag: string;
  date: string;
}

export interface GuideDetail extends GuideItem {
  content: string;
}
