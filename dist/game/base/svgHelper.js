export class SVGHelper {
    static _cachedDocuments = new Map();
    static _isPreloaded = false;
    static async Preload(...urls) {
        if (this._isPreloaded) {
            return;
        }
        return Promise.all(urls.map(url => this._loadSVGAsync(url)))
            .then(() => {
            this._isPreloaded = true;
        });
    }
    static createUseElement(url) {
        if (!this._isPreloaded) {
            throw new Error("Please preload first.");
        }
        if (!this._cachedDocuments.has(url)) {
            throw new Error(`Failed to find SVG document ${url}.`);
        }
        const doc = this._cachedDocuments.get(url);
        const svgElement = doc.querySelector("svg");
        if (!svgElement) {
            throw new Error(`Failed to find svg element in ${url}.`);
        }
        const symbolId = this._generateSymbolId(url);
        var defs = document.querySelector("defs");
        if (!defs) {
            defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            const mainSvg = document.querySelector('svg');
            if (mainSvg) {
                mainSvg.insertBefore(defs, mainSvg.firstChild);
            }
        }
        if (!defs.querySelector(`#${symbolId}`)) {
            const symbolElement = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
            symbolElement.id = symbolId;
            //VIEWBOX?
            const viewBox = svgElement.getAttribute('viewBox');
            if (viewBox) {
                symbolElement.setAttribute('viewBox', viewBox);
            }
            Array.from(svgElement.children).forEach(children => {
                const cloned = document.importNode(children, true);
                symbolElement.appendChild(cloned);
            });
            defs.appendChild(symbolElement);
        }
        const useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
        useElement.setAttribute("href", `#${symbolId}`);
        return useElement;
    }
    static async _loadSVGAsync(url) {
        if (this._cachedDocuments.has(url)) {
            return;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load SVG ${url}.`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        if (doc.querySelector("parsererror")) {
            throw new Error(`Failed to parse SVG ${url}.`);
        }
        this._cachedDocuments.set(url, doc);
    }
    static _generateSymbolId(url) {
        const fileName = url.split("/").pop()?.replace(".svg", "") || "svg";
        return `svg-${fileName}`;
    }
}
