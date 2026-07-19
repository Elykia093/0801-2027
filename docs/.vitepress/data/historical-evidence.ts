import type { HistoricalEvidence } from './models.ts'

const accessedAt = '2026-07-17'

const scoreLineSources = {
  '2023': {
    title: '力学研究所2023年招收全国统考硕士研究生复试规程',
    url: 'https://www.imech.ac.cn/edu/zsjy/zs/sszsxx/zsxx/202401/t20240123_6968567.html',
    publishedAt: '2023-03-28'
  },
  '2024': {
    title: '力学研究所2024年招收全国统考硕士研究生复试分数线及规程',
    url: 'https://www.imech.ac.cn/edu/zsjy/zs/sszsxx/zsxx/202403/t20240321_7048040.html',
    publishedAt: '2024-03-21'
  },
  '2025': {
    title: '力学研究所2025年招收全国统考硕士研究生复试分数线及规程',
    url: 'https://www.imech.ac.cn/edu/zsjy/zs/sszsxx/zsxx/202503/t20250319_7561024.html',
    publishedAt: '2025-03-19'
  }
} as const

const retestLineValues = {
  '2023': {
    retestPoliticsLine: 38,
    retestForeignLanguageLine: 38,
    retestSubjectOneLine: 57,
    retestSubjectTwoLine: 57,
    retestScoreLine: 273
  },
  '2024': {
    retestPoliticsLine: 37,
    retestForeignLanguageLine: 37,
    retestSubjectOneLine: 56,
    retestSubjectTwoLine: 56,
    retestScoreLine: 320
  },
  '2025': {
    retestPoliticsLine: 34,
    retestForeignLanguageLine: 34,
    retestSubjectOneLine: 51,
    retestSubjectTwoLine: 51,
    retestScoreLine: 293
  }
} as const

const admittedSources = [
  {
    title: '力学研究所2025年招收全国统考硕士研究生拟录取名单公示',
    url: 'https://www.imech.ac.cn/edu/zsjy/zs/sszsxx/zsxx/202503/t20250331_7585054.html',
    publishedAt: '2025-03-31'
  },
  {
    title: '力学研究所2025年招收全国统考硕士研究生拟录取名单公示（第二批）',
    url: 'https://www.imech.ac.cn/edu/zsjy/zs/sszsxx/zsxx/202504/t20250407_7589888.html',
    publishedAt: '2025-04-07'
  }
]

const makeScoreLineEvidence = (majorCode: string): HistoricalEvidence[] =>
  (['2023', '2024', '2025'] as const).map((year) => ({
    type: 'score-line',
    year,
    scope: `中国科学院力学研究所 ${majorCode} 学术型硕士`,
    status: 'verified',
    accessedAt,
    sources: [scoreLineSources[year]],
    values: retestLineValues[year],
    note: '官网按学术型统一公布复试总分线和两档单科线，适用于力学所各学术型专业。'
  }))

const makeAdmittedEvidence = (
  majorCode: string,
  majorName: string,
  admittedCount: number
): HistoricalEvidence => ({
  type: 'admitted',
  year: '2025',
  scope: `中国科学院力学研究所 ${majorCode} ${majorName}`,
  status: 'verified',
  accessedAt,
  sources: admittedSources,
  values: { admittedCount },
  note:
    admittedCount === 1
      ? '两批统考拟录取名单共18人，逐行按拟录取专业统计：一般力学与力学基础1人。'
      : `两批统考拟录取名单共18人，逐行未出现${majorName}，按官网完整公示记为已知0人。`
})

const makeRecordEvidence = (
  majorCode: string,
  majorName: string,
  admittedCount: number
): HistoricalEvidence[] => [
  ...makeScoreLineEvidence(majorCode),
  makeAdmittedEvidence(majorCode, majorName, admittedCount)
]

const neuSources = {
  '2023': {
    retest: {
      title: '东北大学理学院2023年硕士研究生招生考试复试成绩公布',
      url: 'https://cos.neu.edu.cn/2023/0328/c11039a283040/page.htm',
      publishedAt: '2023-03-28'
    },
    admitted: {
      title: '东北大学理学院2023年硕士研究生拟录取名单公示',
      url: 'https://cos.neu.edu.cn/2023/0410/c11039a283036/page.htm',
      publishedAt: '2023-04-10'
    }
  },
  '2024': {
    retest: {
      title: '东北大学理学院2024年硕士研究生招生考试复试成绩公布',
      url: 'https://cos.neu.edu.cn/2024/0402/c11039a283029/page.htm',
      publishedAt: '2024-04-02'
    },
    transferRetest: {
      title: '东北大学理学院2024年硕士研究生招生考试调剂复试成绩公布',
      url: 'https://cos.neu.edu.cn/2024/0410/c11039a283025/page.htm',
      publishedAt: '2024-04-10'
    },
    admitted: {
      title: '东北大学理学院2024年硕士研究生招生考试拟录取名单',
      url: 'https://cos.neu.edu.cn/2024/0407/c11039a283027/page.htm',
      publishedAt: '2024-04-07'
    },
    transferAdmitted: {
      title: '东北大学理学院2024年硕士研究生招生考试调剂拟录取名单',
      url: 'https://cos.neu.edu.cn/2024/0412/c11039a283024/page.htm',
      publishedAt: '2024-04-12'
    }
  },
  '2025': {
    retest: {
      title: '东北大学理学院2025年硕士研究生招生考试复试成绩公布',
      url: 'https://cos.neu.edu.cn/2025/0401/c11039a283016/page.htm',
      publishedAt: '2025-04-01'
    },
    admitted: {
      title: '东北大学理学院2025年硕士研究生招生考试拟录取名单',
      url: 'https://cos.neu.edu.cn/2025/0407/c11039a283015/page.htm',
      publishedAt: '2025-04-07'
    }
  }
} as const

