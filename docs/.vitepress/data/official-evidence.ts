import type { OfficialRecordData } from './models.ts'

const accessedAt = '2026-07-11'

export const officialEvidenceByRecord: Record<string, OfficialRecordData> = {
  '354069': {
    planned: 15,
    retest: 15,
    admitted: 15,
    scoreLine: 310,
    evidence: [
      {
        type: 'catalog',
        title: '航空科学与工程学院招收2026年硕士研究生复试资格基本线及拟招生人数',
        url: 'https://ase.buaa.edu.cn/info/1113/16446.htm',
        publishedAt: '2026-03-20',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(005)航空科学与工程学院 080100 力学',
        status: 'partial',
        value: 14,
        note: '初始一志愿计划按飞行器结构强度系6、空气动力学系6、动力学与控制系2合计14人；4月1日学校最新下达计划后调整为15人。'
      },
      {
        type: 'catalog',
        title: '航空科学与工程学院关于招收2026年硕士研究生志愿采集的通知',
        url: 'https://ase.buaa.edu.cn/info/1113/16471.htm',
        publishedAt: '2026-04-01',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(005)航空科学与工程学院 080100 力学',
        status: 'verified',
        value: 15,
        note: '学校最新下达计划后，080100三个系的一志愿计划调整为6、7、2人，合计15人；采用此后续最终计划。'
      },
      {
        type: 'score-line',
        title: '航空科学与工程学院招收2026年硕士研究生复试资格基本线及拟招生人数',
        url: 'https://ase.buaa.edu.cn/info/1113/16446.htm',
        publishedAt: '2026-03-20',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(005)航空科学与工程学院 080100 力学',
        status: 'verified',
        value: 310,
        note: '官网正文表格明确080100力学复试资格基本线为总分310、单科40/60。'
      },
      {
        type: 'retest-rule',
        title: '航空科学与工程学院招收2026年硕士研究生一志愿复试录取工作方案',
        url: 'https://ase.buaa.edu.cn/info/1113/16444.htm',
        publishedAt: '2026-03-20',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(005)航空科学与工程学院硕士研究生一志愿复试录取',
        status: 'verified',
        note: '学院官网公开完整复试录取工作方案PDF及资格审查附件。'
      },
      {
        type: 'retest',
        title: '航空科学与工程学院招收2026年全日制学术学位硕士研究生复试面试分组名单和相关安排的通知',
        url: 'https://ase.buaa.edu.cn/info/1113/16453.htm',
        publishedAt: '2026-03-26',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(005)航空科学与工程学院 080100 力学',
        status: 'verified',
        value: 15,
        note: '页面“080100力学”独立面试表含表头外15条考生记录；后续复试成绩页同样列出15人。'
      },
      {
        type: 'admitted',
        title: '航空科学与工程学院招收2026年全日制学术学位硕士研究生拟录取名单',
        url: 'https://ase.buaa.edu.cn/info/1113/16480.htm',
        publishedAt: '2026-04-03',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(005)航空科学与工程学院 080100 力学',
        status: 'verified',
        value: 15,
        note: '页面080100力学表共15名考生，拟录取专业代码均为080100且“是否拟录取”均为“是”。'
      }
    ]
  },
  '353814': {
    planned: 3,
    retest: null,
    admitted: null,
    scoreLine: 295,
    evidence: [
      {
        type: 'catalog',
        title: '先进结构技术研究院2026年硕士研究生复试工作方案',
        url: 'https://xjjg.bit.edu.cn/rcpy/zstz/3f13c198bf0f43619a5f26021b606f48.htm',
        publishedAt: '2026-03-18',
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(320)先进结构技术研究院 080100 力学',
        status: 'verified',
        value: 3,
        note: '复试工作方案明确080100力学公开招考计划3人；中央目录中的7为目录总计划，二者口径不同。'
      },
      {
        type: 'score-line',
        title: '先进结构技术研究院2026年硕士研究生复试工作方案',
        url: 'https://xjjg.bit.edu.cn/rcpy/zstz/3f13c198bf0f43619a5f26021b606f48.htm',
        publishedAt: '2026-03-18',
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(320)先进结构技术研究院 080100 力学',
        status: 'verified',
        value: 295,
        note: '专业复试线295，单科线40/40/60/60。'
      },
      {
        type: 'retest',
        title: '先进结构技术研究院2026年硕士研究生复试工作方案',
        url: 'https://xjjg.bit.edu.cn/rcpy/zstz/3f13c198bf0f43619a5f26021b606f48.htm',
        publishedAt: '2026-03-18',
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(320)先进结构技术研究院 080100 力学',
        status: 'not-found',
        note: '复试名单附件公示期结束后已撤下，无法从现存官网原文安全计数。'
      },
      {
        type: 'retest-rule',
        title: '先进结构技术研究院2026年硕士研究生招生调剂通知',
        url: 'https://xjjg.bit.edu.cn/rcpy/zstz/18f4ba1425a54a7b811cccdc25a740e9.htm',
        publishedAt: '2026-03-31',
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(320)先进结构技术研究院 080100 力学',
        status: 'verified',
        note: '调剂通知列出2个缺额，仅作后续批次说明，不覆盖复试方案中的公开招考计划3人。'
      },
      {
        type: 'admitted',
        title: '先进结构技术研究院2026年硕士研究生拟录取公示（第二批）',
        url: 'https://xjjg.bit.edu.cn/rcpy/zstz/d53e9fe7b973491c82a0665af9a7bf2f.htm',
        publishedAt: '2026-04-14',
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(320)先进结构技术研究院 080100 力学',
        status: 'not-found',
        note: '公示附件已撤下，无法核验具体拟录取人数。'
      }
    ]
  },
  '304162': {
    planned: null,
    retest: 1,
    admitted: null,
    scoreLine: null,
    evidence: [
      {
        type: 'catalog',
        title: '国防科技大学2026年硕士研究生招生简章',
        url: 'https://yjszs.nudt.edu.cn/pubweb/homePageList/newDetailed.view?keyId=14671',
        publishedAt: '2025-10-15',
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(001)理学院 0801 力学',
        status: 'partial',
        value: 7,
        note: '目录列出地方全日制计划7人，但表下注明包含推免生计划，因此不回填公开招考计划。'
      },
      {
        type: 'retest',
        title: '国防科技大学理学院2026年硕士研究生复试名单',
        url: 'https://yjszs.nudt.edu.cn/attached/file/20260323/20260323161552_965.pdf',
        publishedAt: '2026-03-23',
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(001)理学院 0801 力学（项目映射到080100记录）',
        status: 'verified',
        value: 1,
        note: '官网名单逐行仅1名报考专业为“力学”；原文未写080100，按学院0801招生目录映射。'
      }
    ]
  },
  '304125': {
    planned: null,
    retest: 12,
    admitted: null,
    scoreLine: null,
    evidence: [
      {
        type: 'catalog',
        title: '国防科技大学2026年硕士研究生招生简章',
        url: 'https://yjszs.nudt.edu.cn/pubweb/homePageList/newDetailed.view?keyId=14671',
        publishedAt: '2025-10-15',
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(007)空天科学学院 0801 力学',
        status: 'partial',
        value: 20,
        note: '目录列出地方全日制计划20人，但表下注明包含推免生计划，因此不回填公开招考计划。'
      },
      {
        type: 'retest',
        title: '国防科技大学空天科学学院2026年硕士研究生复试名单',
        url: 'https://yjszs.nudt.edu.cn/attached/file/20260321/20260321172822_609.pdf',
        publishedAt: '2026-03-21',
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(007)空天科学学院 0801 力学（项目映射到080100记录）',
        status: 'verified',
        value: 12,
        note: '官网名单逐行前12名报考专业均为“力学”；原文未写080100，按学院0801招生目录映射。'
      }
    ]
  },
  '345192': {
    planned: 12,
    retest: 5,
    admitted: 12,
    scoreLine: 300,
    evidence: [
      {
        type: 'catalog',
        title: '吉林大学机械与航空航天工程学院2026年硕士研究生招生复试录取实施细则',
        url: 'https://mae.jlu.edu.cn/info/1010/25053.htm',
        publishedAt: null,
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(401)机械与航空航天工程学院 080100 力学',
        status: 'verified',
        value: 12,
        note: '学院实施细则列明080100力学统考招生计划12人。'
      },
      {
        type: 'score-line',
        title: '吉林大学机械与航空航天工程学院2026年硕士研究生招生复试录取实施细则',
        url: 'https://mae.jlu.edu.cn/info/1010/25053.htm',
        publishedAt: null,
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(401)机械与航空航天工程学院 080100 力学',
        status: 'verified',
        value: 300,
        note: '专业复试线为300，单科线45/45/68/80。'
      },
      {
        type: 'retest',
        title: '吉林大学机械与航空航天工程学院2026年硕士研究生复试名单',
        url: 'https://mae.jlu.edu.cn/system/_content/download.jsp?urltype=news.DownloadAttachUrl&owner=1680101113&wbfileid=18090067',
        publishedAt: null,
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(401)机械与航空航天工程学院 080100 力学（一志愿）',
        status: 'verified',
        value: 5,
        note: '官网附件中080100一志愿复试考生5人；该值不包含后续院内调剂。'
      },
      {
        type: 'retest-rule',
        title: '吉林大学机械与航空航天工程学院2026年硕士研究生招生调剂办法',
        url: 'https://mae.jlu.edu.cn/info/1010/25110.htm',
        publishedAt: null,
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(401)机械与航空航天工程学院 080100 力学（院内调剂）',
        status: 'verified',
        note: '后续7个缺额通过院内调剂补充，并复用本院已合格复试成绩；官网未公布调剂申请总人数。'
      },
      {
        type: 'admitted',
        title: '吉林大学2026年硕士研究生拟录取名单公示',
        url: 'https://yzb.jlu.edu.cn/info/1049/2932.htm',
        publishedAt: null,
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(401)机械与航空航天工程学院 080100 力学',
        status: 'verified',
        note: '学校研招网公示页提供全校拟录取名单原件。'
      },
      {
        type: 'admitted',
        title: '吉林大学2026年硕士研究生拟录取名单',
        url: 'https://yzb.jlu.edu.cn/__local/7/89/9A/55738180C25754FFBEA58A590AA_272C2D43_15FAC1.pdf?e=.pdf',
        publishedAt: null,
        accessedAt: '2026-07-12',
        year: '2026',
        scope: '(401)机械与航空航天工程学院 080100 力学',
        status: 'verified',
        value: 12,
        note: '学校拟录取名单按学院和专业逐项计数，080100力学共12人。'
      }
    ]
  },
  '320425': {
    planned: 6,
    retest: null,
    admitted: null,
    scoreLine: 300,
    evidence: [
      {
        type: 'catalog',
        title: '四川大学2026年硕士研究生招生专业目录',
        url: 'https://yz.scu.edu.cn/sszyml/simpleiq/305;080100;0;2026;;;',
        publishedAt: null,
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(305)建筑与环境学院 080100 力学',
        status: 'partial',
        value: 6,
        note: '目录列出预计招生14人、拟接收推免8人，目录阶段预计统考名额为6；官网同时说明实际人数会随推免录取和上线生源调整。'
      },
      {
        type: 'score-line',
        title: '四川大学2026年硕士研究生招生考试考生进入复试的初试成绩基本要求',
        url: 'https://yz.scu.edu.cn/zsxx/Details/c0ae615d-1683-4968-afb5-5b4f27d9be1b',
        publishedAt: '2026-03-14',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '学校工学照顾专业基本线（含0801力学）',
        status: 'verified',
        value: 300,
        note: '学校明确0801力学属于工学照顾专业，总分线300，单科线45/68。'
      },
      {
        type: 'retest-rule',
        title: '四川大学建筑与环境学院2026年硕士研究生招生复试通知',
        url: 'https://acem.scu.edu.cn/info/1003/13946.htm',
        publishedAt: '2026-03-20',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(305)建筑与环境学院 080100 力学',
        status: 'verified',
        note: '学院只提高083000、083300、085300总分线，并明确其他专业按校线执行，因此080100适用学校线300。'
      },
      {
        type: 'retest',
        title: '附件2-2026年硕士招生复试名单',
        url: 'https://acem.scu.edu.cn/system/_content/download.jsp?urltype=news.DownloadAttachUrl&owner=2013824286&wbfileid=17688797',
        publishedAt: '2026-03-20',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(305)建筑与环境学院各专业复试名单',
        status: 'partial',
        note: '学院复试通知保留附件入口，但下载需人工验证码；未取得附件原文，不能按聚合站的16人回填。'
      },
      {
        type: 'admitted',
        title: '四川大学2026年各院系所硕士研究生拟录取名单公示',
        url: 'https://yz.scu.edu.cn/ssfslq/gstz/4',
        publishedAt: null,
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(305)建筑与环境学院',
        status: 'not-found',
        note: '学校汇总页仍指向学院拟录取公示，但学院页面已显示“已公示结束”，原名单不可见，无法安全计数080100拟录取人数。'
      }
    ]
  },
  '320131': {
    planned: 4,
    retest: null,
    admitted: 22,
    scoreLine: 290,
    evidence: [
      {
        type: 'catalog',
        title: '航空航天学院2026年硕士招生专业目录',
        url: 'https://yz.cqu.edu.cn/sszyml/2026/31.html',
        publishedAt: null,
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(031)航空航天学院 080100 力学',
        status: 'verified',
        value: 4,
        note: '目录列明普通计划22人，其中公招4人、推免18人；公开招考计划回填4人，且官网说明最终计划可按实际情况增减。'
      },
      {
        type: 'score-line',
        title: '重庆大学2026年硕士研究生招生考试初试合格基本分数线',
        url: 'https://yz.cqu.edu.cn/news/2026-03/2461.html',
        publishedAt: '2026-03-13',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '学校工学照顾专业基本线（含0801力学）',
        status: 'verified',
        value: 290,
        note: '学校基本线明确力学[0801]属于工学照顾专业，总分线290，单科线40/60。'
      },
      {
        type: 'retest-rule',
        title: '重庆大学2026年相关学院硕士研究生招生考试初试合格分数线（二次划线）',
        url: 'https://yz.cqu.edu.cn/news/2026-03/2493.html',
        publishedAt: '2026-03-17',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(031)航空航天学院 080100 力学',
        status: 'verified',
        note: '二次划线表未列航空航天学院080100，页面明确未列专业按学校基本线执行，因此采用290。'
      },
      {
        type: 'retest',
        title: '重庆大学2026年相关学院硕士研究生招生考试初试合格分数线（二次划线）',
        url: 'https://yz.cqu.edu.cn/news/2026-03/2493.html',
        publishedAt: '2026-03-17',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(031)航空航天学院 080100 力学',
        status: 'not-found',
        note: '学校公开页仅提供分数线及适用规则，未附航空航天学院080100复试名单；未找到可公开逐行计数的官网名单。'
      },
      {
        type: 'admitted',
        title: '重庆大学2026年硕士研究生拟录取名单公示',
        url: 'https://yz.cqu.edu.cn/upload/202605/4b1f5c4d.pdf',
        publishedAt: '2026-05-09',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(031)航空航天学院 080100 力学',
        status: 'verified',
        value: 22,
        note: '学校统一拟录取名单第75页中，学院代码031、专业代码080100对应序号3934至3955，连续22人。'
      }
    ]
  },
  '315494': {
    planned: 31,
    retest: 43,
    admitted: 31,
    scoreLine: 310,
    evidence: [
      {
        type: 'catalog',
        title: '航空学院2026年全国硕士研究生招生考试复试工作方案',
        url: 'https://hangkong.nwpu.edu.cn/info/1357/51444.htm',
        publishedAt: null,
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(001)航空学院 080100 力学',
        status: 'verified',
        value: 31,
        note: '内嵌PDF表格列出招生计划62人、已录取推免31人、剩余计划31人；按公开招考口径回填31。'
      },
      {
        type: 'score-line',
        title: '航空学院2026年全国硕士研究生招生考试复试工作方案',
        url: 'https://hangkong.nwpu.edu.cn/info/1357/51444.htm',
        publishedAt: null,
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(001)航空学院 080100 力学',
        status: 'verified',
        value: 310,
        note: '内嵌PDF表格明确080100力学复试线为45/45/70/70/310。'
      },
      {
        type: 'retest-rule',
        title: '航空学院2026年全国硕士研究生招生考试复试工作方案',
        url: 'https://hangkong.nwpu.edu.cn/info/1357/51444.htm',
        publishedAt: null,
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(001)航空学院 080100 力学',
        status: 'verified',
        note: '学院官网公开复试工作方案，内嵌PDF同时列明分专业计划、分数线和复试人数。'
      },
      {
        type: 'retest',
        title: '航空学院2026年全国硕士研究生招生考试复试名单',
        url: 'https://hangkong.nwpu.edu.cn/info/1357/51454.htm',
        publishedAt: null,
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(001)航空学院 080100 力学',
        status: 'verified',
        value: 43,
        note: '复试方案内嵌PDF明确080100复试人数43人，学院另行公开对应复试名单页面。'
      },
      {
        type: 'admitted',
        title: '航空学院2026年全国硕士研究生招生考试拟录取名单公示',
        url: 'https://hangkong.nwpu.edu.cn/info/1357/51794.htm',
        publishedAt: null,
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(001)航空学院 080100 力学',
        status: 'verified',
        value: 31,
        note: '内嵌PDF开头连续31条专业为“力学”，随后转为“航空宇航科学与技术”；已逐行计数并目视复核关键页。'
      }
    ]
  },
  '315447': {
    planned: 22,
    retest: 29,
    admitted: 22,
    scoreLine: 300,
    evidence: [
      {
        type: 'catalog',
        title: '力学与交通运载工程学院2026年全国硕士研究生招生考试复试工作方案',
        url: 'https://liuyuan.nwpu.edu.cn/info/1024/17814.htm',
        publishedAt: '2026-03-25',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(006)力学与交通运载工程学院 080100 力学',
        status: 'verified',
        value: 22,
        note: '官网正文表格列出招生计划42人、已录取推免20人、剩余计划22人；按公开招考口径回填22。'
      },
      {
        type: 'score-line',
        title: '力学与交通运载工程学院2026年全国硕士研究生招生考试复试工作方案',
        url: 'https://liuyuan.nwpu.edu.cn/info/1024/17814.htm',
        publishedAt: '2026-03-25',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(006)力学与交通运载工程学院 080100 力学',
        status: 'verified',
        value: 300,
        note: '官网正文表格明确080100力学复试线为45/45/70/70/300。'
      },
      {
        type: 'retest-rule',
        title: '力学与交通运载工程学院2026年全国硕士研究生招生考试复试工作方案',
        url: 'https://liuyuan.nwpu.edu.cn/info/1024/17814.htm',
        publishedAt: '2026-03-25',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(006)力学与交通运载工程学院 080100 力学',
        status: 'verified',
        note: '学院官网正文公开复试方案，并列出分专业计划、推免人数、剩余计划、复试人数和复试线。'
      },
      {
        type: 'retest',
        title: '力学与交通运载工程学院2026年全国硕士研究生招生考试复试工作方案',
        url: 'https://liuyuan.nwpu.edu.cn/info/1024/17814.htm',
        publishedAt: '2026-03-25',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(006)力学与交通运载工程学院 080100 力学',
        status: 'verified',
        value: 29,
        note: '官网正文表格列明复试人数29人，页面下方复试名单逐行也正好29名力学考生。'
      },
      {
        type: 'admitted',
        title: '2026年力学与交通运载工程学院硕士研究生拟录取情况公示',
        url: 'https://liuyuan.nwpu.edu.cn/info/1024/17944.htm',
        publishedAt: '2026-04-03',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(006)力学与交通运载工程学院 080100 力学',
        status: 'verified',
        value: 22,
        note: '官网正文表格中报考专业为“力学”的记录共22行，录取情况均为拟录取。'
      },
      {
        type: 'admitted',
        title: '2026年力学与交通运载工程学院研究生调剂复试结果公示',
        url: 'https://liuyuan.nwpu.edu.cn/info/1024/18104.htm',
        publishedAt: '2026-04-13',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(006)力学与交通运载工程学院调剂批次',
        status: 'verified',
        value: 0,
        note: '调剂结果表仅含交通运输工程和航空交通运输，不含080100或力学，因此不追加力学拟录取人数。'
      }
    ]
  },
  '315355': {
    planned: null,
    retest: 0,
    admitted: 0,
    scoreLine: null,
    evidence: [
      {
        type: 'catalog',
        title: '西北工业大学2026年攻读全日制硕士学位研究生招生专业目录',
        url: 'https://yzb.nwpu.edu.cn/info/1177/9928.htm',
        publishedAt: '2025-09-30',
        accessedAt,
        year: '2026',
        scope: '(020)民航学院 080100 力学',
        status: 'partial',
        value: 8,
        note: '官网目录列出080100总计划8人，但未单列推免人数或剩余公开招考计划，因此不回填官网公开招考计划。'
      },
      {
        type: 'score-line',
        title: '西北工业大学2026年硕士研究生入学考试复试基本分数线',
        url: 'https://yzb.nwpu.edu.cn/info/1174/10178.htm',
        publishedAt: '2026-03-14',
        accessedAt,
        year: '2026',
        scope: '学校工学照顾学科基本线（含0801力学）',
        status: 'partial',
        value: 300,
        note: '学校最低线为45/45/70/70/300；学院未另设080100专业线。'
      },
      {
        type: 'retest-rule',
        title: '民航学院2026年全国硕士研究生招生考试复试工作方案',
        url: 'https://minhang.nwpu.edu.cn/info/1150/13503.htm',
        publishedAt: '2026-03-25',
        accessedAt,
        year: '2026',
        scope: '(020)民航学院 080100 力学',
        status: 'verified',
        note: '学院正文明确080100力学无上校线考生。'
      },
      {
        type: 'retest',
        title: '民航学院2026年全国硕士研究生招生考试复试工作方案',
        url: 'https://minhang.nwpu.edu.cn/info/1150/13503.htm',
        publishedAt: '2026-03-25',
        accessedAt,
        year: '2026',
        scope: '(020)民航学院 080100 力学',
        status: 'verified',
        value: 0,
        note: '学院明确该专业无上校线考生，因此统考复试人数为0。'
      },
      {
        type: 'admitted',
        title: '民航学院2026年硕士研究生拟录取名单公示',
        url: 'https://minhang.nwpu.edu.cn/info/1150/13573.htm',
        publishedAt: '2026-04-02',
        accessedAt,
        year: '2026',
        scope: '(020)民航学院 080100 力学',
        status: 'verified',
        value: 0,
        note: '主批次公示名单未出现080100或力学；后续调剂专业也不包含080100，统考拟录取人数为0。'
      },
      {
        type: 'admitted',
        title: '民航学院2026年硕士研究生调剂工作方案',
        url: 'https://minhang.nwpu.edu.cn/info/1150/13623.htm',
        publishedAt: '2026-04-10',
        accessedAt,
        year: '2026',
        scope: '(020)民航学院调剂专业范围',
        status: 'verified',
        value: 0,
        note: '调剂专业仅含080502与089903，不含080100，作为拟录取0人的后续批次边界证据。'
      }
    ]
  },
  '315647': {
    planned: 14,
    retest: null,
    admitted: null,
    scoreLine: null,
    evidence: [
      {
        type: 'catalog',
        title: '西安交通大学2026年硕士研究生招生目录（普通招考）',
        url: 'https://yzbm.xjtu.edu.cn/zsml/sszsml/detailtk/bfo8@yEtRpW1EyxsEKg7eQ==?yxsdm=006&ml=&zydm=&xxfs=&dsbh=&key=',
        publishedAt: '2025-10-09',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(006)航天航空学院 080100 力学',
        status: 'partial',
        value: 14,
        note: '目录列出080100力学拟招生14人，并说明该数为基本计划，录取阶段可根据推免、普通招考生源和学校下达计划调整。'
      },
      {
        type: 'score-line',
        title: '西安交通大学2026年硕士研究生招生复试基本分数线',
        url: 'https://yz.xjtu.edu.cn/__local/7/5F/4A/6F86A6E3882DE35F670358E7FF7_11193F2F_2AB40.pdf',
        publishedAt: '2026-03-16',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '学校08工学基本线',
        status: 'partial',
        value: 320,
        note: '学校工学基本线为总分320、单科50/50/80/80；学院可在校线上提高要求，学院细则附件需验证码，故不回填聚合页所列专业线390。'
      },
      {
        type: 'retest-rule',
        title: '航天航空学院2026年硕士研究生招生复试录取工作细则',
        url: 'https://sae.xjtu.edu.cn/info/1093/9414.htm',
        publishedAt: '2026-03-17',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(006)航天航空学院硕士研究生复试录取',
        status: 'partial',
        note: '学院官网确认复试细则附件存在，但附件下载要求验证码；未取得附件原文，无法核验080100专业线、计划调整和复试规则细节。'
      },
      {
        type: 'retest',
        title: '航天航空学院2026年硕士研究生招生复试录取工作细则',
        url: 'https://sae.xjtu.edu.cn/info/1093/9414.htm',
        publishedAt: '2026-03-17',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(006)航天航空学院 080100 力学',
        status: 'not-found',
        note: '学院公开通知列表未另行发布可逐行计数的硕士复试名单，复试细则页面也只提供受验证码限制的规则附件，因此不回填30人。'
      },
      {
        type: 'admitted',
        title: '航天航空学院2026年硕士研究生招生拟录取名单公示',
        url: 'https://sae.xjtu.edu.cn/info/1093/9455.htm',
        publishedAt: '2026-04-02',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(006)航天航空学院硕士研究生拟录取名单',
        status: 'partial',
        note: '公示正文确认名单见附件，但附件下载要求验证码，未取得可计数原文，不能按聚合页的19人回填080100拟录取人数。'
      }
    ]
  },
  '313757': {
    planned: null,
    retest: 111,
    admitted: 49,
    scoreLine: null,
    evidence: [
      {
        type: 'catalog',
        title: '土木工程与力学学院2026年硕士研究生第一志愿考生复试录取实施细则',
        url: 'https://gxy.lzu.edu.cn/rencaipeiyang/shuoshi/zhaosheng/2026/0320/329088.html',
        publishedAt: '2026-03-21',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(081)土木工程与力学学院 080100 力学',
        status: 'partial',
        value: 55,
        note: '学院细则列出080100分专业招生计划55人，但正文明确该计划包含推荐免试和普通招考考生，因此不回填公开招考计划。'
      },
      {
        type: 'score-line',
        title: '土木工程与力学学院2026年硕士研究生第一志愿考生复试录取实施细则',
        url: 'https://gxy.lzu.edu.cn/rencaipeiyang/shuoshi/zhaosheng/2026/0320/329088.html',
        publishedAt: '2026-03-21',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(081)土木工程与力学学院 080100 力学',
        status: 'not-found',
        note: '实施细则和现存附件未给出080100数值复试线；不能用上线名单最低分反推专业线。'
      },
      {
        type: 'retest',
        title: '土木工程与力学学院2026年硕士研究生招生第一志愿上线考生名单',
        url: 'https://gxy.lzu.edu.cn/gongxueyuan/upload/files/20260320/d8050b04898549599ab8887a23d1cac9.pdf',
        publishedAt: '2026-03-21',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(081)土木工程与力学学院 080100 力学（一志愿）',
        status: 'verified',
        value: 5,
        note: 'PDF逐行核验，080100一志愿上线考生共5人。'
      },
      {
        type: 'retest',
        title: '土木工程与力学学院2026年硕士研究生招生调剂考生复试名单（第一批）',
        url: 'https://gxy.lzu.edu.cn/gongxueyuan/upload/files/20260408/a452a9902b9f439789a90cea321970a5.pdf',
        publishedAt: '2026-04-08',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(081)土木工程与力学学院 080100 力学（调剂第一批）',
        status: 'verified',
        value: 106,
        note: 'PDF逐行核验，序号1至106均为080100力学调剂复试考生。'
      },
      {
        type: 'retest',
        title: '土木工程与力学学院2026年硕士研究生招生调剂考生复试名单（第二批）',
        url: 'https://gxy.lzu.edu.cn/gongxueyuan/upload/files/20260409/32753e6148844208a2db66e9ffa45935.pdf',
        publishedAt: '2026-04-09',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(081)土木工程与力学学院调剂第二批',
        status: 'verified',
        value: 0,
        note: 'PDF未出现080100或力学，作为后续调剂批次人数边界。'
      },
      {
        type: 'retest',
        title: '土木工程与力学学院2026年硕士研究生招生调剂考生复试名单（第三批）',
        url: 'https://gxy.lzu.edu.cn/gongxueyuan/upload/files/20260410/d6b4ac9b447c4d78bf3a56690aaa96df.pdf',
        publishedAt: '2026-04-10',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(081)土木工程与力学学院调剂第三批',
        status: 'verified',
        value: 0,
        note: 'PDF未出现080100或力学，作为后续调剂批次人数边界。'
      },
      {
        type: 'admitted',
        title: '土木工程与力学学院2026年硕士研究生第一志愿考生复试成绩及拟录取结果公示',
        url: 'https://gxy.lzu.edu.cn/gongxueyuan/upload/files/20260327/1d0e83df65844602baff2fab4a3b84e1.pdf',
        publishedAt: '2026-03-27',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(081)土木工程与力学学院 080100 力学（一志愿）',
        status: 'verified',
        value: 5,
        note: 'PDF逐行核验，5名080100一志愿考生均拟录取。'
      },
      {
        type: 'admitted',
        title: '土木工程与力学学院2026年硕士研究生调剂考生复试成绩及拟录取结果公示（力学080100）',
        url: 'https://gxy.lzu.edu.cn/gongxueyuan/upload/files/20260411/10204309599f4d30ba60c222e0f85999.pdf',
        publishedAt: '2026-04-11',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(081)土木工程与力学学院 080100 力学（调剂）',
        status: 'verified',
        value: 43,
        note: 'PDF逐行核验，“是否拟录取”为“是”且拟录取专业为080100的考生共43人。'
      },
      {
        type: 'admitted',
        title: '土木工程与力学学院2026年硕士研究生调剂考生拟录取结果公示（补录）',
        url: 'https://gxy.lzu.edu.cn/gongxueyuan/upload/files/20260414/df089e971e2d46139a5407df6ecc82af.pdf',
        publishedAt: '2026-04-14',
        accessedAt: '2026-07-14',
        year: '2026',
        scope: '(081)土木工程与力学学院 080100 力学（补录）',
        status: 'verified',
        value: 1,
        note: '补录PDF明确1名考生拟录取至080100力学；最终统考拟录取合计49人。'
      }
    ]
  },
  '343703': {
    planned: null,
    retest: null,
    admitted: null,
    scoreLine: null,
    evidence: [
      {
        type: 'retest-rule',
        title: '哈尔滨工业大学土木工程学院2026年硕士招生复试参考',
        url: 'https://civil.hit.edu.cn/2025/1229/c8480a385521/page.htm',
        publishedAt: '2025-12-29',
        accessedAt,
        year: '2026',
        scope: '(009)土木工程学院 080100 力学',
        status: 'partial',
        note: '已定位学院复试参考，但页面不含复试名单或拟录取人数。'
      },
      {
        type: 'admitted',
        title: '土木工程学院硕士研究生招生栏目',
        url: 'https://civil.hit.edu.cn/8480/list.htm',
        publishedAt: null,
        accessedAt,
        year: '2026',
        scope: '(009)土木工程学院 080100 力学',
        status: 'not-found',
        note: '截至访问日期，栏目未找到可对应080100的2026年拟录取名单，人数继续保留待核验。'
      }
    ]
  },
  '335400': {
    planned: null,
    retest: null,
    admitted: null,
    scoreLine: null,
    evidence: [
      {
        type: 'catalog',
        title: '中国科学技术大学2026年工程科学学院招生专业说明',
        url: 'https://yz1.ustc.edu.cn/sszs_2026/index_1.shtml',
        publishedAt: null,
        accessedAt,
        year: '2026',
        scope: '(209)工程科学学院 080100 力学',
        status: 'verified',
        note: '目录确认080100由近代力学系招生；同系还招收085800，后续名单若无专业列不能混合计数。'
      },
      {
        type: 'score-line',
        title: '中国科学技术大学2026年硕士研究生招生考试复试基本分数线',
        url: 'https://yz.ustc.edu.cn/article/2824',
        publishedAt: '2026-03-14',
        accessedAt,
        year: '2026',
        scope: '学校工学基本线',
        status: 'partial',
        value: 310,
        note: '310为学校工学基本线，不等同于209学院080100实际进入复试的院系线。'
      },
      {
        type: 'retest-rule',
        title: '工程科学学院2026年硕士研究生复试名单及研究生招生复试工作方案',
        url: 'https://ses.ustc.edu.cn/2026/0319/c1690a723661/page.htm',
        publishedAt: '2026-03-19',
        accessedAt,
        year: '2026',
        scope: '(209)工程科学学院',
        status: 'verified',
        note: '页面提供近代力学系复试方案和学院复试名单原件。'
      },
      {
        type: 'retest',
        title: '工程科学学院2026年硕士研究生复试名单',
        url: 'https://ses.ustc.edu.cn/_upload/article/files/83/c8/b564e1924fb8831aa66fc91cdd9d/595c6d66-bc2d-4eb6-aedb-54ae23f10863.pdf',
        publishedAt: '2026-03-19',
        accessedAt,
        year: '2026',
        scope: '近代力学系',
        status: 'partial',
        note: 'PDF中近代力学系共34人，但未列专业代码；因该系同时招收080100与085800，不能把34直接填为080100复试人数。'
      },
      {
        type: 'admitted',
        title: '工程科学学院2026年硕士研究生复试建议录取名单',
        url: 'https://ses.ustc.edu.cn/2026/0331/c1690a724756/page.htm',
        publishedAt: '2026-03-31',
        accessedAt,
        year: '2026',
        scope: '近代力学系',
        status: 'partial',
        note: '官网近代力学系建议录取表共27人，但同样没有专业代码，不能安全回填080100拟录取人数。'
      }
    ]
  },
  '327349': {
    planned: 13,
    retest: 20,
    admitted: 13,
    scoreLine: null,
    evidence: [
      {
        type: 'catalog',
        title: '华中科技大学航空航天学院2026年硕士研究生复试工作细则及复试名单公示',
        url: 'http://ae.hust.edu.cn/info/1194/4028.htm',
        publishedAt: '2026-03-17',
        accessedAt,
        year: '2026',
        scope: '(123)航空航天学院 080100 力学',
        status: 'verified',
        value: 13,
        note: '页面正文列明已接收推免18人、公开招考计划13人。'
      },
      {
        type: 'retest',
        title: '华中科技大学航空航天学院2026年硕士研究生复试工作细则及复试名单公示',
        url: 'http://ae.hust.edu.cn/info/1194/4028.htm',
        publishedAt: '2026-03-17',
        accessedAt,
        year: '2026',
        scope: '(123)航空航天学院 080100 力学',
        status: 'verified',
        value: 20,
        note: '页面招生计划表直接列出080100上线人数20。'
      },
      {
        type: 'admitted',
        title: '华中科技大学航空航天学院2026年硕士研究生招生复试成绩公示',
        url: 'http://ae.hust.edu.cn/info/1194/4034.htm',
        publishedAt: '2026-03-23',
        accessedAt,
        year: '2026',
        scope: '(123)航空航天学院 080100 力学',
        status: 'partial',
        value: 13,
        note: '公示说明各专业按总成绩从高到低在计划内待录取；结合细则中的统考计划13人得到该值。附件下载有验证码，未逐行复核。'
      }
    ]
  },
  '323686': {
    planned: 2,
    retest: 1,
    admitted: 2,
    scoreLine: 280,
    evidence: [
      {
        type: 'catalog',
        title: '先进制造学院2026年硕士研究生复试录取实施细则',
        url: 'https://am.sysu.edu.cn/article/381',
        publishedAt: '2026-03-18',
        accessedAt,
        year: '2026',
        scope: '(755)先进制造学院 080100 力学',
        status: 'verified',
        value: 2,
        note: '总计划11人，已招推免9人，公开招考计划2人。'
      },
      {
        type: 'score-line',
        title: '先进制造学院2026年硕士研究生复试录取实施细则',
        url: 'https://am.sysu.edu.cn/article/381',
        publishedAt: '2026-03-18',
        accessedAt,
        year: '2026',
        scope: '(755)先进制造学院 080100 力学',
        status: 'verified',
        value: 280,
        note: '学院正文明确列出080100总分线280，单科线45/45/60/60。'
      },
      {
        type: 'retest',
        title: '先进制造学院2026年硕士生复试名单',
        url: 'https://am.sysu.edu.cn/sites/default/files/2026-05/%E5%85%88%E8%BF%9B%E5%88%B6%E9%80%A0%E5%AD%A6%E9%99%A22026%E5%B9%B4%E7%A1%95%E5%A3%AB%E7%A0%94%E7%A9%B6%E7%94%9F%E5%A4%8D%E8%AF%95%E5%90%8D%E5%8D%95.pdf',
        publishedAt: '2026-03-18',
        accessedAt,
        year: '2026',
        scope: '(755)先进制造学院 080100 力学（一志愿）',
        status: 'verified',
        value: 1,
        note: 'PDF逐行核验，080100一志愿复试名单仅周航1人。'
      },
      {
        type: 'admitted',
        title: '先进制造学院2026年硕士研究生复试结果（第一批）',
        url: 'https://am.sysu.edu.cn/sites/default/files/2026-05/%E5%85%88%E8%BF%9B%E5%88%B6%E9%80%A0%E5%AD%A6%E9%99%A22026%E5%B9%B4%E7%A1%95%E5%A3%AB%E7%A0%94%E7%A9%B6%E7%94%9F%E5%A4%8D%E8%AF%95%E7%BB%93%E6%9E%9C%28%E7%AC%AC%E4%B8%80%E6%89%B9%29.pdf',
        publishedAt: '2026-03-27',
        accessedAt,
        year: '2026',
        scope: '(755)先进制造学院 080100 力学（一志愿）',
        status: 'verified',
        value: 1,
        note: 'PDF明确1名080100考生拟录取。'
      },
      {
        type: 'admitted',
        title: '先进制造学院2026年硕士研究生招生复试结果（第二批）',
        url: 'https://am.sysu.edu.cn/sites/default/files/2026-05/%E5%85%88%E8%BF%9B%E5%88%B6%E9%80%A0%E5%AD%A6%E9%99%A22026%E5%B9%B4%E7%A1%95%E5%A3%AB%E7%A0%94%E7%A9%B6%E7%94%9F%E6%8B%9B%E7%94%9F%E5%A4%8D%E8%AF%95%E7%BB%93%E6%9E%9C%EF%BC%88%E7%AC%AC%E4%BA%8C%E6%89%B9%EF%BC%89.pdf',
        publishedAt: '2026-04-02',
        accessedAt,
        year: '2026',
        scope: '(755)先进制造学院 080100 力学（院内调剂）',
        status: 'verified',
        value: 1,
        note: 'PDF明确1名原报机械工程考生院内调剂至080100并拟录取；最终080100拟录取合计2人。'
      }
    ]
  }
}
