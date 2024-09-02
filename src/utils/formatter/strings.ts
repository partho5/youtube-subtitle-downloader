
// Clean up unwanted characters from transcript
const cleanText = (text: string): string => {
    return text.replace(/\xa0/g, ' '); // Replace non-breaking spaces
};

export {
    cleanText
};