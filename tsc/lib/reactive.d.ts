export interface ITask {
    name: string;
    start(): void;
    stop(): void;
}
interface ITaskOption {
    name: string;
    sec: number;
    delay?: number;
    request(index: number): Promise<any>;
    stopWhile(requestResult: any): boolean | undefined;
}
declare const reactive: {
    createTimerTask: (option: ITaskOption) => ITask;
};
export default reactive;
