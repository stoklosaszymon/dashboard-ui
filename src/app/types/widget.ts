export interface Widget {
  id: number,
  name: string,
  component: any,
  config: WidgetConfig
  dashboardId?: number
}

export interface WidgetConfig {
  width: string
  height: string
}

export type Tab = Pick<Widget, 'id' | 'name'>