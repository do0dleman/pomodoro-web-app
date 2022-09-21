import { useEffect, useRef, useState } from "react"
import { sounds } from "../maps/soundMap"
import { ISettings } from "../models"
import { SoundPickerItem } from "./soundPickerItem"

interface soundPickerProps {
    sendSettings: Function
    settings: ISettings
}
export function SoundPicker(props: soundPickerProps) {

    const [buttonIsOpen, setButtonIsOpen] = useState(false)

    const buttonDark = props.settings.isDark ? "sound-picker__button-dark" : ""
    let buttonOpen = buttonIsOpen ? 'sound-picker__button-open' : ''
    if(props.settings.isDark && buttonOpen) buttonOpen += '-dark'
    const buttonClases = ["sound-picker__button", buttonDark, buttonOpen]

    const wrapperOpen = buttonIsOpen ? 'sound-picker__wrapper-open' : ''
    const wrapperClasses = ['sound-picker__wrapper', wrapperOpen]

    const soundList = useRef<HTMLUListElement>(null)

    function setChosenDecoration(settings: ISettings = props.settings) {
        const soundItems = Array.from(soundList.current!.children as HTMLCollectionOf<HTMLElement>)
        soundItems.forEach(element => {
            const elementSpan = element.firstElementChild! as HTMLElement
            if(element.firstElementChild!.id === settings.sound) {
                elementSpan.style.textDecoration = 'underline'
            } else {
                elementSpan.style.textDecoration = 'none'
            }
        });
    }
    useEffect(() => {
        console.log(props.settings)
        setChosenDecoration(props.settings)
    })
    
    function handleButtonClick() {
        setButtonIsOpen(!buttonIsOpen)
    }
    return (
        <div className="sound-picker">
            <div className="sound-picker__container">
                <button className={buttonClases.join(' ')}
                    onClick={handleButtonClick} 
                >
                    <span>Notification Sound</span> <span></span>
                </button>
                <div className={wrapperClasses.join(' ')}>
                    <ul className="sound-picker__sound-list"
                        ref={soundList}
                    >
                        {Array.from(sounds.keys()).map(id => 
                            <SoundPickerItem 
                                key={id}
                                id={id}
                                settings={props.settings}
                                sendSettings={props.sendSettings}
                            />
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}