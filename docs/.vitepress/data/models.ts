export interface CoverageMetric {
  value: number | null
  known: number
  total: number
}

export interface AdmissionDirection {
  name: string
  exams: string[]
}

export interface RetestDetail {
  label: string
  content: string
}

export interface AdmissionHistory {
  year: string
  politicsAverage?: number | null
  foreignLanguageAverage?: number | null
  subjectOneAverage?: number | null
  subjectTwoAverage?: number | null
  averageScore?: number | null
  admittedHighestScore?: number | null
  admittedLowestScore?: number | null
  retestCount?: number | null
  admittedCount?: number | null
  retestAdmissionRatio?: string | null
  firstChoiceAdmitted?: number | null
  transferAdmitted?: number | null
}

export interface PlannedHistory {
  year: string
  value: number | null
}

export type OfficialEvidenceType =
  | 'catalog'
  | 'retest'
  | 'admitted'
  | 'score-line'
  | 'retest-rule'

export type OfficialEvidenceStatus = 'verified' | 'partial' | 'not-found'

export interface OfficialEvidence {
  type: OfficialEvidenceType
  title: string
  url: string
  publishedAt: string | null
  accessedAt: string
  year: string
  scope: string
  status: OfficialEvidenceStatus
  value?: number
  highestScore?: number
  lowestScore?: number
  note?: string
}

export interface HistoricalEvidenceSource {
  title: string
  url: string
  publishedAt: string | null
}

export type HistoricalEvidenceValues = {
  [Key in keyof Omit<AdmissionHistory, 'year'>]?: NonNullable<AdmissionHistory[Key]>
} & {
  planned?: number
  retestPoliticsLine?: number
  retestForeignLanguageLine?: number
  retestSubjectOneLine?: number
  retestSubjectTwoLine?: number
  retestScoreLine?: number
  retestHighestScore?: number
  retestLowestScore?: number
}

export interface HistoricalEvidence {
  type: OfficialEvidenceType
  year: string
  scope: string
  status: OfficialEvidenceStatus
  accessedAt: string
  sources: HistoricalEvidenceSource[]
  values: HistoricalEvidenceValues
  note?: string
}

export type ReferenceMaterialStatus =
  | 'unreviewed'
  | 'partial'
  | 'verified'
  | 'explicitly-not-designated'
  | 'not-published'

export interface ReferenceMaterialBook {
  title: string
  authors: string[]
  edition: string | null
  publisher: string | null
  publishedYear: string | null
  isbn: string | null
}

export interface ReferenceMaterialSource {
  title: string
  url: string
  publishedAt: string | null
  accessedAt: string
  locator: string
}

export interface ReferenceMaterialLead {
  origin: 'aggregator'
  title: string
  url: string
  accessedAt: string
  excerpt: string
}

export interface ReferenceMaterialCollection {
  year: string
  status: ReferenceMaterialStatus
  examCode: string | null
  examName: string | null
  applicableDirections: string[]
  books: ReferenceMaterialBook[]
  sources: ReferenceMaterialSource[]
  lead?: ReferenceMaterialLead
  note: string
}

export interface OfficialRecordData {
  planned: number | null
  retest: number | null
  admitted: number | null
  scoreLine: number | null
  retestHighestScore?: number | null
  retestLowestScore?: number | null
  historyValues?: Omit<AdmissionHistory, 'year' | 'retestCount' | 'admittedCount'>
  evidence: OfficialEvidence[]
}

export interface SourceAdmissionRecord {
  id: string
  sourceKind?: 'aggregator' | 'official'
  schoolCode: string
  schoolName: string
  region: string
  department: string
  majorCode: string
  majorName: string
  disciplineEvaluation: string | null
  is985: boolean
  is211: boolean
  isDoubleFirstClass: boolean
  planned: number | null
  basicRetestLine: number | null
  averageScore: number | null
  retest: number | null
  admitted: number | null
  retestAdmissionRatio: string | null
  aggregatorDetail: string
  studyMode: string | null
  directions: AdmissionDirection[]
  enrollmentNote: string | null
  studyLength: string | null
  retestDetails: RetestDetail[]
  history: AdmissionHistory[]
  plannedHistory: PlannedHistory[]
}

export interface AdmissionRecord extends SourceAdmissionRecord {
  officialPlanned: number | null
  officialRetest: number | null
  officialAdmitted: number | null
  officialScoreLine: number | null
  officialRetestHighestScore: number | null
  officialRetestLowestScore: number | null
  officialEvidence: OfficialEvidence[]
  historicalEvidence: HistoricalEvidence[]
  referenceMaterial: ReferenceMaterialCollection
}

export interface SchoolAdmission {
  code: string
  name: string
  region: string
  majors: string[]
  disciplineEvaluations: string[]
  recordCount: number
  planned: CoverageMetric
  retest: CoverageMetric
  admitted: CoverageMetric
  officialPortal: string
  aggregatorPage: string
  records: AdmissionRecord[]
}
