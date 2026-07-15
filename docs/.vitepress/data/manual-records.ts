import type { SourceAdmissionRecord } from './models.ts'

const catalogUrl =
  'https://admission.ucas.ac.cn/info/ZhaoshengDanweiDetail/9e780c52-baf5-4020-b453-bc4510579559/8000712026'

const academicExams = [
  '(101)思想政治理论',
  '(201)英语一',
  '(301)数学一',
  '(893)力学专业综合'
]

const makeDirections = (names: string[]) =>
  names.map((name) => ({ name, exams: academicExams }))

const retestDetails = [
  {
    label: '复试方式与内容',
    content:
      '2026年采用现场复试，考核思想政治品德、英语、专业能力及综合素质；英语权重10%，专业能力及综合素质权重90%，单人复试时间一般不超过20分钟。'
  },
  {
    label: '总成绩公式',
    content: '录取成绩由初试成绩和复试成绩各按50%计入，复试成绩低于60分不予录取。'
  }
]

const makeRecord = (
  majorCode: string,
  majorName: string,
  planned: number,
  admitted: number,
  directionNames: string[]
): SourceAdmissionRecord => ({
  id: `ucas-imech-${majorCode}`,
  sourceKind: 'official',
  schoolCode: '80007',
  schoolName: '中国科学院大学（力学研究所）',
  region: '北京',
  department: '(80007)力学研究所',
  majorCode,
  majorName,
  disciplineEvaluation: null,
  is985: false,
  is211: false,
  isDoubleFirstClass: true,
  planned,
  basicRetestLine: null,
  scoreLine: 322,
  retest: null,
  admitted,
  retestAdmissionRatio: null,
  aggregatorDetail: catalogUrl,
  studyMode: '全日制',
  directions: makeDirections(directionNames),
  enrollmentNote: `国科大2026年硕士招生目录预计统考招生${planned}人；目录同时说明力学所硕士总计划约90人（含推免和专业硕士），分专业计划以正式下达结果为准。`,
  studyLength: null,
  retestDetails,
  history: [
    {
      year: '2026',
      politics: 33,
      foreignLanguage: 33,
      subjectOne: 50,
      subjectTwo: 50,
      scoreLine: 322,
      retestCount: null,
      admittedCount: admitted,
      retestAdmissionRatio: null,
      firstChoiceAdmitted: admitted,
      transferAdmitted: 0
    }
  ],
  plannedHistory: [{ year: '2026', value: planned }]
})

const hitAirspaceMechanicsRecord: SourceAdmissionRecord = {
  id: 'hit-aero-085500-airspace-mechanics',
  sourceKind: 'official',
  schoolCode: '10213',
  schoolName: '哈尔滨工业大学',
  region: '黑龙江',
  department: '(001)航天学院',
  majorCode: '085500',
  majorName: '机械（空天力学）',
  disciplineEvaluation: null,
  is985: true,
  is211: true,
  isDoubleFirstClass: true,
  planned: 47,
  basicRetestLine: null,
  scoreLine: 355,
  retest: 49,
  admitted: 47,
  retestAdmissionRatio: '1:1.0',
  aggregatorDetail: 'https://sa.hit.edu.cn/2026/0322/c6582a388652/page.htm',
  studyMode: '全日制',
  directions: [
    { name: '11 空天力学', exams: [] },
    { name: '42 空天力学（郑州基地）', exams: [] },
    { name: '61 空天力学（苏州基地）', exams: [] }
  ],
  enrollmentNote:
    '仅统计085500机械中官网明确标为“空天力学”的三个方向；计划分别为10、13、24人，不代表航天学院085500机械专业的全部方向。',
  studyLength: null,
  retestDetails: [
    {
      label: '复试方式与内容',
      content:
        '复试由专业综合考核和面试组成；复试成绩=专业综合考核（折算百分）×60%+面试（折算百分）×40%。'
    },
    {
      label: '总成绩公式',
      content: '初试成绩与复试成绩各占录取总成绩50%；录取总成绩=初试成绩（折算成百分）+复试成绩。'
    }
  ],
  history: [
    {
      year: '2026',
      politics: 50,
      foreignLanguage: 45,
      subjectOne: 70,
      subjectTwo: 70,
      scoreLine: 355,
      retestCount: 49,
      admittedCount: 47,
      retestAdmissionRatio: '1:1.0',
      firstChoiceAdmitted: 47,
      transferAdmitted: 0
    }
  ],
  plannedHistory: [{ year: '2026', value: 47 }]
}

export const manualAdmissionRecords: SourceAdmissionRecord[] = [
  makeRecord('080101', '一般力学与力学基础', 0, 0, [
    '(01)动力学与控制',
    '(02)飞行力学与控制',
    '(03)生物力学',
    '(04)等离子体动力学',
    '(05)相对论天体力学',
    '(06)空间弱力测量技术',
    '(07)遥科学中的力学问题',
    '(08)力学测量中的光学技术'
  ]),
  makeRecord('080102', '固体力学', 1, 3, [
    '(01)固体变形与本构理论',
    '(02)固体强度、损伤、断裂与疲劳',
    '(03)波动、振动与噪声',
    '(04)接触、摩擦与表界面力学',
    '(05)微纳米力学与多尺度力学',
    '(06)材料和结构的优化设计、制造与可靠性',
    '(07)多场耦合与智能结构力学',
    '(08)软物质与柔性结构力学',
    '(09)力化学耦合',
    '(10)实验固体力学',
    '(11)极端条件下材料与结构力学',
    '(12)物理力学',
    '(13)计算固体力学与机器学习',
    '(14)冲击动力学',
    '(15)新型结构材料力学',
    '(16)仿生材料与生物固体力学'
  ]),
  makeRecord('080103', '流体力学', 1, 1, [
    '(01)湍流与流动稳定性',
    '(02)多相流、渗流与非牛顿流体力学',
    '(03)旋涡、空泡与分离流动',
    '(04)微纳尺度流与界面流动',
    '(05)水动力学与环境流体力学',
    '(06)空气动力学',
    '(07)高温气体动力学',
    '(08)稀薄气体与非平衡流动',
    '(09)微重力流体力学',
    '(10)传热传质与燃烧',
    '(11)流动噪声与气动声学',
    '(12)电磁流体力学',
    '(13)生物流体力学',
    '(14)多场多介质耦合与流动控制',
    '(15)实验流体力学',
    '(16)计算流体力学',
    '(17)智能流体力学'
  ]),
  makeRecord('080104', '工程力学', 0, 0, [
    '(01)海洋工程结构力学',
    '(02)海洋土力学',
    '(03)海洋流体力学',
    '(04)油气渗流力学',
    '(05)多相分离与计量力学',
    '(06)流固耦合力学',
    '(07)结构动力学',
    '(08)结构力学设计与性能评价',
    '(09)材料工艺力学',
    '(10)岩石力学与工程',
    '(11)土力学与结构稳定性',
    '(12)山地灾害力学',
    '(13)风暴潮灾害力学',
    '(14)爆炸力学',
    '(15)激光与物质的相互作用',
    '(16)飞行器设计与工程',
    '(17)发动机设计与工程',
    '(18)轨道交通装备力学'
  ]),
  hitAirspaceMechanicsRecord
]
