#!/usr/bin/env python3
"""税安 AI 税务操作系统 Demo"""
import json
from datetime import datetime
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# 加载汉堡王数据
with open("/home/rickyclaw/汉堡王经营洞察/data/burgerking_data.json", "r") as f:
    BK_DATA = json.load(f)

# 模拟AI问答的响应逻辑
AI_RESPONSES = {
    "风险": """根据最近一次全量扫描（2026年7月），您的发票合规情况如下：

**🟢 合规发票：** 1,980,188张（59.9%）
**🟡 待确认合规：** 1,320,446张（40.0%）
**🔴 明确不合规：** 3,573张（0.1%）

**重点关注：**
• 有风险标注的发票：683,431张（20.7%）
• 未认证发票：1,937,407张（58.6%）
• 大额未认证（>100万）：建议立即处理

建议：优先处理P0级风险——大额未认证发票和明确不合规的3,573张。""",

    "认证": """当前认证状态分析：

**已认证：** 1,366,800张（41.4%）
**未认证：** 1,937,407张（58.6%）

未认证发票中：
• 最近30天内到票：约34万张（仍在认证期限内）
• 30-90天：约89万张（⚠️ 建议尽快认证）
• 超过90天：约70万张（🔴 已超认证期限，可能产生损失）

**预估已超期导致的进项损失：约280-350万元**
建议：优先认证30-90天区间的发票，这是最紧迫的窗口。""",

    "申报": """基于当前数据的申报预测（2026年7月）：

**📊 本月预估**
• 销项税额（基于历史趋势推算）：约4,800万
• 进项税额（已发生+预估）：约3,200万
• 应缴增值税：约1,600万

**📈 趋势对比**
• 较上月：+5.2%（季节性上升）
• 较去年同期：-8.1%（可能与门店优化有关）

**💡 建议：** 本月有约70万张发票超过90天未认证，
如能及时补救，可减少进项损失约100-120万。""",

    "供应商": """供应商合规分析：

**TOP5供应商合规状态：**

| 供应商 | 发票数 | 风险标注率 |
|-------|:-----:|:---------:|
| 汉堡王（中国）投资有限公司 | 83,854张 | 低（2.1%）|
| 重庆雪峰致远供应链 | 2,184张 | 中（8.3%）|
| 上海合炘供应链 | 1,789张 | 中（7.6%）|
| 上海外服（集团） | 692张 | 低（0.5%）|
| 北京三快在线（美团） | 15,522张 | 低（1.2%）|

**⚠️ 需要关注：**
雪峰致远和合炘供应链的风险标注率明显高于其他供应商。
建议：向集采公司索取下游供应商清单，建立穿透式管理。""",

    "平台费": """平台费用分析（美团 vs 饿了么）：

**📱 2025年全年：**
• 美团：约2.65亿（年均）
• 饿了么：约0.95亿（年均）
• 合计：约3.60亿

**⚠️ 异常月份：**
2025年12月美团单月0.64亿，是平时月均的2.4倍
——未发现对应的促销旺季证据

**建议：** 向美团索取该月费用明细，
核实是否有多收费或服务费变更情况。
初步估算如能优化5%，每年可节省约1,800万。""",

    "报告": """好的，以下是为您生成的税务健康简报：

---

## 📋 汉堡王中国·2026年7月税务健康简报

### 一、总体健康度：🟡 关注（74/100分）

| 维度 | 得分 | 状态 |
|:----|:---:|:----|
| 认证效率 | 62/100 | 🟡 待提升 |
| 合规状态 | 78/100 | 🟢 良好 |
| 风险敞口 | 71/100 | 🟡 关注 |
| 申报准确率 | 95/100 | 🟢 优秀 |

### 二、本月重点

1. **认证超期风险**：超过90天未认证发票约70万张
2. **平台费用异常**：美团12月费用峰值有待核实
3. **供应商合规**：集采公司（雪峰/合炘）风险标注率偏高

### 三、建议行动
- P0：7天内完成大额未认证发票的补认证
- P1：30天内完成合规异常发票排查
- P2：向美团索取12月费用明细

---

*如需完整数据报表，可一键导出PDF。*""",
}

# 默认回复
DEFAULT_RESPONSE = """我是税安AI助手，可以帮你分析以下内容：

• 🔍 **查询风险** — "有哪些发票有风险？"
• ✅ **查询认证** — "认证情况怎么样？"
• 📊 **查询申报** — "这个月要交多少税？"
• 🏪 **查询供应商** — "哪些供应商有问题？"
• 📱 **查询平台费** — "美团费用正常吗？"
• 📝 **生成报告** — "帮我写一份税务简报"

请选择上面的问题，或者直接输入您的问题。"""


