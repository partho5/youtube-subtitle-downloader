import {
    clickElementWithText,
    getTranscriptData, getVideoTitle
} from "../youtube/Extract";
import {TranscriptSegment} from "../interface/TypeInterface";
import {
    defaultDownloadFileNamingConvention,
    downloadFileNamingTemplates,
    outputFormatSelectId
} from "../../data/values";
import {setMsg} from "../ui/msgLog";
import {convertJsonStrToSRT, jsonToArray} from "../formatter/outputFormatter";
import {cleanText} from "../formatter/strings";
import {copyTranscriptToClipboard} from "./ClipboardUtils";


let downloadCountTotal = 0;
let autoCopySet = false;

const handleDownloadClick = () => {
    setMsg('Requesting ⏳ Youtube...');

    chrome.storage.sync.get(['downloadCountTotal'], (data) => {
        // console.log(`downloadCountTotal got as ${data.downloadCountTotal}`);
        downloadCountTotal = data.downloadCountTotal || 0;
    });

    let transcriptJSON = getTranscriptData();
    const maxRetries = 5; // Maximum number of retries
    let retryCount = 0; // Initialize the retry counter

    // Retry logic with interval
    const intervalId = setInterval(async () => {
        transcriptJSON = getTranscriptData();
        if (transcriptJSON && transcriptJSON !== "[]") {
            // If the transcriptJSON is not empty, clear the interval and log the result
            clearInterval(intervalId);
            // console.log(transcriptJSON);

            const outputFormat = getSelectedOutputFormat(outputFormatSelectId);
            if (outputFormat) {
                setMsg('Downloading...');

                chrome.storage.sync.get(['autoCopyStatus'], (result)=>{
                    autoCopySet = result.autoCopyStatus || false; // Default to false if not set
                    if (autoCopySet){
                        const transcriptArray = jsonToArray(transcriptJSON);
                        if(transcriptArray){
                            const content = buildFileContent(transcriptArray, outputFormat);
                            copyTranscriptToClipboard(content);
                            setMsg('Subtitle Downloaded ➕ Copied to Clipboard');
                        }else{
                            console.log('no transcriptArray');
                        }
                    }
                });

                const downloadSucceed = await downloadTranscript(transcriptJSON, outputFormat);
                if (downloadSucceed) {
                    if(autoCopySet){
                        setMsg('Downloaded + Copied to Clipboard ✅');
                    }else{
                        setMsg('Subtitle Downloaded ✅');
                    }
                    chrome.storage.sync.set({ downloadCountTotal: ++downloadCountTotal }, ()=>{
                        // console.log('downloadCountTotal set to ', downloadCountTotal);
                    });
                } else {
                    setMsg('Subtitle Download Failed ❌');
                }
            }
        } else {
            // Increment the retry counter
            retryCount++;

            // Check if the maximum number of retries has been reached
            if (retryCount >= maxRetries) {
                clearInterval(intervalId);
                console.error('Could not load transcript after multiple attempts.');
                setMsg("No transcript available for this video 🚫", true);
            } else {
                // Try clicking the 'Show Transcript' button again
                console.log('Retrying to click "Show transcript"...');
                clickElementWithText('Show transcript');
            }
        }
    }, 1000);  // Check every 1sec
}


/* Function to get the selected value from a <select> element and use it */
function getSelectedOutputFormat(outputFormatSelectId: string): string | null {
    // Get the <select> element using the provided ID
    const selectElement = document.querySelector<HTMLSelectElement>(`#${outputFormatSelectId}`);

    // Check if the selectElement exists and return its value or null
    return selectElement ? selectElement.value : null;
}


const buildFileContent = (transcriptArray: TranscriptSegment[], format: string): string => {
    let fileContent: string = '';

    // Determine the file content based on the format
    switch (format) {
        case 'text':
            fileContent = transcriptArray
                .map((segment: TranscriptSegment) => `${cleanText(segment.text)}`)
                .join('\n');
            break;
        case 'text-with-time':
            fileContent = transcriptArray
                .map((segment: TranscriptSegment) => `[${cleanText(segment.timestamp)}] ${cleanText(segment.text)}`)
                .join('\n');
            break;
        case 'json':
            fileContent = JSON.stringify(transcriptArray, null, 2);
            break;
        case 'srt':
            fileContent = convertJsonStrToSRT(JSON.stringify(transcriptArray));
            break;
        default:
            console.error('Invalid format specified');
            break;
    }

    return fileContent;
}



/**
 * Function to output the YouTube transcript data as a file.
 * @param transcriptJSON - The YouTube transcript (JSON string) data to be downloaded.
 * @param format - The format of the file to output ('text', 'text-with-time', 'json', 'srt' etc.).
 * @returns A boolean indicating the success or failure of the output.
 */
function downloadTranscript(transcriptJSON: string, format: string): Promise<boolean> {
    return new Promise((resolve) => {
        let fileContent: string;
        let fileName: string;

        const transcriptArray = jsonToArray(transcriptJSON);
        if(transcriptArray){
            let videoTitle = getVideoTitle();
            if (!videoTitle) {
                videoTitle = `youtube-video-${downloadCountTotal}`;
            }

            chrome.storage.sync.get(['downloadFileNamingConvention'], (result) => {
                const filenameTemplate = result.downloadFileNamingConvention || defaultDownloadFileNamingConvention;
                fileName = buildDownloadFileName(format, filenameTemplate, videoTitle);

                fileContent = buildFileContent(transcriptArray, format);
                if (!fileContent) {
                    resolve(false); // Download failed
                }

                if(fileContent){
                    try {
                        // Create a Blob from the file content
                        const blob = new Blob([fileContent], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);

                        // Create a temporary link element to trigger the output
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();

                        // Clean up
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);

                        console.log('Transcript downloaded as', fileName);
                        resolve(true); // Download succeeded
                    } catch (error) {
                        console.error('Error downloading transcript:', error);
                        resolve(false); // Download failed
                    }
                }
            });
        }else{
            resolve(false);
        }
    });
}



const buildDownloadFileName = (fileFormat: string, filenameTemplate: string, videoTitle: string): string => {
    let extension = '';

    // Set the appropriate file extension based on the format
    switch (fileFormat) {
        case 'text':
            extension = 'txt';
            break;
        case 'text-with-time':
            extension = 'txt';
            break;
        case 'json':
            extension = 'json';
            break;
        case 'srt':
            extension = 'srt';
            break;
        default:
            console.error('Invalid file format specified');
            return '';
    }

    // Build the filename based on the template
    let filename = '';

    switch (filenameTemplate) {
        case downloadFileNamingTemplates[0]: // TRANSCRIPT-OF-TITLE
            filename = `transcript-of-${videoTitle}.${extension}`;
            break;
        case downloadFileNamingTemplates[1]: // TITLE-TRANSCRIPT
            filename = `${videoTitle}-transcript.${extension}`;
            break;
        case downloadFileNamingTemplates[2]: // TITLE
            filename = `${videoTitle}.${extension}`;
            break;
        default:
            console.error('Invalid filename template specified');
            return '';
    }

    return filename;
};


export {
    handleDownloadClick,
    getSelectedOutputFormat,
    buildFileContent
};