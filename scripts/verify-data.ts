import {
  majorLabels,
  referenceBaseline,
  schools,
  snapshot,
  sourceRecords,
  type AdmissionRecord,
  type CoverageMetric
} from '../docs/.vitepress/data/schools.ts'

const errors: string[] = []

const checkMetric = (schoolCode: string, name: string, metric: CoverageMetric) => {
  if (metric.total <= 0) errors.push(`${schoolCode} ${name}: total 必须大于 0`)
  if (metric.known < 0 || metric.known > metric.total) {
    errors.push(`${schoolCode} ${name}: known 必须位于 0..total`)
  }
  if (metric.value !== null && metric.value < 0) {
    errors.push(`${schoolCode} ${name}: value 不能为负数`)
  }
  if (metric.known === 0 && metric.value !== null) {
    errors.push(`${schoolCode} ${name}: 没有已知记录时 value 应为 null`)
  }
}

const checkUrl = (owner: string, label: string, url: string) => {
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) errors.push(`${owner} ${label} 协议不正确`)
  } catch {
    errors.push(`${owner} ${label} URL 无效：${url}`)
  }
}

const checkNonNegative = (
  record: AdmissionRecord,
  label: string,
  value: number | null | undefined
) => {
  if (value !== null && value !== undefined && value < 0) {
    errors.push(`${record.id} ${label} 不能为负数`)
  }
}

if (schools.length !== 27) errors.push(`招生单位数应为 27，实际为 ${schools.length}`)
if (sourceRecords.length !== 44) errors.push(`记录数应为 44，实际为 ${sourceRecords.length}`)

const codes = new Set<string>()
const recordIds = new Set<string>()

for (const school of schools) {
  if (codes.has(school.code)) errors.push(`院校代码重复：${school.code}`)
  codes.add(school.code)

  if (!/^\d{5}$/.test(school.code)) errors.push(`院校代码格式错误：${school.code}`)
  if (!school.officialPortal) errors.push(`${school.code} 缺少院校官网入口`)
  if (school.majors.length === 0) errors.push(`${school.code} 未配置专业代码`)
  if (school.records.length !== school.recordCount) errors.push(`${school.code} records 与 recordCount 不一致`)

  for (const major of school.majors) {
    if (!major.startsWith('0801') && major !== '085500') {
      errors.push(`${school.code} 包含未纳入力学相关范围的专业：${major}`)
    }
    if (!majorLabels[major]) errors.push(`${school.code} 专业缺少名称映射：${major}`)
  }

  checkMetric(school.code, 'planned', school.planned)
  checkMetric(school.code, 'retest', school.retest)
  checkMetric(school.code, 'admitted', school.admitted)

  if (school.planned.total !== school.recordCount) errors.push(`${school.code} planned.total 与 recordCount 不一致`)
  if (school.retest.total !== school.recordCount) errors.push(`${school.code} retest.total 与 recordCount 不一致`)
  if (school.admitted.total !== school.recordCount) errors.push(`${school.code} admitted.total 与 recordCount 不一致`)

  checkUrl(school.code, 'officialPortal', school.officialPortal)
  checkUrl(school.code, 'aggregatorPage', school.aggregatorPage)
}