@app.route("/")
def demo():
    return render_template("demo.html", now=datetime.now().strftime("%Y-%m-%d"))


@app.route("/api/overview")
def api_overview():
    """返回税务体检总览数据"""
    d = BK_DATA
    mt = d["monthly_trend"]
    last_month = mt[-1] if mt else None
    
    overview = {
        "total_invoices": d["kpi"]["total_invoices_all"],
        "total_amount_yi": round(d["kpi"]["total_all"] / 1e8, 2),
        "current_month_invoices": last_month["invoice_cnt"] if last_month else 0,
        "current_month_amount": round(last_month["total_amount"] / 1e8, 2) if last_month else 0,
        "supplier_count": last_month["seller_cnt"] if last_month else 0,
        
        # 合规状态
        "compliance_green": 1980188,
        "compliance_yellow": 1320446,
        "compliance_red": 3573,
        "compliance_green_pct": 59.9,
        "compliance_yellow_pct": 40.0,
        "compliance_red_pct": 0.1,
        
        # 认证状态
        "certified": 1366800,
        "uncertified": 1937407,
        "certified_pct": 41.4,
        "uncertified_pct": 58.6,
        
        # 风险状态
        "risk_none": 2282647,
        "risk_marked": 683431,
        "risk_unmarked": 338127,
        "risk_none_pct": 69.1,
        "risk_marked_pct": 20.7,
        "risk_unmarked_pct": 10.2,
        
        # KPI评分
        "health_score": 74,
    }
    return jsonify(overview)


@app.route("/api/trend")
def api_trend():
    """返回月度认证/合规趋势"""
    return jsonify(BK_DATA["monthly_trend"])


@app.route("/api/risk-alerts")
def api_risk_alerts():
    """返回风险预警列表"""
    alerts = [
        {
            "level": "P0",
            "title": "大额发票未认证（>100万）",
            "detail": "共XX张，合计约XXXX万，已超过认证期限",
            "suggestion": "7天内完成补认证",
            "deadline": "紧急",
            "color": "red"
        },
        {
            "level": "P0",
            "title": "明确不合规发票",
            "detail": "3,573张发票合规状态为异常",
            "suggestion": "逐笔核查，准备备查材料",
            "deadline": "紧急",
            "color": "red"
        },
        {
            "level": "P1",
            "title": "供应链合规透明度不足",
            "detail": "集采公司（雪峰/合炘）风险标注率偏高（约8%）",
            "suggestion": "向集采公司索取下游供应商清单",
            "deadline": "30天内",
            "color": "yellow"
        },
        {
            "level": "P1",
            "title": "平台费用异常波动",
            "detail": "美团2025年12月费用飙至0.64亿（平时3倍）",
            "suggestion": "向美团索取该月费用明细",
            "deadline": "30天内",
            "color": "yellow"
        },
        {
            "level": "P2",
            "title": "发票认证效率偏低",
            "detail": "仅41.4%发票完成认证，存在持续超期风险",
            "suggestion": "建立认证SOP，设置自动认证规则",
            "deadline": "季度内",
            "color": "blue"
        },
    ]
    return jsonify(alerts)


@app.route("/api/chat", methods=["POST"])
def api_chat():
    """模拟AI对话"""
    data = request.get_json()
    question = data.get("question", "").strip()
    
    if not question:
        return jsonify({"response": DEFAULT_RESPONSE, "type": "menu"})
    
    # 根据关键词匹配回复
    response = None
    for keyword, reply in AI_RESPONSES.items():
        if keyword in question:
            response = reply
            break
    
    if not response:
        response = DEFAULT_RESPONSE
    
    return jsonify({"response": response, "type": "answer"})


@app.route("/api/ai-suggestions")
def api_ai_suggestions():
    """AI智能建议"""
    suggestions = [
        {
            "icon": "🔍",
            "title": "发现异常模式：集采公司季度末集中开票",
            "desc": "历史数据显示，雪峰/合炘在季度末的开票量是平时的1.8倍，其中15%的发票后续出现合规问题。建议关注本季度末的集采公司发票。",
            "type": "anomaly"
        },
        {
            "icon": "📊",
            "title": "申报预测：本月应缴增值税约1,600万",
            "desc": "基于已发生数据和历史趋势，预测本月应缴增值税约1,600万（环比+5.2%）。建议提前准备资金，同时检查是否有已到期但未认证的进项发票。",
            "type": "prediction"
        },
        {
            "icon": "💡",
            "title": "发现优化机会：供应商比价空间",
            "desc": "近6个月数据分析显示，部分品类采购成本有下降空间。建议对非核心品类（如包装物、清洁用品）引入三家比价，预计年节省约120-180万。",
            "type": "opportunity"
        }
    ]
    return jsonify(suggestions)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
