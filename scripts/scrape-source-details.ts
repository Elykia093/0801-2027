import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const majorCodes = ['080100', '080101', '080102', '080103', '080104', '0801J1', '0801J7'] as const

interface SourceRecord {
  school_code: string
  school_name: string
  department: string
  major_name: string
  major_code: string
  enroll_num: number | null
  major_eval_display: string | null
  retest_total_score_line: number | null
  yantu_major_id: number
  is_985: number
  is_211: number
  is_double_first: number
  region: string
  score_line: number | null
  retest_count: number | null
  enroll_count: number | null
  rate: string | null
}

interface Direction {
  name: string
  exams: string[]
}

const decodeHtml = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

const cleanText = (value: string) =>
  decodeHtml(value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' '))
    .replace(/[\t\r ]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim()

const knownNumber = (value: number | null) => (value && value > 0 ? value : null)

const fetchText = async (url: string) => {
  let lastError: unknown
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'mechanics-985-admissions-data-refresh/1.0' } })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      return await response.text()
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(`请求失败：${url}；${String(lastError)}`)
}

const extractArray = <T extends string | number>(html: string, name: string): T[] => {
  const match = html.match(new RegExp(`var ${name} = (\\[[^;]*\\]);`))
  if (!match) return []
  return JSON.parse(match[1]!) as T[]
}

