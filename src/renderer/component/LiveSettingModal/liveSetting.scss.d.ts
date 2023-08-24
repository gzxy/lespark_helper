declare namespace LiveSettingScssNamespace {
  export interface ILiveSettingScss {
    LiveSettingModal: string;
    actived: string;
    beginLiveBtn: string;
    modalBody: string;
    modalHeader: string;
    settingInput: string;
    settingItem: string;
    settingItemLeft: string;
    settingUploadItem: string;
    uploadImage: string;
  }
}

declare const LiveSettingScssModule: LiveSettingScssNamespace.ILiveSettingScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LiveSettingScssNamespace.ILiveSettingScss;
};

export = LiveSettingScssModule;
