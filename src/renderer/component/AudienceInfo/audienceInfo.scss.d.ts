declare namespace AudienceInfoScssNamespace {
  export interface IAudienceInfoScss {
    actived: string;
    audienceInfo: string;
    content: string;
    gift: string;
    giftCount: string;
    giftIcon: string;
    giftInfo: string;
    giftItem: string;
    giftList: string;
    leftBorder: string;
    pointInfo: string;
    settingIcon: string;
    settingItem: string;
    settingPopover: string;
    tabBox: string;
    tabTypeGift: string;
    tabTypeItem: string;
    title: string;
    viewerAvatar: string;
    viewerInfo: string;
    viewerItem: string;
    viewerName: string;
  }
}

declare const AudienceInfoScssModule: AudienceInfoScssNamespace.IAudienceInfoScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AudienceInfoScssNamespace.IAudienceInfoScss;
};

export = AudienceInfoScssModule;
