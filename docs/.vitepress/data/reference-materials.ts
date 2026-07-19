import type { ReferenceMaterialCollection } from './models.ts'

type ReferenceMaterialOverride = Partial<ReferenceMaterialCollection> &
  Pick<ReferenceMaterialCollection, 'note'>

const accessedAt = '2026-07-18'
const researchedAt = '2026-07-19'

const aggregatorLead = (
  title: string,
  url: string,
  excerpt: string
): ReferenceMaterialOverride => ({
  lead: {
    origin: 'aggregator',
    title,
    url,
    accessedAt,
    excerpt
  },
  note: '聚合详情仅提供检索线索，尚未打开并核验对应官网原文，不能据此补书名、作者或版本。'
})

const ucasImechNotPublished = (
  majorCode: string,
  majorName: string
): ReferenceMaterialOverride => ({
  status: 'not-published',
  sources: [
    {
      title: '中国科学院大学2026年硕士招生目录：力学研究所',
      url: 'https://admission.ucas.ac.cn/info/ZhaoshengDanweiDetail/9e780c52-baf5-4020-b453-bc4510579559/8000712026',
      publishedAt: null,
      accessedAt: researchedAt,
      locator: `力学研究所${majorCode} ${majorName}专业目录列出初试科目和方向，未列复试指定参考书。`
    },
    {
      title: '力学研究所2026年招收全国统考硕士研究生复试分数线及规程',
      url: 'https://www.imech.ac.cn/edu/zsjy/zs/sszsxx/zsxx/202603/t20260323_8168665.html',
      publishedAt: '2026-03-23',
      accessedAt: researchedAt,
      locator: '复试规程列出现场复试内容、权重和考核方式，正文及复试名单附件未列指定参考书。'
    }
  ],
  note: `已核查2026国科大招生目录、力学所复试规程和公开附件，未发现${majorCode} ${majorName}复试指定参考书目。`
})

