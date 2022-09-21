import React, { useEffect, useRef, useState } from 'react'
import { ISettings } from '../models'
import { playSound } from '../functions/playSound'
import {sounds} from '../maps/soundMap'

interface SoundPickerItemProps {
    id: string
    settings: ISettings
    sendSettings: Function
}
export function SoundPickerItem(props: SoundPickerItemProps) {
    let id = props.id

    const [isSoundItemActive, setIsSoundItemActive] = useState(false)

    const soundItemDark = props.settings.isDark ? 
        'sound-picker__sound-item-dark' : ''
    let soundItemActive = isSoundItemActive ? 
        'sound-picker__sound-item-active' : ''
    if(props.settings.isDark && soundItemActive) soundItemActive += '-dark'

    const soundItemClasses = ['sound-picker__sound-item', 
    soundItemDark, soundItemActive]

    function handleListClick(e: any) {
        if(e.target.tagName === 'BUTTON') {
            const soundId = e.target.previousElementSibling.id
            const sound = sounds.get(soundId)
            playSound(sound, isSoundItemActive, setIsSoundItemActive)
            e.target.style.transform = "scale(110%)"
            return
        }
        let settings: ISettings = JSON.parse(
        localStorage.getItem('settings') || JSON.stringify({
            workTime: 25,
            smallBreakTime: 5,
            bigBreakTime: 15,
            amountOfBreaks: 4,
            isDark: false,
        }))
        const soundId = e.target.id
        settings.sound = soundId
        props.sendSettings(settings)
    }
    function handleMouseUp(e: any) {
        if(e.target.tagName === 'BUTTON') {
            e.target.style.transform = "scale(100%)"
        }
    }

    return (
        <li className={soundItemClasses.join(' ')}
            key={id}
            onMouseDown={handleListClick}
            onMouseUp={handleMouseUp}
        >
            <span id={id}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
            </span>
            <button></button>
        </li>
    )
}