const neuHistoricalEvidence: HistoricalEvidence[] = [
  {
    type: 'retest',
    year: '2023',
    scope: '东北大学理学院 080100 力学',
    status: 'verified',
    accessedAt,
    sources: [neuSources['2023'].retest],
    values: { retestCount: 11, retestHighestScore: 374, retestLowestScore: 297 },
    note: '官网内嵌复试成绩PDF逐行统计080100共11人，初试总分范围297—374分。'
  },
  {
    type: 'admitted',
    year: '2023',
    scope: '东北大学理学院 080100 力学',
    status: 'verified',
    accessedAt,
    sources: [neuSources['2023'].admitted],
    values: {
      politicsAverage: 64,
      foreignLanguageAverage: 53,
      subjectOneAverage: 98,
      subjectTwoAverage: 132,
      averageScore: 347,
      admittedHighestScore: 374,
      admittedLowestScore: 313,
      admittedCount: 9,
      firstChoiceAdmitted: 9
    },
    note: '官网拟录取PDF逐行统计9人；政治、外语、业务课和初试总分均按名单算术平均后四舍五入到整数。'
  },
  {
    type: 'retest',
    year: '2024',
    scope: '东北大学理学院 080100 力学（一志愿与调剂合计）',
    status: 'verified',
    accessedAt,
    sources: [neuSources['2024'].retest, neuSources['2024'].transferRetest],
    values: { retestCount: 15, retestHighestScore: 372, retestLowestScore: 311 },
    note: '官网两份内嵌PDF逐行统计：一志愿7人、调剂8人，共15人；初试总分范围311—372分。'
  },
  {
    type: 'admitted',
    year: '2024',
    scope: '东北大学理学院 080100 力学（一志愿与调剂合计）',
    status: 'verified',
    accessedAt,
    sources: [neuSources['2024'].admitted, neuSources['2024'].transferAdmitted],
    values: {
      politicsAverage: 66,
      foreignLanguageAverage: 65,
      subjectOneAverage: 79,
      subjectTwoAverage: 121,
      averageScore: 331,
      admittedHighestScore: 361,
      admittedLowestScore: 311,
      admittedCount: 11,
      firstChoiceAdmitted: 7,
      transferAdmitted: 4
    },
    note: '官网一志愿拟录取7人、调剂拟录取4人；来源页的各科平均分及高低分口径对应一志愿7人，按官网名单复算一致。'
  },
  {
    type: 'retest',
    year: '2025',
    scope: '东北大学理学院 080100 力学',
    status: 'verified',
    accessedAt,
    sources: [neuSources['2025'].retest],
    values: { retestCount: 12, retestHighestScore: 379, retestLowestScore: 314 },
    note: '官网内嵌复试成绩PDF逐行统计080100共12人，初试总分范围314—379分。'
  },
  {
    type: 'admitted',
    year: '2025',
    scope: '东北大学理学院 080100 力学',
    status: 'verified',
    accessedAt,
    sources: [neuSources['2025'].admitted],
    values: {
      politicsAverage: 66,
      foreignLanguageAverage: 53,
      subjectOneAverage: 101,
      subjectTwoAverage: 116,
      averageScore: 336,
      admittedHighestScore: 379,
      admittedLowestScore: 317,
      admittedCount: 10,
      firstChoiceAdmitted: 10
    },
    note: '官网拟录取PDF逐行统计10人；政治、外语、业务课和初试总分均按名单算术平均后四舍五入到整数。'
  }
]

const neuResources2025Evidence: HistoricalEvidence[] = [
  {
    type: 'retest',
    year: '2025',
    scope: '东北大学资源与土木工程学院 080104 工程力学',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '东北大学资源与土木工程学院2025年全日制硕士研究生招生考试复试成绩公布',
        url: 'http://www.zitu.neu.edu.cn/2025/0401/c1036a280820/page.htm',
        publishedAt: '2025-04-01'
      }
    ],
    values: { retestCount: 0 },
    note: '官网内嵌完整复试成绩PDF共14个内容页，逐页检索未出现0801或080104，按完整名单记为已知0人。'
  },
  {
    type: 'admitted',
    year: '2025',
    scope: '东北大学资源与土木工程学院 080104 工程力学',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '东北大学资源与土木工程学院2025年硕士研究生招生考试拟录取名单',
        url: 'http://www.zitu.neu.edu.cn/2025/0407/c1036a281099/page.htm',
        publishedAt: '2025-04-07'
      }
    ],
    values: { admittedCount: 0 },
    note: '官网内嵌完整拟录取PDF共13个内容页，逐页检索未出现0801或080104，按完整名单记为已知0人。'
  }
]

