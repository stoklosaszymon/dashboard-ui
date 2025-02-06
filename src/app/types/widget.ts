export interface Widget {
  id: number,
  name: string,
  component: any,
  config: WidgetConfig
}

interface WidgetConfig {
  width: string
  height: string
}