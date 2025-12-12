export class SVGHelper
{
    private static _cachedDocuments: Map<string, Document> = new Map<string, Document>();
    private static _isPreloaded = false;

    public static async Preload(...urls: string[]): Promise<void>
    {
        if (this._isPreloaded)
        {
            return;
        }

        return Promise.all(urls.map(url => this._loadSVGAsync(url)))
            .then(() =>
            {
                this._isPreloaded = true;
            });
    }

    public static createUseElement(url: string): SVGUseElement
    {
        if (!this._isPreloaded)
        {
            throw new Error("Please preload first.");
        }

        if (!this._cachedDocuments.has(url))
        {
            throw new Error(`Failed to find SVG document ${url}.`);
        }

        const doc = this._cachedDocuments.get(url)!;
        const svgElement = doc.querySelector("svg");

        if (!svgElement)
        {
            throw new Error(`Failed to find svg element in ${url}.`);
        }

        const symbolId = this._generateSymbolId(url);

        var defs = document.querySelector("defs");
        if (!defs)
        {
            defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            const mainSvg = document.querySelector('svg');
            if (mainSvg)
            {
                mainSvg.insertBefore(defs, mainSvg.firstChild);
            }
        }

        if (!defs.querySelector(`#${symbolId}`))
        {
            const symbolElement = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
            symbolElement.id = symbolId;

            //VIEWBOX?
            const viewBox = svgElement.getAttribute('viewBox');
            if (viewBox) {
                symbolElement.setAttribute('viewBox', viewBox);
            }

            Array.from(svgElement.children).forEach(children =>
            {
                const cloned = document.importNode(children, true);
                symbolElement.appendChild(cloned);
            });

            defs.appendChild(symbolElement);
        }

        const useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
        useElement.setAttribute("href", `#${symbolId}`);
        return useElement;
    }

    private static async _loadSVGAsync(url: string): Promise<void>
    {
        if (this._cachedDocuments.has(url))
        {
            return;
        }

        const response = await fetch(url);
        if (!response.ok)
        {
            throw new Error(`Failed to load SVG ${url}.`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");

        if (doc.querySelector("parsererror"))
        {
            throw new Error(`Failed to parse SVG ${url}.`)
        }

        this._cachedDocuments.set(url, doc);
    }

    private static _generateSymbolId(url:string):string
    {
        const fileName = url.split("/").pop()?.replace(".svg", "") || "svg";
        return `svg-${fileName}`;
    }
}