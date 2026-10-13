/**
 * KKM Corporate Intelligence Agent v3.0
 * Structured Report Generation & Export Handler
 */

import { DecisionReport, ModuleId, Language } from '../../src/types';
import { EVIDENCE_RECORDS, MODULES } from '../../src/data/evidenceRepository';

export interface ReportRequestPayload {
  title: string;
  moduleId: ModuleId;
  language: Language;
  customContext?: string;
}

export function generateStructuredReport(payload: ReportRequestPayload): DecisionReport {
  const { title, moduleId, language, customContext } = payload;
  const mod = MODULES.find((m) => m.id === moduleId) || MODULES[0];
  const relevantDocs = EVIDENCE_RECORDS.filter((r) => r.moduleId === moduleId);
  const primaryDoc = relevantDocs[0] || EVIDENCE_RECORDS[0];

  const reportId = `KKM-REP-${Date.now().toString().slice(-6)}`;
  const isPersian = language === 'fa';

  const executiveConclusion = isPersian
    ? `این گزارش تصمیم‌یار سازمانی در چارچوب ماژول ${mod.code} (${mod.titleFa}) جهت پشتیبانی از اتخاذ تصمیمات استراتژیک تدوین شده است. بر اساس مستندات ثبت‌شده در سامانه اطلاعات گروه KKM، پیگیری این طرح مستلزم تفکیک مرزهای صحه‌گذاری فنی و اعمال مدیریت ریسک مرحله‌ای است.`
    : `This executive decision-support report was prepared under module ${mod.code} (${mod.titleEn}) for leadership evaluation. Based on verified KKM International Group archives, advancement requires strict adherence to technical validation stage-gates and human approval boundaries.`;

  const strategicAlternatives = isPersian
    ? [
        {
          option: 'گزینه ۱: توسعه گام‌به‌گام با صحه‌گذاری مستقل',
          pros: 'کاهش ریسک سرمایه‌گذاری، انطباق کامل با ممیزی، حفظ شفافیت قانونی',
          cons: 'طولانی‌تر شدن بازه زمانی رسیدن به تجاری‌سازی (افزایش ۶ ماه)',
          riskLevel: 'low' as const,
        },
        {
          option: 'گزینه ۲: تسریع ورود به بازار و عقد قرارداد تامین',
          pros: 'کسب مزیت رقابتی زودهنگام در بازارهای منطقه‌ای انرژی پاک',
          cons: 'افزایش ریسک نقض ادعاهای پتنت شخص ثالث و انحراف احتمالی بازده کاتالیست',
          riskLevel: 'high' as const,
        },
      ]
    : [
        {
          option: 'Option 1: Stage-gated development with independent audit',
          pros: 'Mitigates capital loss, enforces regulatory compliance, guarantees IP defensibility',
          cons: 'Extends commercialization lead-time by approximately 6 months',
          riskLevel: 'low' as const,
        },
        {
          option: 'Option 2: Accelerated procurement and vendor commitment',
          pros: 'Captures first-mover advantage across regional clean energy hubs',
          cons: 'High exposure to patent infringement claims and unvalidated catalyst kinetics',
          riskLevel: 'high' as const,
        },
      ];

  const riskMatrix = isPersian
    ? [
        {
          category: 'فنی و مهندسی',
          description: 'انحراف بازده در شرایط کاری مستمر نسبت به مدل‌های آزمایشگاهی',
          mitigation: 'اجرای آزمون ۱۲۰ ساعته پایلوت پیش از سفارش ساخت نهایی',
          residualRisk: 'medium' as const,
        },
        {
          category: 'مالکیت فکری و حقوقی',
          description: 'هم‌پوشانی ادعاهای پتنت با پیشینه EP3429188B1',
          mitigation: 'اصلاح هندسه نازل و اخذ نظر رسمی وکیل در اتحادیه اروپا',
          residualRisk: 'low' as const,
        },
        {
          category: 'مالی و نقدینگی',
          description: 'افزایش هزینه‌های سرمایه‌ای (Capex) و تاخیر در تجهیزات با دوره تحویل طولانی',
          mitigation: 'تخصیص مرحله‌ای منابع با شرط تحقق نقاط عطف مشخص',
          residualRisk: 'medium' as const,
        },
      ]
    : [
        {
          category: 'Technical & Engineering',
          description: 'Catalyst degradation or lower thermal recovery during continuous operation',
          mitigation: 'Enforce 120-hour continuous pilot verification before final procurement',
          residualRisk: 'medium' as const,
        },
        {
          category: 'IP & Legal Defensibility',
          description: 'Claim proximity to prior art EP3429188B1 in European patent jurisdictions',
          mitigation: 'Carve out nozzle geometry and obtain formal counsel opinion',
          residualRisk: 'low' as const,
        },
        {
          category: 'Financial & Capex',
          description: 'Cost overrun risk on long-lead high-pressure equipment (24-week delivery)',
          mitigation: 'Implement milestone-contingent tranche releases via credit facility',
          residualRisk: 'medium' as const,
        },
      ];

  const recommendation = isPersian
    ? `تصویب و اجرای گزینه ۱ (توسعه گام‌به‌گام با صحه‌گذاری مستقل). پیش از هرگونه تخصیص بودجه فراتر از ۱.۵ میلیون دلار، گزارش صحه‌گذاری بنچ آزمایشگاهی و تاییدیه رسمی FTO الزامی است.`
    : `Approve and execute Option 1 (Stage-gated development with independent audit). Prior to committing capex exceeding $1.5M, laboratory bench validation and formal patent counsel FTO clearance are mandatory conditions precedent.`;

  const actionPlan = isPersian
    ? [
        {
          id: 'AP-01',
          action: 'تکمیل آزمون پایلوت پیوسته ۱۲۰ ساعته',
          owner: 'مدیریت R&D کیمیا کران ماد',
          dependencies: 'تامین خوراک استاندارد',
          risks: 'نوسان حرارتی مشعل',
          acceptanceCriteria: 'ثبت بازده $\\ge 58.4\\%$ با انحراف معیار کمتر از ۳٪',
        },
        {
          id: 'AP-02',
          action: 'تنظیم ادعاهای تکمیلی ثبت اختراع بین‌المللی',
          owner: 'مشاور ارشد مالکیت فکری KKM',
          dependencies: 'نتایج نهایی آنالیز کاتالیست',
          risks: 'افشای زودهنگام اسرار تجاری',
          acceptanceCriteria: 'دریافت گزارش استعلام FTO بدون معارض',
        },
        {
          id: 'AP-03',
          action: 'بررسی بسته مالی و تخصیص مرحله‌ای بودجه در هیئت مدیره',
          owner: 'مدیر ارشد مالی KKM',
          dependencies: 'تصویب دروازه فنی شماره ۳',
          risks: 'تغییر نرخ بهره بانکی',
          acceptanceCriteria: 'اخذ مصوبه مکتوب کمیته سرمایه‌گذاری',
        },
      ]
    : [
        {
          id: 'AP-01',
          action: 'Complete 120-hour continuous pilot endurance test',
          owner: 'Kimia Karan Mad R&D Directorate',
          dependencies: 'Standard feedstock supply assurance',
          risks: 'Burner temperature instability',
          acceptanceCriteria: 'Measured thermal recovery $\\ge 58.4\\%$ with std dev < 3%',
        },
        {
          id: 'AP-02',
          action: 'Finalize international patent claim carve-outs',
          owner: 'KKM Senior IP Counsel',
          dependencies: 'Post-test catalyst assay reports',
          risks: 'Premature trade secret exposure',
          acceptanceCriteria: 'Clean jurisdictional FTO clearance memorandum',
        },
        {
          id: 'AP-03',
          action: 'Present phased capex allocation proposal to Board',
          owner: 'KKM Chief Financial Officer',
          dependencies: 'Stage-Gate 3 technical sign-off',
          risks: 'Interest rate volatility on credit lines',
          acceptanceCriteria: 'Formal written Executive Committee authorization',
        },
      ];

  const openIssues = isPersian
    ? [
        'تعیین تکلیف حریم نهایی مسکونی اطراف سایت پایلوت با شهرداری منطقه',
        'تکمیل قرارداد محرمانگی تکمیلی (NDA) با سازندگان کاتالیست',
        'تأییدیه رسمی کمیته حسابرسی برای آزادسازی قسط اول تسهیلات',
      ]
    : [
        'Confirmation of regulatory buffer zones around pilot facility with regional authorities',
        'Execution of bilateral supplemental NDAs with specialized catalyst fabricators',
        'Formal Board Audit Committee concurrence for credit facility tranche 1 release',
      ];

  return {
    id: reportId,
    title: title || (isPersian ? `گزارش تصمیم‌گیری: ${mod.titleFa}` : `Decision Report: ${mod.titleEn}`),
    moduleId,
    language,
    createdAt: new Date().toISOString(),
    status: 'Finalized',
    executiveConclusion,
    verifiedEvidence: [primaryDoc.recordId],
    strategicAlternatives,
    riskMatrix,
    recommendation,
    actionPlan,
    openIssues,
    requiresHumanApproval: true,
    approvalStatus: 'Pending',
  };
}