const parseDirections = (html: string) => {
  const panel = html.match(/<!-- ===== Tab 1:[\s\S]*?<!-- ===== Tab 2:/)?.[0] ?? ''
  const directions: Direction[] = []
  const rawStudyLength = cleanText(panel.match(/<div class="dept-meta">([\s\S]*?)<\/div>/)?.[1] ?? '')
  const rowPattern = /<tr>\s*<td>([\s\S]*?)<\/td>\s*<td class="td-exam">([\s\S]*?)<\/td>[\s\S]*?<\/tr>/g
  for (const match of panel.matchAll(rowPattern)) {
    const exams = [...match[2]!.matchAll(/<div class="exam-line[^"]*">([\s\S]*?)<\/div>/g)]
      .map((exam) => cleanText(exam[1]!))
      .filter(Boolean)
    directions.push({ name: cleanText(match[1]!), exams })
  }

  return {
    directions,
    enrollmentNote: cleanText(panel.match(/class="enroll-cell">([\s\S]*?)<\/td>/)?.[1] ?? '') || null,
    studyLength: rawStudyLength.replace(/^学习方式[：:]/, '').trim() || null
  }
}

const parseRetestDetails = (html: string) => {
  const panel = html.match(/<!-- ===== Tab 2:[\s\S]*?<!-- ===== Tab 3:/)?.[0] ?? ''
  return [...panel.matchAll(/<span[^>]*>([\s\S]*?)<\/span>\s*<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((match) => ({ label: cleanText(match[1]!), content: cleanText(match[2]!) }))
    .filter((item) => item.label && item.content)
}

const historyKeyMap: Record<string, string> = {
  政治: 'politicsAverage',
  外语: 'foreignLanguageAverage',
  业务1: 'subjectOneAverage',
  业务2: 'subjectTwoAverage',
  '总分(复试线)': 'averageScore',
  最高分: 'admittedHighestScore',
  最低分: 'admittedLowestScore',
  复试人数: 'retestCount',
  录取人数: 'admittedCount',
  复录比: 'retestAdmissionRatio',
  一志愿录取: 'firstChoiceAdmitted',
  调剂录取: 'transferAdmitted'
}

const parseHistory = (html: string) => {
  const panel = html.match(/<!-- ===== Tab 4:[\s\S]*?<script>/)?.[0] ?? ''
  const years = [...panel.matchAll(/<th>(\d{4})<\/th>/g)].map((match) => match[1]!)
  const history = years.map((year) => ({ year } as Record<string, string | number | null>))

  for (const row of panel.matchAll(/<tr>\s*<td(?: class="[^"]*")?>([\s\S]*?)<\/td>([\s\S]*?)<\/tr>/g)) {
    const label = cleanText(row[1]!)
    const key = historyKeyMap[label]
    if (!key) continue
    const values = [...row[2]!.matchAll(/<td(?: class="[^"]*")?>([\s\S]*?)<\/td>/g)].map((cell) => cleanText(cell[1]!))
    values.forEach((value, index) => {
      const historyItem = history[index]
      if (!historyItem) return
      if (key === 'retestAdmissionRatio') {
        historyItem[key] = value && value !== '-' ? value : null
        return
      }
      const numberValue = Number(value)
      historyItem[key] = value && value !== '-' && Number.isFinite(numberValue) ? numberValue : null
    })
  }

  const plannedYears = extractArray<string>(html, '_chart_planned_years')
  const plannedValues = extractArray<number>(html, '_chart_planned')
  const plannedHistory = plannedYears.map((year, index) => ({ year, value: plannedValues[index] ?? null }))
  return { history, plannedHistory }
}

const parseDetailPage = (html: string) => {
  const header = html.match(/<div class="school-tags"[\s\S]*?<\/div>/)?.[0] ?? ''
  const studyMode = cleanText(header.match(/<span style="color:var\(--text-dim\);font-size:13px;">([\s\S]*?)<\/span>/)?.[1] ?? '') || null
  return {
    studyMode,
    ...parseDirections(html),
    retestDetails: parseRetestDetails(html),
    ...parseHistory(html)
  }
}

const mapWithLimit = async <T, U>(items: T[], limit: number, mapper: (item: T) => Promise<U>) => {
  const result = new Array<U>(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      result[index] = await mapper(items[index]!)
    }
  })
  await Promise.all(workers)
  return result
}

const sourceRecords = (
  await Promise.all(
    majorCodes.map(async (majorCode) => {
      const payload = JSON.parse(
        await fetchText(`https://ksg.hongguoyan.com/api/majors/schools?major_code=${majorCode}`)
      ) as { data: SourceRecord[] }
      return payload.data.filter((record) => record.is_985 === 1)
    })
  )
).flat()

const records = await mapWithLimit(sourceRecords, 6, async (record) => {
  const aggregatorDetail = `https://ksg.hongguoyan.com/schools/detail/${record.school_code}/${record.major_code}/${record.yantu_major_id}`
  const detail = parseDetailPage(await fetchText(aggregatorDetail))
  return {
    id: String(record.yantu_major_id),
    schoolCode: record.school_code,
    schoolName: record.school_name,
    region: record.region,
    department: record.department,
    majorCode: record.major_code,
    majorName: record.major_name,
    disciplineEvaluation: record.major_eval_display && record.major_eval_display !== '-' ? record.major_eval_display : null,
    is985: record.is_985 === 1,
    is211: record.is_211 === 1,
    isDoubleFirstClass: record.is_double_first === 1,
    planned: knownNumber(record.enroll_num),
    basicRetestLine: knownNumber(record.retest_total_score_line),
    averageScore: knownNumber(record.score_line),
    retest: knownNumber(record.retest_count),
    admitted: knownNumber(record.enroll_count),
    retestAdmissionRatio: record.rate && record.rate !== '-' ? record.rate : null,
    aggregatorDetail,
    ...detail
  }
})

records.sort((left, right) =>
  left.schoolCode.localeCompare(right.schoolCode) ||
  left.majorCode.localeCompare(right.majorCode) ||
  left.department.localeCompare(right.department, 'zh-CN')
)

const serializedRecords = JSON.stringify(records, null, 2)

if (process.argv.includes('--write')) {
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const outputPath = resolve(projectRoot, 'docs/.vitepress/data/source-records.generated.ts')
  const output = [
    "import type { SourceAdmissionRecord } from './models.ts'",
    '',
    '// 由 scripts/scrape-source-details.ts 从公开接口与详情页生成。',
    '// 不要手工修改；刷新命令：pnpm sync:data',
    `export const admissionRecords: SourceAdmissionRecord[] = ${serializedRecords}`,
    ''
  ].join('\n')
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, output, 'utf8')
  console.log(`已生成 ${records.length} 条记录：${outputPath}`)
} else {
  console.log(serializedRecords)
}
