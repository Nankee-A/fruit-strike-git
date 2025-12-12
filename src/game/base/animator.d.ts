export class Animator
{
    public static to(target: Element, duration: number, vars: any, easeIn?: boolean, easeOut?: boolean): any;

    public static set(target: Element, vars: any): any;

    public static kill(animation: any): void;
}