export function reportToMarkdown(report: DecisionReport): string {
  const isFa = report.language === 'fa';
  return `# ${report.title}
**Report ID:** ${report.id}  
**Date:** ${report.createdAt.split('T')[0]}  
**Module:** ${report.moduleId}  
**Status:** ${report.status}  
**Human Approval:** ${report.requiresHumanApproval ? 'Required' : 'Not Required'}

---

## 1. ${isFa ? 'نتیجه‌گیری مدیریتی' : 'Executive Conclusion'}
${report.executiveConclusion}

## 2. ${isFa ? 'شواهد و مدارک استناد شده' : 'Verified Evidence & Citations'}
${report.verifiedEvidence.map((e) => `- Verified Record: \`${e}\``).join('\n')}

## 3. ${isFa ? 'تحلیل گزینه‌های راهبردی' : 'Strategic Alternatives Analysis'}
${report.strategicAlternatives
  .map(
    (alt) =>
      `### ${alt.option}\n- **${isFa ? 'مزایا' : 'Pros'}:** ${alt.pros}\n- **${isFa ? 'معایب' : 'Cons'}:** ${alt.cons}\n- **${isFa ? 'سطح ریسک' : 'Risk Level'}:** ${alt.riskLevel.toUpperCase()}`
  )
  .join('\n\n')}

## 4. ${isFa ? 'ماتریس ریسک و اقدامات کنترلی' : 'Risk Matrix & Mitigation Controls'}
| Category | Description | Mitigation Strategy | Residual Risk |
| :--- | :--- | :--- | :--- |
${report.riskMatrix
  .map((r) => `| ${r.category} | ${r.description} | ${r.mitigation} | ${r.residualRisk.toUpperCase()} |`)
  .join('\n')}

## 5. ${isFa ? 'پیشنهاد راهبردی' : 'Strategic Recommendation'}
${report.recommendation}

## 6. ${isFa ? 'برنامه اقدام اجرایی' : 'Executable Action Plan'}
| # | Action | Owner | Dependencies | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
${report.actionPlan
  .map((a) => `| ${a.id} | ${a.action} | ${a.owner} | ${a.dependencies} | ${a.acceptanceCriteria} |`)
  .join('\n')}

## 7. ${isFa ? 'مسائل باز و تاییدیه‌ها' : 'Open Issues & Required Approvals'}
${report.openIssues.map((issue) => `- ${issue}`).join('\n')}

---
*Generated by KKM Corporate Intelligence Agent v3.0 Prototype. Governed by KKM International Group & Kimia Karan Mad.*
`;
}
