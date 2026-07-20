/* ===== Risk Module V2+V3 Functions ===== */
var _expandedCategories = {};

function renderRiskModule() {
    var h = '';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">';
    h += '<h2 style="font-size:16px;margin:0;">⚠️ 风险监控</h2>';
    h += '<div style="font-size:12px;color:#8c8c8c;">扫描：600/600家 ✔️ 今日更新</div></div>';
    h += '<div class="dash-dim-row" style="margin-bottom:14px;">';
    h += '<div class="dash-dim-card" onclick="showRiskKPI(\'abnormal\')" style="cursor:pointer;border-left:3px solid #f5222d;"><div style="font-size:10px;color:#8c8c8c;">🏢 异常公司</div><div style="font-size:22px;font-weight:700;color:#f5222d;">45</div><div style="font-size:10px;color:#8c8c8c;">/ 600家 • 7.5%</div></div>';
    h += '<div class="dash-dim-card" onclick="showRiskKPI(\'highrisk\')" style="cursor:pointer;border-left:3px solid #faad14;"><div style="font-size:10px;color:#8c8c8c;">🔴 高风险公司</div><div style="font-size:22px;font-weight:700;color:#faad14;">3</div><div style="font-size:10px;color:#8c8c8c;">需立即处置</div></div>';
    h += '<div class="dash-dim-card" onclick="showRiskKPI(\'loss\')" style="cursor:pointer;border-left:3px solid #1890ff;"><div style="font-size:10px;color:#8c8c8c;">💰 预估损失</div><div style="font-size:22px;font-weight:700;color:#1890ff;">~640万</div><div style="font-size:10px;color:#8c8c8c;">待确认</div></div>';
    h += '<div class="dash-dim-card" onclick="showRiskKPI(\'disposal\')" style="cursor:pointer;border-left:3px solid #52c41a;"><div style="font-size:10px;color:#8c8c8c;">📈 处置率</div><div style="font-size:22px;font-weight:700;color:#52c41a;">26.7%</div><div style="font-size:10px;color:#8c8c8c;">偏低</div></div></div>';
    h += '<div class="dash-section"><div class="dash-section-title">📍 按区域分布</div><table style="width:100%;border-collapse:collapse;font-size:12px;"><tr style="color:#8c8c8c;font-size:10px;"><th style="text-align:left;padding:4px 8px;border-bottom:1px solid #f0f0f0;">区域</th><th style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0;">公司数</th><th style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0;">异常数</th><th style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0;">风险率</th><th style="text-align:center;padding:4px 8px;border-bottom:1px solid #f0f0f0;">趋势</th><th style="text-align:center;padding:4px 8px;border-bottom:1px solid #f0f0f0;">操作</th></tr>';
    REGION_DATA.forEach(function(r) {
        var rc = r.riskRate > 10 ? '#f5222d' : (r.riskRate > 5 ? '#faad14' : '#52c41a');
        h += '<tr style="cursor:pointer;" onclick="showRegionDrill(\'' + r.id + '\')" onmouseover="this.style.background=\'#f5f5f5\'" onmouseout="this.style.background=\'\'">';
        h += '<td style="padding:8px;border-bottom:1px solid #f0f0f0;font-weight:500;"><span style="color:' + rc + ';">●</span> ' + r.name + '</td>';
        h += '<td style="text-align:right;padding:8px;border-bottom:1px solid #f0f0f0;">' + r.companies + '</td>';
        h += '<td style="text-align:right;padding:8px;border-bottom:1px solid #f0f0f0;color:' + rc + ';font-weight:600;">' + r.abnormal + '</td>';
        h += '<td style="text-align:right;padding:8px;border-bottom:1px solid #f0f0f0;color:' + rc + ';">' + r.riskRate + '</td>';
        h += '<td style="text-align:center;padding:8px;border-bottom:1px solid #f0f0f0;">' + (r.trend === 'up' ? '🔼' : (r.trend === 'down' ? '🔽' : '▶️')) + '</td>';
        h += '<td style="text-align:center;padding:8px;border-bottom:1px solid #f0f0f0;"><span style="color:#1890ff;font-size:10px;">[查看]</span></td></tr>';
    });
    h += '</table></div>';
    h += '<div class="dash-section"><div class="dash-section-title">🔥 风险TOP 5公司</div>';
    TOP_RISK_COMPANIES.forEach(function(c) {
        var lc = c.level === 'high' ? '#f5222d' : '#faad14';
        h += '<div style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;cursor:pointer;" onclick="showCompanyDetail(\'' + c.name + '\')" onmouseover="this.style.background=\'#fafafa\'" onmouseout="this.style.background=\'\'">';
        h += '<div style="width:20px;font-size:10px;color:#8c8c8c;font-weight:600;">' + c.rank + '</div>';
        h += '<div style="flex:1;"><div style="font-size:12px;font-weight:500;">' + c.name + '</div><div style="font-size:10px;color:#8c8c8c;">' + c.mainIssue + '</div></div>';
        h += '<div style="text-align:right;"><div style="font-size:14px;font-weight:700;color:' + lc + ';">' + c.score + '</div><div style="font-size:9px;color:#8c8c8c;">损失' + c.loss + '</div></div></div>';
    });
    h += '</div>';
    h += '<div class="dash-section"><div class="dash-section-title">📋 最新异常公司（今日新增）</div>';
    RECENT_ALERTS.forEach(function(a) {
        var ac = a.level === 'high' ? '#f5222d' : '#faad14';
        h += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0;cursor:pointer;" onclick="showCompanyDetail(\'' + a.company + '\')">';
        h += '<div style="font-size:10px;color:#8c8c8c;min-width:40px;">' + a.time + '</div>';
        h += '<div style="width:8px;height:8px;border-radius:50%;background:' + ac + ';flex-shrink:0;"></div>';
        h += '<div style="flex:1;"><span style="font-size:12px;font-weight:500;">' + a.company + '</span><span style="font-size:10px;color:#8c8c8c;margin-left:8px;">' + a.summary + '</span></div></div>';
    });
    h += '</div>';
    document.getElementById('view-\u98ce\u9669').innerHTML = h;
}

function showRiskKPI(type) {
    var h = '';
    if (type === 'abnormal') {
        h = '<div class="cal-modal" style="width:560px;"><div class="cal-modal-header"><div class="cal-modal-title">🏢 异常公司清单(45家)</div><button class="cal-modal-close" onclick="closeRiskDrill()">✕</button></div>';
        REGION_DATA.forEach(function(r) {
            h += '<div style="font-size:12px;font-weight:600;color:#333;margin:10px 0 6px;">' + r.name + '(' + r.abnormal + '家)</div>';
            for (var i = 0; i < Math.min(r.abnormal, 3); i++) {
                h += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px;border-bottom:1px solid #f5f5f5;"><span>⚠️ XX路店' + (i+1) + '</span><span style="color:#8c8c8c;font-size:10px;">风险' + (60 - i*8) + '分</span></div>';
            }
        });
        h += '<div style="margin-top:10px;text-align:center;"><span style="font-size:10px;color:#1890ff;cursor:pointer;padding:4px 12px;border:1px solid #1890ff;border-radius:4px;">📤 导出清单</span></div></div>';
    } else if (type === 'highrisk') {
        h = '<div class="cal-modal" style="width:560px;"><div class="cal-modal-header"><div class="cal-modal-title">🔴 高风险公司(3家)</div><button class="cal-modal-close" onclick="closeRiskDrill()">✕</button></div>';
        TOP_RISK_COMPANIES.slice(0,3).forEach(function(c) {
            h += '<div style="border:1px solid #ffccc7;border-radius:8px;padding:10px;margin-bottom:8px;background:#fff2f0;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:600;font-size:12px;">' + c.name + '</span><span style="background:#f5222d;color:#fff;padding:0 8px;border-radius:10px;font-size:10px;">' + c.score + '</span></div>';
            h += '<div style="font-size:10px;color:#8c8c8c;margin:4px 0;">损失' + c.loss + '</div>';
            h += '<div style="display:flex;gap:8px;"><span style="font-size:10px;color:#1890ff;cursor:pointer;padding:2px 8px;border:1px solid #1890ff;border-radius:4px;">📄 查看详情</span><span style="font-size:10px;color:#f5222d;cursor:pointer;padding:2px 8px;border:1px solid #f5222d;border-radius:4px;">⚡ 立即处置</span></div></div>';
        });
        h += '<div style="margin-top:8px;text-align:center;"><span style="font-size:10px;color:#f5222d;cursor:pointer;padding:4px 12px;border:1px solid #f5222d;border-radius:4px;">⚡ 一键处理全部高风险</span></div></div>';
    } else if (type === 'loss') {
        h = '<div class="cal-modal" style="width:560px;"><div class="cal-modal-header"><div class="cal-modal-title">💰 预估损失明细</div><button class="cal-modal-close" onclick="closeRiskDrill()">✕</button></div>';
        h += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;"><div><div style="font-size:12px;font-weight:500;">超期认证损失</div><div style="font-size:10px;color:#8c8c8c;">超90天未认证约70万张</div></div><div style="text-align:right;"><div style="font-size:14px;font-weight:700;color:#f5222d;">~280万</div><div style="font-size:10px;color:#8c8c8c;">43.8%</div></div></div>';
        h += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;"><div><div style="font-size:12px;font-weight:500;">不合规发票罚款</div><div style="font-size:10px;color:#8c8c8c;">3,573张不合规发票</div></div><div style="text-align:right;"><div style="font-size:14px;font-weight:700;color:#faad14;">~160万</div><div style="font-size:10px;color:#8c8c8c;">25.0%</div></div></div>';
        h += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;"><div><div style="font-size:12px;font-weight:500;">供应商风险敞口</div><div style="font-size:10px;color:#8c8c8c;">雪峰/合炘供应链</div></div><div style="text-align:right;"><div style="font-size:14px;font-weight:700;color:#1890ff;">~120万</div><div style="font-size:10px;color:#8c8c8c;">18.8%</div></div></div>';
        h += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;"><div><div style="font-size:12px;font-weight:500;">美团平台费异常</div><div style="font-size:10px;color:#8c8c8c;">2025年12月异常月份</div></div><div style="text-align:right;"><div style="font-size:14px;font-weight:700;color:#faad14;">~80万</div><div style="font-size:10px;color:#8c8c8c;">12.5%</div></div></div>';
        h += '<div style="display:flex;justify-content:space-between;padding:10px 0;font-weight:700;font-size:14px;border-top:1px solid #f0f0f0;"><span>合计</span><span style="color:#f5222d;">~640万</span></div></div>';
    } else if (type === 'disposal') {
        h = '<div class="cal-modal" style="width:560px;"><div class="cal-modal-header"><div class="cal-modal-title">📈 处置进度</div><button class="cal-modal-close" onclick="closeRiskDrill()">✕</button></div>';
        h += '<div style="font-size:11px;color:#8c8c8c;margin-bottom:10px;">总风险项：45家公司的103项</div>';
        h += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;"><div style="width:60px;font-size:12px;color:#52c41a;">已处理</div><div style="flex:1;height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;"><div style="height:100%;width:11.7%;background:#52c41a;border-radius:4px;"></div></div><div style="text-align:right;"><div style="font-size:13px;font-weight:600;">12</div><div style="font-size:9px;color:#8c8c8c;">11.7%</div></div></div>';
        h += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;"><div style="width:60px;font-size:12px;color:#1890ff;">处置中</div><div style="flex:1;height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;"><div style="height:100%;width:14.6%;background:#1890ff;border-radius:4px;"></div></div><div style="text-align:right;"><div style="font-size:13px;font-weight:600;">15</div><div style="font-size:9px;color:#8c8c8c;">14.6%</div></div></div>';
        h += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;"><div style="width:60px;font-size:12px;color:#f5222d;">待处理</div><div style="flex:1;height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;"><div style="height:100%;width:73.8%;background:#f5222d;border-radius:4px;"></div></div><div style="text-align:right;"><div style="font-size:13px;font-weight:600;">76</div><div style="font-size:9px;color:#8c8c8c;">73.8%</div></div></div>';
        h += '<div style="border-top:1px solid #f0f0f0;padding:8px 0;font-size:11px;"><span style="color:#8c8c8c;">趋势：上周21.2% → 本周26.7% </span><span style="color:#52c41a;font-weight:600;">↑ +5.5%</span></div></div>';
    }
    var overlay = document.createElement('div');
    overlay.className = 'cal-modal-overlay'; overlay.id = 'riskDrillOverlay';
    overlay.onclick = function(e) { if (e.target === this) this.remove(); };
    overlay.innerHTML = h;
    document.body.appendChild(overlay);
}
function closeRiskDrill() { var m = document.getElementById('riskDrillOverlay'); if (m) m.remove(); }

function showRegionDrill(regionId) {
    var r = REGION_DATA.find(function(x) { return x.id === regionId; });
    if (!r) return;
    var h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><h2 style="font-size:16px;margin:0;">⚠️ ' + r.name + ' · ' + r.companies + '家公司</h2><span style="font-size:11px;color:#1890ff;cursor:pointer;padding:4px 10px;border:1px solid #1890ff;border-radius:4px;" onclick="renderRiskModule()">🔙 返回集团看板</span></div>';
    h += '<div style="display:flex;gap:8px;margin-bottom:14px;"><div style="background:#fff2f0;border:1px solid #ffccc7;border-radius:8px;padding:8px 12px;text-align:center;flex:1;"><div style="font-size:10px;color:#8c8c8c;">🔴 高风险</div><div style="font-size:18px;font-weight:700;color:#f5222d;">' + r.highRisk + '</div></div><div style="background:#fffbe6;border:1px solid #ffe7ba;border-radius:8px;padding:8px 12px;text-align:center;flex:1;"><div style="font-size:10px;color:#8c8c8c;">⚠️ 中风险</div><div style="font-size:18px;font-weight:700;color:#faad14;">' + r.midRisk + '</div></div><div style="background:#f6ffed;border:1px solid #b7eb8f;border-radius:8px;padding:8px 12px;text-align:center;flex:1;"><div style="font-size:10px;color:#8c8c8c;">🟡 低风险</div><div style="font-size:18px;font-weight:700;color:#faad14;">' + r.lowRisk + '</div></div><div style="background:#f0f5ff;border:1px solid #91caff;border-radius:8px;padding:8px 12px;text-align:center;flex:1;"><div style="font-size:10px;color:#8c8c8c;">🟢 正常</div><div style="font-size:18px;font-weight:700;color:#52c41a;">' + (r.companies - r.abnormal) + '</div></div></div>';
    h += '<div class="dash-section"><div class="dash-section-title">🏢 风险公司列表</div>';
    for (var i = 0; i < Math.min(r.abnormal, 5); i++) {
        var score = 32 + i * 8; var level = score < 50 ? 'high' : 'mid'; var lc = level === 'high' ? '#f5222d' : '#faad14';
        h += '<div style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;"><div style="width:6px;height:6px;border-radius:50%;background:' + lc + ';margin-right:10px;flex-shrink:0;"></div><div style="flex:1;"><div style="font-size:12px;">' + r.name + 'XX路店' + (i+1) + '</div></div><div style="font-size:12px;font-weight:600;color:' + lc + ';">' + score + '</div></div>';
    }
    h += '</div>';
    document.getElementById('view-\u98ce\u9669').innerHTML = h;
}

function showCompanyDetail(name) {
    var d = COMPANY_RISK_DETAIL[name] || { region: '未知', score: 50, level: 'mid', kpi: {invoices:5000,certRate:'50%',complianceRate:'60%',healthScore:60,loss:'10万',supplierRisk:'3%'}, risks: [{level:'P1',title:'待检测',status:'待处理'}] };
    var lc = d.level === 'high' ? '#f5222d' : '#faad14';
    var h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><div><h2 style="font-size:16px;margin:0;">' + name + '</h2><div style="font-size:10px;color:#8c8c8c;margin-top:3px;">' + d.region + ' · 风险评分：' + d.score + '</div></div><span style="font-size:11px;color:#1890ff;cursor:pointer;padding:4px 10px;border:1px solid #1890ff;border-radius:4px;" onclick="renderRiskModule()">🔙 返回集团看板</span></div>';
    h += '<div style="display:flex;gap:0;margin-bottom:12px;border-bottom:2px solid #e8e8ed;"><div id="tabKPI" style="padding:8px 16px;font-size:12px;cursor:pointer;border-bottom:2px solid #1890ff;color:#1890ff;font-weight:600;" onclick="switchCompanyTab(\'' + name + '\',\'kpi\')">📊 核心KPI</div><div id="tabRisk" style="padding:8px 16px;font-size:12px;cursor:pointer;color:#595959;" onclick="switchCompanyTab(\'' + name + '\',\'risk\')">📋 风险列表</div><div id="tabCompliance" style="padding:8px 16px;font-size:12px;cursor:pointer;color:#595959;" onclick="switchCompanyTab(\'' + name + '\',\'compliance\')">📄 财税合规检测</div></div><div id="companyTabContent">';
    h += '<div class="dash-dim-row" style="margin-bottom:14px;"><div class="dash-dim-card"><div style="font-size:10px;color:#8c8c8c;">📄 发票数</div><div style="font-size:18px;font-weight:700;">' + d.kpi.invoices.toLocaleString() + '</div></div><div class="dash-dim-card" style="border-left:3px solid ' + (d.kpi.certRate < 50 ? '#f5222d' : '#52c41a') + ';"><div style="font-size:10px;color:#8c8c8c;">✅ 认证率</div><div style="font-size:18px;font-weight:700;">' + d.kpi.certRate + '</div></div><div class="dash-dim-card" style="border-left:3px solid ' + (d.kpi.complianceRate < 60 ? '#f5222d' : '#52c41a') + ';"><div style="font-size:10px;color:#8c8c8c;">🟢 合规率</div><div style="font-size:18px;font-weight:700;">' + d.kpi.complianceRate + '</div></div><div class="dash-dim-card" style="border-left:3px solid ' + lc + ';"><div style="font-size:10px;color:#8c8c8c;">⚡ 健康评分</div><div style="font-size:18px;font-weight:700;">' + d.kpi.healthScore + '/100</div></div></div>';
    h += '<div class="dash-section" style="margin-top:14px;"><div class="dash-section-title">📋 风险列表</div>';
    d.risks.forEach(function(r) {
        h += '<div style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;"><div style="width:36px;font-size:10px;font-weight:600;color:' + (r.level === 'P0' ? '#f5222d' : (r.level === 'P1' ? '#faad14' : '#1890ff')) + ';">' + r.level + '</div><div style="flex:1;font-size:12px;">' + r.title + '</div><div style="font-size:10px;padding:2px 8px;border-radius:4px;background:' + (r.status === '待处理' ? '#f5222d' : '#1890ff') + ';color:#fff;">' + r.status + '</div></div>';
    });
    h += '<div style="display:flex;gap:8px;margin-top:10px;"><span style="font-size:10px;color:#f5222d;cursor:pointer;padding:4px 12px;border:1px solid #f5222d;border-radius:4px;">⚡ 一键处理高风险项</span><span style="font-size:10px;color:#1890ff;cursor:pointer;padding:4px 12px;border:1px solid #1890ff;border-radius:4px;">📄 生成本公司风控报告</span></div></div></div>';
    document.getElementById('view-\u98ce\u9669').innerHTML = h;
}
function switchCompanyTab(name, tab) {
    var els = document.querySelectorAll('[id^="tab"]');
    els.forEach(function(t) { t.style.borderBottom = '2px solid transparent'; t.style.color = '#595959'; t.style.fontWeight = '400'; });
    var a = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (a) { a.style.borderBottom = '2px solid #1890ff'; a.style.color = '#1890ff'; a.style.fontWeight = '600'; }
    var d = COMPANY_RISK_DETAIL[name] || { region: '未知', score: 50, level: 'mid', kpi: {invoices:0,certRate:'0%',complianceRate:'0%',healthScore:0,loss:'0',supplierRisk:'0%'}, risks: [] };
    var c = document.getElementById('companyTabContent');
    if (tab === 'compliance') { renderComplianceCheck(name, d, c); }
    else if (tab === 'risk') { renderCompanyRiskList(name, d, c); }
    else { renderCompanyKPI(name, d, c); }
}
function renderCompanyKPI(name, d, container) {
    var lc = d.level === 'high' ? '#f5222d' : '#faad14';
    container.innerHTML = '<div class="dash-dim-row" style="margin-bottom:14px;"><div class="dash-dim-card"><div style="font-size:10px;color:#8c8c8c;">📄 发票数</div><div style="font-size:18px;font-weight:700;">' + (d.kpi.invoices || 0).toLocaleString() + '</div></div><div class="dash-dim-card" style="border-left:3px solid ' + (parseInt(d.kpi.certRate) < 50 ? '#f5222d' : '#52c41a') + ';"><div style="font-size:10px;color:#8c8c8c;">✅ 认证率</div><div style="font-size:18px;font-weight:700;">' + (d.kpi.certRate || '0') + '</div></div><div class="dash-dim-card" style="border-left:3px solid ' + (parseInt(d.kpi.complianceRate) < 60 ? '#f5222d' : '#52c41a') + ';"><div style="font-size:10px;color:#8c8c8c;">🟢 合规率</div><div style="font-size:18px;font-weight:700;">' + (d.kpi.complianceRate || '0') + '</div></div><div class="dash-dim-card" style="border-left:3px solid ' + lc + ';"><div style="font-size:10px;color:#8c8c8c;">⚡ 健康评分</div><div style="font-size:18px;font-weight:700;">' + (d.kpi.healthScore || '0') + '/100</div></div></div>';
}
function renderCompanyRiskList(name, d, container) {
    var h = '<div class="dash-section"><div class="dash-section-title">📋 风险列表</div>';
    if (d.risks && d.risks.length) { d.risks.forEach(function(r) { h += '<div style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;"><div style="width:36px;font-size:10px;font-weight:600;color:' + (r.level === 'P0' ? '#f5222d' : (r.level === 'P1' ? '#faad14' : '#1890ff')) + ';">' + r.level + '</div><div style="flex:1;font-size:12px;">' + r.title + '</div><div style="font-size:10px;padding:2px 8px;border-radius:4px;background:' + (r.status === '待处理' ? '#f5222d' : '#1890ff') + ';color:#fff;">' + r.status + '</div></div>'; }); }
    h += '</div>';
    container.innerHTML = h;
}
function renderComplianceCheck(name, d, container) {
    var c = COMPLIANCE_CHECK;
    var h = '<div class="dash-section"><div class="dash-section-title" style="display:flex;justify-content:space-between;"><span>📄 财税合规检测报告</span><span style="font-size:10px;color:#8c8c8c;font-weight:400;">' + c.checkDate + ' · ' + name + '</span></div>';
    h += '<div style="display:flex;gap:12px;margin-bottom:14px;"><div style="text-align:center;flex:1;background:#fff2f0;border-radius:8px;padding:10px;"><div style="font-size:10px;color:#8c8c8c;">检测项</div><div style="font-size:22px;font-weight:700;">' + c.summary.total + '</div></div><div style="text-align:center;flex:1;background:#fff2f0;border-radius:8px;padding:10px;"><div style="font-size:10px;color:#8c8c8c;">🔴 高风险</div><div style="font-size:22px;font-weight:700;color:#f5222d;">' + c.summary.high + '</div></div><div style="text-align:center;flex:1;background:#fffbe6;border-radius:8px;padding:10px;"><div style="font-size:10px;color:#8c8c8c;">⚠️ 中风险</div><div style="font-size:22px;font-weight:700;color:#faad14;">' + c.summary.mid + '</div></div><div style="text-align:center;flex:1;background:#f6ffed;border-radius:8px;padding:10px;"><div style="font-size:10px;color:#8c8c8c;">🟡 低风险</div><div style="font-size:22px;font-weight:700;color:#faad14;">' + c.summary.low + '</div></div></div>';
    c.categories.forEach(function(cat, i) {
        var exp = _expandedCategories[i] || false;
        var badge = {high:0,mid:0,low:0}; cat.items.forEach(function(it){badge[it.level]++;});
        h += '<div style="border:1px solid #e8e8ed;border-radius:8px;margin-bottom:8px;overflow:hidden;"><div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;cursor:pointer;background:#fafafa;" onclick="toggleCategory(' + i + ')"><div><span style="font-size:13px;font-weight:600;">' + cat.icon + ' ' + cat.name + '</span><span style="font-size:10px;color:#8c8c8c;margin-left:8px;">' + cat.items.length + '项</span></div><div style="display:flex;gap:6px;align-items:center;">' + (badge.high > 0 ? '<span style="font-size:9px;background:#fff2f0;color:#f5222d;padding:1px 6px;border-radius:8px;">🔴 ' + badge.high + '</span>' : '') + (badge.mid > 0 ? '<span style="font-size:9px;background:#fffbe6;color:#faad14;padding:1px 6px;border-radius:8px;">⚠️ ' + badge.mid + '</span>' : '') + '<span style="font-size:12px;color:#bfbfbf;">' + (exp ? '▲' : '▼') + '</span></div></div><div id="catContent' + i + '" style="' + (exp ? '' : 'display:none;') + 'padding:0 12px 10px;">';
        cat.items.forEach(function(it) {
            var lc = it.level === 'high' ? '#f5222d' : (it.level === 'mid' ? '#faad14' : '#1890ff');
            h += '<div style="display:flex;align-items:center;padding:6px 0;border-bottom:1px solid #f5f5f5;cursor:pointer;" onclick="showComplianceDetail(' + i + ',' + cat.items.indexOf(it) + ')"><div style="width:8px;height:8px;border-radius:50%;background:' + lc + ';flex-shrink:0;margin-right:8px;"></div><div style="flex:1;font-size:12px;">' + it.title + '</div><div style="font-size:10px;color:#8c8c8c;">' + (it.desc || '') + '</div></div>';
        });
        h += '</div></div>';
    });
    container.innerHTML = h;
}
function toggleCategory(idx) { _expandedCategories[idx] = !_expandedCategories[idx]; var el = document.getElementById('catContent' + idx); if (el) { el.style.display = _expandedCategories[idx] ? '' : 'none'; } }
function showComplianceDetail(catIdx, itemIdx) {
    var item = COMPLIANCE_CHECK.categories[catIdx].items[itemIdx];
    var lc = item.level === 'high' ? '#f5222d' : (item.level === 'mid' ? '#faad14' : '#1890ff');
    var ln = item.level === 'high' ? '高风险' : (item.level === 'mid' ? '中风险' : '低风险');
    var h = '<div class="cal-modal" style="width:560px;"><div class="cal-modal-header"><div class="cal-modal-title" style="font-size:14px;">' + item.title + '</div><button class="cal-modal-close" onclick="closeRiskDrill()">✕</button></div><div style="margin-bottom:10px;"><span style="background:' + lc + ';color:#fff;padding:1px 8px;border-radius:10px;font-size:10px;">' + ln + '</span></div>';
    h += '<div style="font-size:12px;font-weight:600;color:#333;margin-bottom:6px;">📋 风险描述</div><div style="font-size:12px;color:#595959;line-height:1.6;margin-bottom:12px;">此模块用于展示公司取得的发票状态不为正常状态的进项发票，主要用于识别被认定为异常凭证的进项发票。</div>';
    if (item.detail) { h += '<div style="font-size:12px;font-weight:600;color:#333;margin-bottom:6px;">📊 异常详情</div><div style="font-size:12px;color:#595959;line-height:1.6;margin-bottom:12px;padding:8px;background:#f5f5f5;border-radius:6px;">' + item.detail + '</div>'; }
    if (item.suggestions && item.suggestions.length) {
        h += '<div style="font-size:12px;font-weight:600;color:#52c41a;margin-bottom:6px;">✅ 应对建议</div><ol style="font-size:12px;color:#595959;line-height:1.8;padding-left:20px;">';
        item.suggestions.forEach(function(s) { h += '<li>' + s + '</li>'; }); h += '</ol>';
    }
    if (item.policy) { h += '<div style="font-size:12px;font-weight:600;color:#8c8c8c;margin-bottom:4px;">📜 政策依据</div><div style="font-size:11px;color:#8c8c8c;padding:6px 8px;background:#fafafa;border-radius:4px;">' + item.policy + '</div>'; }
    h += '<div style="display:flex;gap:8px;margin-top:14px;"><span style="font-size:10px;color:#52c41a;cursor:pointer;padding:4px 12px;border:1px solid #52c41a;border-radius:4px;">✅ 标记已处理</span><span style="font-size:10px;color:#1890ff;cursor:pointer;padding:4px 12px;border:1px solid #1890ff;border-radius:4px;">📄 查看原始发票</span></div></div>';
    var overlay = document.createElement('div');
    overlay.className = 'cal-modal-overlay'; overlay.id = 'riskDrillOverlay';
    overlay.onclick = function(e) { if (e.target === this) this.remove(); };
    overlay.innerHTML = h;
    document.body.appendChild(overlay);
}
