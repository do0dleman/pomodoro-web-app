import { useEffect, useState, useContext } from "react";
import { Clock } from "./components/clock";
import { Settings } from "./components/settings";
import { ISettings } from "./models";
import {requestNotificationPermission} from './functions/notification'

const defaultSettings: ISettings = {
  workTime: 25,
  smallBreakTime: 5,
  bigBreakTime: 15,
  amountOfBreaks: 4,
  isDark: false, 
  sound: 'bell'
}
function App() {
  const [settingsValue, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || 
    JSON.stringify(defaultSettings))
  )

  useEffect(() => {
    if (settingsValue.isDark) document.body.classList.add("dark")
    if (!settingsValue.isDark) document.body.classList.remove("dark")
    
    localStorage.setItem('settings', JSON.stringify(settingsValue))
  }, [settingsValue])
  function loadSettings(settings: ISettings) {
    setSettings(settings)
  }
  useEffect(() => {
    requestNotificationPermission()
  }, [])
  return (
    <div className={`App`}>
      <Settings sendSettings={loadSettings} />
      <Clock settings={settingsValue} />
    </div>
  );
}

export default App;