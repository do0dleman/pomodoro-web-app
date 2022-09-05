import { useEffect, useState } from 'react'
import { ISettings } from '../models'
import { sounds } from '../maps/soundMap'

type ClockTime = {
    min: number
    sec: number
}
interface ClockProps {
    settings: ISettings
}
const SVGsize = "32px"

let workTimeMin: number
let workTimeSec: number
let smallBreakTimeMin: number
let smallBreakTimeSec: number
let bigBreakTimeMin: number
let bigBreakTimeSec: number
let clockTime: ClockTime = { min: 0, sec: 0 }

let isInnit: boolean = true
let isClockActive: boolean = false
let isBreak: boolean = false // true - work | false - break
let isOnTimeOut: boolean = false
let breakCounter = 1
export function Clock(props: ClockProps) {
    const settings = props.settings
    let isDebug = false; // if is true set workTime to 0 and work sec to 2

    let isSkip: boolean = false
    let clockMinStr: string = (settings.workTime > 10) ? 
                            `${settings.workTime}` : `0${settings.workTime}`
    let clockSecStr: string = '00'

    const [clockValueStr, SetClockValueStr] = useState(`${clockMinStr}:${clockSecStr}`)
    const [buttonState, setButtonState] = useState(isClockActive)
    const [clockCurrentRound, setClockCurrentRound] = useState(breakCounter)
    const [showBreak, setShowBreak] = useState(isBreak)
    const [isRestartButtonActive, setIsRestartButtonActive] = useState(false)

    const bgCircleDark = settings.isDark ? 'clock__bg-circle-dark' : ''
    const bgCircleClases = ['clock__bg-circle', bgCircleDark]
    if (isInnit) {
        workTimeMin = settings.workTime
        workTimeSec = 0
        smallBreakTimeMin = settings.smallBreakTime
        smallBreakTimeSec = 0
        bigBreakTimeMin = settings.bigBreakTime
        bigBreakTimeSec = 0
        isInnit = false
    }
    if (isDebug) {
        workTimeMin = 0
        workTimeSec = 2
    }

    useEffect(() => {
        document.title = `${clockValueStr} | Pomodor`
    }, [clockValueStr])
    useEffect(() => {
        restartClock()
    }, [settings])

    
    let i = 0
    function playSound() {
        if(i === 3) {
            i = 0
            return
        }
        let audio = new Audio(sounds.get(settings.sound))
        i++
        audio.play() 
        audio.onloadedmetadata = () => {
            setTimeout(playSound, audio.duration * 1000 + 200)
        }
    }
    function setStringValues(min: number, sec: number) {
        clockMinStr = `${min}`
        if (min < 10) clockMinStr = `0${min}`
        clockSecStr = `${sec}`
        if (sec < 10) clockSecStr = `0${sec}`
    }
    function clockTick() {
        if (!isClockActive || isOnTimeOut) return
        if (clockTime.min === 0 && clockTime.sec === 1) {
            if (isBreak) {
                if (breakCounter !== settings.amountOfBreaks) {
                    breakCounter++
                    setClockCurrentRound(breakCounter)
                } else {
                    breakCounter = 1
                    setClockCurrentRound(breakCounter)
                }
            }
            isBreak = !isBreak
            setShowBreak(isBreak)
            isInnit = true
            setClockActive()
            if (!isSkip) playSound()
            isSkip = false
        }
        if (!isBreak) {
            clockTime = calcClockTime(workTimeMin, workTimeSec)
            workTimeMin = clockTime.min
            workTimeSec = clockTime.sec
            setStringValues(workTimeMin, workTimeSec)
        }
        else if (isBreak) {
            if (!(settings.amountOfBreaks === breakCounter)) {
                clockTime = calcClockTime(smallBreakTimeMin, smallBreakTimeSec)
                smallBreakTimeMin = clockTime.min
                smallBreakTimeSec = clockTime.sec
                setStringValues(smallBreakTimeMin, smallBreakTimeSec)
            }
            else {
                clockTime = calcClockTime(bigBreakTimeMin, bigBreakTimeSec)
                bigBreakTimeMin = clockTime.min
                bigBreakTimeSec = clockTime.sec
                setStringValues(bigBreakTimeMin, bigBreakTimeSec)
            }
        }
        isOnTimeOut = true
        if (!isInnit) setTimeout(() => {
            isOnTimeOut = false
            clockTick()
        }, 1000)
        if (isInnit) isOnTimeOut = false
        SetClockValueStr(`${clockMinStr}:${clockSecStr}`)
    }
    function calcClockTime(min: number, sec: number) {
        if (isInnit) return { min, sec }
        if (sec === 0 && min > 0) {
            min--
            sec = 60
        }
        sec--
        return { min, sec }
    }
    function setClockActive() {
        if (isClockActive) {
            isClockActive = false
            setButtonState(isClockActive)
            return
        }
        if (isInnit) isInnit = false
        isClockActive = true
        setIsRestartButtonActive(true)
        setButtonState(isClockActive)
        clockTick()
    }
    function skipStage() {
        clockTime.min = 0
        clockTime.sec = 1
        isClockActive = true
        isSkip = true
        isOnTimeOut = false
        setIsRestartButtonActive(false)
        clockTick()
    }
    function restartClock() {
        if(!isBreak) {
            clockTime.min = settings.workTime
        }
        if(isBreak && settings.amountOfBreaks !== breakCounter) {
            clockTime.min = settings.smallBreakTime
        }
        if(isBreak && settings.amountOfBreaks === breakCounter) {
            clockTime.min = settings.bigBreakTime
        }
        clockTime.sec = 0
        clockMinStr = (clockTime.min > 9) ? `${clockTime.min}` : `0${clockTime.min}`
        clockSecStr = (clockTime.sec > 9) ? `${clockTime.sec}` : `0${clockTime.sec}`
        setIsRestartButtonActive(false)
        isClockActive = false
        isInnit = true
        SetClockValueStr(`${clockMinStr}:${clockSecStr}`)
        setClockCurrentRound(breakCounter)
        setButtonState(false)
    }
    return (
        <div className="clock">
            <div className="clock__wrapper">
                <div className="clock__container">
                    <div className={bgCircleClases.join(' ')}></div>
                    <div className={bgCircleClases.join(' ')}></div>
                    <div className={bgCircleClases.join(' ')}></div>
                    <span className="clock__time">
                        {clockValueStr}
                    </span>
                    <span className='clock__state'>
                        {showBreak ? "Break" : "Work"}
                    </span>
                    <div className="clock__controls">
                        <button
                        className={`clock__button ${isRestartButtonActive ? 
                        '' : 'clock__button-inactive'}`}
                        onClick={restartClock}
                        >
                            <svg version="1.1" width={SVGsize} height={SVGsize} 
                            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" 
                            viewBox="0 0 297 297">
                                <path d="M296.252,144.737c-1.522-3.674-5.108-6.071-9.086-6.071h-30.432c-5.041-66.306-60.606-118.719-128.18-118.719
                            C57.669,19.947,0,77.616,0,148.501s57.669,128.553,128.554,128.553c5.431,0,9.834-4.403,9.834-9.834V222.7
                            c0-5.431-4.403-9.834-9.834-9.834c-35.49,0-64.365-28.874-64.365-64.365c0-35.491,28.874-64.365,64.365-64.365
                            c32.148,0,58.867,23.69,63.615,54.53h-31.893c-3.978,0-7.564,2.396-9.086,6.071c-1.522,3.675-0.68,7.905,2.132,10.718
                            l63.446,63.445c3.842,3.84,10.067,3.84,13.908,0l63.445-63.445C296.932,152.642,297.773,148.413,296.252,144.737z
                             M223.721,198.038l-39.703-39.703h18.734c5.431,0,9.834-4.403,9.834-9.834c0-46.336-37.697-84.033-84.033-84.033
                            S44.52,102.165,44.52,148.501c0,43.01,32.479,78.577,74.199,83.461v24.984c-55.451-4.984-99.05-51.718-99.05-108.445
                            c0-60.039,48.846-108.885,108.885-108.885s108.883,48.846,108.883,108.885c0,5.431,4.403,9.834,9.834,9.834h16.151
                            L223.721,198.038z"/>
                            </svg>
                        </button>
                        <button className="clock__button"
                        onClick={setClockActive}
                        >
                            <span>
                                {buttonState ? "Pause" : "Start"}
                            </span>
                        </button>
                        <button
                        className="clock__button"
                        onClick={skipStage}
                        >
                            <svg version="1.1" id="designs" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                width={SVGsize} height={SVGsize} viewBox="0 0 32 32">
                                <path d="M29.998,16.648c0.004-0.073,0.002-0.143-0.015-0.213c-0.004-0.024,0.001-0.048-0.005-0.071
                                    c-0.012-0.043-0.038-0.071-0.056-0.107c-0.006-0.012-0.006-0.025-0.013-0.037c-0.004-0.007-0.012-0.011-0.016-0.019
                                    c-0.065-0.105-0.146-0.194-0.252-0.276c-0.229-0.173-0.457-0.345-0.687-0.516c-0.575-0.451-1.11-0.942-1.645-1.437
                                    c-0.58-0.538-1.191-1.039-1.798-1.545c-0.605-0.504-1.233-0.984-1.834-1.492c-0.623-0.528-1.235-1.068-1.842-1.616
                                    c-0.56-0.506-1.11-1.03-1.697-1.505c-0.646-0.522-1.307-1.022-1.971-1.522c-0.636-0.501-1.261-1.015-1.878-1.539
                                    c-0.169-0.141-0.341-0.234-0.568-0.234c-0.21,0-0.417,0.085-0.566,0.234c-0.149,0.149-0.234,0.356-0.234,0.566
                                    c0,0.128,0.046,0.264,0.112,0.387c-0.124,0.147-0.208,0.329-0.208,0.532c0.006,1.479-0.006,2.958-0.03,4.436
                                    c-0.012,0.651-0.01,1.3-0.006,1.953c0.003,0.392,0.011,0.785,0.014,1.178c-0.689-0.514-1.376-1.03-2.06-1.554
                                    c-0.683-0.54-1.352-1.1-2.037-1.638c-0.673-0.528-1.346-1.054-1.999-1.61c-0.705-0.599-1.391-1.221-2.114-1.8
                                    C5.899,6.646,5.212,6.078,4.51,5.53C4.202,5.292,3.896,5.054,3.589,4.818c-0.111-0.085-0.27-0.119-0.422-0.119
                                    c-0.088,0-0.174,0.012-0.247,0.032C2.701,4.79,2.515,4.935,2.4,5.129c-0.035,0.06-0.047,0.129-0.066,0.195
                                    C2.202,5.473,2.116,5.665,2.106,5.878C1.965,9.369,2.005,12.865,2.005,16.36c0,1.61-0.002,3.222,0.018,4.832
                                    c0.012,0.818,0.018,1.638,0.016,2.455c-0.002,0.776-0.02,1.554-0.014,2.33c0.004,0.419,0.333,0.761,0.744,0.798
                                    c0.067,0.042,0.134,0.085,0.211,0.106c0.197,0.053,0.465,0.042,0.635-0.084c0.748-0.542,1.495-1.084,2.245-1.62
                                    c0.703-0.504,1.38-1.038,2.084-1.536c1.411-1,2.884-1.905,4.295-2.902c0.735-0.518,1.467-1.039,2.211-1.544
                                    c-0.051,1.055-0.085,2.11-0.101,3.166c-0.02,1.251-0.038,2.499-0.038,3.749c0,0.272,0.146,0.503,0.354,0.653
                                    c0.01,0.114,0.039,0.227,0.098,0.326c0.202,0.347,0.717,0.522,1.068,0.28c1.344-0.923,2.658-1.888,3.968-2.856
                                    c0.619-0.456,1.243-0.905,1.864-1.36c0.637-0.469,1.264-0.949,1.906-1.413c1.034-0.748,2.062-1.507,3.083-2.273
                                    c0.482-0.362,0.965-0.725,1.449-1.084c0.23-0.17,0.457-0.347,0.691-0.516c0.28-0.203,0.568-0.397,0.844-0.605
                                    c0.167-0.123,0.294-0.246,0.351-0.455c0.013-0.049,0.007-0.099,0.01-0.149C29.998,16.654,29.998,16.651,29.998,16.648z
                                     M12.004,18.843c-1.386,0.989-2.787,1.951-4.202,2.898C6.97,22.299,6.19,22.923,5.388,23.52c-0.574,0.428-1.162,0.839-1.749,1.251
                                    c-0.007-1.194-0.013-2.387-0.028-3.579c-0.018-1.61-0.008-3.222-0.006-4.832c0.004-1.671,0.006-3.343,0.004-5.014
                                    c0-1.421,0.05-2.839,0.11-4.256C4.31,7.551,4.902,8.011,5.486,8.48c0.703,0.564,1.358,1.181,2.042,1.765
                                    c0.661,0.562,1.334,1.108,2.013,1.646c0.703,0.557,1.386,1.143,2.094,1.693c1.002,0.777,2.025,1.525,3.032,2.296
                                    c0.244,0.191,0.484,0.386,0.726,0.58c-0.108,0.078-0.213,0.16-0.325,0.235c-0.341,0.23-0.679,0.466-1.014,0.706
                                    C13.376,17.887,12.685,18.359,12.004,18.843z M25.18,18.716c-1.251,0.945-2.513,1.872-3.779,2.792
                                    c-1.012,0.739-2.033,1.465-3.045,2.206c-0.788,0.575-1.598,1.122-2.404,1.673c0.004-1.008,0.008-2.017,0.016-3.027
                                    c0.006-0.623,0.006-1.246,0.03-1.87c0.028-0.707,0.083-1.411,0.129-2.118c0.006-0.102-0.016-0.199-0.052-0.29
                                    c0.301-0.207,0.6-0.417,0.903-0.623c0.193-0.131,0.337-0.292,0.401-0.522c0.008-0.03,0.001-0.061,0.006-0.091
                                    c0.097-0.144,0.165-0.307,0.165-0.483c0-0.157-0.042-0.306-0.121-0.443c-0.077-0.131-0.183-0.236-0.314-0.316
                                    c-0.076-0.058-0.153-0.116-0.229-0.173c-0.147-0.116-0.292-0.235-0.438-0.354c0.044-0.102,0.067-0.213,0.063-0.329
                                    c-0.024-0.699-0.018-1.399-0.032-2.098c-0.012-0.659-0.022-1.318-0.024-1.977c-0.003-1.238,0.033-2.476,0.049-3.714
                                    c0.2,0.155,0.393,0.32,0.595,0.473c0.54,0.405,1.09,0.796,1.631,1.202c1.227,0.986,2.356,2.089,3.56,3.103
                                    c1.237,1.043,2.527,2.021,3.744,3.089c0.431,0.379,0.846,0.776,1.284,1.147c0.239,0.201,0.486,0.392,0.734,0.581
                                    c-0.352,0.261-0.704,0.522-1.053,0.786C26.393,17.797,25.788,18.258,25.18,18.716z"/>
                            </svg>
                        </button>
                    </div>
                    <span className="clock__rounds">
                        {`${clockCurrentRound}/${props.settings.amountOfBreaks} Round`}
                    </span>
                </div>
            </div>
        </div >
    )
}