const steps = () => {
  return [
    {
      element: '#guide-dark',
      popover: {
        title: '引导',
        description: '暗黑模式切换',
        position: 'bottom-right'
      }
    },
    {
      element: '#guide-fullscreen',
      popover: {
        title: '引导',
        description: '全屏化',
        position: 'bottom-right'
      }
    },
    {
      element: '#guide-quit',
      popover: {
        title: '引导',
        description: '退出当前程序',
        position: 'bottom-right'
      }
    }
  ]
}
export default steps
