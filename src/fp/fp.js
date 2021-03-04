/* harmony import */
var canvasFP = require(/*! ./core/canvasFP */ "./canvasFP.js");
/* harmony import */
var _core_webglFP__WEBPACK_IMPORTED_MODULE_2__ = require(/*! ./core/webglFP */ "./webglFP.js");
/* harmony import */
var _core_audioFP__WEBPACK_IMPORTED_MODULE_3__ = require(/*! ./core/audioFP */ "./audioFP.js");

var fff = document.querySelector('.fingerprint');

function log(info) {
    if (fff.innerText.indexOf('指纹获取中...') != -1) {
        fff.innerHTML = '';
    };
    fff.innerHTML = fff.innerHTML + '</br>' + info;
}

setTimeout(function () {
    log("<span id='cf'>Canvas 指纹 : " + canvasFP().hash + "</span>");
    log("<span id='cg'>Webgl 指纹 : " + _core_webglFP__WEBPACK_IMPORTED_MODULE_2__().hash + "</span>");
    _core_audioFP__WEBPACK_IMPORTED_MODULE_3__().then(function (_ref) {
        var hash = _ref.hash;
        log("<span id='ca'>Audio 指纹 : " + hash + "</span>");
    });
}, 500); //
// var components = [
//     { key: 'userAgent', getData: UserAgent },
//     { key: 'webdriver', getData: webdriver },
//     { key: 'language', getData: languageKey },
//     { key: 'colorDepth', getData: colorDepthKey },
//     { key: 'deviceMemory', getData: deviceMemoryKey },
//     { key: 'pixelRatio', getData: pixelRatioKey },
//     { key: 'hardwareConcurrency', getData: hardwareConcurrencyKey },
//     { key: 'screenResolution', getData: screenResolutionKey },
//     { key: 'availableScreenResolution', getData: availableScreenResolutionKey },
//     { key: 'timezoneOffset', getData: timezoneOffset },
//     { key: 'timezone', getData: timezone },
//     { key: 'sessionStorage', getData: sessionStorageKey },
//     { key: 'localStorage', getData: localStorageKey },
//     { key: 'indexedDb', getData: indexedDbKey },
//     { key: 'addBehavior', getData: addBehaviorKey },
//     { key: 'openDatabase', getData: openDatabaseKey },
//     { key: 'cpuClass', getData: cpuClassKey },
//     { key: 'platform', getData: platformKey },
//     { key: 'doNotTrack', getData: doNotTrackKey },
//     { key: 'plugins', getData: pluginsComponent },
//     { key: 'canvas', getData: canvasKey },
//     { key: 'webgl', getData: webglKey },
//     { key: 'webglVendorAndRenderer', getData: webglVendorAndRendererKey },
//     { key: 'adBlock', getData: adBlockKey },
//     { key: 'hasLiedLanguages', getData: hasLiedLanguagesKey },
//     { key: 'hasLiedResolution', getData: hasLiedResolutionKey },
//     { key: 'hasLiedOs', getData: hasLiedOsKey },
//     { key: 'hasLiedBrowser', getData: hasLiedBrowserKey },
//     { key: 'touchSupport', getData: touchSupportKey },
//     { key: 'fonts', getData: jsFontsKey, pauseBefore: true },
//     { key: 'fontsFlash', getData: flashFontsKey, pauseBefore: true },
//     { key: 'audio', getData: audioKey },
//     { key: 'enumerateDevices', getData: enumerateDevicesKey }
// ]
