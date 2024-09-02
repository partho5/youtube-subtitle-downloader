import { TranscriptSegment } from "../interface/TypeInterface";

const convertToSRT = (subtitles: TranscriptSegment[]): string => {
    let srtOutput = '';

    // Convert each subtitle entry to SRT format
    subtitles.forEach((subtitle, index) => {
        const startTime = subtitle.timestamp;

        // Calculate end time based on the next subtitle or text length
        let endTime = index < subtitles.length - 1
            ? subtitles[index + 1].timestamp
            : calculateEndTime(startTime, subtitle.text.length);

        const formattedStartTime = formatTimestamp(startTime);
        const formattedEndTime = formatTimestamp(endTime);

        // Append to the SRT output
        srtOutput += `${index + 1}\n`;
        srtOutput += `${formattedStartTime} --> ${formattedEndTime}\n`;
        srtOutput += `${subtitle.text}\n\n`;
    });

    return srtOutput.trim(); // Remove any trailing newlines
}

function formatTimestamp(timestamp: string): string {
    const [minutes, seconds] = timestamp.split(':').map(Number);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    const hours = '00';
    const millis = '000';
    return `${hours}:${formattedMinutes}:${formattedSeconds},${millis}`;
}

// Function to calculate end time based on text length
function calculateEndTime(startTime: string, textLength: number): string {
    const [minutes, seconds] = startTime.split(':').map(Number);
    let durationInSeconds = Math.ceil(textLength / 10); // Example: 1 second for every 10 characters
    let newSeconds = seconds + durationInSeconds;
    let newMinutes = minutes;

    while (newSeconds >= 60) {
        newSeconds -= 60;
        newMinutes += 1;
    }

    return `${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
}

// Function to convert JSON string to SRT
const convertJsonStrToSRT = (jsonString: string): string => {
    try {
        const subtitles: TranscriptSegment[] = JSON.parse(jsonString);
        return convertToSRT(subtitles);
    } catch (error) {
        console.error("Invalid JSON string:", error);
        return "";
    }
};

const jsonToArray = (transcriptData: string): TranscriptSegment[] | null => {
    try {
        const parsedData = JSON.parse(transcriptData);

        // Check if the parsed data is an array
        if (Array.isArray(parsedData)) {
            return parsedData as TranscriptSegment[];
        } else {
            console.error('Parsed data is not an array.');
            return null; // Return null if the parsed data is not an array
        }
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        return null; // Return null on error
    }
};

export {
    convertJsonStrToSRT,
    jsonToArray
};
