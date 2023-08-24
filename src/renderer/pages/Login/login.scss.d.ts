declare namespace LoginScssNamespace {
  export interface ILoginScss {
    actived: string;
    canLogin: string;
    codeBtn: string;
    codeInput: string;
    emailInput: string;
    inputPhoneBox: string;
    inputPhoneOption: string;
    isLoading: string;
    leftBorder: string;
    login: string;
    loginBox: string;
    loginBtn: string;
    loginComBox: string;
    loginTitle: string;
    loginType: string;
    loginTypeItem: string;
    logo: string;
    passwordInput: string;
    showIcon: string;
    tipCheckBox: string;
    tipLink: string;
    tipText: string;
    userTip: string;
  }
}

declare const LoginScssModule: LoginScssNamespace.ILoginScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoginScssNamespace.ILoginScss;
};

export = LoginScssModule;