const hnuHistoricalEvidence: HistoricalEvidence[] = [
  {
    type: 'retest-rule',
    year: '2023',
    scope: '湖南大学机械与运载工程学院 080100 力学',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '湖南大学机械与运载工程学院2023年硕士研究生复试录取工作实施细则',
        url: 'https://mve.hnu.edu.cn/info/1609/12461.htm',
        publishedAt: '2023-03-27'
      }
    ],
    values: {
      planned: 13,
      retestCount: 16,
      retestPoliticsLine: 50,
      retestForeignLanguageLine: 50,
      retestSubjectOneLine: 80,
      retestSubjectTwoLine: 80,
      retestScoreLine: 314
    },
    note: '官网细则表格明确统招计划13人、上线人数16人及总分线314分；上线人数按进入复试名单口径记录，不推断实际到考人数。'
  },
  {
    type: 'retest-rule',
    year: '2024',
    scope: '湖南大学机械与运载工程学院 080100 力学',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '湖南大学机械与运载工程学院2024年硕士研究生复试录取工作实施细则',
        url: 'https://mve.hnu.edu.cn/info/1609/12379.htm',
        publishedAt: '2024-03-23'
      }
    ],
    values: {
      planned: 11,
      retestPoliticsLine: 50,
      retestForeignLanguageLine: 50,
      retestSubjectOneLine: 70,
      retestSubjectTwoLine: 70,
      retestScoreLine: 310
    },
    note: '官网细则表格明确统招计划11人、总分线310分及单科线50/70分；名单附件下载需要验证码，未读取附件，不据此补复试或拟录取人数。'
  },
  {
    type: 'retest-rule',
    year: '2025',
    scope: '湖南大学机械与运载工程学院 080100 力学',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '机械与运载工程学院2025年硕士研究生招生复试工作实施细则',
        url: 'https://mve.hnu.edu.cn/info/1609/12197.htm',
        publishedAt: '2025-03-22'
      }
    ],
    values: {
      planned: 12,
      retestPoliticsLine: 50,
      retestForeignLanguageLine: 50,
      retestSubjectOneLine: 70,
      retestSubjectTwoLine: 70,
      retestScoreLine: 352
    },
    note: '官网细则表格明确统招计划12人、总分线352分及单科线50/70分；名单附件下载需要验证码，未读取附件，不据此补复试或拟录取人数。'
  }
]

const zjuHistoricalEvidence: HistoricalEvidence[] = [
  {
    type: 'catalog',
    year: '2024',
    scope: '浙江大学航空航天学院 080100 力学',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '航空航天学院2024年硕士研究生招生考试复试录取方案',
        url: 'http://saa.zju.edu.cn/2024/0319/c67589a2892394/page.htm',
        publishedAt: '2024-03-19'
      }
    ],
    values: { planned: 10 },
    note: '官网页面内嵌8页复试录取方案PDF，第2页招生计划表明确[0801]力学招生10人。'
  },
  {
    type: 'catalog',
    year: '2025',
    scope: '浙江大学航空航天学院 080100 力学',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '航空航天学院2025年硕士研究生招生考试复试录取方案',
        url: 'http://saa.zju.edu.cn/2025/0318/c67589a3028162/page.htm',
        publishedAt: '2025-03-18'
      }
    ],
    values: { planned: 8 },
    note: '官网复试录取方案正文招生计划表明确[0801]力学招生8人；页面中的复试名单附件链接已移除，未据此补名单人数。'
  }
]

const buaaSources = {
  '2023': {
    rule: {
      title: '北京航空航天大学航空科学与工程学院招收2023年硕士研究生一志愿复试录取工作方案',
      url: 'https://ase.buaa.edu.cn/info/1113/12224.htm',
      publishedAt: '2023-03-24'
    },
    result: {
      title: '航空学院2023年学术硕士一志愿复试结果公示',
      url: 'https://ase.buaa.edu.cn/info/1113/12236.htm',
      publishedAt: '2023-03-31'
    }
  },
  '2024': {
    rule: {
      title: '北京航空航天大学航空科学与工程学院2024年硕士研究生复试资格基本线及拟招生人数',
      url: 'https://ase.buaa.edu.cn/info/1113/14495.htm',
      publishedAt: '2024-03-27'
    },
    result: {
      title: '航空科学与工程学院招收2024年统考学术学位硕士研究生一志愿复试成绩及拟录取名单',
      url: 'https://ase.buaa.edu.cn/info/1113/14516.htm',
      publishedAt: '2024-04-02'
    }
  },
  '2025': {
    rule: {
      title: '北京航空航天大学航空科学与工程学院2025年硕士研究生复试资格基本线、拟招收人数及志愿采集的通知',
      url: 'https://ase.buaa.edu.cn/info/1113/15332.htm',
      publishedAt: '2025-03-19'
    },
    result: {
      title: '北京航空航天大学航空科学与工程学院招收2025年学术学位硕士研究生拟录取名单',
      url: 'https://ase.buaa.edu.cn/info/1113/15348.htm',
      publishedAt: '2025-03-31'
    }
  }
} as const

const buaaHistoricalValues = {
  '2023': {
    planned: 23,
    retestScoreLine: 335,
    singleLine: 40,
    subjectLine: 60,
    retestCount: 31,
    retestLowestScore: 335,
    retestHighestScore: 413,
    admittedCount: 23,
    retestAdmissionRatio: '1:1.3',
    averageScore: 374,
    admittedLowestScore: 343,
    admittedHighestScore: 413
  },
  '2024': {
    planned: 29,
    retestScoreLine: 325,
    singleLine: 40,
    subjectLine: 60,
    retestCount: 38,
    retestLowestScore: 326,
    retestHighestScore: 428,
    admittedCount: 29,
    retestAdmissionRatio: '1:1.3',
    averageScore: 369,
    admittedLowestScore: 337,
    admittedHighestScore: 428
  },
  '2025': {
    planned: 17,
    retestScoreLine: 320,
    singleLine: 35,
    subjectLine: 60,
    retestCount: 24,
    retestLowestScore: 324,
    retestHighestScore: 389,
    admittedCount: 20,
    retestAdmissionRatio: '1:1.2',
    averageScore: 351,
    admittedLowestScore: 326,
    admittedHighestScore: 389
  }
} as const

