// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;
const iCloudFileManager = FileManager.iCloud();

class  ScriptableWebView {
    html       = '';
    styles     = '';
    scripts    = {
        top:    ['ToDo.js'],
        bottom: [],
    };
    config = {};

    constructor(root) {
        this.root = iCloudFileManager.documentsDirectory() + root;
        if (!iCloudFileManager.isFileDownloaded(this.root + '/webview.scriptable.json')) {
            iCloudFileManager.downloadFileFromiCloud(this.root + '/webview.scriptable.json');
        }
        this.config = JSON.parse(iCloudFileManager.readString(this.root + '/webview.scriptable.json'));
    }

    render() {
        if (!iCloudFileManager.isFileDownloaded(this.root + '/' + this.config.view)) {
            iCloudFileManager.downloadFileFromiCloud(this.root + '/' + this.config.view);
        }
        this.html = iCloudFileManager.readString(this.root + '/' + this.config.view);
        this.loadStyleSheets();
        this.loadInlineScripts();
        return this.html;
    }

    loadStyleSheets() {
        if(this.config.styles.length > 0) {
            for (let index = 0; index < this.config.styles.length; index++) {
                if (!iCloudFileManager.isFileDownloaded(this.root + '/' + this.config.styles[index])) {
                    iCloudFileManager.downloadFileFromiCloud(this.root + '/' + this.config.styles[index]);
                }
                this.html = this.html.replace('|STYLE|', `<style>${iCloudFileManager.readString(this.root + '/' + this.config.styles[index])}</style>` + '\r\n|STYLE|')
                if(index + 1 == this.config.styles.length) {
                    this.html = this.html.replace('|STYLE|', '')
                }
            }
        } else {
            this.html = this.html.replace('|STYLE|', '')
        }
    }

    loadInlineScripts() {
        if(this.scripts.top.length > 0) {
            for (let index = 0; index < this.scripts.top.length; index++) {
                if (!iCloudFileManager.isFileDownloaded(this.root + '/' + this.scripts.top[index])) {
                    iCloudFileManager.downloadFileFromiCloud(this.root + '/' + this.scripts.top[index]);
                }
                this.html = this.html.replace('|INLINE-SCRIPT|', `<script>
                ${iCloudFileManager.readString(this.root + '/' + this.scripts.top[index])}</script>` + '\r\n|INLINE-SCRIPT|')
                if(index + 1 == this.scripts.top.length) {
                    this.html = this.html.replace('|INLINE-SCRIPT|', '')
                }
            }
        } else {
            this.html = this.html.replace('|INLINE-SCRIPT|', '')
        }
    }

};
exports.ScriptableWebView = ScriptableWebView;