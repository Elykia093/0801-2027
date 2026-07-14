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

if (schools.length !== 26) errors.push(`院校数应为 26，实际为 ${schools.length}`)
if (sourceRecords.length !== 39) errors.push(`记录数应为 39，实际为 ${sourceRecords.length}`)

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
    if (!major.startsWith('0801')) errors.push(`${school.code} 包含非 0801 专业：${major}`)
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

  if (!record.is985) errors.push(`${record.id} 不是 985 记录`)
  if (!record.majorCode.startsWith('0801')) errors.push(`${record.id} 包含非 0801 专业`)
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
  checkUrl(record.id, 'aggregatorDetail', record.aggregatorDetail)

  for (const evidence of record.officialEvidence) {
    checkUrl(record.id, `officialEvidence.${evidence.type}`, evidence.url)
    if (evidence.year !== '2026') errors.push(`${record.id} 官网证据年份应为2026`)
    if (!evidence.title || !evidence.scope || !evidence.accessedAt) {
      errors.push(`${record.id} 官网证据缺少标题、范围或访问日期`)
    }
    if (evidence.value !== undefined && evidence.value < 0) {
      errors.push(`${record.id} 官网证据值不能为负数`)
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

  const directionNames = new Set<string>()
  for (const direction of record.directions) {
    if (!direction.name) errors.push(`${record.id} 存在空研究方向`)
    if (directionNames.has(direction.name)) errors.push(`${record.id} 研究方向重复：${direction.name}`)
    directionNames.add(direction.name)
    if (direction.exams.length === 0) errors.push(`${record.id} ${direction.name} 缺少初试科目`)
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
    [record.officialPlanned, record.officialRetest, record.officialAdmitted, record.officialScoreLine].some(
      (value) => value !== null
    )
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
    `数据校验通过：${schools.length} 所院校，${sourceRecords.length} 条记录；方向 ${snapshot.directionKnownRecords}/${snapshot.totalSourceRecords}，复试细则 ${snapshot.retestDetailKnownRecords}/${snapshot.totalSourceRecords}，历年复录 ${snapshot.historyKnownRecords}/${snapshot.totalSourceRecords}。`
  )
}