export const referenceMaterialOverrides: Record<string, ReferenceMaterialOverride> = {
  '354069': {
    ...aggregatorLead(
      '北京航空航天大学航空科学与工程学院 080100 聚合详情',
      'https://ksg.hongguoyan.com/schools/detail/10006/080100/354069',
      '参考资料详见《北京航空航天大学航空科学与工程学院招收2025年硕士研究生复试的预通知》。'
    ),
    status: 'verified',
    examName: '航空航天基础知识',
    books: [
      {
        title: '航空航天概论',
        authors: ['贾玉红'],
        edition: '第5版',
        publisher: '北京航空航空大学出版社',
        publishedYear: '2022',
        isbn: null
      },
      {
        title: '航空航天概论',
        authors: ['昂海松', '童明波', '余雄庆'],
        edition: '第三版',
        publisher: '科学出版社',
        publishedYear: '2021',
        isbn: null
      },
      {
        title: '航空航天技术概论',
        authors: ['宋笔锋'],
        edition: null,
        publisher: '国防工业出版社',
        publishedYear: '2014',
        isbn: null
      },
      {
        title: '飞机总体设计',
        authors: ['刘虎', '罗明强', '孙康文'],
        edition: '第2版',
        publisher: '北京航空航天大学出版社',
        publishedYear: '2024',
        isbn: null
      }
    ],
    sources: [
      {
        title: '北京航空航天大学航空科学与工程学院招收2026年硕士研究生复试的预通知',
        url: 'https://ase.buaa.edu.cn/info/1113/16417.htm',
        publishedAt: '2026-03-10',
        accessedAt: researchedAt,
        locator: '正文“笔试主要参考但不限于以下资料”第1—4项。'
      }
    ],
    note: '2026官网预通知完整列出4项笔试参考资料；第一项出版社按官网原文“北京航空航空大学出版社”保存，不自行更正疑似笔误。'
  },
  '353278': {
    ...aggregatorLead(
      '中国农业大学理学院 080100 聚合详情',
      'https://ksg.hongguoyan.com/schools/detail/10019/080100/353278',
      '专业笔试科目为《力学综合》，但该文本不是参考书目。'
    ),
    status: 'not-published',
    examName: '力学综合',
    sources: [
      {
        title: '中国农业大学理学院2026年硕士研究生复试工作实施细则（有更新）',
        url: 'https://sci.cau.edu.cn/art/2026/3/23/art_40525_1103789.html',
        publishedAt: '2026-03-23',
        accessedAt: researchedAt,
        locator: '0801力学复试安排仅列专业笔试科目“力学综合”；正文及可见附件未列指定参考书。'
      }
    ],
    note: '已核查2026招生目录、学院复试细则和公开附件，确认复试科目为力学综合，但未发现2026指定参考书目。'
  },
  '343703': {
    status: 'verified',
    examName: '理论力学、材料力学',
    books: [
      {
        title: '理论力学',
        authors: ['哈尔滨工业大学理论力学教研室'],
        edition: '第八版',
        publisher: '高等教育出版社',
        publishedYear: '2016',
        isbn: null
      },
      {
        title: '材料力学',
        authors: ['孙训芳'],
        edition: '第六版',
        publisher: '高等教育出版社',
        publishedYear: '2019',
        isbn: null
      },
      {
        title: '材料力学',
        authors: ['刘钊', '王秋生'],
        edition: null,
        publisher: '哈尔滨工业大学出版社',
        publishedYear: '2008',
        isbn: null
      }
    ],
    sources: [
      {
        title: '哈尔滨工业大学土木工程学院2026年硕士招生复试参考',
        url: 'https://civil.hit.edu.cn/2025/1229/c8439a385521/page.htm',
        publishedAt: '2025-12-29',
        accessedAt: researchedAt,
        locator: '附件“第四套题大纲：理论力学、材料力学.docx”中两科“二、参考书目”；理论力学1本、材料力学2本。'
      }
    ],
    note: '080100力学考生按2026复试方案只能选择第四套题；官网第四套题大纲完整列出3本参考书。'
  },
  '347381': {
    status: 'verified',
    examCode: '816',
    examName: '材料力学；复试参考范围',
    applicableDirections: [
      '(01)一般力学与力学基础',
      '(02)固体力学',
      '(03)流体力学',
      '(04)工程力学',
      '(05)计算力学',
      '(07)动力学与控制',
      '(08)应用与实验力学',
      '(09)生物与纳米力学',
      '(10)航空航天力学与工程',
      '(11)制造工艺力学',
      '(12)生物医学工程'
    ],
    books: [
      {
        title: '高等数学',
        authors: ['四川大学数学系'],
        edition: null,
        publisher: '高等教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '常微分方程讲义',
        authors: ['叶彦谦'],
        edition: '第二版',
        publisher: '人民教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '理论力学',
        authors: ['哈尔滨工业大学'],
        edition: '第七版',
        publisher: '高等教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '材料力学（I，II）',
        authors: ['刘鸿文'],
        edition: '第四版',
        publisher: '高等教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '理论力学',
        authors: ['阮诗伦', '马红艳'],
        edition: null,
        publisher: '科学出版社',
        publishedYear: '2019',
        isbn: null
      },
      {
        title: '理论力学解题指导',
        authors: ['马红艳'],
        edition: null,
        publisher: '科学出版社',
        publishedYear: '2019',
        isbn: null
      },
      {
        title: '材料力学',
        authors: ['王博'],
        edition: '第二版',
        publisher: '高等教育出版社',
        publishedYear: '2022',
        isbn: null
      },
      {
        title: '材料力学解题指导',
        authors: ['马红艳'],
        edition: '第二版',
        publisher: '科学出版社',
        publishedYear: '2020',
        isbn: null
      }
    ],
    sources: [
      {
        title: '大连理工大学2026年硕士研究生招生专业目录：080100力学',
        url: 'https://yjszs.dlut.edu.cn/zsbm/zsml/sszsml/zsmlYjfx/2026/560/080100?ksfs=21',
        publishedAt: null,
        accessedAt: researchedAt,
        locator: '560力学与航空航天学院080100力学动态目录页“初试参考书目”和“复试参考范围”；11个方向均使用816材料力学。'
      }
    ],
    note: '2026官网动态目录已逐项核验8本不重复参考书；页面未提供ISBN，部分旧版教材未标出版年份，均按原文保留为空。'
  },
  '347406': {
    status: 'verified',
    examCode: '816',
    examName: '材料力学；复试参考范围',
    applicableDirections: [
      '(01)工程结构多学科优化与反问题',
      '(02)结构与多学科耦合系统仿真软件与应用',
      '(03)先进材料与结构分析、设计与性能表征',
      '(04)工程结构动力分析与控制',
      '(05)工程结构可靠性分析与健康诊断'
    ],
    books: [
      {
        title: '高等数学',
        authors: ['四川大学数学系'],
        edition: null,
        publisher: '高等教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '常微分方程讲义',
        authors: ['叶彦谦'],
        edition: '第二版',
        publisher: '人民教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '理论力学',
        authors: ['哈尔滨工业大学'],
        edition: '第七版',
        publisher: '高等教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '材料力学（I，II）',
        authors: ['刘鸿文'],
        edition: '第四版',
        publisher: '高等教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '理论力学',
        authors: ['阮诗伦', '马红艳'],
        edition: null,
        publisher: '科学出版社',
        publishedYear: '2019',
        isbn: null
      },
      {
        title: '理论力学解题指导',
        authors: ['马红艳'],
        edition: null,
        publisher: '科学出版社',
        publishedYear: '2019',
        isbn: null
      },
      {
        title: '材料力学',
        authors: ['王博'],
        edition: null,
        publisher: '高等教育出版社',
        publishedYear: '2018',
        isbn: null
      },
      {
        title: '材料力学解题指导',
        authors: ['马红艳'],
        edition: '第二版',
        publisher: '科学出版社',
        publishedYear: '2020',
        isbn: null
      }
    ],
    sources: [
      {
        title: '大连理工大学2026年硕士研究生招生专业目录：080104工程力学',
        url: 'https://yjszs.dlut.edu.cn/zsbm/zsml/sszsml/zsmlYjfx/2026/490/080104?ksfs=21',
        publishedAt: null,
        accessedAt: researchedAt,
        locator: '490白俄罗斯国立大学联合学院080104工程力学动态目录页“初试参考书目”和编号1—8的“复试参考范围”；5个方向均使用816材料力学。'
      }
    ],
    note: '2026官网动态目录已逐项核验8本不重复参考书；其中王博《材料力学》在复试参考范围中标为高等教育出版社2018年9月，未自行替换为同页初试书目的2022年第二版。'
  },
  '347444': {
    status: 'verified',
    examCode: '816',
    examName: '材料力学；复试参考范围',
    applicableDirections: [
      '(01)海洋工程装备设计中的关键力学问题研究',
      '(02)海洋工程实验及现场监测技术',
      '(03)先进复合材料力学行为',
      '(04)工程机械设计及优化',
      '(05)多体系统与机械系统动力学',
      '(06)智能检测仪器开发与利用'
    ],
    books: [
      {
        title: '高等数学',
        authors: ['四川大学数学系'],
        edition: null,
        publisher: '高等教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '常微分方程讲义',
        authors: ['叶彦谦'],
        edition: '第二版',
        publisher: '人民教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '理论力学',
        authors: ['哈尔滨工业大学'],
        edition: '第七版',
        publisher: '高等教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '材料力学（I，II）',
        authors: ['刘鸿文'],
        edition: '第四版',
        publisher: '高等教育出版社',
        publishedYear: null,
        isbn: null
      },
      {
        title: '理论力学',
        authors: ['阮诗伦', '马红艳'],
        edition: null,
        publisher: '科学出版社',
        publishedYear: '2019',
        isbn: null
      },
      {
        title: '理论力学解题指导',
        authors: ['马红艳'],
        edition: null,
        publisher: '科学出版社',
        publishedYear: '2019',
        isbn: null
      },
      {
        title: '材料力学',
        authors: ['王博'],
        edition: '第二版',
        publisher: '高等教育出版社',
        publishedYear: '2022',
        isbn: null
      },
      {
        title: '材料力学解题指导',
        authors: ['马红艳'],
        edition: '第二版',
        publisher: '科学出版社',
        publishedYear: '2020',
        isbn: null
      }
    ],
    sources: [
      {
        title: '大连理工大学2026年硕士研究生招生专业目录：080104工程力学',
        url: 'https://yjszs.dlut.edu.cn/zsbm/zsml/sszsml/zsmlYjfx/2026/380/080104?ksfs=21',
        publishedAt: null,
        accessedAt: researchedAt,
        locator: '080104工程力学动态目录页列出6个方向、816材料力学初试科目及2本初试用书；“复试参考范围”栏列出高等数学、常微分方程、理论力学和材料力学共8本参考书。'
      }
    ],
    note: '2026官网动态目录已逐项核验8本不重复参考书；页面未提供ISBN，部分旧版教材未标出版年份，均按原文保留为空。'
  },
  '347202': aggregatorLead(
    '东北大学理学院 080100 聚合详情',
    'https://ksg.hongguoyan.com/schools/detail/10145/080100/347202',
    '考核内容参考《东北大学2025年硕士研究生招生考试复试参考信息》。'
  ),
  '327349': {
    status: 'partial',
    examName: '工程力学、流体力学',
    sources: [
      {
        title: '华中科技大学航空航天学院2026年硕士研究生复试工作细则及复试名单公示',
        url: 'http://ae.hust.edu.cn/info/1194/4028.htm',
        publishedAt: '2026-03-17',
        accessedAt: researchedAt,
        locator: '“复试形式和内容”明确080100专业理论知识测试主要考核《工程力学》和《流体力学》，未列书名、作者、版本或出版社。'
      }
    ],
    note: '已核验2026官网复试科目为工程力学和流体力学；未发现对应指定参考书目，保持部分核验。'
  },
  '342154': {
    status: 'not-published',
    sources: [
      {
        title: '同济大学航空航天与力学学院2026年统考硕士复试安排',
        url: 'https://aero-mech.tongji.edu.cn/99/d4/c22245a367060/page.htm',
        publishedAt: '2026-03-20',
        accessedAt: researchedAt,
        locator: '复试安排PDF列出力学笔试、面试时间与考核要求，未列指定参考书；学院2026硕士招生栏目未另发书目。'
      }
    ],
    note: '已核查2026复试安排、复试名单、成绩公示及学院硕士招生栏目，未发现080100复试指定参考书目。'
  },
  '340072': {
    ...aggregatorLead(
      '东南大学土木工程学院 080100 聚合详情',
      'https://ksg.hongguoyan.com/schools/detail/10286/080100/340072',
      '复试科目覆盖范围参见招生专业目录及参考书目。'
    ),
    status: 'verified',
    examCode: '541',
    examName: '力学综合',
    books: [
      {
        title: '理论力学',
        authors: ['东南大学理论力学教研室'],
        edition: '第3版',
        publisher: '高等教育出版社',
        publishedYear: '2015',
        isbn: null
      },
      {
        title: '材料力学',
        authors: ['孙训方等'],
        edition: '第6版（上下册）',
        publisher: '高等教育出版社',
        publishedYear: '2019',
        isbn: null
      },
      {
        title: '弹性力学',
        authors: ['徐芝纶'],
        edition: '第5版',
        publisher: '高等教育出版社',
        publishedYear: '2016',
        isbn: null
      }
    ],
    sources: [
      {
        title: '东南大学2026年招收攻读硕士学位研究生专业目录',
        url: 'https://gsas.seu.edu.cn/ssmlcx2026/pages/index.html',
        publishedAt: null,
        accessedAt: researchedAt,
        locator: '005土木工程学院→080100力学→复试科目541“力学综合”；参考书目栏列出3本书。'
      }
    ],
    note: '2026官方动态招生目录确认080100各方向复试科目为541力学综合，并完整列出理论力学、材料力学、弹性力学3本参考书。'
  },
  '336994': {
    status: 'not-published',
    sources: [
      {
        title: '浙江大学航空航天学院2026年硕士研究生复试录取方案',
        url: 'http://saa.zju.edu.cn/2026/0319/c67589a3142154/page.htm',
        publishedAt: '2026-03-19',
        accessedAt: researchedAt,
        locator: '复试录取方案及可见名单附件未列080100复试指定参考书，学院2026硕士招生栏目未另发书目。'
      }
    ],
    note: '已核查2026招生目录、学院复试录取方案和公开附件，未发现080100复试指定参考书目。'
  },
  '327479': {
    status: 'partial',
    examName: '固体力学',
    sources: [
      {
        title: '武汉大学土木建筑工程学院2026年硕士研究生复试录取工作实施细则',
        url: 'https://civ.whu.edu.cn/info/1188/70751.htm',
        publishedAt: '2026-03-20',
        accessedAt: researchedAt,
        locator: '“各专业复试笔试科目一览表”明确080102固体力学复试笔试科目为“固体力学”，未列指定书目。'
      }
    ],
    note: '已核验2026官网复试笔试科目为固体力学；正文和可见附件未提供书名、作者、版本或出版社。'
  },
  '327478': {
    status: 'partial',
    examName: '固体力学',
    sources: [
      {
        title: '武汉大学土木建筑工程学院2026年硕士研究生复试录取工作实施细则',
        url: 'https://civ.whu.edu.cn/info/1188/70751.htm',
        publishedAt: '2026-03-20',
        accessedAt: researchedAt,
        locator: '“各专业复试笔试科目一览表”明确080104工程力学复试笔试科目为“固体力学”，未列指定书目。'
      }
    ],
    note: '已核验2026官网复试笔试科目为固体力学；正文和可见附件未提供书名、作者、版本或出版社。'
  },
  '327502': {
    status: 'partial',
    sources: [
      {
        title: '武汉大学水利水电学院2026年硕士研究生招生复试录取工作细则',
        url: 'https://swrh.whu.edu.cn/info/1041/110641.htm',
        publishedAt: '2026-03-21',
        accessedAt: researchedAt,
        locator: '正文明确专业笔试考察水利工程基础知识及相关专业方向内容，具体科目及参考书目见附件2；附件下载受验证码限制，尚未读取。'
      }
    ],
    note: '已核验2026官网存在《硕士招生专业、研究方向及复试对应参考书目》附件；因验证码门禁尚未读取080103对应行，保持部分核验。'
  },
  '325216': {
    ...aggregatorLead(
      '湖南大学机械与运载工程学院 080100 聚合详情',
      'https://ksg.hongguoyan.com/schools/detail/10532/080100/325216',
      '参考书目提示为“请参见附件5专业课考试大纲”。'
    ),
    status: 'not-published',
    sources: [
      {
        title: '湖南大学机械与运载工程学院2026年硕士研究生复试录取工作实施细则',
        url: 'https://mve.hnu.edu.cn/info/1609/18225.htm',
        publishedAt: '2026-03-21',
        accessedAt: researchedAt,
        locator: '2026复试细则及可见附件未列080100复试指定书目；招生目录中的812初试科目资料不属于复试书目。'
      }
    ],
    note: '已核查2026招生目录、复试细则及公开附件，未发现080100复试指定参考书目；未将812初试教材混入复试书目。'
  },
  '325007': {
    ...aggregatorLead(
      '中南大学土木工程学院 080100 聚合详情',
      'https://ksg.hongguoyan.com/schools/detail/10533/080100/325007',
      '笔试科目参考学院网站公布的复试科目及参考书。'
    ),
    status: 'partial',
    sources: [
      {
        title: '2026年土木工程学院硕士研究生统考复试专业综合课考试科目及参考书目',
        url: 'https://civil.csu.edu.cn/info/2019/12291.htm',
        publishedAt: '2026-03-12',
        accessedAt,
        locator: '正文“见附件”；附件名为《2026级硕士复试专业综合课考试科目及参考书目.pdf》，下载端返回验证码页，附件正文尚未读取。'
      }
    ],
    note: '已核验官网书目通知及附件名称，但附件受验证码限制，尚不能确认080100力学对应科目、书名、作者、版本或出版社。'
  },
  '320425': {
    status: 'partial',
    examName: '力学综合',
    sources: [
      {
        title: '四川大学2026年硕士研究生招生专业目录：建筑与环境学院080100力学',
        url: 'https://yz.scu.edu.cn/sszyml/simpleiq/305;080100;0;2026;;;',
        publishedAt: null,
        accessedAt: researchedAt,
        locator: '080100力学各方向备注均明确“复试科目：力学综合”，未列指定书名、作者、版本或出版社。'
      },
      {
        title: '四川大学建筑与环境学院2026年硕士研究生招生复试通知',
        url: 'https://acem.scu.edu.cn/info/1003/13946.htm',
        publishedAt: '2026-03-20',
        accessedAt: researchedAt,
        locator: '复试通知规定笔试科目见2026硕士招生目录，正文及可见附件未另列参考书。'
      }
    ],
    note: '已核验2026官网复试科目为力学综合；目录和复试通知均未提供对应指定参考书目。'
  },
  '320131': {
    status: 'partial',
    examName: '专业综合知识',
    sources: [
      {
        title: '重庆大学航空航天学院2026年硕士招生专业目录',
        url: 'https://yz.cqu.edu.cn/sszyml/2026/31.html',
        publishedAt: null,
        accessedAt: researchedAt,
        locator: '080100力学专业备注明确复试科目为外语听力口语和专业综合知识；未列指定书目。理论力学、材料力学仅为同等学力加试科目。'
      }
    ],
    note: '已核验2026官网复试科目为专业综合知识；未将同等学力加试科目误作复试书目，当前未发现指定参考书。'
  },
  '315647': {
    ...aggregatorLead(
      '西安交通大学航天航空学院 080100 聚合详情',
      'https://ksg.hongguoyan.com/schools/detail/10698/080100/315647',
      '复试科目为006001弹性力学或006002流体力学，任选一门。'
    ),
    status: 'partial',
    examName: '弹性力学或流体力学',
    sources: [
      {
        title: '西安交通大学2026年硕士研究生招生专业目录（普通招考）',
        url: 'https://yzbm.xjtu.edu.cn/zsml/sszsml/detailtk/bfo8@yEtRpW1EyxsEKg7eQ==?yxsdm=006&ml=&zydm=&xxfs=&dsbh=&key=',
        publishedAt: '2025-10-09',
        accessedAt: researchedAt,
        locator: '006航天航空学院080100力学各方向的复试科目均为“弹性力学或流体力学”，目录未列指定书目。'
      },
      {
        title: '航天航空学院2026年硕士研究生招生复试录取工作细则',
        url: 'https://sae.xjtu.edu.cn/info/1093/9414.htm',
        publishedAt: '2026-03-17',
        accessedAt: researchedAt,
        locator: '正文确认复试细则附件存在，但附件下载受验证码限制，尚未读取书目或考试范围。'
      }
    ],
    note: '已核验2026官方目录中的复试科目，尚未发现书名、作者、版本和出版社；复试细则附件受验证码限制，保持部分核验。'
  },
  '313757': {
    status: 'not-published',
    sources: [
      {
        title: '土木工程与力学学院2026年硕士研究生第一志愿考生复试录取实施细则',
        url: 'https://gxy.lzu.edu.cn/rencaipeiyang/shuoshi/zhaosheng/2026/0320/329088.html',
        publishedAt: '2026-03-21',
        accessedAt: researchedAt,
        locator: '080100复试细则及可见名单、结果附件未列复试指定参考书；学院2026硕士招生栏目未另发书目。'
      }
    ],
    note: '已核查2026招生目录、学院复试细则、复试名单及结果附件，未发现080100复试指定参考书目。'
  },
  'ucas-imech-080101': ucasImechNotPublished('080101', '一般力学与力学基础'),
  'ucas-imech-080102': ucasImechNotPublished('080102', '固体力学'),
  'ucas-imech-080103': ucasImechNotPublished('080103', '流体力学'),
  'ucas-imech-080104': ucasImechNotPublished('080104', '工程力学')
}

export const emptyReferenceMaterial = (
  override: ReferenceMaterialOverride | undefined
): ReferenceMaterialCollection => ({
  year: '2026',
  status: 'unreviewed',
  examCode: null,
  examName: null,
  applicableDirections: [],
  books: [],
  sources: [],
  note: '尚未逐一完成官网参考书目或考试大纲核验。',
  ...override
})