const buaaHistoricalEvidence: HistoricalEvidence[] = (
  ['2023', '2024', '2025'] as const
).flatMap((year) => {
  const values = buaaHistoricalValues[year]
  const resultScope = `北京航空航天大学航空科学与工程学院 080100 力学（一志愿）`

  return [
    {
      type: 'retest-rule',
      year,
      scope: resultScope,
      status: 'verified',
      accessedAt,
      sources: [buaaSources[year].rule],
      values: {
        planned: values.planned,
        retestPoliticsLine: values.singleLine,
        retestForeignLanguageLine: values.singleLine,
        retestSubjectOneLine: values.subjectLine,
        retestSubjectTwoLine: values.subjectLine,
        retestScoreLine: values.retestScoreLine
      },
      note:
        year === '2025'
          ? '官网表格明确080100复试总分线320分、两档单科线35/60分；一志愿拟招收人数按飞行器结构强度系8人、空气动力学系7人、动力学与控制系2人合计17人，其中含国际前沿交叉科学研究院专项1人。'
          : `官网表格明确080100一志愿拟招生${values.planned}人、复试总分线${values.retestScoreLine}分及两档单科线${values.singleLine}/${values.subjectLine}分。`
    },
    {
      type: 'retest',
      year,
      scope: resultScope,
      status: 'verified',
      accessedAt,
      sources: [buaaSources[year].result],
      values: {
        retestCount: values.retestCount,
        retestHighestScore: values.retestHighestScore,
        retestLowestScore: values.retestLowestScore
      },
      note: `官网一志愿复试结果表逐行统计080100共${values.retestCount}人，均列出复试成绩；初试总分范围${values.retestLowestScore}—${values.retestHighestScore}分。此处按复试结果表实际列示人数记录，不采用聚合页的资格名单人数。`
    },
    {
      type: 'admitted',
      year,
      scope: resultScope,
      status: 'verified',
      accessedAt,
      sources: [buaaSources[year].result],
      values: {
        averageScore: values.averageScore,
        admittedHighestScore: values.admittedHighestScore,
        admittedLowestScore: values.admittedLowestScore,
        admittedCount: values.admittedCount,
        retestAdmissionRatio: values.retestAdmissionRatio,
        firstChoiceAdmitted: values.admittedCount
      },
      note: `同一官网结果表逐行统计“是否拟录取”为“是”的080100考生${values.admittedCount}人；初试总分算术平均后四舍五入为${values.averageScore}分，范围${values.admittedLowestScore}—${values.admittedHighestScore}分；复录比按同表复试人数与拟录取人数计算为${values.retestAdmissionRatio}。`
    }
  ] satisfies HistoricalEvidence[]
})

const tjuRuleSources = {
  '2023': {
    title: '【统招硕士】机械工程学院2023年硕士研究生招生复试、录取工作办法',
    url: 'https://me.tju.edu.cn/info/1830/17841.htm',
    publishedAt: '2023-03-19'
  },
  '2024': {
    title: '【统招硕士】机械工程学院2024年硕士研究生招生复试、录取工作办法',
    url: 'https://me.tju.edu.cn/info/1041/34661.htm',
    publishedAt: '2024-03-25'
  },
  '2025': {
    title: '【统招硕士】机械工程学院2025年硕士研究生招生复试、录取工作办法',
    url: 'https://me.tju.edu.cn/info/2670/44251.htm',
    publishedAt: '2025-03-19'
  }
} as const

const tjuRetestSources = {
  '2023': tjuRuleSources['2023'],
  '2024': tjuRuleSources['2024'],
  '2025': {
    title: '【统招硕士】机械工程学院2025年硕士研究生复试名单（含专项计划）',
    url: 'https://me.tju.edu.cn/info/2670/44261.htm',
    publishedAt: '2025-03-17'
  }
} as const

const tjuAdmittedSources = {
  '2023': [
    {
      title: '【统招硕士】机械工程学院2023年硕士研究生复试成绩及拟录取名单（含专项计划）',
      url: 'https://me.tju.edu.cn/info/1830/17871.htm',
      publishedAt: '2023-03-28'
    }
  ],
  '2024': [
    {
      title: '【统招硕士】机械工程学院2024年硕士研究生复试成绩及拟录取名单（含专项计划）',
      url: 'https://me.tju.edu.cn/info/1041/34621.htm',
      publishedAt: '2024-04-02'
    },
    {
      title: '【统招硕士】机械工程学院2024年硕士研究生复试成绩及拟录取名单（第二批）',
      url: 'https://me.tju.edu.cn/info/1041/34581.htm',
      publishedAt: '2024-04-07'
    }
  ],
  '2025': [
    {
      title: '【统招硕士】机械工程学院2025年硕士研究生复试成绩及拟录取名单（含专项计划）',
      url: 'https://me.tju.edu.cn/info/2670/44201.htm',
      publishedAt: '2025-03-25'
    },
    {
      title: '【统招硕士】机械工程学院2025年硕士研究生招生拟录取名单（第二批）',
      url: 'https://me.tju.edu.cn/info/2670/44191.htm',
      publishedAt: '2025-03-28'
    }
  ]
} as const

