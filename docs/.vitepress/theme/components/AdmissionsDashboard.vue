<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  majorLabels,
  schools,
  snapshot,
  type CoverageMetric,
  type SchoolAdmission
} from '../../data/schools'

type CompletenessFilter = 'all' | 'complete' | 'partial'
type SortKey = 'code' | 'name' | 'planned' | 'retest' | 'admitted'

const query = ref('')
const major = ref('all')
const completeness = ref<CompletenessFilter>('all')
const sortKey = ref<SortKey>('code')

const majorOptions = computed(() =>
  [...new Set(schools.flatMap((school) => school.majors))].sort()
)

const isComplete = (metric: CoverageMetric) => metric.known === metric.total

const hasCompleteMetrics = (school: SchoolAdmission) =>
  isComplete(school.planned) && isComplete(school.retest) && isComplete(school.admitted)

const filteredSchools = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase('zh-CN')
  const result = schools.filter((school) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      school.name.toLocaleLowerCase('zh-CN').includes(normalizedQuery) ||
      school.code.includes(normalizedQuery)
    const matchesMajor = major.value === 'all' || school.majors.includes(major.value)
    const complete = hasCompleteMetrics(school)
    const matchesCompleteness =
      completeness.value === 'all' ||
      (completeness.value === 'complete' && complete) ||
      (completeness.value === 'partial' && !complete)
    return matchesQuery && matchesMajor && matchesCompleteness
  })

  return [...result].sort((left, right) => {
    if (sortKey.value === 'name') return left.name.localeCompare(right.name, 'zh-CN')
    if (sortKey.value === 'code') return left.code.localeCompare(right.code)
    const leftValue = left[sortKey.value].value ?? -1
    const rightValue = right[sortKey.value].value ?? -1
    return rightValue - leftValue
  })
})

const sumMetric = (key: 'planned' | 'retest' | 'admitted') =>
  schools.reduce((sum, school) => sum + (school[key].value ?? 0), 0)

const completeSchoolCount = computed(() => schools.filter(hasCompleteMetrics).length)

const metricTitle = (metric: CoverageMetric) => {
  if (metric.value === null) return '来源数据未提供人数'
  if (isComplete(metric)) return `已覆盖 ${metric.total}/${metric.total} 条院系或专业记录`
  return `部分数据：覆盖 ${metric.known}/${metric.total} 条院系或专业记录`
}
</script>

