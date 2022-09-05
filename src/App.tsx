import { useEffect, useState } from "react";
import { Clock } from "./components/clock";
import { Settings } from "./components/settings";
import { ISettings } from "./models";

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
    
    console.log('22')
    localStorage.setItem('settings', JSON.stringify(settingsValue))
  }, [settingsValue])
  function loadSettings(settings: ISettings) {
    setSettings(settings)
    console.log('app: ')
    console.log(settings)
  }
  return (
    <div className={`App`}>
      <Settings sendSettings={loadSettings} />
      <Clock settings={settingsValue} />
    </div>
  );
}

export default App;