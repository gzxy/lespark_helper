declare namespace TrafficLightScssNamespace {
  export interface ITrafficLightScss {
    btnGroup: string;
    btnItem: string;
    fullIcon: string;
    hideIcon: string;
    menuHeader: string;
    titleBarText: string;
    trafficLigth: string;
  }
}

declare const TrafficLightScssModule: TrafficLightScssNamespace.ITrafficLightScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TrafficLightScssNamespace.ITrafficLightScss;
};

export = TrafficLightScssModule;