const tjuHistoricalValues = {
  '2023': {
    planned: 19,
    retestCount: 23,
    retestHighestScore: 400,
    retestLowestScore: 313,
    politicsAverage: 63,
    foreignLanguageAverage: 63,
    subjectOneAverage: 103,
    subjectTwoAverage: 122,
    averageScore: 350,
    admittedHighestScore: 400,
    admittedLowestScore: 313,
    admittedCount: 19,
    retestAdmissionRatio: '1:1.2',
    firstChoiceAdmitted: 19,
    transferAdmitted: 0
  },
  '2024': {
    planned: 22,
    retestCount: 16,
    retestHighestScore: 378,
    retestLowestScore: 317,
    politicsAverage: 67,
    foreignLanguageAverage: 73,
    subjectOneAverage: 89,
    subjectTwoAverage: 117,
    averageScore: 346,
    admittedHighestScore: 378,
    admittedLowestScore: 317,
    admittedCount: 16,
    retestAdmissionRatio: '1:1.0',
    firstChoiceAdmitted: 16,
    transferAdmitted: 0
  },
  '2025': {
    planned: 19,
    retestCount: 27,
    retestHighestScore: 388,
    retestLowestScore: 335,
    politicsAverage: 67,
    foreignLanguageAverage: 62,
    subjectOneAverage: 111,
    subjectTwoAverage: 119,
    averageScore: 360,
    admittedHighestScore: 388,
    admittedLowestScore: 344,
    admittedCount: 19,
    retestAdmissionRatio: '1:1.4',
    firstChoiceAdmitted: 19,
    transferAdmitted: 0
  }
} as const

const tjuHistoricalEvidence: HistoricalEvidence[] = (
  ['2023', '2024', '2025'] as const
).flatMap((year) => {
  const values = tjuHistoricalValues[year]
  const scope = '天津大学机械工程学院 080100 力学（一志愿）'
  const admittedSources = [tjuRetestSources[year], ...tjuAdmittedSources[year]]
  const secondBatchNote =
    year === '2023'
      ? ''
      : `${year}年第二批完整结果表未出现080100，故不增加该专业拟录取人数。`

  return [
    {
      type: 'catalog',
      year,
      scope,
      status: 'verified',
      accessedAt,
      sources: [tjuRuleSources[year]],
      values: { planned: values.planned },
      note:
        year === '2023'
          ? '官网复试录取办法计划表列出080100两个方向14人、5人，合计19人。'
          : year === '2024'
            ? '官网复试录取办法计划表列出080100两个方向19人、3人，合计22人。'
            : '官网复试录取办法计划表列出080100两个方向16人、3人，合计19人。'
    },
    {
      type: 'retest',
      year,
      scope,
      status: 'verified',
      accessedAt,
      sources: [tjuRetestSources[year]],
      values: {
        retestCount: values.retestCount,
        retestHighestScore: values.retestHighestScore,
        retestLowestScore: values.retestLowestScore
      },
      note: `官网完整复试名单逐行筛选080100共${values.retestCount}人，初试总分范围${values.retestLowestScore}—${values.retestHighestScore}分。学院方案只引用学校基本线，未明确公布080100专业复试总分线，故不以名单最低分代替。`
    },
    {
      type: 'admitted',
      year,
      scope,
      status: 'verified',
      accessedAt,
      sources: admittedSources,
      values: {
        politicsAverage: values.politicsAverage,
        foreignLanguageAverage: values.foreignLanguageAverage,
        subjectOneAverage: values.subjectOneAverage,
        subjectTwoAverage: values.subjectTwoAverage,
        averageScore: values.averageScore,
        admittedHighestScore: values.admittedHighestScore,
        admittedLowestScore: values.admittedLowestScore,
        admittedCount: values.admittedCount,
        retestAdmissionRatio: values.retestAdmissionRatio,
        firstChoiceAdmitted: values.firstChoiceAdmitted,
        ...(year !== '2023' && { transferAdmitted: values.transferAdmitted })
      },
      note: `官网结果表逐行统计080100拟录取${values.admittedCount}人；按考生编号与复试名单对应，四科及初试总分均按拟录取考生算术平均后四舍五入到整数，初试总分范围${values.admittedLowestScore}—${values.admittedHighestScore}分。复试与拟录取为同一一志愿范围，复录比为${values.retestAdmissionRatio}。${secondBatchNote}`
    }
  ] satisfies HistoricalEvidence[]
})

const whuCivilSources = {
  '2024': {
    title: '土木建筑工程学院2024年硕士研究生复试录取工作实施细则',
    url: 'https://civ.whu.edu.cn/info/1188/56501.htm',
    publishedAt: '2024-03-22'
  },
  '2025': {
    title: '武汉大学土木建筑工程学院2025年硕士研究生复试录取工作实施细则',
    url: 'https://civ.whu.edu.cn/info/1188/65741.htm',
    publishedAt: '2025-03-17'
  }
} as const

