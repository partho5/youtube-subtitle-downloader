import {
    clickElementWithText,
    getTranscriptData, getVideoTitle
} from "../youtube/Extract";
import {TranscriptSegment} from "../interface/TypeInterface";
import {displayMsgId, outputFormatSelectId} from "../../data/values";
import {setMsg} from "../ui/msgLog";
import { convertJsonStrToSRT } from "../formatter/outputFormatter";


const handleDownloadClick = () => {
    setMsg('Requesting ⏳ Youtube...');

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
                downloadTranscript(transcriptJSON, outputFormat);
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


/**
 * Function to download the youtube data as a file
 * @param transcriptData - The youtube data to be downloaded
 * @param format - The format of the file to download ('text', 'text-with-time', 'json')
 */
function downloadTranscript(transcriptData: string, format: string): void {
    let fileContent: string;
    let fileName: string;

    // Parse JSON data if format is 'json'
    let transcriptArray: TranscriptSegment[] = [];
    if (format === 'json') {
        try {
            transcriptArray = JSON.parse(transcriptData);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            return;
        }
    } else {
        // Assume transcriptData is already an array for non-JSON formats
        transcriptArray = JSON.parse(transcriptData);
    }

    // Clean up unwanted characters
    const cleanText = (text: string): string => {
        // Replace non-breaking spaces (0xa0) with regular spaces (0x20)
        return text.replace(/\xa0/g, ' ');
    };

    const videoTitle = getVideoTitle();
    console.info(videoTitle);

    // Determine the file content and name based on the format
    switch (format) {
        case 'text':
            // Convert the transcriptArray to plain text format
            fileContent = transcriptArray
                .map((segment: TranscriptSegment) => `${cleanText(segment.text)}`)
                .join('\n');
            fileName = `transcript-of-${getVideoTitle()}.txt`;
            break;
        case 'text-with-time':
            // Convert the transcriptArray to text with timestamps format
            fileContent = transcriptArray
                .map((segment: TranscriptSegment) => `[${cleanText(segment.timestamp)}] ${cleanText(segment.text)}`)
                .join('\n');
            fileName = `transcript-with-time-of-${getVideoTitle()}.txt`;
            break;
        case 'json':
            // Use the JSON data as is
            fileContent = JSON.stringify(transcriptArray, null, 2);
            fileName = `transcript-of-${getVideoTitle()}.json`;
            break;
        case 'srt':
            fileContent = convertJsonStrToSRT(cleanText(transcriptData));
            fileName = `transcript-of-${getVideoTitle()}.srt`;
            break;
        default:
            console.error('Invalid format specified');
            return;
    }

    // Create a Blob from the file content
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('Transcript downloaded as', fileName);

    setMsg('Subtitle Downloaded ✅');
}


export {
    handleDownloadClick,
    getSelectedOutputFormat
};