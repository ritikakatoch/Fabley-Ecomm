import { IToastObject } from "./interfaces/index";
declare function show(toastObj: IToastObject): string;
export declare const toast: {
    show: typeof show;
};
export {};
