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
  type OfficialEvidence
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

const valueOrPending = (value: number | string | null | undefined) => value ?? '待核验'

const historyRows: Array<{ label: string; key: keyof AdmissionHistory }> = [
  { label: '政治', key: 'politics' },
  { label: '外语', key: 'foreignLanguage' },
  { label: '业务 1', key: 'subjectOne' },
  { label: '业务 2', key: 'subjectTwo' },
  { label: '总分（复试线）', key: 'scoreLine' },
  { label: '最高分', key: 'highestScore' },
  { label: '最低分', key: 'lowestScore' },
  { label: '复试人数', key: 'retestCount' },
  { label: '录取人数', key: 'admittedCount' },
  { label: '复录比', key: 'retestAdmissionRatio' },
  { label: '一志愿录取', key: 'firstChoiceAdmitted' },
  { label: '调剂录取', key: 'transferAdmitted' }
]

const historyValue = (history: AdmissionHistory, key: keyof AdmissionHistory) =>
  history[key] ?? '—'

const recordCompleteness = (record: AdmissionRecord) => {
  const fields = [record.planned, record.retest, record.admitted, record.scoreLine]
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
</script>

<template>
  <section class="admissions-details" aria-labelledby="details-title">
    <h1 id="details-title">力学相关专业招生详情库</h1>
    <p class="details-lead">
      逐院系展开 {{ snapshot.totalSourceRecords }} 条力学相关记录，覆盖0801学硕和经官网明确核验的力学相关专硕；已有 {{ snapshot.officialEvidenceRecords }} 条记录绑定具体官网原文，其中 {{ snapshot.officialValueRecords }} 条取得可展示的官网核验值，{{ snapshot.officialRangeRecordCount }} 条含复试名单初试分范围。
    </p>

    <div class="notice">
      <strong>证据边界：</strong>
      985院校的0801聚合字段来自“{{ snapshot.provider }}”公开页面快照；国科大力学所和哈工大空天力学专硕字段直接来自官方目录、方案与名单。专硕只纳入官网能明确映射到力学方向的子集；合并专业且无法拆分时不会硬计入。
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
          <option value="pending-split">官网材料待拆分</option>
        </select>
      </div>
    </div>

    <p class="result-meta">
      当前显示 {{ filteredSchools.length }} 个招生单位、{{ filteredSchools.reduce((sum, school) => sum + school.records.length, 0) }} 条院系/专业记录。
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
                  <div><dt>复试基本线</dt><dd>{{ valueOrPending(record.basicRetestLine) }}</dd></div>
                  <div><dt>来源复试线</dt><dd>{{ valueOrPending(record.scoreLine) }}</dd></div>
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

              <section class="record-section">
                <h3>历年招生计划</h3>
                <div class="history-chip-row">
                  <span v-for="item in record.plannedHistory" :key="item.year" class="history-chip">
                    {{ item.year }}：{{ valueOrPending(item.value) }} 人
                  </span>
                </div>
              </section>

              <section class="record-section">
                <h3>历年分数与复录数据</h3>
                <div v-if="record.history.length > 0" class="compact-table-wrap">
                  <table class="compact-table history-table">
                    <thead>
                      <tr>
                        <th scope="col">指标</th>
                        <th v-for="history in record.history" :key="history.year" scope="col">{{ history.year }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in historyRows" :key="row.key">
                        <th scope="row">{{ row.label }}</th>
                        <td v-for="history in record.history" :key="history.year">
                          {{ historyValue(history, row.key) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p v-else class="missing-data">来源页未提供可展开的历年分数与复录数据。</p>
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
