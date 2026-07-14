import { officialEvidenceByRecord } from './official-evidence.ts'
import { admissionRecords as generatedAdmissionRecords } from './source-records.generated.ts'
import type { AdmissionRecord, CoverageMetric, SchoolAdmission } from './models.ts'

export type {
  AdmissionRecord,
  AdmissionHistory,
  CoverageMetric,
  OfficialEvidence,
  OfficialEvidenceStatus,
  OfficialEvidenceType,
  SchoolAdmission
} from './models.ts'

export const majorLabels: Record<string, string> = {
  '080100': '力学',
  '080101': '一般力学与力学基础',
  '080102': '固体力学',
  '080103': '流体力学',
  '080104': '工程力学',
  '0801J1': '生态力学',
  '0801J7': '低空技术与工程'
}

const officialPortals: Record<string, string> = {
  '10006': 'https://yzb.buaa.edu.cn/',
  '10007': 'https://grd.bit.edu.cn/zsgz/ssyjs/index.htm',
  '10019': 'https://yz.cau.edu.cn/',
  '10056': 'https://yzb.tju.edu.cn/',
  '10141': 'https://gs.dlut.edu.cn/',
  '10145': 'http://yz.neu.edu.cn/',
  '10183': 'https://zsb.jlu.edu.cn/',
  '10213': 'https://yzb.hit.edu.cn/',
  '10247': 'https://yz.tongji.edu.cn/',
  '10248': 'https://yzb.sjtu.edu.cn/',
  '10286': 'https://yzb.seu.edu.cn/',
  '10335': 'https://yjsy.zju.edu.cn/',
  '10358': 'https://yz.ustc.edu.cn/',
  '10422': 'https://www.yz.sdu.edu.cn/',
  '10486': 'https://yz.whu.edu.cn/',
  '10487': 'http://gszs.hust.edu.cn/',
  '10532': 'http://gra.hnu.edu.cn/',
  '10533': 'https://gra.csu.edu.cn/',
  '10558': 'https://graduate.sysu.edu.cn/zsw/',
  '10561': 'https://yz.scut.edu.cn/',
  '10610': 'https://yz.scu.edu.cn/',
  '10611': 'https://yz.cqu.edu.cn/',
  '10698': 'https://yz.xjtu.edu.cn/',
  '10699': 'https://yzb.nwpu.edu.cn/',
  '10730': 'https://ge.lzu.edu.cn/',
  '92002': 'https://yjszs.nudt.edu.cn/'
}

const aggregateMetric = (
  records: AdmissionRecord[],
  key: 'planned' | 'retest' | 'admitted'
): CoverageMetric => {
  const values = records.map((record) => record[key]).filter((value): value is number => value !== null)
  return {
    value: values.length > 0 ? values.reduce((sum, value) => sum + value, 0) : null,
    known: values.length,
    total: records.length
  }
}

const admissionRecords: AdmissionRecord[] = generatedAdmissionRecords.map((record) => {
  const official = officialEvidenceByRecord[record.id]
  return {
    ...record,
    officialPlanned: official?.planned ?? null,
    officialRetest: official?.retest ?? null,
    officialAdmitted: official?.admitted ?? null,
    officialScoreLine: official?.scoreLine ?? null,
    officialEvidence: official?.evidence ?? []
  }
})

const recordsBySchool = new Map<string, AdmissionRecord[]>()
for (const record of admissionRecords) {
  const records = recordsBySchool.get(record.schoolCode) ?? []
  records.push(record)
  recordsBySchool.set(record.schoolCode, records)
}

export const schools: SchoolAdmission[] = [...recordsBySchool.entries()]
  .map(([code, records]) => {
    const first = records[0]!
    return {
      code,
      name: first.schoolName,
      region: first.region,
      majors: [...new Set(records.map((record) => record.majorCode))].sort(),
      disciplineEvaluations: [
        ...new Set(
          records
            .map((record) => record.disciplineEvaluation)
            .filter((value): value is string => value !== null)
        )
      ],
      recordCount: records.length,
      planned: aggregateMetric(records, 'planned'),
      retest: aggregateMetric(records, 'retest'),
      admitted: aggregateMetric(records, 'admitted'),
      officialPortal: officialPortals[code] ?? '',
      aggregatorPage: `https://ksg.hongguoyan.com/schools/detail/${code}`,
      records
    }
  })
  .sort((left, right) => left.code.localeCompare(right.code))

const knownCount = (selector: (record: AdmissionRecord) => boolean) =>
  admissionRecords.filter(selector).length

export const snapshot = {
  accessedAt: '2026-07-10',
  provider: '力学考研加油站',
  providerPage: 'https://ksg.hongguoyan.com/schools/majors-search',
  referencePage: 'https://ksg.hongguoyan.com/schools/detail/10559/080102/323221',
  yearLabel: '聚合页含 2023—2026 历年字段，但未给每项官网原文',
  totalSourceRecords: admissionRecords.length,
  plannedKnownRecords: knownCount((record) => record.planned !== null),
  retestKnownRecords: knownCount((record) => record.retest !== null),
  admittedKnownRecords: knownCount((record) => record.admitted !== null),
  scoreLineKnownRecords: knownCount((record) => record.scoreLine !== null),
  directionKnownRecords: knownCount((record) => record.directions.length > 0),
  retestDetailKnownRecords: knownCount((record) => record.retestDetails.length > 0),
  historyKnownRecords: knownCount((record) => record.history.length > 0),
  officialEvidenceRecords: knownCount((record) => record.officialEvidence.length > 0),
  officialValueRecords: knownCount((record) =>
    [record.officialPlanned, record.officialRetest, record.officialAdmitted, record.officialScoreLine].some(
      (value) => value !== null
    )
  )
} as const

export const referenceBaseline = [
  { field: '院校、专业代码与院系', reference: true, site: true, note: '本站覆盖 39 条逐院系记录' },
  { field: '985/211/双一流、地区、学科评估', reference: '部分', site: true, note: '本站额外展示地区与双一流状态' },
  { field: '培养方式、学制', reference: true, site: true, note: '缺失时明确标记待核验' },
  { field: '研究方向与初试科目', reference: true, site: true, note: '逐方向保留完整科目组合' },
  { field: '招生人数与推免口径', reference: true, site: true, note: '同时保留聚合人数和页面原始说明' },
  { field: '复试细则摘要', reference: true, site: true, note: '含总成绩公式、复试内容、参考书目等公开项' },
  { field: '复试基本线、复试线', reference: '部分', site: true, note: '本站并列展示两个来源字段，避免混淆' },
  { field: '历年招生计划', reference: true, site: true, note: '按来源页已有年份展示' },
  { field: '单科线、总分线、最高/最低分', reference: true, site: true, note: '按年完整展开' },
  { field: '复试、录取、复录比、一志愿、调剂', reference: true, site: true, note: '按年完整展开并保留缺失值' },
  { field: '26 所 985 横向筛选和汇总', reference: false, site: true, note: '支持专业、完整度和人数排序' },
  { field: '逐条官网原文与核验值', reference: false, site: true, note: '展示官网计划、复试、拟录取、分数线及冲突说明' },
  { field: '字段覆盖率与缺失值口径', reference: false, site: true, note: '不把 0/缺失冒充真实人数' }
] as const

export const sourceRecords = admissionRecords