const makeWhuCivilHistoricalEvidence = (
  majorCode: string,
  majorName: string
): HistoricalEvidence[] => [
  {
    type: 'retest-rule',
    year: '2024',
    scope: `武汉大学土木建筑工程学院 ${majorCode} ${majorName}（0801 力学共享线）`,
    status: 'verified',
    accessedAt,
    sources: [whuCivilSources['2024']],
    values: {
      retestPoliticsLine: 55,
      retestForeignLanguageLine: 50,
      retestSubjectOneLine: 65,
      retestSubjectTwoLine: 80,
      retestScoreLine: 285
    },
    note: '官网细则对0801力学统一公布总分线285分和单科线55/50/65/80分。可用计划7人属于一级学科共享计划，无法拆分至080102与080104；名单附件下载进入验证码页面，未读取，不据此补专业计划、复试或拟录取人数。'
  },
  {
    type: 'retest-rule',
    year: '2025',
    scope: `武汉大学土木建筑工程学院 ${majorCode} ${majorName}（0801 力学共享线）`,
    status: 'verified',
    accessedAt,
    sources: [whuCivilSources['2025']],
    values: {
      retestPoliticsLine: 45,
      retestForeignLanguageLine: 35,
      retestSubjectOneLine: 55,
      retestSubjectTwoLine: 90,
      retestScoreLine: 275
    },
    note: '官网细则对0801力学统一公布总分线275分和单科线45/35/55/90分。招生计划2人属于一级学科共享计划，无法拆分至080102与080104；名单附件下载进入验证码页面，未读取，不据此补专业计划、复试或拟录取人数。'
  }
]

const whuWaterHistoricalEvidence: HistoricalEvidence[] = [
  {
    type: 'retest-rule',
    year: '2024',
    scope: '武汉大学水利水电学院 080103 流体力学',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '【硕招】武汉大学水利水电学院 2024年硕士研究生入学复试录取工作细则',
        url: 'https://swrh.whu.edu.cn/info/1041/89071.htm',
        publishedAt: '2024-03-21'
      }
    ],
    values: {
      planned: 1,
      retestPoliticsLine: 55,
      retestForeignLanguageLine: 60,
      retestSubjectOneLine: 80,
      retestSubjectTwoLine: 90,
      retestScoreLine: 320
    },
    note: '官网细则内嵌招生计划图片明确080103总计划2人、推免1人、剩余计划1人，并列出学术组总分线320分及单科线55/60/80/90分；名单附件需要验证码，未读取，不据此补复试或拟录取人数。'
  },
  {
    type: 'retest-rule',
    year: '2025',
    scope: '武汉大学水利水电学院 080103 流体力学（学术专业共享线）',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '【硕招】武汉大学水利水电学院 2025年硕士研究生入学复试录取工作细则',
        url: 'https://swrh.whu.edu.cn/info/1041/99721.htm',
        publishedAt: '2025-03-18'
      }
    ],
    values: {
      retestPoliticsLine: 33,
      retestForeignLanguageLine: 33,
      retestSubjectOneLine: 50,
      retestSubjectTwoLine: 90,
      retestScoreLine: 265
    },
    note: '官网细则内嵌招生计划图片对080103等多个学术专业统一列出总分线265分及单科线33/33/50/90分。剩余计划30人属于多个专业共享计划，无法拆分至080103；名单附件需要验证码，未读取，不据此补专业计划、复试或拟录取人数。'
  }
]