<template>
  <section class="dashboard" aria-labelledby="dashboard-title">
    <h2 id="dashboard-title">0801 力学招生数据总览</h2>

    <div class="notice">
      <strong>数据边界：</strong>
      当前人数来自“{{ snapshot.provider }}”公开接口快照，来源页没有标注统计年份；院校官网链接已核对为官方入口，但尚未逐校定位到当年招生目录、复试名单和拟录取名单，因此人数属于<strong>聚合参考数据</strong>，不是官网最终结论。缺失记录不会按 0 人计算。
    </div>

    <div class="summary-grid" aria-label="数据摘要">
      <article class="summary-card">
        <div class="summary-label">985 院校</div>
        <div class="summary-value">{{ schools.length }}</div>
        <div class="summary-meta">按院校代码去重</div>
      </article>
      <article class="summary-card">
        <div class="summary-label">招生计划合计</div>
        <div class="summary-value">{{ sumMetric('planned') }}</div>
        <div class="summary-meta">覆盖 {{ snapshot.plannedKnownRecords }}/{{ snapshot.totalSourceRecords }} 条记录</div>
      </article>
      <article class="summary-card">
        <div class="summary-label">复试人数合计</div>
        <div class="summary-value">{{ sumMetric('retest') }}</div>
        <div class="summary-meta">覆盖 {{ snapshot.retestKnownRecords }}/{{ snapshot.totalSourceRecords }} 条记录</div>
      </article>
      <article class="summary-card">
        <div class="summary-label">拟录取人数合计</div>
        <div class="summary-value">{{ sumMetric('admitted') }}</div>
        <div class="summary-meta">覆盖 {{ snapshot.admittedKnownRecords }}/{{ snapshot.totalSourceRecords }} 条记录</div>
      </article>
    </div>

    <div class="dashboard-controls" aria-label="数据筛选">
      <div class="control">
        <label for="school-search">搜索院校或代码</label>
        <input id="school-search" v-model="query" type="search" placeholder="例如：武汉大学 / 10486" />
      </div>
      <div class="control">
        <label for="major-filter">专业代码</label>
        <select id="major-filter" v-model="major">
          <option value="all">全部 0801 专业</option>
          <option v-for="code in majorOptions" :key="code" :value="code">
            {{ code }} {{ majorLabels[code] }}
          </option>
        </select>
      </div>
      <div class="control">
        <label for="coverage-filter">数据完整度</label>
        <select id="coverage-filter" v-model="completeness">
          <option value="all">全部</option>
          <option value="complete">三项完整</option>
          <option value="partial">存在缺失</option>
        </select>
      </div>
      <div class="control">
        <label for="sort-select">排序</label>
        <select id="sort-select" v-model="sortKey">
          <option value="code">院校代码</option>
          <option value="name">院校名称</option>
          <option value="planned">招生计划从高到低</option>
          <option value="retest">复试人数从高到低</option>
          <option value="admitted">拟录取人数从高到低</option>
        </select>
      </div>
    </div>

    <p class="result-meta">
      当前显示 {{ filteredSchools.length }} 所；三项数据完整 {{ completeSchoolCount }} 所。人数后的覆盖率表示已知记录数/该校总记录数。
    </p>

    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th scope="col">院校</th>
            <th scope="col">0801 招生专业</th>
            <th scope="col">招生计划</th>
            <th scope="col">复试人数</th>
            <th scope="col">拟录取人数</th>
            <th scope="col">完整度</th>
            <th scope="col">来源</th>
          </tr>
        </thead>
        <tbody v-if="filteredSchools.length > 0">
          <tr v-for="school in filteredSchools" :key="school.code">
            <td>
              <div class="school-name">{{ school.name }}</div>
              <div class="school-code">{{ school.code }} · {{ school.region }} · {{ school.recordCount }} 条记录</div>
            </td>
            <td>
              <div class="major-list">
                <span v-for="code in school.majors" :key="code" class="major-chip">
                  {{ code }} {{ majorLabels[code] }}
                </span>
              </div>
            </td>
            <td :title="metricTitle(school.planned)">
              <div class="metric-value">{{ school.planned.value ?? '—' }}</div>
              <div class="metric-coverage">{{ school.planned.known }}/{{ school.planned.total }}</div>
            </td>
            <td :title="metricTitle(school.retest)">
              <div class="metric-value">{{ school.retest.value ?? '—' }}</div>
              <div class="metric-coverage">{{ school.retest.known }}/{{ school.retest.total }}</div>
            </td>
            <td :title="metricTitle(school.admitted)">
              <div class="metric-value">{{ school.admitted.value ?? '—' }}</div>
              <div class="metric-coverage">{{ school.admitted.known }}/{{ school.admitted.total }}</div>
            </td>
            <td>
              <span :class="['status-chip', { partial: !hasCompleteMetrics(school) }]">
                {{ hasCompleteMetrics(school) ? '三项完整' : '部分数据' }}
              </span>
            </td>
            <td>
              <div class="source-links">
                <a :href="`/details#school-${school.code}`">本站详情</a>
                <a :href="school.officialPortal" target="_blank" rel="noopener noreferrer">院校官网</a>
                <a :href="school.aggregatorPage" target="_blank" rel="noopener noreferrer">聚合详情</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredSchools.length === 0" class="empty-result">
        没有符合当前筛选条件的院校。
      </div>
    </div>
  </section>
</template>
