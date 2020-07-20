import {v4 as uuidv4} from "uuid";

export const STATUS = {
    OK: 'Working',
    BAD: 'Not Working',
};

const getPage = async (url) => {
    const result = await fetch(url);
    const {status} = result;
    if (status === 404) {
        return ''
    }
    const text = await result.text();
    return text.replace(/\s/g, '');
};

const searchLinks = async (url) => {
    let links = [];
    const html = await getPage(url);
    if (html.indexOf('<a') >= 0) {
        const match = html.match(/<a.*?href="(.*?)".*?>(.*?)<\/a>/ig);
        const tags = Array.from(match);
        links = tags.map((item) => {
            return item.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/ig, '$1')
        });
    }
    return links;
};
const checkLink = async (link) => {
    const html = await getPage(link);
    return html.length > 0;
};
const generateLink = (url, status, parent) => {
    return {
        id: uuidv4(),
        url,
        parent,
        status: status ? STATUS.OK : STATUS.BAD
    }
};
const searchPages = async (allLinks, links, allLinksObjects, firstUrl) => {
    return Promise.all(links.map(async (item) => {
        if (item.includes(firstUrl) && !item.includes('wp-admin') && !item.includes('wp-login')) {

            if (item.indexOf('/') === 0 && item.length > 1) {
                item = firstUrl + item.substr(1);
            }
            const foundedLinks = await searchLinks(item);
            const filteredLinks = foundedLinks.filter(innerItem => {
                if (innerItem.indexOf('/') === 0 && innerItem.length > 1) {
                    innerItem = firstUrl + innerItem.substr(1);
                }
                return innerItem.includes(firstUrl) && !allLinks.includes(innerItem) && !innerItem.includes('wp-admin') && !innerItem.includes('wp-login');
            });
            if (filteredLinks.length > 0) {
                filteredLinks.forEach((filteredItem) => {
                    if (!allLinks.includes(filteredItem)) {
                        allLinks.push(filteredItem);
                        allLinksObjects.push({parent: item, url: filteredItem});
                    }
                });
                return searchPages(allLinks, filteredLinks, allLinksObjects, firstUrl)
            }
        }
    }));
};
const processLinks = async (url) => {
    const allLinks = [];
    const allLinksObjects = [];
    allLinks.push(url);
    allLinksObjects.push({
        parent: '',
        url
    });
    await searchPages(allLinks, allLinks, allLinksObjects, url);
    return Promise.all(allLinksObjects.map(async item => {
        const isWorkingLink = await checkLink(item.url);
        return generateLink(item.url, isWorkingLink, item.parent);
    }));
};
export default {
    processLinks,
}
