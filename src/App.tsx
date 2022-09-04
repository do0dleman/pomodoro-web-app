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
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings') || JSON.stringify(defaultSettings)))
  useEffect(() => {
    if (settings.isDark) document.body.classList.add("dark")
    if (!settings.isDark) document.body.classList.remove("dark")
    
    localStorage.setItem('settings', JSON.stringify(settings))
  }, [settings])
  function loadSettings(settings: ISettings) {
    setSettings(settings)
  }
  return (
    <div className={`App`}>
      <Settings sendSettings={loadSettings} />
      <Clock settings={settings} />
    </div>
  );
}

export default App;