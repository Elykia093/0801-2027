<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  isOfficialSourceRecord,
  isProfessionalDegree,
  majorLabels,
  referenceBaseline,
  schoolSearchAliases,
  schools,
  snapshot,
  type AdmissionHistory,
  type AdmissionRecord,
  type HistoricalEvidence,
  type OfficialEvidence,
  type ReferenceMaterialStatus
} from '../../data/schools'

const query = ref('')
const major = ref('all')
const region = ref('all')
const officialStatus = ref('all')

const majorOptions = computed(() =>
  [...new Set(schools.flatMap((school) => school.majors))].sort()
)

const regionOptions = computed(() =>
  [...new Set(schools.map((school) => school.region))].sort((left, right) =>
    left.localeCompare(right, 'zh-CN')
  )
)

const recordMatches = (record: AdmissionRecord, normalizedQuery: string) => {
  const matchesMajor = major.value === 'all' || record.majorCode === major.value
  const matchesOfficialStatus =
    officialStatus.value === 'all' ||
    (officialStatus.value === 'with-values' && hasOfficialValues(record)) ||
    (officialStatus.value === 'with-range' &&
      record.officialRetestHighestScore !== null &&
      record.officialRetestLowestScore !== null) ||
    (officialStatus.value === 'with-history' && record.historicalEvidence.length > 0) ||
    (officialStatus.value === 'with-reference-lead' && record.referenceMaterial.lead !== undefined) ||
    (officialStatus.value === 'reference-pending' &&
      ['unreviewed', 'partial'].includes(record.referenceMaterial.status)) ||
    (officialStatus.value === 'pending-split' &&
      record.officialEvidence.length > 0 &&
      !hasOfficialValues(record))
  if (!matchesMajor || !matchesOfficialStatus) return false
  if (!normalizedQuery) return true
  return [
    record.schoolName,
    record.schoolCode,
    record.department,
    record.majorCode,
    record.majorName,
    ...(schoolSearchAliases[record.schoolCode] ?? [])
  ].some((value) => value.toLocaleLowerCase('zh-CN').includes(normalizedQuery))
}

const filteredSchools = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase('zh-CN')
  return schools
    .filter((school) => region.value === 'all' || school.region === region.value)
    .map((school) => ({
      ...school,
      records: school.records.filter((record) => recordMatches(record, normalizedQuery))
    }))
    .filter((school) => school.records.length > 0)
})

const filteredRecordCount = computed(() =>
  filteredSchools.value.reduce((sum, school) => sum + school.records.length, 0)
)

const historicalEvidence = schools.flatMap((school) =>
  school.records.flatMap((record) => record.historicalEvidence)
)
const latestEvidenceAccessedAt = [
  snapshot.accessedAt,
  ...schools.flatMap((school) =>
    school.records.flatMap((record) => [
      ...record.officialEvidence.map((item) => item.accessedAt),
      ...record.historicalEvidence.map((item) => item.accessedAt),
      ...record.referenceMaterial.sources.map((item) => item.accessedAt)
    ])
  )
].sort().at(-1)
const historicalEvidenceSourceCount = new Set(
  historicalEvidence.flatMap((item) => item.sources.map((source) => source.url))
).size

const valueOrPending = (value: number | string | null | undefined) => value ?? '待核验'
const plannedHistoryValue = (value: number | null) =>
  value === null ? '待核验' : `${value} 人`

type HistoryRow = {
  label: string
  key: Exclude<keyof AdmissionHistory, 'year'>
  unit: '分' | '人' | ''
}

