import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '985 力学招生数据',
  base: '/0801-2027/',
  description: '招收 0801 力学相关专业的 985 院校招生、复试与拟录取数据',
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
          { text: '985 院校总览', link: '/' },
          { text: '院校与专业详情', link: '/details' },
          { text: '统计口径', link: '/methodology' },
          { text: '来源与核验', link: '/sources' }
        ]
      }
    ],
    socialLinks: [],
    footer: {
      message: '仅作择校信息整理，请以院校当年招生简章和公示名单为准。',
      copyright: '数据快照访问日期：2026-07-10'
    },
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3]
    }
  }
})
