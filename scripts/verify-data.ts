import {
  hasHistoryValues,
  majorLabels,
  referenceBaseline,
  schools,
  snapshot,
  sourceRecords,
  type AdmissionRecord,
  type CoverageMetric,
  type OfficialEvidence,
  type ReferenceMaterialStatus
} from '../docs/.vitepress/data/schools.ts'
import { referenceMaterialOverrides } from '../docs/.vitepress/data/reference-materials.ts'

const errors: string[] = []
const requiredHistoryYears = ['2023', '2024', '2025', '2026']
const referenceMaterialStatuses: ReferenceMaterialStatus[] = [
  'unreviewed',
  'partial',
  'verified',
  'explicitly-not-designated',
  'not-published'
]
type RangeEvidence = OfficialEvidence & { highestScore: number; lowestScore: number }

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
  checkNonNegative(record, 'averageScore', record.averageScore)
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
    if (evidence.publishedAt !== null && !/^20\d{2}-\d{2}-\d{2}$/.test(evidence.publishedAt)) {
      errors.push(`${record.id} 官网证据发布日期格式错误：${evidence.publishedAt}`)
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

  const referenceMaterial = record.referenceMaterial
  if (referenceMaterial.year !== '2026') {
    errors.push(`${record.id} 参考书目收集年份应为2026`)
  }
  if (!referenceMaterialStatuses.includes(referenceMaterial.status)) {
    errors.push(`${record.id} 参考书目状态无效：${referenceMaterial.status}`)
  }
  if (!referenceMaterial.note.trim()) errors.push(`${record.id} 参考书目缺少核验说明`)

  const referenceBookKeys = new Set<string>()
  for (const book of referenceMaterial.books) {
    if (!book.title.trim() || book.authors.length === 0 || book.authors.some((author) => !author.trim())) {
      errors.push(`${record.id} 参考书缺少书名或作者/主编`)
    }
    const key = `${book.title.trim()}|${book.authors.join('|')}`
    if (referenceBookKeys.has(key)) errors.push(`${record.id} 参考书重复：${book.title}`)
    referenceBookKeys.add(key)
    if (book.publishedYear !== null && !/^\d{4}$/.test(book.publishedYear)) {
      errors.push(`${record.id} 参考书出版年份格式错误：${book.publishedYear}`)
    }
  }

  const referenceSourceUrls = new Set<string>()
  for (const source of referenceMaterial.sources) {
    checkUrl(record.id, 'referenceMaterial.source', source.url)
    if (!source.title.trim() || !source.accessedAt || !source.locator.trim()) {
      errors.push(`${record.id} 参考书目官网来源缺少标题、访问日期或原文定位`)
    }
    if (!/^20\d{2}-\d{2}-\d{2}$/.test(source.accessedAt)) {
      errors.push(`${record.id} 参考书目来源访问日期格式错误：${source.accessedAt}`)
    }
    if (source.publishedAt !== null && !/^20\d{2}-\d{2}-\d{2}$/.test(source.publishedAt)) {
      errors.push(`${record.id} 参考书目来源发布日期格式错误：${source.publishedAt}`)
    }
    if (referenceSourceUrls.has(source.url)) errors.push(`${record.id} 参考书目来源URL重复：${source.url}`)
    referenceSourceUrls.add(source.url)
  }

  if (referenceMaterial.status === 'verified') {
    if (referenceMaterial.books.length === 0 || referenceMaterial.sources.length === 0) {
      errors.push(`${record.id} 已核验参考书目必须同时有书目和官网原文`)
    }
  }
  if (referenceMaterial.status === 'partial' && referenceMaterial.sources.length === 0) {
    errors.push(`${record.id} 部分核验参考书目必须至少打开一条官网原文`)
  }
  if (['explicitly-not-designated', 'not-published'].includes(referenceMaterial.status)) {
    if (referenceMaterial.books.length > 0 || referenceMaterial.sources.length === 0) {
      errors.push(`${record.id} “明确不指定/官网未公开”必须无书目且有官网原文证据`)
    }
  }
  if (referenceMaterial.status === 'unreviewed' && referenceMaterial.sources.length > 0) {
    errors.push(`${record.id} 已保存官网原文后不能继续标记为未核验`)
  }
  if (
    referenceMaterial.applicableDirections.some(
      (direction) => !record.directions.some((item) => item.name === direction)
    )
  ) {
    errors.push(`${record.id} 参考书目适用方向不属于该记录研究方向`)
  }
  if (referenceMaterial.lead) {
    checkUrl(record.id, 'referenceMaterial.lead', referenceMaterial.lead.url)
    if (
      referenceMaterial.lead.origin !== 'aggregator' ||
      !referenceMaterial.lead.title.trim() ||
      !referenceMaterial.lead.excerpt.trim() ||
      !referenceMaterial.lead.accessedAt
    ) {
      errors.push(`${record.id} 参考书目聚合线索字段不完整`)
    }
    if (!/^20\d{2}-\d{2}-\d{2}$/.test(referenceMaterial.lead.accessedAt)) {
      errors.push(`${record.id} 参考书目线索访问日期格式错误：${referenceMaterial.lead.accessedAt}`)
    }
    if (referenceMaterial.lead.url !== record.aggregatorDetail) {
      errors.push(`${record.id} 参考书目聚合线索未绑定本记录详情页`)
    }
  }

  const historicalEvidenceKeys: Record<(typeof record.historicalEvidence)[number]['type'], string[]> = {
    catalog: ['planned'],
    retest: ['retestCount', 'retestHighestScore', 'retestLowestScore'],
    admitted: [
      'politicsAverage',
      'foreignLanguageAverage',
      'subjectOneAverage',
      'subjectTwoAverage',
      'averageScore',
      'admittedHighestScore',
      'admittedLowestScore',
      'admittedCount',
      'retestAdmissionRatio',
      'firstChoiceAdmitted',
      'transferAdmitted'
    ],
    'score-line': [
      'retestPoliticsLine',
      'retestForeignLanguageLine',
      'retestSubjectOneLine',
      'retestSubjectTwoLine',
      'retestScoreLine'
    ],
    'retest-rule': [
      'planned',
      'retestCount',
      'retestPoliticsLine',
      'retestForeignLanguageLine',
      'retestSubjectOneLine',
      'retestSubjectTwoLine',
      'retestScoreLine'
    ]
  }
  for (const evidence of record.historicalEvidence) {
    if (!['2023', '2024', '2025'].includes(evidence.year)) {
      errors.push(`${record.id} 历史官网证据年份应位于2023—2025：${evidence.year}`)
    }
    if (!evidence.scope || !evidence.accessedAt || evidence.sources.length === 0) {
      errors.push(`${record.id} 历史官网证据缺少范围、访问日期或原文`)
    }
    for (const source of evidence.sources) {
      if (!source.title) errors.push(`${record.id} 历史官网证据缺少原文标题`)
      checkUrl(record.id, `historicalEvidence.${evidence.type}`, source.url)
      if (source.publishedAt !== null && !/^20\d{2}-\d{2}-\d{2}$/.test(source.publishedAt)) {
        errors.push(`${record.id} 历史官网证据发布日期格式错误：${source.publishedAt}`)
      }
    }

    const evidenceValues = Object.entries(evidence.values)
    if (evidenceValues.length === 0 && evidence.status !== 'not-found') {
      errors.push(`${record.id} 已核验历史官网证据缺少数值`)
    }
    if (!record.history.some((item) => item.year === evidence.year)) {
      errors.push(`${record.id} 历史官网证据未映射到 ${evidence.year} 数据行`)
    }
    for (const [field, value] of evidenceValues) {
      if (!historicalEvidenceKeys[evidence.type]?.includes(field)) {
        errors.push(`${record.id} ${evidence.type} 历史证据包含不匹配字段：${field}`)
      }
      if (value === null || value === undefined) {
        errors.push(`${record.id} ${evidence.year} 历史官网证据不应保存空值：${field}`)
      } else if (typeof value === 'number' && value < 0) {
        errors.push(`${record.id} ${evidence.year} 历史官网证据值不能为负数：${field}`)
      }
    }

    const hasRetestHighest = evidence.values.retestHighestScore !== undefined
    const hasRetestLowest = evidence.values.retestLowestScore !== undefined
    if (hasRetestHighest !== hasRetestLowest) {
      errors.push(`${record.id} ${evidence.year} 历史复试名单最高分和最低分必须同时存在`)
    }
    if (
      evidence.values.retestHighestScore !== undefined &&
      evidence.values.retestLowestScore !== undefined &&
      evidence.values.retestHighestScore < evidence.values.retestLowestScore
    ) {
      errors.push(`${record.id} ${evidence.year} 历史复试名单最高分不能低于最低分`)
    }

    const hasAdmittedHighest = evidence.values.admittedHighestScore !== undefined
    const hasAdmittedLowest = evidence.values.admittedLowestScore !== undefined
    if (hasAdmittedHighest !== hasAdmittedLowest) {
      errors.push(`${record.id} ${evidence.year} 历史拟录取最高分和最低分必须同时存在`)
    }
    if (
      evidence.values.admittedHighestScore !== undefined &&
      evidence.values.admittedLowestScore !== undefined &&
      evidence.values.admittedHighestScore < evidence.values.admittedLowestScore
    ) {
      errors.push(`${record.id} ${evidence.year} 历史拟录取最高分不能低于最低分`)
    }
  }

  const comparableHistoryFields = [
    'politicsAverage',
    'foreignLanguageAverage',
    'subjectOneAverage',
    'subjectTwoAverage',
    'averageScore',
    'admittedHighestScore',
    'admittedLowestScore',
    'retestCount',
    'admittedCount',
    'firstChoiceAdmitted',
    'transferAdmitted'
  ] as const
  const additiveHistoryFields = new Set([
    'retestCount',
    'admittedCount',
    'firstChoiceAdmitted',
    'transferAdmitted'
  ])
  for (const history of record.history) {
    const evidenceForYear = record.historicalEvidence.filter(
      (evidence) => evidence.year === history.year && evidence.status !== 'not-found'
    )
    for (const field of comparableHistoryFields) {
      const values = evidenceForYear
        .map((evidence) => evidence.values[field])
        .filter((value): value is number => typeof value === 'number')
      if (values.length === 0) continue
      const actual = history[field]
      const matchesSingle = typeof actual === 'number' && values.includes(actual)
      const matchesBatches =
        typeof actual === 'number' &&
        additiveHistoryFields.has(field) &&
        values.reduce((sum, value) => sum + value, 0) === actual
      if (!matchesSingle && !matchesBatches) {
        errors.push(
          `${record.id} ${history.year} ${field}=${String(actual)} 与历史官网证据 ${values.join('、')} 不一致`
        )
      }
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
    const rangeEvidence = record.officialEvidence.filter(
      (evidence): evidence is RangeEvidence =>
        evidence.type === 'retest' &&
        evidence.status !== 'not-found' &&
        evidence.highestScore !== undefined &&
        evidence.lowestScore !== undefined
    )
    if (rangeEvidence.length === 0) {
      errors.push(`${record.id} 官网复试名单初试分范围与分批证据不一致`)
    } else {
      const evidenceHighestScore = Math.max(...rangeEvidence.map((evidence) => evidence.highestScore))
      const evidenceLowestScore = Math.min(...rangeEvidence.map((evidence) => evidence.lowestScore))
      if (
        evidenceHighestScore !== record.officialRetestHighestScore ||
        evidenceLowestScore !== record.officialRetestLowestScore
      ) {
        errors.push(`${record.id} 官网复试名单初试分范围与分批证据不一致`)
      }
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

    const historicalEvidenceForYear = record.historicalEvidence.filter(
      (evidence) => evidence.year === history.year && evidence.status !== 'not-found'
    )
    const evidenceRatio = historicalEvidenceForYear
      .map((evidence) => evidence.values.retestAdmissionRatio)
      .filter((value): value is string => value !== undefined)
      .at(-1)
    if (evidenceRatio !== undefined && history.retestAdmissionRatio !== evidenceRatio) {
      errors.push(`${record.id} ${history.year} 复录比未采用官网同口径派生值`)
    }
    if (
      evidenceRatio !== undefined &&
      typeof history.retestCount === 'number' &&
      typeof history.admittedCount === 'number' &&
      history.admittedCount > 0
    ) {
      const expectedRatio = `1:${(history.retestCount / history.admittedCount).toFixed(1)}`
      if (evidenceRatio !== expectedRatio) {
        errors.push(`${record.id} ${history.year} 官网派生复录比与人数不一致`)
      }
    }
  }

  if (record.history.map((item) => item.year).join(',') !== requiredHistoryYears.join(',')) {
    errors.push(`${record.id} 历年分数与复录数据必须按 2023—2026 排列`)
  }

  const plannedHistoryYears = new Set<string>()
  for (const history of record.plannedHistory) {
    if (!/^20\d{2}$/.test(history.year)) {
      errors.push(`${record.id} 历年招生计划年份格式错误：${history.year}`)
    }
    if (plannedHistoryYears.has(history.year)) {
      errors.push(`${record.id} 历年招生计划年份重复：${history.year}`)
    }
    plannedHistoryYears.add(history.year)
    if (history.value !== null && history.value < 0) {
      errors.push(`${record.id} ${history.year} 招生计划不能为负数`)
    }
    const evidencePlanned = record.historicalEvidence
      .filter((evidence) => evidence.year === history.year && evidence.status !== 'not-found')
      .map((evidence) => evidence.values.planned)
      .filter((value): value is number => value !== undefined)
      .at(-1)
    const officialPlanned = history.year === '2026' ? record.officialPlanned : null
    const expectedPlanned = officialPlanned ?? evidencePlanned
    if (expectedPlanned !== null && expectedPlanned !== undefined && history.value !== expectedPlanned) {
      errors.push(`${record.id} ${history.year} 招生计划未采用官网核验值`)
    }
  }
  if (record.plannedHistory.map((item) => item.year).join(',') !== requiredHistoryYears.join(',')) {
    errors.push(`${record.id} 历年招生计划必须按 2023—2026 排列`)
  }

  const latest = record.history.at(-1)
  if (latest) {
    for (const [label, current, historical] of [
      ['averageScore', record.averageScore, latest.averageScore],
      ['retest', record.officialRetest ?? record.retest, latest.retestCount],
      ['admitted', record.officialAdmitted ?? record.admitted, latest.admittedCount]
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
  '342154': { planned: null, retest: 48, admitted: null, scoreLine: null, retestHighestScore: 435, retestLowestScore: 344 },
  '343729': { planned: 27, retest: 53, admitted: 27, scoreLine: 355, retestHighestScore: 446, retestLowestScore: 355 },
  '343703': { planned: 2, retest: 2, admitted: null, scoreLine: 315, retestHighestScore: 384, retestLowestScore: 345 },
  '351357': { planned: 20, retest: null, admitted: null, scoreLine: null, retestHighestScore: null, retestLowestScore: null },
  '347202': { planned: null, retest: 12, admitted: 10, scoreLine: null, retestHighestScore: 394, retestLowestScore: 343 },
  '347183': { planned: null, retest: 1, admitted: 1, scoreLine: null, retestHighestScore: 375, retestLowestScore: 375 },
  '340072': { planned: null, retest: 21, admitted: 14, scoreLine: null, retestHighestScore: 433, retestLowestScore: 329 },
  '336994': { planned: 4, retest: 8, admitted: null, scoreLine: null, retestHighestScore: 422, retestLowestScore: 330 },
  '335400': { planned: null, retest: null, admitted: null, scoreLine: 370, retestHighestScore: null, retestLowestScore: null },
  '331532': { planned: 3, retest: 3, admitted: null, scoreLine: null, retestHighestScore: 389, retestLowestScore: 337 },
  '327479': { planned: null, retest: 3, admitted: 3, scoreLine: 290, retestHighestScore: 376, retestLowestScore: 293 },
  '327478': { planned: null, retest: 1, admitted: 1, scoreLine: 290, retestHighestScore: 372, retestLowestScore: 372 },
  '327502': { planned: 2, retest: 1, admitted: 1, scoreLine: 320, retestHighestScore: 328, retestLowestScore: 328 },
  '327349': { planned: 13, retest: 20, admitted: 13, scoreLine: null, retestHighestScore: 427, retestLowestScore: 356 },
  '325216': { planned: 12, retest: 13, admitted: 12, scoreLine: 326, retestHighestScore: 405, retestLowestScore: 322 },
  '325007': { planned: 15, retest: 15, admitted: null, scoreLine: 305, retestHighestScore: 389, retestLowestScore: 309 },
  '323677': { planned: 5, retest: 7, admitted: 5, scoreLine: 335, retestHighestScore: 370, retestLowestScore: 335 },
  '323019': { planned: 8, retest: 12, admitted: 8, scoreLine: null, retestHighestScore: 368, retestLowestScore: 305 },
  '323686': { planned: 2, retest: 1, admitted: 2, scoreLine: 280, retestHighestScore: 338, retestLowestScore: 338 },
  '313757': { planned: null, retest: 111, admitted: 49, scoreLine: null, retestHighestScore: 403, retestLowestScore: 287 },
  '304162': { planned: null, retest: 1, admitted: null, scoreLine: null, retestHighestScore: 370, retestLowestScore: 370 },
  '304125': { planned: null, retest: 12, admitted: null, scoreLine: null, retestHighestScore: 395, retestLowestScore: 331 },
  '347381': { planned: 22, retest: 40, admitted: 22, scoreLine: 335, retestHighestScore: 412, retestLowestScore: 230 },
  'hit-aero-085500-airspace-mechanics': { planned: 47, retest: 49, admitted: 47, scoreLine: 355, retestHighestScore: 427, retestLowestScore: 356 }
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

const dlutMechanics = sourceRecords.find((record) => record.id === '347381')
if (!dlutMechanics) {
  errors.push('缺少大连理工大学力学与航空航天学院080100记录')
} else {
  const history2026 = dlutMechanics.history.find((history) => history.year === '2026')
  for (const [label, actual, expected] of [
    ['政治平均分', history2026?.politicsAverage, 66],
    ['外语平均分', history2026?.foreignLanguageAverage, 66],
    ['业务课一平均分', history2026?.subjectOneAverage, 108],
    ['业务课二平均分', history2026?.subjectTwoAverage, 110],
    ['初试总分平均分', history2026?.averageScore, 351],
    ['拟录取初试最高分', history2026?.admittedHighestScore, 412],
    ['拟录取初试最低分', history2026?.admittedLowestScore, 243],
    ['一志愿拟录取', history2026?.firstChoiceAdmitted, 17],
    ['调剂拟录取', history2026?.transferAdmitted, 5]
  ] as const) {
    if (actual !== expected) errors.push(`347381 2026 ${label}应为${expected}，实际为${String(actual)}`)
  }
  if (history2026?.retestAdmissionRatio !== null) {
    errors.push('347381 2026 调剂名单含缺考考生，复录比应留空')
  }
  const transferAttendanceEvidence = dlutMechanics.officialEvidence.find(
    (evidence) => evidence.url === 'https://lihang.dlut.edu.cn/info/1050/28902.htm'
  )
  if (
    transferAttendanceEvidence?.type !== 'retest-rule' ||
    transferAttendanceEvidence.status !== 'verified' ||
    transferAttendanceEvidence.value !== undefined
  ) {
    errors.push('347381 2026 调剂到考口径应有独立且不参与人数求和的官网证据')
  }
}

const dlutPanjinMechanics = sourceRecords.find((record) => record.id === '347444')
if (!dlutPanjinMechanics) {
  errors.push('缺少大连理工大学化工海洋与生命学院080104记录')
} else {
  const history2024 = dlutPanjinMechanics.history.find((history) => history.year === '2024')
  const planned2024 = dlutPanjinMechanics.plannedHistory.find((history) => history.year === '2024')
  const planned2025 = dlutPanjinMechanics.plannedHistory.find((history) => history.year === '2025')
  for (const [label, actual, expected] of [
    ['招生计划', planned2024?.value, 15],
    ['政治平均分', history2024?.politicsAverage, 70],
    ['外语平均分', history2024?.foreignLanguageAverage, 64],
    ['业务课一平均分', history2024?.subjectOneAverage, 92],
    ['业务课二平均分', history2024?.subjectTwoAverage, 111],
    ['初试总分平均分', history2024?.averageScore, 338],
    ['拟录取初试最高分', history2024?.admittedHighestScore, 396],
    ['拟录取初试最低分', history2024?.admittedLowestScore, 318],
    ['复试名单人数', history2024?.retestCount, 24],
    ['拟录取人数', history2024?.admittedCount, 15],
    ['一志愿拟录取', history2024?.firstChoiceAdmitted, 2],
    ['调剂拟录取', history2024?.transferAdmitted, 13]
  ] as const) {
    if (actual !== expected) errors.push(`347444 2024 ${label}应为${expected}，实际为${String(actual)}`)
  }
  if (history2024?.retestAdmissionRatio !== null) {
    errors.push('347444 2024 调剂名单含无复试成绩考生，复录比应留空')
  }
  if (planned2025?.value !== 11) {
    errors.push(`347444 2025 官网统考计划应为11，实际为${String(planned2025?.value)}`)
  }
  const rule2025 = dlutPanjinMechanics.historicalEvidence.find(
    (evidence) => evidence.year === '2025' && evidence.type === 'retest-rule'
  )
  for (const [label, actual, expected] of [
    ['政治线', rule2025?.values.retestPoliticsLine, 42],
    ['外语线', rule2025?.values.retestForeignLanguageLine, 42],
    ['业务课一线', rule2025?.values.retestSubjectOneLine, 70],
    ['业务课二线', rule2025?.values.retestSubjectTwoLine, 75],
    ['总分线', rule2025?.values.retestScoreLine, 300]
  ] as const) {
    if (actual !== expected) errors.push(`347444 2025 ${label}应为${expected}，实际为${String(actual)}`)
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
  if (hitAirspaceMechanics.averageScore !== null) errors.push('哈工大空天力学未核到拟录取初试均分，应为null')
  if (hitAirspaceMechanics.officialScoreLine !== 355) errors.push('哈工大空天力学官网复试线应为355')
  if (hitAirspaceMechanics.directions.length !== 3) errors.push('哈工大空天力学应包含3个方向')
  const expectedExams = [
    '(101)思想政治理论',
    '(201)英语（一）或(202)俄语或(203)日语',
    '(301)数学（一）',
    '(815)基础力学（理论力学和材料力学各占50%）'
  ]
  const expectedDirections = [
    { name: '11 空天力学', exams: expectedExams },
    { name: '42 空天力学（郑州基地）', exams: expectedExams },
    { name: '61 空天力学（苏州基地）', exams: expectedExams }
  ]
  if (
    hitAirspaceMechanics.directions.some((direction, index) => {
      const expected = expectedDirections[index]
      return (
        expected === undefined ||
        direction.name !== expected.name ||
        direction.exams.length !== expected.exams.length ||
        direction.exams.some((exam, examIndex) => exam !== expected.exams[examIndex])
      )
    })
  ) {
    errors.push('哈工大空天力学方向名称、顺序或初试科目与官网招生目录不一致')
  }
  const catalogEvidence = hitAirspaceMechanics.officialEvidence.find(
    (evidence) => evidence.url === 'https://yzb.hit.edu.cn/2025/0925/c22281a392831/page.htm'
  )
  if (
    catalogEvidence?.type !== 'catalog' ||
    catalogEvidence.status !== 'verified' ||
    catalogEvidence.publishedAt !== '2025-09-25'
  ) {
    errors.push('哈工大空天力学初试科目缺少已核验的2026官网招生目录证据')
  }
}

const countKnown = (selector: (record: AdmissionRecord) => boolean) => sourceRecords.filter(selector).length
const expectedSnapshotCounts = {
  plannedKnownRecords: countKnown((record) => record.planned !== null),
  retestKnownRecords: countKnown((record) => record.retest !== null),
  admittedKnownRecords: countKnown((record) => record.admitted !== null),
  averageScoreKnownRecords: countKnown((record) => record.averageScore !== null),
  directionKnownRecords: countKnown((record) => record.directions.length > 0),
  retestDetailKnownRecords: countKnown((record) => record.retestDetails.length > 0),
  historyKnownRecords: countKnown(hasHistoryValues),
  historicalEvidenceRecords: countKnown((record) => record.historicalEvidence.length > 0),
  officialEvidenceRecords: countKnown((record) => record.officialEvidence.length > 0),
  referenceMaterialLeadRecords: countKnown((record) => record.referenceMaterial.lead !== undefined),
  referenceMaterialPartialRecords: countKnown(
    (record) => record.referenceMaterial.status === 'partial'
  ),
  referenceMaterialSettledRecords: countKnown((record) =>
    ['verified', 'explicitly-not-designated', 'not-published'].includes(record.referenceMaterial.status)
  ),
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

if (snapshot.referenceMaterialLeadRecords !== 7) {
  errors.push(`参考书目检索线索应覆盖7条记录，实际为${snapshot.referenceMaterialLeadRecords}`)
}

if (snapshot.referenceMaterialPartialRecords !== 8) {
  errors.push(`参考书目部分核验应覆盖8条记录，实际为${snapshot.referenceMaterialPartialRecords}`)
}

if (sourceRecords.filter((record) => record.referenceMaterial.year === '2026').length !== 44) {
  errors.push('44条记录必须全部进入2026参考书目收集队列')
}

for (const recordId of Object.keys(referenceMaterialOverrides)) {
  if (!recordIds.has(recordId)) errors.push(`参考书目覆盖配置包含未知记录：${recordId}`)
}

if (referenceBaseline.length < 13 || referenceBaseline.some((item) => item.site !== true)) {
  errors.push('参考详情页字段矩阵未完整声明本站覆盖')
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(
    `数据校验通过：${schools.length} 个招生单位，${sourceRecords.length} 条记录；方向 ${snapshot.directionKnownRecords}/${snapshot.totalSourceRecords}，复试细则 ${snapshot.retestDetailKnownRecords}/${snapshot.totalSourceRecords}，历年复录 ${snapshot.historyKnownRecords}/${snapshot.totalSourceRecords}，参考书目队列 ${sourceRecords.length}/${snapshot.totalSourceRecords}（线索 ${snapshot.referenceMaterialLeadRecords}，部分核验 ${snapshot.referenceMaterialPartialRecords}，已定案 ${snapshot.referenceMaterialSettledRecords}）。`
  )
}
