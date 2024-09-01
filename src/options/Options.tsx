import React, { useState, useEffect } from 'react';
import './Options.css';
import {defaultDownloadFileNamingConvention, downloadFileNamingTemplates} from "../data/values";

export const Options = () => {
    const [downloadCountTotal, setDownloadCountTotal] = useState(0);
    const [namingConvention, setNamingConvention] = useState<string>(defaultDownloadFileNamingConvention);

    const link = 'https://github.com/partho5/youtube-subtitle-downloader';

    useEffect(() => {
        chrome.storage.sync.get(['downloadCountTotal'], (result) => {
            setDownloadCountTotal(result.downloadCountTotal || 0);
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

    return (
        <main>
            <section className="content">
                <h3>
                    <span>Youtube Extension Options</span>
                </h3>

                <div className="download-info">
                    <div className="row">
                        Total Videos Downloaded: <span className="down-count">{downloadCountTotal}</span>
                    </div>

                    <div className="row naming-convention">
                        <p>Downloaded File Name:</p>
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

                </div>


                <p className="source-code">
                    View the <a href={link} target="_blank">source code on GitHub</a>
                </p>
            </section>
        </main>
    );
};

export default Options;
