import { useState, useEffect } from "react"
import { ISettings } from "../models"
import { SoundPicker } from "./soundPicker"
import { SettingsBlock } from "./settingBlock"

interface ISettingsProps {
    sendSettings: Function
}
let isStart: boolean = true
export function Settings(props: ISettingsProps) {
    let settings: ISettings = JSON.parse(localStorage.getItem('settings') || JSON.stringify({
        workTime: 25,
        smallBreakTime: 5,
        bigBreakTime: 15,
        amountOfBreaks: 4,
        isDark: false,
        sound: "bell",
    }))
    const [settingsValue, setSettingsValue] = useState(settings)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    useEffect(() => {
        props.sendSettings(settingsValue)
    }, [settingsValue])
    const cotainerActive = isSettingsOpen ? 'settings__container-active' : ''
    const containerDark = settingsValue.isDark ? "settings__container-dark" : ""
    const containerClases = [
        "settings__container",
        containerDark,
        cotainerActive
    ]

    const rangeDark = settingsValue.isDark ? "settings__range-dark" : ""
    const rangeClases = [
        'settings__range',
        rangeDark
    ]

    const openButtonState = isSettingsOpen ? 'settings__open-button-active' :
        'settings__open-button-inactive'
    const openButtonDark = settingsValue.isDark ? 'settings__open-button-dark' : ''
    const openButtonStart = isStart ? 'settings__open-button-on-start' : ''
    const openButtonClases = [
        "settings__open-button",
        openButtonState,
        openButtonStart,
        openButtonDark
    ]

    const themeButtonDark = settingsValue.isDark ? 'settings__theme-button-dark' : ''
    const themeButtonClases = [
        "settings__theme-button",
        themeButtonDark
    ]
    function handleChange(event: any) {
        const name = event.target.name
        const value = event.target.value
        setSettingsValue((prev) => {
            const settings = {
                ...prev,
                [name]: Number(value)
            }
            return settings
        })
    }
    function changeTheme() {
        setSettingsValue((prev) => {
            const settings = {
                ...prev,
                ['isDark']: !settingsValue.isDark
            }
            return settings
        })
    }
    function handleOpenbuttonClick() {
        isStart = false
        setIsSettingsOpen(!isSettingsOpen)
    }
    return (
        <div className={`settings`}>
            <button id="openButton" className={`${openButtonClases.join(' ')}`}
                onClick={handleOpenbuttonClick}>
                <span></span><span></span><span></span>
            </button>
            <div className={containerClases.join(' ')}>
                <h1 className="settings__title">Settings</h1>
                <div className="settings__block">
                    <SettingsBlock
                        settings={settingsValue}
                        sendSettings={props.sendSettings}
                        blockParams={{
                            minValue: 1,
                            maxValue: 60,
                            name: 'workTime',
                            measure: 'min',
                            label: 'Work Time'
                        }}
                    />
                </div>
                <div className="settings__block">
                    <SettingsBlock
                        settings={settingsValue}
                        sendSettings={props.sendSettings}
                        blockParams={{
                            minValue: 1,
                            maxValue: 30,
                            name: 'smallBreakTime',
                            measure: 'min',
                            label: 'Short Break Time'
                        }}
                    />
                </div>
                <div className="settings__block">
                    <SettingsBlock
                        settings={settingsValue}
                        sendSettings={props.sendSettings}
                        blockParams={{
                            minValue: 1,
                            maxValue: 45,
                            name: 'bigBreakTime',
                            measure: 'min',
                            label: 'Long Break Time'
                        }}
                    />
                </div>
                <div className="settings__block">
                    <SettingsBlock
                        settings={settingsValue}
                        sendSettings={props.sendSettings}
                        blockParams={{
                            minValue: 2,
                            maxValue: 8,
                            name: 'amountOfBreaks',
                            measure: 'rounds',
                            label: 'Rounds'
                        }}
                    />
                </div>
                <div className="settings__block">
                    <SoundPicker
                        settings={settingsValue}
                        sendSettings={props.sendSettings}
                    />
                </div>
                <div className="settings__block">
                    <button className={themeButtonClases.join(' ')}
                        onClick={changeTheme}
                    >
                        <svg className={settingsValue.isDark ? "svg-inactive" : ""} width="32px" height="32px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M512 396.8c64 0 115.2 51.2 115.2 115.2 0 23.466667 19.2 42.666667 42.666667 42.666667s42.666667-19.2 42.666666-42.666667c0-110.933333-89.6-200.533333-200.533333-200.533333-23.466667 0-42.666667 19.2-42.666667 42.666666s19.2 42.666667 42.666667 42.666667" /><path d="M64 554.666667c-23.466667 0-42.666667-19.2-42.666667-42.666667s19.2-42.666667 42.666667-42.666667h66.133333c8.533333-74.666667 38.4-140.8 81.066667-196.266666l-46.933333-46.933334c-14.933333-17.066667-14.933333-44.8 0-61.866666 17.066667-17.066667 42.666667-17.066667 59.733333 0l46.933333 46.933333c55.466667-44.8 123.733333-72.533333 196.266667-81.066667V64c0-23.466667 19.2-42.666667 42.666667-42.666667s42.666667 19.2 42.666666 42.666667v66.133333c74.666667 8.533333 140.8 38.4 196.266667 81.066667l46.933333-46.933333c17.066667-17.066667 42.666667-17.066667 59.733334 0 17.066667 17.066667 17.066667 42.666667 0 59.733333L810.666667 273.066667c44.8 55.466667 72.533333 123.733333 81.066666 196.266666H960c23.466667 0 42.666667 19.2 42.666667 42.666667s-19.2 42.666667-42.666667 42.666667h-66.133333c-8.533333 74.666667-38.4 140.8-81.066667 196.266666l46.933333 46.933334c17.066667 17.066667 17.066667 42.666667 0 59.733333-8.533333 8.533333-19.2 12.8-29.866666 12.8-10.666667 0-21.333333-4.266667-29.866667-12.8L750.933333 810.666667c-55.466667 44.8-123.733333 72.533333-196.266666 81.066666V960c0 23.466667-19.2 42.666667-42.666667 42.666667s-42.666667-19.2-42.666667-42.666667v-66.133333c-74.666667-8.533333-140.8-38.4-196.266666-81.066667l-46.933334 46.933333c-8.533333 8.533333-19.2 12.8-29.866666 12.8s-21.333333-4.266667-29.866667-12.8c-17.066667-17.066667-17.066667-42.666667 0-59.733333l46.933333-46.933333c-44.8-55.466667-72.533333-123.733333-81.066666-196.266667H64z m448-341.333334c-164.266667 0-298.666667 134.4-298.666667 298.666667s134.4 298.666667 298.666667 298.666667 298.666667-134.4 298.666667-298.666667-134.4-298.666667-298.666667-298.666667z" />
                        </svg>
                        <svg version="1.1" height="32px" width="32px" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 1000 1000" className={!settingsValue.isDark ? "svg-inactive" : ""}>
                            <g><path d="M836.3,759.5c-23,3.8-46.4,5.7-70.2,5.7c-77.5,0-149.2-19.2-215.1-57.5c-66-38.3-118.1-90.4-156.4-156.4c-38.3-66-57.5-137.7-57.5-215.1c0-81.7,22.1-157.7,66.4-227.9c-85.5,25.5-155.5,74.3-209.7,146.2c-54.3,71.9-81.4,153.6-81.4,245.1c0,55.3,10.9,108.2,32.6,158.6s50.8,93.8,87.1,130.2s79.8,65.4,130.2,87.1c50.4,21.7,103.3,32.6,158.6,32.6c61.3,0,119.5-13.1,174.6-39.3C750.6,842.8,797.5,806.4,836.3,759.5z M965.9,705.3c-40,86.4-100.3,155.4-181,207.2c-80.7,51.7-168.6,77.6-264,77.6c-66.4,0-129.8-13-190.2-38.9c-60.4-26-112.6-60.9-156.4-104.7S95.5,750.4,69.5,690c-26-60.4-38.9-123.8-38.9-190.2c0-65.1,12.2-127.4,36.7-186.7c24.5-59.4,57.7-110.8,99.6-154.2c41.9-43.4,92-78.4,150.3-105c58.3-26.6,120-41.2,185.1-43.7c18.7-0.9,31.7,7.4,38.9,24.9c7.7,17.4,4.5,32.8-9.6,46c-36.6,33.2-64.6,71.8-83.9,115.9c-19.4,44-29,90.5-29,139.5c0,63,15.5,121.1,46.6,174.3c31.1,53.2,73.2,95.3,126.4,126.4C644.9,668,703,683.6,766,683.6c50.2,0,98.7-10.9,145.6-32.6c17.4-7.7,32.8-4.9,46,8.3c6,6,9.7,13.2,11.2,21.7C970.2,689.5,969.3,697.6,965.9,705.3L965.9,705.3z" /></g>
                        </svg>
                        <span>
                            {`${settingsValue.isDark ? 'Dark Theme' : 'Light Theme'}`}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}