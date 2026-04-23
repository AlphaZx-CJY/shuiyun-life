Page({
  data: {
    paymentId: null,
    payment: null
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ paymentId: id });
    this.loadPaymentDetail(id);
  },

  onShareAppMessage() {
    return {
      title: this.data.payment?.title || '缴费详情',
      path: `/pages/payment-detail/payment-detail?id=${this.data.paymentId}`
    };
  },

  loadPaymentDetail(id) {
    const paymentData = {
      1: {
        id: 1,
        title: '物业费缴纳指南',
        tag: '物业费',
        content: `
<h2>缴纳方式</h2>
<ul>
<li><strong>线上缴纳</strong>：通过"水韵名邸"公众号 → 物业服务 → 在线缴费，支持微信/支付宝/银联</li>
<li><strong>现场缴纳</strong>：物业服务中心前台（工作日 9:00-17:00，周末 10:00-16:00）</li>
<li><strong>银行转账</strong>：开户行工商银行长宁支行，账号：6222 0000 0000 0000 000</li>
</ul>
<h2>优惠政策</h2>
<ul>
<li>早鸟优惠：5月31日前缴纳享<strong>98折</strong></li>
<li>按时缴纳：6月30日前缴纳无滞纳金</li>
<li>一次性缴纳全年送保洁服务1次</li>
</ul>
<h2>收费标准</h2>
<table>
<tr><td>住宅</td><td>2.8元/平方米/月</td></tr>
<tr><td>地下车位</td><td>80元/月</td></tr>
<tr><td>地面临时停车</td><td>5元/小时，封顶30元/天</td></tr>
</table>
<h2>常见问题</h2>
<p><strong>Q：物业费包含哪些内容？</strong></p>
<p>A：包含公共区域保洁、绿化养护、电梯维保、消防设施维护、保安巡逻等。</p>
<p><strong>Q：逾期未缴纳会怎样？</strong></p>
<p>A：逾期将按日收取0.05%滞纳金，连续3个月未缴纳将暂停门禁卡权限。</p>
        `,
        date: '2025-04-20'
      },
      2: {
        id: 2,
        title: '水费缴纳流程',
        tag: '水费',
        content: `
<h2>缴费渠道</h2>
<ul>
<li><strong>微信</strong>：我 → 服务 → 生活缴费 → 水费 → 选择"上海自来水"</li>
<li><strong>支付宝</strong>：生活缴费 → 水费 → 输入户号</li>
<li><strong>银行APP</strong>：工行/建行/招行APP生活缴费板块</li>
</ul>
<h2>户号查询</h2>
<p>水费账单上12位数字即为户号，或拨打供水热线962740查询。</p>
<h2>收费标准</h2>
<p>上海居民用水实行阶梯价格：</p>
<ul>
<li>第一阶梯（0-220立方米/年）：3.45元/立方米</li>
<li>第二阶梯（220-300立方米/年）：4.83元/立方米</li>
<li>第三阶梯（300立方米以上/年）：5.83元/立方米</li>
</ul>
        `,
        date: '2025-04-15'
      },
      3: {
        id: 3,
        title: '电费阶梯计价说明',
        tag: '电费',
        content: `
<h2>阶梯电价标准</h2>
<table>
<tr><td>第一阶梯</td><td>0-3120度/年</td><td>0.617元/度</td></tr>
<tr><td>第二阶梯</td><td>3120-4800度/年</td><td>0.677元/度</td></tr>
<tr><td>第三阶梯</td><td>4800度以上/年</td><td>0.977元/度</td></tr>
</table>
<h2>省电小贴士</h2>
<ul>
<li>空调设定26℃，每调高1℃可省电6%-8%</li>
<li>热水器设定50℃-55℃，不用时关闭</li>
<li>电器待机也会耗电，建议拔掉不用的插头</li>
<li>使用LED灯泡，比传统灯泡节能80%</li>
</ul>
<h2>缴费方式</h2>
<p>可通过"网上国网"APP、微信、支付宝、银行代扣等方式缴纳。</p>
        `,
        date: '2025-04-10'
      },
      4: {
        id: 4,
        title: '燃气费查询与缴纳',
        tag: '燃气费',
        content: `
<h2>表具读数</h2>
<p>燃气表位于厨房橱柜内，黑色数字为整数位，红色为小数位。每月10日抄表。</p>
<h2>缴费渠道</h2>
<ul>
<li>"上海燃气"APP</li>
<li>微信/支付宝生活缴费</li>
<li>银行代扣（推荐，避免忘缴）</li>
</ul>
<h2>安全须知</h2>
<ul>
<li>闻到异味立即关闭总阀，开窗通风，勿开关电器</li>
<li>胶管每18个月更换一次</li>
<li>热水器烟管必须伸出室外</li>
<li>离家超过3天建议关闭总阀</li>
</ul>
        `,
        date: '2025-04-05'
      },
      5: {
        id: 5,
        title: '停车费月租办理',
        tag: '停车费',
        content: `
<h2>月租费用</h2>
<ul>
<li>地下固定车位：500元/月（含管理费）</li>
<li>地下非固定车位：400元/月</li>
<li>地面月租：300元/月</li>
</ul>
<h2>办理流程</h2>
<ol>
<li>携带身份证、行驶证至物业前台</li>
<li>填写《停车位租赁申请表》</li>
<li>缴纳首月费用及押金500元</li>
<li>领取蓝牙门禁卡</li>
</ol>
<h2>注意事项</h2>
<ul>
<li>月租车位按月缴纳，每月25日前缴纳下月费用</li>
<li>退租需提前15天告知，押金无息退还</li>
<li>车位仅限登记车辆使用，不得转租</li>
</ul>
        `,
        date: '2025-04-01'
      }
    };
    this.setData({ payment: paymentData[id] || null });
  }
});
