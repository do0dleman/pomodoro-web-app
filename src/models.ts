export interface ISettings {
    workTime: number,
    smallBreakTime: number,
    bigBreakTime: number,
    amountOfBreaks: number,
    isDark: boolean,
    sound: string
}
export interface ISettingsBlockParams {
    minValue: number,
    maxValue: number, 
    name: string,
    measure: string,
    label: string,
}