const historyRowGroups: Array<{ label: string; rows: HistoryRow[] }> = [
  {
    label: '拟录取初试分统计',
    rows: [
      { label: '政治平均分', key: 'politicsAverage', unit: '分' },
      { label: '外语平均分', key: 'foreignLanguageAverage', unit: '分' },
      { label: '业务 1 平均分', key: 'subjectOneAverage', unit: '分' },
      { label: '业务 2 平均分', key: 'subjectTwoAverage', unit: '分' },
      { label: '初试总分平均分', key: 'averageScore', unit: '分' },
      { label: '拟录取初试最高分', key: 'admittedHighestScore', unit: '分' },
      { label: '拟录取初试最低分', key: 'admittedLowestScore', unit: '分' }
    ]
  },
  {
    label: '复试与录取人数',
    rows: [
      { label: '复试人数', key: 'retestCount', unit: '人' },
      { label: '拟录取人数', key: 'admittedCount', unit: '人' },
      { label: '复录比', key: 'retestAdmissionRatio', unit: '' },
      { label: '一志愿拟录取', key: 'firstChoiceAdmitted', unit: '人' },
      { label: '调剂拟录取', key: 'transferAdmitted', unit: '人' }
    ]
  }
]

const historyValue = (history: AdmissionHistory, key: HistoryRow['key']) => history[key] ?? '—'
const historyValueMissing = (history: AdmissionHistory, key: HistoryRow['key']) =>
  history[key] === null || history[key] === undefined

const recordCompleteness = (record: AdmissionRecord) => {
  const fields = [record.planned, record.retest, record.admitted, record.averageScore]
  return `${fields.filter((value) => value !== null).length}/${fields.length} 项核心字段`
}

const hasOfficialValues = (record: AdmissionRecord) =>
  [
    record.officialPlanned,
    record.officialRetest,
    record.officialAdmitted,
    record.officialScoreLine,
    record.officialRetestHighestScore,
    record.officialRetestLowestScore
  ].some((value) => value !== null)

const evidenceSummary = (item: OfficialEvidence) =>
  [
    item.value !== undefined ? `${item.value}${item.type === 'score-line' ? ' 分' : ' 人'}` : null,
    item.lowestScore !== undefined && item.highestScore !== undefined
      ? `${item.lowestScore}-${item.highestScore} 分`
      : null
  ]
    .filter((value): value is string => value !== null)
    .join(' · ')

const historicalEvidenceSummary = (item: HistoricalEvidence) =>
  [
    item.values.planned !== undefined ? `计划 ${item.values.planned} 人` : null,
    item.values.retestScoreLine !== undefined ? `复试线 ${item.values.retestScoreLine}` : null,
    item.values.averageScore !== undefined ? `初试均分 ${item.values.averageScore}` : null,
    item.values.admittedLowestScore !== undefined && item.values.admittedHighestScore !== undefined
      ? `拟录取 ${item.values.admittedLowestScore}-${item.values.admittedHighestScore} 分`
      : null,
    item.values.retestLowestScore !== undefined && item.values.retestHighestScore !== undefined
      ? `复试 ${item.values.retestLowestScore}-${item.values.retestHighestScore} 分`
      : null,
    item.values.retestCount !== undefined ? `复试 ${item.values.retestCount} 人` : null,
    item.values.admittedCount !== undefined ? `拟录取 ${item.values.admittedCount} 人` : null,
    item.values.firstChoiceAdmitted !== undefined ? `一志愿 ${item.values.firstChoiceAdmitted} 人` : null,
    item.values.transferAdmitted !== undefined ? `调剂 ${item.values.transferAdmitted} 人` : null
  ]
    .filter((value): value is string => value !== null)
    .join(' · ')

const historicalEvidenceDetails = (item: HistoricalEvidence) =>
  [
    item.values.retestPoliticsLine !== undefined ? `政治线 ${item.values.retestPoliticsLine}` : null,
    item.values.retestForeignLanguageLine !== undefined
      ? `外语线 ${item.values.retestForeignLanguageLine}`
      : null,
    item.values.retestSubjectOneLine !== undefined ? `业务1线 ${item.values.retestSubjectOneLine}` : null,
    item.values.retestSubjectTwoLine !== undefined ? `业务2线 ${item.values.retestSubjectTwoLine}` : null,
    item.values.politicsAverage !== undefined ? `政治均分 ${item.values.politicsAverage}` : null,
    item.values.foreignLanguageAverage !== undefined
      ? `外语均分 ${item.values.foreignLanguageAverage}`
      : null,
    item.values.subjectOneAverage !== undefined ? `业务1均分 ${item.values.subjectOneAverage}` : null,
    item.values.subjectTwoAverage !== undefined ? `业务2均分 ${item.values.subjectTwoAverage}` : null
  ]
    .filter((value): value is string => value !== null)
    .join(' · ')

