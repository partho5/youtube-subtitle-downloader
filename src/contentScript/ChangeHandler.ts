import {getSelectedOutputFormat} from "../utils/download/DownloadUtils";
import {defaultSelectedOutputFormat, outputFormatSelectId} from "../data/values";

// Function to save the selected format to Chrome storage
const saveSelectedOutputFormat = (format: string): void => {
    chrome.storage.sync.set({ selectedOutputFormat: format }, () => {
        console.log(`Output format ${format} saved.`);
    });
}

// Function to retrieve the saved output format from Chrome storage
const getSelectedOutputFormatFromStorage = (callback: (format: string) => void): void => {
    chrome.storage.sync.get(['selectedOutputFormat'], (result) => {
        const format = result.selectedOutputFormat || defaultSelectedOutputFormat;
        callback(format);
    });
}

const handleOutputValChange = () => {
    const fileFormat = getSelectedOutputFormat(outputFormatSelectId);
    if(fileFormat){
        saveSelectedOutputFormat(fileFormat);
    }
};

// Function to set the selected value of the <select> element
function setSelectedOption(selectId: string, value: string): void {
    const selectElement = document.querySelector(selectId) as HTMLSelectElement;
    if (selectElement) {
        selectElement.value = value;
    }
}

// Function to initialize the select element with the saved output format
function initializeDownloadFormatSelected(selectId: string): void {
    getSelectedOutputFormatFromStorage((format) => {
        setSelectedOption(selectId, format);
    });
}

export {
    handleOutputValChange,
    getSelectedOutputFormatFromStorage,
    initializeDownloadFormatSelected
};