declare namespace LivePreviewScssNamespace {
  export interface ILivePreviewScss {
    active: string;
    anchorAvatar: string;
    anchorInfo: string;
    anchorLevel: string;
    anchorName: string;
    anchorNameText: string;
    area: string;
    arrow: string;
    button: string;
    cameraModal: string;
    desc: string;
    header: string;
    item: string;
    layoutSetting: string;
    livePreview: string;
    loginOutBtn: string;
    options: string;
    previewColum: string;
    previewRow: string;
    title: string;
  }
}

declare const LivePreviewScssModule: LivePreviewScssNamespace.ILivePreviewScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LivePreviewScssNamespace.ILivePreviewScss;
};

export = LivePreviewScssModule;
