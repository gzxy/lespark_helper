declare namespace LiveStatisticsModalScssNamespace {
  export interface ILiveStatisticsModalScss {
    LiveStatisticsModal: string;
    dataCount: string;
    dataItem: string;
    dataName: string;
    liveContent: string;
    liveTip: string;
    time: string;
    title: string;
  }
}

declare const LiveStatisticsModalScssModule: LiveStatisticsModalScssNamespace.ILiveStatisticsModalScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LiveStatisticsModalScssNamespace.ILiveStatisticsModalScss;
};

export = LiveStatisticsModalScssModule;
