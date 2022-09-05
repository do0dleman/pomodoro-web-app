import { useEffect, useRef, useState } from "react"
import { sounds } from "../maps/soundMap"
import { ISettings } from "../models"

let isSoundPlaying: boolean = false
let i = 0
let soundValue = sounds.get('bell')
let replaySoundTimeout: ReturnType<typeof setTimeout>
function playSound(sound: string) { 
    soundValue = sound
    if(i === 3) {
        i = 0
        return
    }
    if(isSoundPlaying) {
        clearTimeout(replaySoundTimeout)
        isSoundPlaying = false
        i = 0
    }
    if(!isSoundPlaying) {
        i++
        let audio = new Audio(soundValue)
        audio.play() 
        audio.onloadedmetadata = (e) => {
            isSoundPlaying = true
            replaySoundTimeout = setTimeout( () => {
                isSoundPlaying = false
                playSound(soundValue)
            }, audio.duration * 1000 + 100)
            console.log(typeof(replaySoundTimeout))
        }
    }
}

interface soundPickerProps {
    sendSettings: Function
    settings: ISettings
}
export function SoundPicker(props: soundPickerProps) {

    const [buttonIsOpen, setButtonIsOpen] = useState(false)

    const buttonDark = props.settings.isDark ? "sound-picker__button-dark" : ""
    let buttonOpen = buttonIsOpen ? 'sound-picker__button-open' : ''
    if(props.settings.isDark) buttonOpen += '-dark'
    const buttonClases = ["sound-picker__button", buttonDark, buttonOpen]

    const wrapperOpen = buttonIsOpen ? 'sound-picker__wrapper-open' : ''
    const wrapperClasses = ['sound-picker__wrapper', wrapperOpen]

    const soundList = useRef<HTMLUListElement>(null)

    const soundItemDark = props.settings.isDark ? 'sound-picker__sound-item-dark' : ''
    const soundItemClasses = ['sound-picker__sound-item', soundItemDark]

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
        setChosenDecoration()
    }, [])
    function handleListClick(e: any) {
        if(e.target.tagName === 'BUTTON') {
            const soundId = e.target.previousElementSibling.id
            const sound = sounds.get(soundId)
            playSound(sound)
            return
        }
        let settings: ISettings = JSON.parse(localStorage.getItem('settings') || JSON.stringify({
            workTime: 25,
            smallBreakTime: 5,
            bigBreakTime: 15,
            amountOfBreaks: 4,
            isDark: false,
        }))
        const soundId = e.target.id
        settings.sound = soundId
        props.sendSettings(settings)
        setChosenDecoration(settings)
    }
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
                        onClick={handleListClick}
                        ref={soundList}
                    >
                        {Array.from(sounds.keys()).map(id => 
                            <li className={soundItemClasses.join(' ')} key={id}>
                                <span id={id}>
                                    {id.charAt(0).toUpperCase() + id.slice(1)}
                                </span>
                                <button></button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}