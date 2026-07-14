import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import AdmissionsDashboard from './components/AdmissionsDashboard.vue'
import AdmissionsDetails from './components/AdmissionsDetails.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AdmissionsDashboard', AdmissionsDashboard)
    app.component('AdmissionsDetails', AdmissionsDetails)
  }
} satisfies Theme