for (const record of sourceRecords) {
  if (recordIds.has(record.id)) errors.push(`详情记录 ID 重复：${record.id}`)
  recordIds.add(record.id)

  if (!record.is985 && record.schoolCode !== '80007') {
    errors.push(`${record.id} 不是 985 记录，也不是允许补充的国科大力学所记录`)
  }
  if (record.schoolCode === '80007') {
    if (record.is985 || record.is211 || !record.isDoubleFirstClass) {
      errors.push(`${record.id} 国科大院校标签配置不正确`)
    }
    if (!['080101', '080102', '080103', '080104'].includes(record.majorCode)) {
      errors.push(`${record.id} 不属于国科大力学所2026年0801招生专业`)
    }
    if (record.sourceKind !== 'official') errors.push(`${record.id} 国科大手工记录应标记为官网来源`)
  }
  if (!record.majorCode.startsWith('0801') && record.majorCode !== '085500') {
    errors.push(`${record.id} 包含未纳入力学相关范围的专业`)
  }
  if (record.majorCode === '085500' && record.id !== 'hit-aero-085500-airspace-mechanics') {
    errors.push(`${record.id} 不是当前允许纳入的哈工大空天力学专硕记录`)
  }
  if (!majorLabels[record.majorCode]) errors.push(`${record.id} 专业缺少名称映射`)
  if (record.directions.length === 0) errors.push(`${record.id} 缺少研究方向与初试科目`)
  if (record.plannedHistory.length === 0) errors.push(`${record.id} 缺少历年招生计划`)
  if (!schools.some((school) => school.code === record.schoolCode && school.records.includes(record))) {
    errors.push(`${record.id} 未归属到院校汇总`)
  }

  checkNonNegative(record, 'planned', record.planned)
  checkNonNegative(record, 'basicRetestLine', record.basicRetestLine)
  checkNonNegative(record, 'scoreLine', record.scoreLine)
  checkNonNegative(record, 'retest', record.retest)
  checkNonNegative(record, 'admitted', record.admitted)
  checkNonNegative(record, 'officialPlanned', record.officialPlanned)
  checkNonNegative(record, 'officialRetest', record.officialRetest)
  checkNonNegative(record, 'officialAdmitted', record.officialAdmitted)
  checkNonNegative(record, 'officialScoreLine', record.officialScoreLine)
  checkNonNegative(record, 'officialRetestHighestScore', record.officialRetestHighestScore)
  checkNonNegative(record, 'officialRetestLowestScore', record.officialRetestLowestScore)
  checkUrl(record.id, 'aggregatorDetail', record.aggregatorDetail)

  const hasRetestHighestScore = record.officialRetestHighestScore !== null
  const hasRetestLowestScore = record.officialRetestLowestScore !== null
  if (hasRetestHighestScore !== hasRetestLowestScore) {
    errors.push(`${record.id} 官网复试名单最高分和最低分必须同时存在`)
  }
  if (
    record.officialRetestHighestScore !== null &&
    record.officialRetestLowestScore !== null &&
    record.officialRetestHighestScore < record.officialRetestLowestScore
  ) {
    errors.push(`${record.id} 官网复试名单最高分不能低于最低分`)
  }

  for (const evidence of record.officialEvidence) {
    checkUrl(record.id, `officialEvidence.${evidence.type}`, evidence.url)
    if (evidence.year !== '2026') errors.push(`${record.id} 官网证据年份应为2026`)
    if (!evidence.title || !evidence.scope || !evidence.accessedAt) {
      errors.push(`${record.id} 官网证据缺少标题、范围或访问日期`)
    }
    if (evidence.value !== undefined && evidence.value < 0) {
      errors.push(`${record.id} 官网证据值不能为负数`)
    }
    const hasEvidenceHighestScore = evidence.highestScore !== undefined
    const hasEvidenceLowestScore = evidence.lowestScore !== undefined
    if (hasEvidenceHighestScore !== hasEvidenceLowestScore) {
      errors.push(`${record.id} 官网证据最高分和最低分必须同时存在`)
    }
    if (
      (evidence.highestScore !== undefined && evidence.highestScore < 0) ||
      (evidence.lowestScore !== undefined && evidence.lowestScore < 0)
    ) {
      errors.push(`${record.id} 官网证据分数不能为负数`)
    }
    if ((hasEvidenceHighestScore || hasEvidenceLowestScore) && evidence.type !== 'retest') {
      errors.push(`${record.id} 官网证据分数范围只能来自复试名单`)
    }
    if (
      evidence.highestScore !== undefined &&
      evidence.lowestScore !== undefined &&
      evidence.highestScore < evidence.lowestScore
    ) {
      errors.push(`${record.id} 官网证据最高分不能低于最低分`)
    }
  }

  for (const [field, value, evidenceType] of [
    ['officialPlanned', record.officialPlanned, 'catalog'],
    ['officialRetest', record.officialRetest, 'retest'],
    ['officialAdmitted', record.officialAdmitted, 'admitted'],
    ['officialScoreLine', record.officialScoreLine, 'score-line']
  ] as const) {
    if (value === null) continue

    const matchingEvidence = record.officialEvidence.filter(
      (evidence) => evidence.type === evidenceType && evidence.status !== 'not-found'
    )
    if (matchingEvidence.length === 0) {
      errors.push(`${record.id} ${field} 缺少对应官网证据`)
      continue
    }

    const evidenceValues = matchingEvidence
      .map((evidence) => evidence.value)
      .filter((evidenceValue): evidenceValue is number => evidenceValue !== undefined)
    if (evidenceValues.length === 0) {
      errors.push(`${record.id} ${field} 的官网证据缺少数值`)
      continue
    }

    const matchesSingleEvidence = evidenceValues.includes(value)
    const matchesBatches =
      ['retest', 'admitted'].includes(evidenceType) &&
      evidenceValues.reduce((sum, evidenceValue) => sum + evidenceValue, 0) === value
    if (!matchesSingleEvidence && !matchesBatches) {
      errors.push(`${record.id} ${field}=${value} 与官网证据值 ${evidenceValues.join('、')} 不一致`)
    }
  }

  if (record.officialRetestHighestScore !== null && record.officialRetestLowestScore !== null) {
    const matchingRangeEvidence = record.officialEvidence.some(
      (evidence) =>
        evidence.type === 'retest' &&
        evidence.status !== 'not-found' &&
        evidence.highestScore === record.officialRetestHighestScore &&
        evidence.lowestScore === record.officialRetestLowestScore
    )
    if (!matchingRangeEvidence) {
      errors.push(`${record.id} 官网复试名单初试分范围缺少对应证据`)
    }
  }

  const directionNames = new Set<string>()
  for (const direction of record.directions) {
    if (!direction.name) errors.push(`${record.id} 存在空研究方向`)
    if (directionNames.has(direction.name)) errors.push(`${record.id} 研究方向重复：${direction.name}`)
    directionNames.add(direction.name)
    if (direction.exams.length === 0) {
      const allowsPendingProfessionalExams =
        record.majorCode === '085500' &&
        record.sourceKind === 'official' &&
        record.officialEvidence.length > 0
      if (!allowsPendingProfessionalExams) errors.push(`${record.id} ${direction.name} 缺少初试科目`)
    }
  }

  const historyYears = new Set<string>()
  for (const history of record.history) {
    if (!/^20\d{2}$/.test(history.year)) errors.push(`${record.id} 历史年份格式错误：${history.year}`)
    if (historyYears.has(history.year)) errors.push(`${record.id} 历史年份重复：${history.year}`)
    historyYears.add(history.year)
    for (const [label, value] of Object.entries(history)) {
      if (label !== 'year' && label !== 'retestAdmissionRatio' && typeof value === 'number' && value < 0) {
        errors.push(`${record.id} ${history.year} ${label} 不能为负数`)
      }
    }
  }

  const latest = record.history.at(-1)
  if (latest) {
    for (const [label, current, historical] of [
      ['scoreLine', record.scoreLine, latest.scoreLine],
      ['retest', record.retest, latest.retestCount],
      ['admitted', record.admitted, latest.admittedCount]
    ] as const) {
      if (current !== null && historical !== null && historical !== undefined && current !== historical) {
        errors.push(`${record.id} 当前 ${label} 与最新历史列不一致`)
      }
    }
  }
}

