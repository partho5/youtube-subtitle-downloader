
const copyTranscriptToClipboard = (transcriptData: string) => {
    copyToClipBoard(transcriptData);
}

const copyToClipBoard = (data: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(data).then(() => {
            // console.log('Transcript copied to clipboard');
        }).catch(err => {
            // console.error('Failed to copy transcript to clipboard:', err);
        });
    }
    else {
        // Fallback for browsers that do not support Clipboard API

        // Create a temporary textarea element to facilitate copying
        const textarea = document.createElement('textarea');
        textarea.value = data;
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            // console.log('Transcript copied to clipboard');
        } catch (err) {
            // console.error('Failed to copy transcript to clipboard:', err);
        }
        document.body.removeChild(textarea);
    }
}

export {
    copyTranscriptToClipboard
};