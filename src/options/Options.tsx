import React, { useState, useEffect } from 'react';
import './Options.css';
import {defaultDownloadFileNamingConvention, downloadFileNamingTemplates} from "../data/values";

export const Options = () => {
    const [downloadCountTotal, setDownloadCountTotal] = useState(0);
    const [namingConvention, setNamingConvention] = useState<string>(defaultDownloadFileNamingConvention);
    const [autoCopyStatus, setAutoCopyStatus] = useState(false); // after output being completed, whether automatically copy transcript to clipboard or not

    useEffect(() => {
        chrome.storage.sync.get(['downloadCountTotal'], (result) => {
            setDownloadCountTotal(result.downloadCountTotal || 0);
        });

        // Listener to update downloadCountTotal when it changes in chrome storage
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'sync' && changes.downloadCountTotal) {
                setDownloadCountTotal(changes.downloadCountTotal.newValue || 0);
            }
        });
    }, []);


    useEffect(() => {
        chrome.storage.sync.get(['downloadFileNamingConvention'], (result) => {
            console.log(`downloadFileNamingConvention=${result.downloadFileNamingConvention}`)
            setNamingConvention(result.downloadFileNamingConvention || defaultDownloadFileNamingConvention);
        });
    }, []);

    const handleDownFileNamingConventionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const downloadFileNamingConvention = event.target.value;
        setNamingConvention(downloadFileNamingConvention); // Update local state
        // Set the selected naming convention to chrome storage
        chrome.storage.sync.set({ downloadFileNamingConvention: downloadFileNamingConvention }, () => {
            console.log(`Naming convention set to: ${downloadFileNamingConvention}`);
        });
    };

    useEffect(() => {
        // Retrieve the saved 'autoCopyStatus' from chrome storage
        chrome.storage.sync.get(['autoCopyStatus'], (result) => {
            setAutoCopyStatus(result.autoCopyStatus || false); // Default to false if not set
        });
    }, []);

    const handleAutoCopyStatusToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const status = event.target.checked;
        setAutoCopyStatus(status);
        // Save the 'autoCopyStatus' to chrome storage
        chrome.storage.sync.set({ autoCopyStatus: status }, () => {
            console.log(`Auto copy status set to: ${status}`);
        });
    }

    return (
        <main>
            <section className="content">
                <h3>
                    Youtube Extension Options
                </h3>

                <div className="row download-info">
                    <h4>Statistics</h4>
                    <div className="stat">
                        <span>Total {`Subtitle${downloadCountTotal > 1 ? 's' : ''}`} Downloaded:</span>
                        <span className="down-count">{downloadCountTotal}</span>
                    </div>
                </div>

                <div className="row clipboard-option">
                    <h4>Copy to Clipboard</h4>
                    <p className="hints">
                        If checked, transcript / subtitle will be copied to clipboard automatically after being downloaded.
                    </p>
                    <div>
                        <input
                            type="checkbox"
                            name="auto-copy-checkbox"
                            checked={autoCopyStatus}
                            onChange={handleAutoCopyStatusToggle}
                        />&nbsp;
                        <label htmlFor="auto-copy">Auto Copy to Clipboard</label>
                    </div>
                </div>

                <div className="row naming-convention">
                    <h4>Downloaded File Name</h4>
                    <p className="hints">Determine the pattern of the downloaded file name</p>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="namingConvention"
                                value={downloadFileNamingTemplates[0]}
                                checked={namingConvention === downloadFileNamingTemplates[0]}
                                onChange={handleDownFileNamingConventionChange}
                            />
                            Transcript-of-{"<video title> • <extension>"}
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="namingConvention"
                                value={downloadFileNamingTemplates[1]}
                                checked={namingConvention === downloadFileNamingTemplates[1]}
                                onChange={handleDownFileNamingConventionChange}
                            />
                            {"<video title>-transcript • <extension>"}
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="namingConvention"
                                value={downloadFileNamingTemplates[2]}
                                checked={namingConvention === downloadFileNamingTemplates[2]}
                                onChange={handleDownFileNamingConventionChange}
                            />
                            {"<video title> • <extension>"}
                        </label>
                    </div>
                </div>

                <div className="row links">
                    <div>
                        <p>
                            An <a href="https://www.youtube.com/watch?v=IgKWPdJWuBQ" target="_blank">example
                            video</a> that has multi language
                            transcript available
                        </p>
                    </div>

                    <p>
                        See <a href="https://www.youtube.com/watch?v=h9tTK0LbXfE" target="_blank">how the
                        extension works</a>
                    </p>
                    <p className="source-code">
                        View the <a href="https://github.com/partho5/youtube-subtitle-downloader" target="_blank">source code on GitHub</a>
                    </p>

                    <hr/>
                    <p className="developer">
                        Developed by: <a href="https://www.linkedin.com/in/partho5" target="_blank">Partho Protim</a>
                    </p>
                </div>

            </section>
        </main>
    );
};

export default Options;
