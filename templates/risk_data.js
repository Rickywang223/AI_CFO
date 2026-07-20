// ===== V2 Risk Monitoring Data =====
const REGION_DATA = [
    { id: 'huadong', name: '华东区域', companies: 180, abnormal: 18, highRisk: 3, midRisk: 8, lowRisk: 7, riskRate: '10.0%', trend: 'up', trendLabel: '↑↑' },
    { id: 'huanan', name: '华南区域', companies: 98, abnormal: 8, highRisk: 0, midRisk: 4, lowRisk: 4, riskRate: '8.2%', trend: 'flat', trendLabel: '→' },
    { id: 'huabei', name: '华北区域', companies: 112, abnormal: 7, highRisk: 0, midRisk: 3, lowRisk: 4, riskRate: '6.2%', trend: 'down', trendLabel: '↓' },
    { id: 'huazhong', name: '华中区域', companies: 156, abnormal: 4, highRisk: 0, midRisk: 2, lowRisk: 2, riskRate: '2.6%', trend: 'down', trendLabel: '↓' },
    { id: 'touzi', name: '投资公司', companies: 54, abnormal: 8, highRisk: 0, midRisk: 4, lowRisk: 4, riskRate: '14.8%', trend: 'flat', trendLabel: '→' },
];
const TOP_RISK_COMPANIES = [
    { rank: 1, name: '华东·上海XX路店', region: '华东', score: 32, level: 'high', mainIssue: '合规率32%', loss: '52万' },
    { rank: 2, name: '华东·南京XX路店', region: '华东', score: 41, level: 'high', mainIssue: '认证率18%', loss: '38万' },
    { rank: 3, name: '投资公司', region: '投资公司', score: 45, level: 'high', mainIssue: '发票异常', loss: '30万' },
    { rank: 4, name: '华东·苏州XX路店', region: '华东', score: 48, level: 'mid', mainIssue: '供应商风险12%', loss: '25万' },
    { rank: 5, name: '华南·广州XX路店', region: '华南', score: 52, level: 'mid', mainIssue: '税负偏低', loss: '18万' },
];
const RECENT_ALERTS = [
    { time: '10:32', company: '华东·上海XX路店', level: 'high', summary: '大额发票未认证X张', region: '华东' },
    { time: '09:15', company: '投资公司', level: 'mid', summary: '集采供应商异常', region: '投资公司' },
    { time: '08:40', company: '华南·广州XX路店', level: 'mid', summary: '税负率偏低', region: '华南' },
];
const COMPANY_RISK_DETAIL = {};
COMPANY_RISK_DETAIL['华东·上海XX路店'] = { region: '华东', score: 32, level: 'high', kpi: { invoices: 12340, certRate: '28%', complianceRate: '32%', healthScore: 32, loss: '52万', supplierRisk: '8.1%' }, risks: [{ level: 'P0', title: '大额发票未认证 47张 >100万', status: '待处理' },{ level: 'P0', title: '明确不合规发票 234张', status: '处置中' },{ level: 'P1', title: '供应商风险偏高 雪峰12.3%', status: '待处理' },{ level: 'P2', title: '认证效率偏低 28%', status: '待处理' }] };
COMPANY_RISK_DETAIL['华东·南京XX路店'] = { region: '华东', score: 41, level: 'high', kpi: { invoices: 8920, certRate: '18%', complianceRate: '45%', healthScore: 41, loss: '38万', supplierRisk: '5.2%' }, risks: [{ level: 'P0', title: '认证率18% 超90天47张', status: '处置中' },{ level: 'P1', title: '供应商风险偏高', status: '待处理' }] };
COMPANY_RISK_DETAIL['投资公司'] = { region: '投资公司', score: 45, level: 'high', kpi: { invoices: 4560, certRate: '62%', complianceRate: '72%', healthScore: 68, loss: '30万', supplierRisk: '2.1%' }, risks: [{ level: 'P0', title: '发票异常 第三方平台凭证', status: '待处理' }] };

// ===== V3 Compliance Check Data =====
const COMPLIANCE_CHECK = {
    companyId: 'shanghai-xx-road', checkDate: '2026年7月',
    summary: { total: 83, high: 2, mid: 49, low: 32, rating: '中等风险' },
    categories: [
        { name: '发票风险', icon: '📄', items: [
            { level: 'high', title: '进项风险发票(异常凭证)', desc: '2张异常凭证', detail: '共2张异常发票..义乌市碧火电子..西安博特汽车美容..', suggestions: ['核实发票真实性', '异常凭证做进项转出'], policy: '《异常增值税扣税凭证管理》' },
            { level: 'mid', title: '保险特殊类发票合规风险', desc: '金额12,492元' }, { level: 'mid', title: '服装商品发票合规风险', desc: '金额18,521元' },
            { level: 'mid', title: '运费与增值税占比变动率偏高' }, { level: 'low', title: '发票税号与企业名不匹配' },
            { level: 'low', title: '当期大量红废发票' }, { level: 'mid', title: '代开发票风险' },
        ]},
        { name: '增值税风险', icon: '💰', items: [
            { level: 'mid', title: '申报表附表一扣除金额异常' }, { level: 'mid', title: '其他扣税凭证金额异常' },
            { level: 'mid', title: '未开具发票金额填写异常' }, { level: 'mid', title: '销售额与应纳税额配比异常' },
            { level: 'mid', title: '进项税增长但销项税下降' }, { level: 'mid', title: '应收账款增长率大于销售增长率' },
            { level: 'mid', title: '毛利率与税负变动率配比异常' }, { level: 'mid', title: '增值税税负率偏低' },
        ]},
        { name: '企业所得税风险', icon: '🏢', items: [
            { level: 'mid', title: '增值税与企业税收入差异比对' }, { level: 'mid', title: '成本费用利润率异常' },
            { level: 'mid', title: '营业成本未足额取得发票' }, { level: 'mid', title: '固定资产折旧申报异常' },
            { level: 'mid', title: '研发费用填报异常' }, { level: 'mid', title: '财报资产减少未体现处置利得' },
        ]},
        { name: '其他税种风险', icon: '📊', items: [
            { level: 'mid', title: '印花税合同计税差异' }, { level: 'high', title: '房产税账载与税源差异' },
        ]},
        { name: '财务风险', icon: '📊', items: [
            { level: 'mid', title: '应收账款余额占比偏高' }, { level: 'mid', title: '经营活动现金流异常' },
        ]},
        { name: '履约风险', icon: '🤝', items: [
            { level: 'mid', title: '跨境服务无扣缴记录' },
        ]},
        { name: '上下游企业风险', icon: '🏭', items: [
            { level: 'mid', title: '供应商税收违法信息' }, { level: 'mid', title: '客户税收违法信息' },
        ]},
    ]
};
