const steps = () => {
  return [
    {
      element: '#guide-fullscreen',
      popover: {
        title: '引导',
        description: '全屏化',
        position: 'bottom-right'
      }
    },
    {
      element: '#guide-dark',
      popover: {
        title: '引导',
        description: '暗黑模式切换',
        position: 'bottom-right'
      }
    },
    {
      element: '#guide-tabs',
      popover: {
        title: '引导',
        description: '切换到/关闭当前页面',
        position: 'bottom-right'
      }
    },
    {
      element: '#guide-base-manage',
      popover: {
        title: '基地管理',
        description: '打开和关闭基地管理菜单'
      }
    },
    {
      element: '#guide-base-manage-table',
      popover: {
        title: '基地列表',
        description: '查询基地信息'
      }
    },
  ]
}
export default steps
