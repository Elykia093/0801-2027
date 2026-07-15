import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '力学相关专业招生数据',
  base: '/0801-2027/',
  description: '26 所 985 院校、国科大力学所及官网核验力学相关专硕的招生、复试与拟录取数据',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '数据总览', link: '/' },
      { text: '院校详情', link: '/details' },
      { text: '统计口径', link: '/methodology' },
      { text: '来源说明', link: '/sources' }
    ],
    sidebar: [
      {
        text: '数据站',
        items: [
          { text: '招生单位总览', link: '/' },
          { text: '院校与专业详情', link: '/details' },
          { text: '统计口径', link: '/methodology' },
          { text: '来源与核验', link: '/sources' }
        ]
      }
    ],
    socialLinks: [],
    footer: {
      message: '仅作择校信息整理，请以院校当年招生简章和公示名单为准。',
      copyright: '聚合快照 2026-07-10；官网补充 2026-07-16'
    },
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3]
    }
  }
})
