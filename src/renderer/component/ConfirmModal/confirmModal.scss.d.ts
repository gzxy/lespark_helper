declare namespace ConfirmModalScssNamespace {
   export interface IConfirmModalScss {
     confirmModal: string;
   }
 }
 
 declare const ConfirmModalScssModule: ConfirmModalScssNamespace.IConfirmModalScss & {
   /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
   locals: ConfirmModalScssNamespace.IConfirmModalScss;
 };
 
 export = ConfirmModalScssModule;
 