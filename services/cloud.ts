/**
 * 云开发基础能力封装
 *
 * 前置条件：
 * 1. 在微信开发者工具中点击「云开发」按钮开通服务
 * 2. 将 app.ts 中 wx.cloud.init() 的 env 替换为真实环境 ID
 * 3. 在云控制台数据库中创建对应集合
 */

const db = wx.cloud.database();

/** 获取集合引用 */
export function getCollection(name: string) {
  return db.collection(name);
}

export interface QueryOptions {
  orderBy?: { field: string; desc?: boolean }[];
  limit?: number;
}

/**
 * 条件查询
 * @param collection 集合名称
 * @param where 查询条件对象，如 { category: 'notice' }
 * @param options 排序与分页选项
 * @returns Promise<查询结果数组>
 */
export function query<T = any>(
  collection: string,
  where?: Record<string, any>,
  options?: QueryOptions,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    let queryRef: any = db.collection(collection);
    if (where) {
      queryRef = queryRef.where(where);
    }
    if (options?.orderBy) {
      options.orderBy.forEach((o) => {
        queryRef = queryRef.orderBy(o.field, o.desc ? 'desc' : 'asc');
      });
    }
    if (options?.limit) {
      queryRef = queryRef.limit(options.limit);
    }
    queryRef.get({
      success: (res) => resolve(res.data as T[]),
      fail: (err) => reject(err),
    });
  });
}

/**
 * 新增文档
 * @param collection 集合名称
 * @param data 文档数据
 * @returns Promise<新增结果>
 */
export function add<T = any>(collection: string, data: Record<string, any>): Promise<T> {
  return new Promise((resolve, reject) => {
    db.collection(collection).add({
      data,
      success: (res) => resolve(res as unknown as T),
      fail: (err) => reject(err),
    });
  });
}

/**
 * 调用云函数
 * @param name 云函数名称
 * @param data 传入参数
 * @returns Promise<云函数返回结果>
 */
export function callFunction<T = any>(name: string, data?: Record<string, any>): Promise<T> {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success: (res) => resolve(res.result as T),
      fail: (err) => reject(err),
    });
  });
}

/** 导出原始数据库实例，供高级查询使用 */
export { db };
