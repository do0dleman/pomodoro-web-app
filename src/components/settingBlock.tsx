import React, { useEffect, useState } from "react"
import { ISettings, ISettingsBlockParams } from "../models"

interface settingBlockProps {
    blockParams: ISettingsBlockParams,
    settings: ISettings,
    sendSettings: Function
}

export function SettingsBlock(props: settingBlockProps) {
    const blockParams = props.blockParams
    const name = blockParams.name
    const [settingsValue, setSettingsValue] = useState(props.settings)
    useEffect(() => {
        props.sendSettings(settingsValue)
        console.log(settingsValue)
    }, [settingsValue])

    const rangeDark = settingsValue.isDark ? "settings__range-dark" : ""
    const rangeClases = [
        'settings__range',
        rangeDark
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

    return (
        <div className="settings__block-container">
            <label className="settings__label" htmlFor={blockParams.name}>
                {blockParams.label}
            </label>
            <span className={rangeClases.join(' ')}>
                <input type="range" name={blockParams.name}
                    step={1}
                    defaultValue={String(settingsValue[name as keyof ISettings])}
                    onChange={handleChange}
                    min={blockParams.minValue}
                    max={blockParams.maxValue}
                />
            </span>
            <span className="settings__curent-value">
                {`${String(settingsValue[name as keyof ISettings])} ${blockParams.measure}`}
            </span>
        </div>
    )


}