const dlutPanjin2024Evidence: HistoricalEvidence[] = [
  {
    type: 'retest-rule',
    year: '2024',
    scope: '大连理工大学化工海洋与生命学院 080104 工程力学',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '化工海洋与生命学院2024年硕士研究生复试录取办法',
        url: 'https://hyxy.dlut.edu.cn/info/1591/12841.htm',
        publishedAt: '2024-03-23'
      }
    ],
    values: {
      planned: 15,
      retestPoliticsLine: 45,
      retestForeignLanguageLine: 45,
      retestSubjectOneLine: 70,
      retestSubjectTwoLine: 75,
      retestScoreLine: 310
    },
    note: '官网复试录取办法PDF第1页列明工程力学复试线为45/45/70/75/310分，第2页列明统考招生计划15人。'
  },
  {
    type: 'retest',
    year: '2024',
    scope: '大连理工大学化工海洋与生命学院 080104 工程力学（一志愿与调剂名单合计）',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '化工海洋与生命学院2024年硕士研究生复试录取办法',
        url: 'https://hyxy.dlut.edu.cn/info/1591/12841.htm',
        publishedAt: '2024-03-23'
      },
      {
        title: '化工海洋与生命学院2024年硕士生招生调剂复试名单',
        url: 'https://hyxy.dlut.edu.cn/info/1591/12881.htm',
        publishedAt: '2024-04-08'
      },
      {
        title: '大连理工大学化工海洋与生命学院调剂复试成绩公示',
        url: 'https://hyxy.dlut.edu.cn/info/1591/12891.htm',
        publishedAt: '2024-04-09'
      },
      {
        title: '化工海洋与生命学院2024年硕士生招生调剂复试名单（第二轮）',
        url: 'https://hyxy.dlut.edu.cn/info/1591/12921.htm',
        publishedAt: '2024-04-11'
      }
    ],
    values: {
      retestCount: 24,
      retestHighestScore: 396,
      retestLowestScore: 314
    },
    note: '一志愿复试名单列出2人，首轮调剂名单列出22人，第二轮完整名单未出现080104，合计24人，初试总分314至396分。首轮调剂成绩表中20人有成绩、2人复试成绩为空，因此保留名单人数但不派生复录比。'
  },
  {
    type: 'admitted',
    year: '2024',
    scope: '大连理工大学化工海洋与生命学院 080104 工程力学（一志愿与调剂拟录取合计）',
    status: 'verified',
    accessedAt,
    sources: [
      {
        title: '化工海洋与生命学院2024年硕士研究生复试录取办法',
        url: 'https://hyxy.dlut.edu.cn/info/1591/12841.htm',
        publishedAt: '2024-03-23'
      },
      {
        title: '化工海洋与生命学院2024年硕士生招生复试结果公示（30日面试）',
        url: 'https://hyxy.dlut.edu.cn/info/1591/12861.htm',
        publishedAt: '2024-03-30'
      },
      {
        title: '化工海洋与生命学院2024年硕士生招生调剂复试名单',
        url: 'https://hyxy.dlut.edu.cn/info/1591/12881.htm',
        publishedAt: '2024-04-08'
      },
      {
        title: '化工海洋与生命学院2024年硕士调剂复试拟录取名单',
        url: 'https://hyxy.dlut.edu.cn/info/1591/12901.htm',
        publishedAt: '2024-04-10'
      },
      {
        title: '化工海洋与生命学院2024年硕士调剂复试拟录取名单（第二轮）',
        url: 'https://hyxy.dlut.edu.cn/info/1591/12941.htm',
        publishedAt: '2024-04-12'
      }
    ],
    values: {
      politicsAverage: 70,
      foreignLanguageAverage: 64,
      subjectOneAverage: 92,
      subjectTwoAverage: 111,
      averageScore: 338,
      admittedHighestScore: 396,
      admittedLowestScore: 318,
      admittedCount: 15,
      firstChoiceAdmitted: 2,
      transferAdmitted: 13
    },
    note: '一志愿拟录取2人、首轮调剂拟录取13人，第二轮完整拟录取名单未出现080104，合计15人。15名拟录取考生按编号与两批复试名单对应后，各科及初试总分平均值四舍五入为70、64、92、111、338分，初试总分范围318至396分。'
  },
  {
    type: 'retest-rule',
    year: '2025',
    scope: '大连理工大学化工海洋与生命学院 080104 工程力学',
    status: 'verified',
    accessedAt: '2026-07-19',
    sources: [
      {
        title: '化工海洋与生命学院2025年硕士研究生复试录取办法',
        url: 'https://hyxy.dlut.edu.cn/info/1981/25661.htm',
        publishedAt: '2025-03-22'
      },
      {
        title: '化工海洋与生命学院2025年全国硕士研究生复试成绩与拟录取名单公示',
        url: 'https://hyxy.dlut.edu.cn/info/1981/25751.htm',
        publishedAt: '2025-03-29'
      }
    ],
    values: {
      planned: 11,
      retestPoliticsLine: 42,
      retestForeignLanguageLine: 42,
      retestSubjectOneLine: 70,
      retestSubjectTwoLine: 75,
      retestScoreLine: 300
    },
    note: '官网复试录取办法正文表格按专业代码列明080104工程力学统考计划11人、差额比例160%，复试线42/42/70/75/300分。复试名单和080104复试成绩及拟录取公示附件均进入验证码下载页，未获附件处理授权，不据此补复试人数、拟录取人数或分数范围。'
  }
]

const seuAccessedAt = '2026-07-19'

const tongjiHistoricalEvidence: HistoricalEvidence[] = [
  {
    type: 'score-line',
    year: '2024',
    scope: '同济大学航空航天与力学学院 080100 力学（全国统考）',
    status: 'verified',
    accessedAt: '2026-07-19',
    sources: [
      {
        title: '同济大学2024年各学院调整分数线通知',
        url: 'https://yz.tongji.edu.cn/info/1012/3442.htm',
        publishedAt: '2024-03-18'
      },
      {
        title: '同济大学航空航天与力学学院2024年硕士研究生进入复试的初试成绩基本要求',
        url: 'https://yz.tongji.edu.cn/101hanglifenshuxian.pdf',
        publishedAt: '2024-03-18'
      }
    ],
    values: {
      retestPoliticsLine: 50,
      retestForeignLanguageLine: 50,
      retestSubjectOneLine: 80,
      retestSubjectTwoLine: 80,
      retestScoreLine: 315
    },
    note: '学院专业线PDF全国统考表明确080100力学单科线50/50/80/80分、总分线315分；专项计划另表，不混入普通统考口径。'
  },
  {
    type: 'score-line',
    year: '2025',
    scope: '同济大学航空航天与力学学院 080100 力学（全国统考）',
    status: 'verified',
    accessedAt: '2026-07-19',
    sources: [
      {
        title: '同济大学2025年各学院调整分数线通知',
        url: 'https://yz.tongji.edu.cn/info/1012/3861.htm',
        publishedAt: '2025-03-14'
      },
      {
        title: '同济大学航空航天与力学学院2025年硕士研究生进入复试的初试成绩基本要求',
        url: 'https://yz.tongji.edu.cn/101fenshuxian.pdf',
        publishedAt: '2025-03-14'
      }
    ],
    values: {
      retestPoliticsLine: 50,
      retestForeignLanguageLine: 45,
      retestSubjectOneLine: 75,
      retestSubjectTwoLine: 85,
      retestScoreLine: 300
    },
    note: '学院专业线PDF全国统考表明确080100力学单科线50/45/75/85分、总分线300分；退役大学生士兵计划另表，不混入普通统考口径。'
  },
  {
    type: 'admitted',
    year: '2025',
    scope: '同济大学航空航天与力学学院 080100 力学（统考录取）',
    status: 'verified',
    accessedAt: '2026-07-19',
    sources: [
      {
        title: '2025年各学院分专业统考生报名录取情况',
        url: 'https://yz.tongji.edu.cn/info/1029/4028.htm',
        publishedAt: '2025-09-25'
      },
      {
        title: '同济大学2025年各学院分专业统考生报名录取情况表',
        url: 'https://yz.tongji.edu.cn/__local/8/8E/8A/75B61ADF7C8EAB629D786D7A940_B10B8C3F_43C99.pdf',
        publishedAt: '2025-09-25'
      }
    ],
    values: { admittedCount: 20 },
    note: '官网统计PDF第2页按学院和专业代码列明101航空航天与力学学院080100力学统考报名113人、统考录取20人；历史录取人数采用统考录取口径。'
  }
]

