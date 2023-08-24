declare namespace SceneSettingScssNamespace {
  export interface ISceneSettingScss {
    checkBtn: string;
    sceneSetting: string;
    settingItem: string;
  }
}

declare const SceneSettingScssModule: SceneSettingScssNamespace.ISceneSettingScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SceneSettingScssNamespace.ISceneSettingScss;
};

export = SceneSettingScssModule;