const expectedOfficialValues: Record<
  string,
  {
    planned: number | null
    retest: number | null
    admitted: number | null
    scoreLine: number | null
    retestHighestScore: number | null
    retestLowestScore: number | null
  }
> = {
  '342023': { planned: 18, retest: 22, admitted: null, scoreLine: 350, retestHighestScore: null, retestLowestScore: null },
  '340072': { planned: null, retest: 21, admitted: 14, scoreLine: null, retestHighestScore: 433, retestLowestScore: 329 },
  '336994': { planned: 4, retest: 8, admitted: null, scoreLine: null, retestHighestScore: 422, retestLowestScore: 330 },
  '331532': { planned: null, retest: null, admitted: null, scoreLine: null, retestHighestScore: null, retestLowestScore: null },
  '327479': { planned: null, retest: 3, admitted: 3, scoreLine: 290, retestHighestScore: 376, retestLowestScore: 293 },
  '327478': { planned: null, retest: 1, admitted: 1, scoreLine: 290, retestHighestScore: 372, retestLowestScore: 372 },
  '327502': { planned: 2, retest: 1, admitted: 1, scoreLine: 320, retestHighestScore: 328, retestLowestScore: 328 },
  '325216': { planned: 12, retest: 13, admitted: 12, scoreLine: 326, retestHighestScore: 405, retestLowestScore: 322 },
  '325007': { planned: 15, retest: 15, admitted: null, scoreLine: 305, retestHighestScore: 389, retestLowestScore: 309 },
  '323677': { planned: 5, retest: 7, admitted: 5, scoreLine: 335, retestHighestScore: 370, retestLowestScore: 335 },
  '323019': { planned: 8, retest: 12, admitted: 8, scoreLine: null, retestHighestScore: 368, retestLowestScore: 305 }
}

