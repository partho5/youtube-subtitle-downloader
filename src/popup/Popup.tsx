import './Popup.css'
import settingsIcon from '../../public/icons/settings-icon.png';
import {openSettingsPage} from "../utils/ui/Actions";

export const Popup = () => {

  return (
    <main>
      <h2>Youtube ↓ Subtitle</h2>

      <div className="msg1">
          <p>
              Download by 1 click 🖱
              &nbsp;<a href="https://datamatric.com/portfolio/apps/youtube-subtitle-downloader" target="_blank" id="how-link">See how</a> ?
          </p>
      </div>

        <div className="settings-container">
            <img className="icon icon-settings" src={settingsIcon} alt="Settingts Icon"/>
          <div className="settings-label" onClick={openSettingsPage}>Customize More</div>
      </div>
    </main>
  )

}

export default Popup
