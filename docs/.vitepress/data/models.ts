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
  politics?: number | null
  foreignLanguage?: number | null
  subjectOne?: number | null
  subjectTwo?: number | null
  scoreLine?: number | null
  highestScore?: number | null
  lowestScore?: number | null
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
  note?: string
}

export interface OfficialRecordData {
  planned: number | null
  retest: number | null
  admitted: number | null
  scoreLine: number | null
  evidence: OfficialEvidence[]
}

export interface SourceAdmissionRecord {
  id: string
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
  scoreLine: number | null
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
  officialEvidence: OfficialEvidence[]
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
