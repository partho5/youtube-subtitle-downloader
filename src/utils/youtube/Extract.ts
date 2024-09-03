
import {TranscriptSegment} from "../interface/TypeInterface";

/* Function to click an element based on its text content */
function clickElementWithText(text: string): void {
    // Use XPath to find the element with the specified text content
    const xpath: string = `//div[contains(@class, 'yt-spec-button-shape-next__button-text-content')]//span[text()='${text}']`;
    const elements: XPathResult = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    // Check if the element is found and click it
    if (elements.snapshotLength > 0) {
        const element: Node | null = elements.snapshotItem(0);
        if (element instanceof HTMLElement) {
            element.click();
            // console.log(`Clicked element with text: ${text}`);
        } else {
            // console.log(`Snapshot item is not an HTML element.`);
        }
    } else {
        // console.log(`Element with text '${text}' not found.`);
    }
}


/* Function to get transcript data */
function getTranscriptData(): string {
    // Initialize an empty array to store the transcript data
    const transcriptData: TranscriptSegment[] = [];

    // Use a query selector to find all transcript segment elements
    const segments: NodeListOf<HTMLElement> = document.querySelectorAll('ytd-transcript-segment-renderer');

    // Iterate over each segment to extract the timestamp and text
    segments.forEach((segment: HTMLElement) => {
        const timestampElement = segment.querySelector('.segment-timestamp') as HTMLElement;
        const textElement = segment.querySelector('.segment-text') as HTMLElement;

        const timestamp = timestampElement?.innerText.trim() || '';
        const text = textElement?.innerText.trim() || '';

        // Push an object containing the timestamp and text to the transcriptData array
        transcriptData.push({ timestamp, text });
    });

    // Return the transcript data as a JSON object
    return JSON.stringify(transcriptData, null, 2);
}

function hideTranscriptSection() {
    const transcriptSection = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-youtube"]');
    if (transcriptSection) {
        (transcriptSection as HTMLElement).style.height = '100px';
        (transcriptSection as HTMLElement).style.opacity = '0';
        (transcriptSection as HTMLElement).style.zIndex = '100';
    }
}

/**
 * Function to get the video title from the YouTube video page.
 * @returns The video title as a string or null if the title is not found.
 */
function getVideoTitle(): string | null {
    // Select the element that contains the video title
    const titleElement = document.querySelector<HTMLHeadingElement>('div#title h1 yt-formatted-string');

    // Return the text content of the element if it exists
    return titleElement ? titleElement.textContent?.trim() || null : null;
}


function extractVideoUrlsFromPlaylist(): string[] {
    const videoUrls: string[] = [];

    // Select all video elements in the playlist
    const videoElements = document.querySelectorAll('ytd-playlist-panel-video-renderer a#wc-endpoint');

    // Loop through the selected elements and extract the href attribute
    videoElements.forEach(videoElement => {
        const url = videoElement.getAttribute('href');
        if (url) {
            videoUrls.push(`https://www.youtube.com${url}`);
        }
    });

    return videoUrls;
}



export {
    clickElementWithText,
    getTranscriptData,
    hideTranscriptSection,
    getVideoTitle,
    extractVideoUrlsFromPlaylist
};