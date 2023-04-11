export interface IToastObject {
    message: string;
    title: string;
    type: string;
    newestOnTop: boolean;
}
export interface IOption {
    containerId: string;
    position: string;
    titleClass: string;
    newestOnTop: boolean;
    timeOut: number;
    messageClass: string;
}
