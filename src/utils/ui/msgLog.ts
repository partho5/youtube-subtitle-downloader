import { displayMsgId } from "../../data/values";

/** Gets the HTML element by selector */
const getElement = (selector: string): HTMLLabelElement | null => {
    return document.querySelector(selector) as HTMLLabelElement | null;
}

/** Sets the text and makes sure the element is visible */
const setText = (selector: string, text: string): void => {
    const element = getElement(selector);
    if (element) {
        element.style.display = 'block';
        element.textContent = text;
    } else {
        console.error(`Element with selector ${selector} not found.`);
    }
}

/** Displays or hides the message based on the provided text and auto-hide option */
const setMsg = (msgText: string, autoHide: boolean = false): void => {
    if (msgText.trim() === '') {
        hideMsg(); // Hide if text is blank
    } else {
        setText(`#${displayMsgId}`, msgText);
        if (autoHide) {
            // Automatically hide the message after a delay
            setTimeout(() => {
                hideMsg();
            }, 5000); // Adjust the delay time as needed
        }
    }
}

/** Hides the message element */
const hideMsg = (): void => {
    const msgLabel = getElement(`#${displayMsgId}`);
    if (msgLabel) {
        msgLabel.style.display = 'none';
    }
}

export {
    setText,
    setMsg,
    hideMsg
};
