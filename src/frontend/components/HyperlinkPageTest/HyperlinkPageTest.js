import React, {useState} from 'react';
import styles from './HyperlinkPageTest.css';
import Utils, {STATUS} from '../../utils/index';

function HyperlinkPageTest() {
    const [links, setLinks] = useState([]);
    const [currentLocation, setLocation] = useState('');
    const [brokenLinks, setBrokenLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scanned, setScanned] = useState(false);
    const runSearch = async () => {
        setBrokenLinks([]);
        setLinks([]);
        setLoading(true);
        const links = await Utils.processLinks(currentLocation);
        function compare( a, b ) {
            if ( a.status < b.status ){
                return -1;
            }
            if ( a.status > b.status ){
                return 1;
            }
            return 0;
        }
        links.sort(compare);
        const currentBrokenLinks = links.filter((item) => {
            return item.status === STATUS.BAD
        });
        setBrokenLinks(currentBrokenLinks);
        setLoading(false);
        setScanned(true);
        setLinks(links);
    };
    useState(() => {
        setLocation(location.origin)
    }, []);

    return (
        <div className={styles.contentWrapper}>
            <div className={styles.buttonWrapper}>
                <button className={styles.button} onClick={runSearch}>
                    Start Test
                </button>
            </div>
            {
                scanned && brokenLinks.length > 0 && (
                    <div>
                        Found <b>{brokenLinks.length}</b> broken links on the next pages:
                        <ol>
                            {
                                brokenLinks.map((item, index) => (
                                    <li key={index}>
                                        <a href={item.parent} target="_blank">
                                            {item.parent}
                                        </a>
                                        &nbsp;(Broken link: <b>{item.url}</b>)
                                    </li>
                                ))
                            }
                        </ol>
                    </div>
                )
            }
            <div>

            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.numberTd}>
                            No.
                        </th>
                        <th>
                            Page Url
                        </th>
                        <th className={styles.statusTd}>
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    links.map((item, index) => (
                        <tr key={index}>
                            <td className={styles.numberTd}>
                                {index+1}
                            </td>
                            <td>
                                <a href={item.url} target="_blank">
                                    {item.url}
                                </a>
                            </td>
                            <td className={styles.statusTd}>
                                <span className={item.status === STATUS.BAD ? styles.red : styles.green}>{item.status}</span>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
            {
                loading && (
                    <div className={styles.scanning}>Scanning</div>
                )
            }
        </div>
    )
}
export default HyperlinkPageTest;
