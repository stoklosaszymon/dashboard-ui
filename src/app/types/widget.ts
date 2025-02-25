export interface Widget {
  id: number,
  name: string,
  component: any,
  config: WidgetConfig
}

export interface WidgetConfig {
  width: string
  height: string
}

export type Tab = Pick<Widget, 'id' | 'name'>