for (const [recordId, expected] of Object.entries(expectedOfficialValues)) {
  const record = sourceRecords.find((item) => item.id === recordId)
  if (!record) {
    errors.push(`缺少2026官网核验记录：${recordId}`)
    continue
  }

  for (const [label, actual, expectedValue] of [
    ['官网公开招考计划', record.officialPlanned, expected.planned],
    ['官网复试人数', record.officialRetest, expected.retest],
    ['官网拟录取人数', record.officialAdmitted, expected.admitted],
    ['官网专业复试线', record.officialScoreLine, expected.scoreLine],
    ['官网复试名单初试最高分', record.officialRetestHighestScore, expected.retestHighestScore],
    ['官网复试名单初试最低分', record.officialRetestLowestScore, expected.retestLowestScore]
  ] as const) {
    if (actual !== expectedValue) {
      errors.push(`${recordId} ${label} 应为 ${expectedValue ?? 'null'}，实际为 ${actual ?? 'null'}`)
    }
  }
}

const hitAirspaceMechanics = sourceRecords.find(
  (record) => record.id === 'hit-aero-085500-airspace-mechanics'
)
if (!hitAirspaceMechanics) {
  errors.push('缺少哈工大085500空天力学专硕记录')
} else {
  if (hitAirspaceMechanics.sourceKind !== 'official') errors.push('哈工大空天力学记录应标记为官网来源')
  if (hitAirspaceMechanics.majorCode !== '085500') errors.push('哈工大空天力学专业代码应为085500')
  if (hitAirspaceMechanics.planned !== 47) errors.push('哈工大空天力学招生计划应为47')
  if (hitAirspaceMechanics.retest !== 49) errors.push('哈工大空天力学复试人数应为49')
  if (hitAirspaceMechanics.admitted !== 47) errors.push('哈工大空天力学拟录取人数应为47')
  if (hitAirspaceMechanics.scoreLine !== 355) errors.push('哈工大空天力学复试线应为355')
  if (hitAirspaceMechanics.directions.length !== 3) errors.push('哈工大空天力学应包含3个方向')
  const expectedDirections = [
    '11 空天力学',
    '42 空天力学（郑州基地）',
    '61 空天力学（苏州基地）'
  ]
  if (hitAirspaceMechanics.directions.some((direction, index) => direction.name !== expectedDirections[index])) {
    errors.push('哈工大空天力学方向名称或顺序与官网核验结果不一致')
  }
}

const countKnown = (selector: (record: AdmissionRecord) => boolean) => sourceRecords.filter(selector).length
const expectedSnapshotCounts = {
  plannedKnownRecords: countKnown((record) => record.planned !== null),
  retestKnownRecords: countKnown((record) => record.retest !== null),
  admittedKnownRecords: countKnown((record) => record.admitted !== null),
  scoreLineKnownRecords: countKnown((record) => record.scoreLine !== null),
  directionKnownRecords: countKnown((record) => record.directions.length > 0),
  retestDetailKnownRecords: countKnown((record) => record.retestDetails.length > 0),
  historyKnownRecords: countKnown((record) => record.history.length > 0),
  officialEvidenceRecords: countKnown((record) => record.officialEvidence.length > 0),
  officialValueRecords: countKnown((record) =>
    [
      record.officialPlanned,
      record.officialRetest,
      record.officialAdmitted,
      record.officialScoreLine,
      record.officialRetestHighestScore,
      record.officialRetestLowestScore
    ].some((value) => value !== null)
  )
}

for (const [key, expected] of Object.entries(expectedSnapshotCounts)) {
  const actual = snapshot[key as keyof typeof expectedSnapshotCounts]
  if (actual !== expected) errors.push(`snapshot.${key} 应为 ${expected}，实际为 ${actual}`)
}

if (snapshot.totalSourceRecords !== sourceRecords.length) {
  errors.push('快照记录总数与详情记录数不一致')
}

if (referenceBaseline.length < 13 || referenceBaseline.some((item) => item.site !== true)) {
  errors.push('参考详情页字段矩阵未完整声明本站覆盖')
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(
    `数据校验通过：${schools.length} 个招生单位，${sourceRecords.length} 条记录；方向 ${snapshot.directionKnownRecords}/${snapshot.totalSourceRecords}，复试细则 ${snapshot.retestDetailKnownRecords}/${snapshot.totalSourceRecords}，历年复录 ${snapshot.historyKnownRecords}/${snapshot.totalSourceRecords}。`
  )
}
