declare namespace InteractiveMsgScssNamespace {
  export interface IInteractiveMsgScss {
    content: string;
    contentBody: string;
    interactiveMsg: string;
    title: string;
  }
}

declare const InteractiveMsgScssModule: InteractiveMsgScssNamespace.IInteractiveMsgScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InteractiveMsgScssNamespace.IInteractiveMsgScss;
};

export = InteractiveMsgScssModule;
