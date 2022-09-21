import workImg from "../images/work.png"
import restImg from "../images/rest.jpg"

export function requestNotificationPermission() {
    let permision = Notification.permission

    if(permision === 'granted' || permision === 'denied') return
    if(permision === 'default') {
        Notification.requestPermission()
    }
}
export function showNotification(title: string, body: string, isBreak: boolean) {
    let permision = Notification.permission
    if(permision === 'default' || permision === 'denied') return

    let icon
    if(isBreak) icon = restImg
    if(!isBreak) icon = workImg
    let notification = new Notification(title, {body, icon})
    notification.onclick = () => {
        notification.close();
        window.parent.focus();
    }
}