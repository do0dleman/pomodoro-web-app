import {sounds} from '../maps/soundMap'

let isSoundPlaying: boolean = false
let i = 0
let soundValue = sounds.get('bell')
let replaySoundTimeout: ReturnType<typeof setTimeout>
let prevSetIsActive: Function
export function playSound(sound: string, isActive: boolean, setIsActive: Function) { 
    setIsActive(true)
    soundValue = sound
    if(i === 3) {
        i = 0
        setIsActive(false)
        return
    }
    if(isSoundPlaying) {
        clearTimeout(replaySoundTimeout)
        isSoundPlaying = false
        i = 0
        prevSetIsActive(false)
        if (prevSetIsActive === setIsActive) return
    }
    if(!isSoundPlaying) {
        i++
        let audio = new Audio(soundValue)
        audio.play() 
        prevSetIsActive = setIsActive
        audio.onloadedmetadata = (e) => {
            isSoundPlaying = true
            replaySoundTimeout = setTimeout( () => {
                isSoundPlaying = false
                playSound(soundValue, isActive, setIsActive)
            }, audio.duration * 1000 + 100)
        }
    }
}