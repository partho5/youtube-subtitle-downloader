import './Popup.css'
import {appName} from "../data/values";
import settingsIcon from '../../public/icons/settings-icon.png';

export const Popup = () => {

    const openSettingsPage = () => {
        chrome.runtime.openOptionsPage();
    };




  return (
    <main>
      <h2>{appName}</h2>

      <div className="">
        <p>1 click ! And download subtitle / transcript</p>
      </div>

      <div className="settings-container">
          <img className="icon icon-settings" src={settingsIcon} alt="Settingts Icon"/>
          <div className="settings-label" onClick={openSettingsPage}>Customize More</div>
      </div>
    </main>
  )
}

export default Popup
