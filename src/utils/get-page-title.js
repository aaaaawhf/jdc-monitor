import defaultSettings from '@/settings'

const title = defaultSettings.title || '京东云无线宝监控系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