const seuHistoricalSources = {
  '2023': {
    scoreLine: {
      title: '2023年东南大学各院系所复试分数线',
      url: 'https://yzb.seu.edu.cn/2023/0726/c6674a455893/page.htm',
      publishedAt: '2023-07-26'
    },
    admission: {
      title: '2023年硕士研究生考试录取情况汇总',
      url: 'https://yzb.seu.edu.cn/2023/0726/c6675a455894/page.htm',
      publishedAt: '2023-07-26'
    }
  },
  '2024': {
    scoreLine: {
      title: '2024年东南大学各院系所复试分数线',
      url: 'https://yzb.seu.edu.cn/2024/0813/c6674a499641/page.htm',
      publishedAt: '2024-08-13'
    },
    admission: {
      title: '2024年硕士研究生考试录取情况汇总',
      url: 'https://yzb.seu.edu.cn/2024/0813/c6675a499642/page.htm',
      publishedAt: '2024-08-13'
    }
  },
  '2025': {
    scoreLine: {
      title: '2025年东南大学各院系所复试分数线',
      url: 'https://yzb.seu.edu.cn/2025/0905/c6674a538419/page.htm',
      publishedAt: '2025-09-05'
    },
    admission: {
      title: '2025年硕士研究生考试录取情况汇总',
      url: 'https://yzb.seu.edu.cn/2025/0905/c6675a538418/page.htm',
      publishedAt: '2025-09-05'
    }
  }
} as const

const seuHistoricalValues = {
  '2023': { scoreLine: 300, applied: 56, totalAdmitted: 24, exemptAdmitted: 7, admitted: 17 },
  '2024': { scoreLine: 342, applied: 82, totalAdmitted: 24, exemptAdmitted: 12, admitted: 12 },
  '2025': { scoreLine: 305, applied: 41, totalAdmitted: 25, exemptAdmitted: 8, admitted: 17 }
} as const

const seuHistoricalEvidence: HistoricalEvidence[] = (
  ['2023', '2024', '2025'] as const
).flatMap((year) => {
  const values = seuHistoricalValues[year]
  const scope = '东南大学土木工程学院 080100 力学'

  return [
    {
      type: 'score-line',
      year,
      scope,
      status: 'verified',
      accessedAt: seuAccessedAt,
      sources: [seuHistoricalSources[year].scoreLine],
      values: {
        retestPoliticsLine: 50,
        retestForeignLanguageLine: 50,
        retestSubjectOneLine: 70,
        retestSubjectTwoLine: 70,
        retestScoreLine: values.scoreLine
      },
      note: `官网复试分数线表按学院和专业代码列出080100力学单科线50/50/70/70分、总分线${values.scoreLine}分。`
    },
    {
      type: 'admitted',
      year,
      scope,
      status: 'verified',
      accessedAt: seuAccessedAt,
      sources: [seuHistoricalSources[year].admission],
      values: {
        admittedCount: values.admitted,
        firstChoiceAdmitted: values.admitted,
        transferAdmitted: 0
      },
      note: `官网考试录取汇总表中080100一志愿考试${values.applied}人、总录取${values.totalAdmitted}人、推免录取${values.exemptAdmitted}人、统考录取${values.admitted}人、改录0人；本站历史录取人数采用统考口径，不采用包含推免的总录取人数。`
    }
  ] satisfies HistoricalEvidence[]
})

export const historicalEvidenceByRecord: Record<string, HistoricalEvidence[]> = {
  '325216': hnuHistoricalEvidence,
  '354069': buaaHistoricalEvidence,
  '351357': tjuHistoricalEvidence,
  '336994': zjuHistoricalEvidence,
  '327478': makeWhuCivilHistoricalEvidence('080104', '工程力学'),
  '327479': makeWhuCivilHistoricalEvidence('080102', '固体力学'),
  '327502': whuWaterHistoricalEvidence,
  '347183': neuResources2025Evidence,
  '347202': neuHistoricalEvidence,
  '347444': dlutPanjin2024Evidence,
  '342154': tongjiHistoricalEvidence,
  '340072': seuHistoricalEvidence,
  'ucas-imech-080101': makeRecordEvidence('080101', '一般力学与力学基础', 1),
  'ucas-imech-080102': makeRecordEvidence('080102', '固体力学', 0),
  'ucas-imech-080103': makeRecordEvidence('080103', '流体力学', 0),
  'ucas-imech-080104': makeRecordEvidence('080104', '工程力学', 0)
}
