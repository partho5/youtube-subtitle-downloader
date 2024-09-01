const appName: string = 'Youtube Subtitle Downloader';
const extensionUniquePrefix = 'yt-sub-ext'; /* Will be used to make any identifier, css selector etc. unique */
const outputFormatSelectId = `${extensionUniquePrefix}-output-format`;
const displayMsgId = `${extensionUniquePrefix}-msg`;
const downloadFileNamingTemplates = [
    'TRANSCRIPT-OF-TITLE',
    'TITLE-TRANSCRIPT',
    'TITLE'
];

const defaultDownloadFileNamingConvention = downloadFileNamingTemplates[2];
const defaultSelectedOutputFormat = 'text';

export {
    appName,
    extensionUniquePrefix,
    outputFormatSelectId,
    displayMsgId,
    downloadFileNamingTemplates,

    defaultDownloadFileNamingConvention,
    defaultSelectedOutputFormat,
};