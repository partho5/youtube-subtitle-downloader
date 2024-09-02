import { handleDownloadClick } from "../utils/output/DownloadUtils";
import { displayMsgId, extensionUniquePrefix, outputFormatSelectId } from "../data/values";
import { handleOutputValChange, initializeDownloadFormatSelected } from "./ChangeHandler";
import { extractVideoUrlsFromPlaylist } from "../utils/youtube/Extract";
import {setMsg} from "../utils/ui/msgLog";


function injectUI() {
    // Check if the target element exists and hasn't already been modified
    const secondaryInner = document.querySelector('#secondary-inner');
    const existingDiv = document.querySelector('#yt-sub-ext-container');

    if (secondaryInner && !existingDiv) {
        // Create a new div element
        const newDiv = document.createElement('div');
        newDiv.id = `${extensionUniquePrefix}-container`;
        newDiv.innerHTML = `
            <span class="${extensionUniquePrefix}-options-button" title="Settings">⚙️</span>
            <button class='btn btn-download'>
                <span class='icon'>&#8681;</span>
                Download Subtitle
            </button>
            <span>as</span>
            <select id="${outputFormatSelectId}">
                <option value="text">Text</option>
                <option value="text-with-time">Text with Time</option>
                <option value="json">JSON</option>
                <option value="srt">SRT</option>
            </select>
            
            <!-- Log, status, progress etc. mesage to show -->
            <div id="${displayMsgId}"></div>

            `;
        newDiv.style.padding = '10px';

        // Prepend the new div before the #secondary-inner element
        if (secondaryInner.parentNode) {
            secondaryInner.parentNode.insertBefore(newDiv, secondaryInner);
        }

        initializeDownloadFormatSelected(`#${outputFormatSelectId}`);

        const button = newDiv.querySelector('.btn-download');
        if (button) {
            button.addEventListener('click', handleDownloadClick);
        }

        const outputSelector = newDiv.querySelector(`#${outputFormatSelectId}`);
        if(outputSelector){
            outputSelector.addEventListener('change', handleOutputValChange);
        }

        const optionsButton = newDiv.querySelector(`.${extensionUniquePrefix}-options-button`);
        if (optionsButton) {
            optionsButton.addEventListener('click', ()=>{
                chrome.runtime.sendMessage({"action": "openOptionsPage"});
            });
        }
    }
}

// Use setInterval to keep checking for the element until it appears
const intervalId = setInterval(() => {
    const secondaryInner = document.querySelector('#secondary-inner');

    if (secondaryInner) {
        // Call the modifyYouTube function
        injectUI();

        // Start observing changes after initial modification
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // page has been loaded
                    injectUI();
                    setMsg(''); // clears in case any previous message was shown


                    // feature to be built
                    const urls = extractVideoUrlsFromPlaylist();
                    if(urls.length > 0){
                        // console.log(`${urls.length} videos in this playlist`);
                    }

                    // now the UI is appearing in the webpage
                    break; // Exit loop after the first modification
                }
            }
        });

        if(secondaryInner.parentNode){
            observer.observe(secondaryInner.parentNode, { childList: true });
        }

        // Clear the interval as we have found the target element
        clearInterval(intervalId);
    }
}, 500);  // Check every 500ms