const evidenceTypeLabels: Record<OfficialEvidence['type'], string> = {
  catalog: '招生计划',
  retest: '复试名单',
  admitted: '拟录取',
  'score-line': '分数线',
  'retest-rule': '复试细则'
}

const evidenceStatusLabels: Record<OfficialEvidence['status'], string> = {
  verified: '官网核验',
  partial: '部分核验',
  'not-found': '未找到原文'
}

const referenceMaterialStatusLabels: Record<ReferenceMaterialStatus, string> = {
  unreviewed: '官网待核验',
  partial: '部分核验',
  verified: '书目已核验',
  'explicitly-not-designated': '官网明确不指定',
  'not-published': '官网未公开'
}

const referenceMaterialStatusClasses: Record<ReferenceMaterialStatus, string> = {
  unreviewed: 'partial',
  partial: 'partial',
  verified: 'verified',
  'explicitly-not-designated': 'verified',
  'not-published': 'not-found'
}
</script>

<template>
  <section class="admissions-details" aria-labelledby="details-title">
    <header class="details-intro">
      <div>
        <p class="details-kicker">2023—2026 招生证据账本</p>
        <h1 id="details-title">力学相关专业招生详情库</h1>
        <p class="details-lead">
          聚合快照 {{ snapshot.accessedAt }}；官网核验至 {{ latestEvidenceAccessedAt }}。缺失字段保持为空。
        </p>
      </div>
      <dl class="details-overview" aria-label="详情库覆盖概览">
        <div><dt>招生单位</dt><dd>{{ schools.length }}</dd></div>
        <div><dt>院系 / 专业</dt><dd>{{ snapshot.totalSourceRecords }}</dd></div>
        <div><dt>2026 官网核验</dt><dd>{{ snapshot.officialValueRecords }}</dd></div>
        <div><dt>历史官网原文</dt><dd>{{ historicalEvidenceSourceCount }}</dd></div>
        <div><dt>书目已定案</dt><dd>{{ snapshot.referenceMaterialSettledRecords }}/{{ snapshot.totalSourceRecords }}</dd></div>
      </dl>
    </header>

    <div class="notice">
      <strong>证据边界：</strong>
      985院校的0801来源统计来自“{{ snapshot.provider }}”公开页面快照；历史表中的分数是拟录取名单初试分统计，不是复试线。官网复试线、复试名单范围和拟录取计数单独列证据；合并专业无法拆分时不写数值。
    </div>

    <details class="baseline-panel">
      <summary>与参考详情页逐字段对照（本站新增 3 类能力）</summary>
      <div class="compact-table-wrap">
        <table class="compact-table baseline-table">
          <thead>
            <tr>
              <th scope="col">信息字段</th>
              <th scope="col">参考页</th>
              <th scope="col">本站</th>
              <th scope="col">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in referenceBaseline" :key="item.field">
              <td>{{ item.field }}</td>
              <td>{{ item.reference === true ? '有' : item.reference === false ? '无' : item.reference }}</td>
              <td><span class="status-chip">有</span></td>
              <td>{{ item.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>

    <div class="detail-controls" aria-label="详情筛选">
      <div class="control">
        <label for="detail-search">搜索学校、院系或专业</label>
        <input id="detail-search" v-model="query" type="search" placeholder="例如：航空航天 / 080104" />
      </div>
      <div class="control">
        <label for="detail-major">专业代码</label>
        <select id="detail-major" v-model="major">
          <option value="all">全部力学相关专业</option>
          <option v-for="code in majorOptions" :key="code" :value="code">
            {{ code }} {{ majorLabels[code] }}（{{ isProfessionalDegree(code) ? '专硕' : '学硕' }}）
          </option>
        </select>
      </div>
      <div class="control">
        <label for="detail-region">地区</label>
        <select id="detail-region" v-model="region">
          <option value="all">全部地区</option>
          <option v-for="item in regionOptions" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
      <div class="control">
        <label for="detail-official-status">官网核验状态</label>
        <select id="detail-official-status" v-model="officialStatus">
          <option value="all">全部</option>
          <option value="with-values">有官网核验值</option>
          <option value="with-range">有初试分范围</option>
          <option value="with-history">有2023—2025官网证据</option>
          <option value="pending-split">官网材料待拆分</option>
          <option value="with-reference-lead">有参考书目线索</option>
          <option value="reference-pending">参考书目待核验</option>
        </select>
      </div>
    </div>

    <p class="result-meta">
      当前显示 {{ filteredSchools.length }} 个招生单位、{{ filteredRecordCount }} 条院系/专业记录。
    </p>

    <div v-if="filteredSchools.length > 0" class="school-detail-list">
      <article
        v-for="school in filteredSchools"
        :id="`school-${school.code}`"
        :key="school.code"
        class="school-detail-card"
      >
        <header class="school-detail-header">
          <div>
            <div class="school-title-line">
              <h2>{{ school.name }}</h2>
              <span class="school-code">{{ school.code }}</span>
            </div>
            <div class="tag-row" aria-label="院校标签">
              <span v-if="school.records.some((record) => record.is985)" class="tag-chip important">985</span>
              <span v-if="school.records.some((record) => record.is211)" class="tag-chip">211</span>
              <span v-if="school.records.some((record) => record.isDoubleFirstClass)" class="tag-chip">双一流</span>
              <span class="tag-chip">{{ school.region }}</span>
              <span v-for="evaluation in school.disciplineEvaluations" :key="evaluation" class="tag-chip">
                学科评估 {{ evaluation }}
              </span>
            </div>
          </div>
          <div class="source-actions">
            <a :href="school.officialPortal" target="_blank" rel="noopener noreferrer">院校官网</a>
            <a :href="school.aggregatorPage" target="_blank" rel="noopener noreferrer">
              {{ school.records.every(isOfficialSourceRecord) ? '官网招生目录' : '聚合院校页' }}
            </a>
          </div>
        </header>

        <div class="school-metric-grid" aria-label="院校汇总人数">
          <div>
            <span>招生计划</span>
            <strong>{{ valueOrPending(school.planned.value) }}</strong>
            <small>{{ school.planned.known }}/{{ school.planned.total }} 条已知</small>
          </div>
          <div>
            <span>复试人数</span>
            <strong>{{ valueOrPending(school.retest.value) }}</strong>
            <small>{{ school.retest.known }}/{{ school.retest.total }} 条已知</small>
          </div>
          <div>
            <span>拟录取人数</span>
            <strong>{{ valueOrPending(school.admitted.value) }}</strong>
            <small>{{ school.admitted.known }}/{{ school.admitted.total }} 条已知</small>
          </div>
        </div>

        <div class="program-list">
          <details v-for="record in school.records" :key="record.id" class="program-record">
            <summary>
              <span class="program-heading">
                <strong>{{ record.majorCode }} {{ record.majorName }}</strong>
                <small>{{ record.department }}</small>
              </span>
              <span class="program-summary-metrics">
                计划 {{ valueOrPending(record.planned) }} · 复试 {{ valueOrPending(record.retest) }} · 拟录取 {{ valueOrPending(record.admitted) }}
              </span>
            </summary>

            <div class="record-body">
              <div class="record-status-line">
                <span class="status-chip">{{ isOfficialSourceRecord(record) ? '官网来源' : '聚合参考' }}</span>
                <span class="status-chip">{{ isProfessionalDegree(record.majorCode) ? '专业学位' : '学术学位' }}</span>
                <span v-if="hasOfficialValues(record)" class="status-chip verified">有官网核验值</span>
                <span v-else-if="record.officialEvidence.length > 0" class="status-chip partial">官网材料待拆分</span>
                <span v-if="record.referenceMaterial.lead" class="status-chip partial">有书目线索</span>
                <span>{{ recordCompleteness(record) }}</span>
                <span>详情 ID {{ record.id }}</span>
              </div>

              <section v-if="record.officialEvidence.length > 0" class="record-section official-section">
                <div class="section-title-row">
                  <h3>2026 官网核验</h3>
                  <span class="status-chip verified">{{ record.officialEvidence.length }} 条原文</span>
                </div>
                <dl class="fact-grid official-fact-grid">
                  <div><dt>官网公开招考计划</dt><dd>{{ valueOrPending(record.officialPlanned) }}</dd></div>
                  <div><dt>官网复试人数</dt><dd>{{ valueOrPending(record.officialRetest) }}</dd></div>
                  <div><dt>官网拟录取人数</dt><dd>{{ valueOrPending(record.officialAdmitted) }}</dd></div>
                  <div><dt>官网专业复试线</dt><dd>{{ valueOrPending(record.officialScoreLine) }}</dd></div>
                  <div><dt>名单初试最高分</dt><dd>{{ valueOrPending(record.officialRetestHighestScore) }}</dd></div>
                  <div><dt>名单初试最低分</dt><dd>{{ valueOrPending(record.officialRetestLowestScore) }}</dd></div>
                </dl>
                <div class="official-evidence-list">
                  <article v-for="item in record.officialEvidence" :key="`${item.type}-${item.url}-${item.note}`">
                    <div class="evidence-heading">
                      <span class="evidence-type">{{ evidenceTypeLabels[item.type] }}</span>
                      <span :class="['status-chip', item.status]">{{ evidenceStatusLabels[item.status] }}</span>
                      <strong v-if="evidenceSummary(item)">{{ evidenceSummary(item) }}</strong>
                    </div>
                    <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
                    <p>{{ item.scope }} · {{ item.publishedAt ?? '发布日期未标明' }} · 访问 {{ item.accessedAt }}</p>
                    <p v-if="item.note" class="evidence-note">{{ item.note }}</p>
                  </article>
                </div>
              </section>

              <section class="record-section" aria-label="招生与培养">
                <h3>招生与培养</h3>
                <dl class="fact-grid">
                  <div><dt>培养方式</dt><dd>{{ valueOrPending(record.studyMode) }}</dd></div>
                  <div><dt>学制</dt><dd>{{ valueOrPending(record.studyLength) }}</dd></div>
                  <div><dt>招生说明</dt><dd>{{ valueOrPending(record.enrollmentNote) }}</dd></div>
                  <div><dt>招生计划</dt><dd>{{ valueOrPending(record.planned) }}</dd></div>
                  <div><dt>来源复试基本线</dt><dd>{{ valueOrPending(record.basicRetestLine) }}</dd></div>
                  <div><dt>来源拟录取初试均分</dt><dd>{{ valueOrPending(record.averageScore) }}</dd></div>
                  <div><dt>复试人数</dt><dd>{{ valueOrPending(record.retest) }}</dd></div>
                  <div><dt>拟录取人数</dt><dd>{{ valueOrPending(record.admitted) }}</dd></div>
                  <div><dt>复录比</dt><dd>{{ valueOrPending(record.retestAdmissionRatio) }}</dd></div>
                </dl>
              </section>

              <section class="record-section">
                <h3>研究方向与初试科目（{{ record.directions.length }} 个方向）</h3>
                <div v-if="record.directions.length > 0" class="compact-table-wrap">
                  <table class="compact-table direction-table">
                    <thead>
                      <tr><th scope="col">研究方向</th><th scope="col">考试科目</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="direction in record.directions" :key="direction.name">
                        <td>{{ direction.name }}</td>
                        <td>
                          <span v-for="exam in direction.exams" :key="exam" class="exam-item">{{ exam }}</span>
                          <span v-if="direction.exams.length === 0" class="missing-data">待官网目录核验</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p v-else class="missing-data">来源页未提供研究方向或初试科目。</p>
              </section>

              <section class="record-section">
                <h3>复试细则摘要</h3>
                <div v-if="record.retestDetails.length > 0" class="retest-detail-list">
                  <article v-for="item in record.retestDetails" :key="item.label">
                    <h4>{{ item.label }}</h4>
                    <p>{{ item.content }}</p>
                  </article>
                </div>
                <p v-else class="missing-data">来源页未提供复试细则摘要，需进入院校官网继续核验。</p>
              </section>

              <section class="record-section reference-material-section">
                <div class="section-title-row">
                  <div>
                    <h3>复试参考书目（{{ record.referenceMaterial.year }}）</h3>
                    <p class="section-caption">最终状态仅允许：有指定书目、官网明确不指定、官网未公开；检索尚未完成时保持“官网待核验”。</p>
                  </div>
                  <span
                    :class="['status-chip', referenceMaterialStatusClasses[record.referenceMaterial.status]]"
                  >
                    {{ referenceMaterialStatusLabels[record.referenceMaterial.status] }}
                  </span>
                </div>

                <dl
                  v-if="record.referenceMaterial.examCode || record.referenceMaterial.examName"
                  class="fact-grid reference-material-facts"
                >
                  <div><dt>复试科目代码</dt><dd>{{ valueOrPending(record.referenceMaterial.examCode) }}</dd></div>
                  <div><dt>复试科目名称</dt><dd>{{ valueOrPending(record.referenceMaterial.examName) }}</dd></div>
                  <div>
                    <dt>适用方向</dt>
                    <dd>{{ record.referenceMaterial.applicableDirections.join('、') || '全部或待核验' }}</dd>
                  </div>
                </dl>

                <div v-if="record.referenceMaterial.books.length > 0" class="compact-table-wrap">
                  <table class="compact-table reference-book-table">
                    <thead>
                      <tr>
                        <th scope="col">书名</th><th scope="col">作者 / 主编</th><th scope="col">版本</th>
                        <th scope="col">出版社</th><th scope="col">出版年 / ISBN</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="book in record.referenceMaterial.books" :key="`${book.title}-${book.authors.join('-')}`">
                        <td>{{ book.title }}</td>
                        <td>{{ book.authors.join('、') }}</td>
                        <td>{{ book.edition ?? '官网未标明' }}</td>
                        <td>{{ book.publisher ?? '官网未标明' }}</td>
                        <td>{{ [book.publishedYear, book.isbn].filter(Boolean).join(' / ') || '官网未标明' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-if="record.referenceMaterial.sources.length > 0" class="official-evidence-list">
                  <article v-for="source in record.referenceMaterial.sources" :key="source.url">
                    <a :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.title }}</a>
                    <p>{{ source.publishedAt ?? '发布日期未标明' }} · 访问 {{ source.accessedAt }} · {{ source.locator }}</p>
                  </article>
                </div>

                <article v-if="record.referenceMaterial.lead" class="reference-material-lead">
                  <strong>聚合线索（不能作为官网书目证据）</strong>
                  <p>{{ record.referenceMaterial.lead.excerpt }}</p>
                  <a
                    :href="record.referenceMaterial.lead.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >{{ record.referenceMaterial.lead.title }}</a>
                  <small>访问 {{ record.referenceMaterial.lead.accessedAt }}</small>
                </article>

                <p class="reference-material-note">{{ record.referenceMaterial.note }}</p>
              </section>

              <section class="record-section">
                <div class="section-title-row">
                  <div>
                    <h3>2023—2026 招生计划</h3>
                    <p class="section-caption">同口径官网核验值优先；无官网值时保留聚合来源原值，缺失不补 0。</p>
                  </div>
                  <a
                    class="evidence-link"
                    :href="record.aggregatorDetail"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ isOfficialSourceRecord(record) ? '官网原文' : '聚合原详情' }}
                  </a>
                </div>
                <div class="history-chip-row">
                  <span
                    v-for="item in record.plannedHistory"
                    :key="item.year"
                    :class="['history-chip', { missing: item.value === null }]"
                  >
                    {{ item.year }}：{{ plannedHistoryValue(item.value) }}
                  </span>
                </div>
              </section>

              <section class="record-section">
                <div class="section-title-row">
                  <div>
                    <h3>2023—2026 拟录取分数与复录数据</h3>
                    <p class="section-caption">分数列为拟录取名单初试分统计；同口径官网值优先，复试线与名单范围见年度证据；复录比仅在人数统计范围一致时保留。</p>
                  </div>
                  <span class="status-chip">聚合 + 官网</span>
                </div>
                <p class="table-scroll-hint">横向滑动查看全部年份</p>
                <div v-if="record.history.length > 0" class="compact-table-wrap">
                  <table class="compact-table history-table">
                    <thead>
                      <tr>
                        <th scope="col">指标</th>
                        <th v-for="history in record.history" :key="history.year" scope="col">{{ history.year }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="group in historyRowGroups" :key="group.label">
                        <tr class="history-group-row">
                          <th :colspan="record.history.length + 1" scope="rowgroup">{{ group.label }}</th>
                        </tr>
                        <tr v-for="row in group.rows" :key="row.key">
                          <th scope="row">{{ row.label }}</th>
                          <td
                            v-for="history in record.history"
                            :key="history.year"
                            :class="{ 'is-missing': historyValueMissing(history, row.key) }"
                          >
                            <span>{{ historyValue(history, row.key) }}</span>
                            <small v-if="!historyValueMissing(history, row.key) && row.unit">{{ row.unit }}</small>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
                <p v-else class="missing-data">2023—2026 暂无可展开的分数与复录数据。</p>
                <div class="history-source-note">
                  <span>“—”表示已接入来源均未提供，不按 0 计算。</span>
                  <a :href="record.aggregatorDetail" target="_blank" rel="noopener noreferrer">
                    查看聚合来源
                  </a>
                </div>
              </section>

              <section
                v-if="record.historicalEvidence.length > 0"
                class="record-section official-section"
              >
                <div class="section-title-row">
                  <div>
                    <h3>2023—2025 年度官网证据</h3>
                    <p class="section-caption">每个数值绑定当年学院原文；名单口径与来源统计不一致时并列保留。</p>
                  </div>
                  <span class="status-chip verified">{{ record.historicalEvidence.length }} 组证据</span>
                </div>
                <div class="official-evidence-list">
                  <article
                    v-for="item in record.historicalEvidence"
                    :key="`${item.type}-${item.year}-${item.scope}`"
                  >
                    <div class="evidence-heading">
                      <span class="evidence-type">{{ item.year }} · {{ evidenceTypeLabels[item.type] }}</span>
                      <span :class="['status-chip', item.status]">{{ evidenceStatusLabels[item.status] }}</span>
                      <strong>{{ historicalEvidenceSummary(item) }}</strong>
                    </div>
                    <div class="evidence-sources">
                      <div v-for="source in item.sources" :key="source.url">
                        <a :href="source.url" target="_blank" rel="noopener noreferrer">
                          {{ source.title }}
                        </a>
                        <small>{{ source.publishedAt ?? '发布日期未标明' }}</small>
                      </div>
                    </div>
                    <p v-if="historicalEvidenceDetails(item)" class="evidence-values">
                      {{ historicalEvidenceDetails(item) }}
                    </p>
                    <p>{{ item.scope }} · 访问 {{ item.accessedAt }}</p>
                    <p v-if="item.note" class="evidence-note">{{ item.note }}</p>
                  </article>
                </div>
              </section>

              <section class="record-section evidence-section">
                <h3>来源与官网核验</h3>
                <p>
                  来源参考值与官网核验值分开展示；两者有差异时，以链接中的当年学校原文为准。没有官网核验值不代表真实人数为0。
                </p>
                <div class="source-actions inline">
                  <a :href="record.aggregatorDetail" target="_blank" rel="noopener noreferrer">
                    {{ isOfficialSourceRecord(record) ? '查看官网来源原文' : '查看聚合原详情' }}
                  </a>
                  <a :href="school.officialPortal" target="_blank" rel="noopener noreferrer">进入院校官网核验</a>
                </div>
              </section>
            </div>
          </details>
        </div>
      </article>
    </div>

    <div v-else class="empty-result">没有符合当前筛选条件的院校或专业记录。</div>
  </section>
</template>
