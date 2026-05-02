// ╔═════════════════════════════════════════════════════════════════════════╗
// ║                    REMOTE ADS CONFIGURATION FILE                      ║
// ║                                                                       ║
// ║   Edit this file to update ads across all connected websites.         ║
// ║   Set ON = false to disable any specific ad unit.                     ║
// ╚═════════════════════════════════════════════════════════════════════════╝

// =========================================================================
// ⚙️  AD CODES — ONLY CHANGE THE VALUES BELOW Updated
// =========================================================================

// 2️⃣ TOP BANNER — DESKTOP (728x90)
var BANNER_DESKTOP_ON = true;
var BANNER_DESKTOP_CODE = `
<script>
  atOptions = {
    'key' : 'ab33a70d5ba163b6913cee19036eb2ad',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://marksdespitelinear.com/ab33a70d5ba163b6913cee19036eb2ad/invoke.js"></script>
`;

// 3️⃣ TOP BANNER — MOBILE (320x50) 
var BANNER_MOBILE_ON = true;
var BANNER_MOBILE_CODE = `
<script>
  atOptions = {
    'key' : '16ddedc7dce08ba8c96db98ae88010f8',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://marksdespitelinear.com/16ddedc7dce08ba8c96db98ae88010f8/invoke.js"></script>
`;

// 4️⃣ SIDEBAR AD 1 (300x250)
var SIDEBAR_1_ON = true;
var SIDEBAR_1_CODE = `
<script>
  atOptions = {
    'key' : '139e79bacf83c0bce7c111945c083552',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://marksdespitelinear.com/139e79bacf83c0bce7c111945c083552/invoke.js"></script>
`;

// 5️⃣ SIDEBAR AD 2 (160x300)
var SIDEBAR_2_ON = true;
var SIDEBAR_2_CODE = `
<script>
  atOptions = {
    'key' : '0306c344716b8f4513e3a0bb308f5a14',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://marksdespitelinear.com/0306c344716b8f4513e3a0bb308f5a14/invoke.js"></script>
`;

// 6️⃣ STICKY BOTTOM — DESKTOP (728x90) (Uses Top Banner Desktop Code)
var STICKY_DESKTOP_ON = true;

// 7️⃣ STICKY BOTTOM — MOBILE (320x50) (Uses Top Banner Mobile Code)
var STICKY_MOBILE_ON = true;


// =========================================================================
// 🔧  DO NOT MODIFY THE CODE BELOW! (Injection Logic)
// =========================================================================

function initAds() {
    var adQueue = [];

    function queueAd(containerId, htmlContent, isOn) {
        if (!isOn || !htmlContent) return;
        adQueue.push({ containerId: containerId, htmlContent: htmlContent });
    }

    async function processQueue() {
        for (let i = 0; i < adQueue.length; i++) {
            await injectAdPromise(adQueue[i].containerId, adQueue[i].htmlContent);
        }
        
    }

    // Sequentially injects ads to prevent global 'atOptions' conflicts
    function injectAdPromise(containerId, htmlContent) {
        return new Promise((resolve) => {
            var container = document.getElementById(containerId);
            if (!container) {
                resolve();
                return;
            }

            var temp = document.createElement('div');
            temp.innerHTML = htmlContent.trim();
            
            var scriptsToLoad = 0;
            var scriptsLoaded = 0;

            var originalWrite = document.write;
            var originalWriteln = document.writeln;

            function checkDone() {
                if (scriptsLoaded >= scriptsToLoad) {
                    // Restore document.write after this ad is loaded
                    document.write = originalWrite;
                    document.writeln = originalWriteln;
                    resolve();
                }
            }

            // Hijack document.write so ad networks don't overwrite the entire page
            document.write = function(content) {
                var writeTemp = document.createElement('div');
                writeTemp.innerHTML = content;
                while (writeTemp.firstChild) {
                    container.appendChild(writeTemp.firstChild);
                }
            };
            document.writeln = function(content) {
                document.write(content + '\\n');
            };

            var children = Array.from(temp.childNodes);
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                if (child.tagName === 'SCRIPT') {
                    let newScript = document.createElement('script');
                    Array.from(child.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    
                    if (child.src) {
                        scriptsToLoad++;
                        newScript.onload = () => { scriptsLoaded++; checkDone(); };
                        newScript.onerror = () => { scriptsLoaded++; checkDone(); };
                        container.appendChild(newScript);
                    } else if (child.innerHTML) {
                        newScript.innerHTML = child.innerHTML;
                        container.appendChild(newScript);
                    }
                } else {
                    container.appendChild(child);
                }
            }
            
            if (scriptsToLoad === 0) {
                document.write = originalWrite;
                document.writeln = originalWriteln;
                resolve();
            }
        });
    }

    function injectScriptDirectly(containerId, htmlContent, isOn) {
        if (!isOn || !htmlContent) return;
        var container = containerId ? document.getElementById(containerId) : document.head;
        if (!container) return;

        var temp = document.createElement('div');
        temp.innerHTML = htmlContent.trim();
        
        Array.from(temp.childNodes).forEach(child => {
            if (child.tagName === 'SCRIPT') {
                var newScript = document.createElement('script');
                Array.from(child.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                if (child.innerHTML) newScript.innerHTML = child.innerHTML;
                container.appendChild(newScript);
            } else {
                container.appendChild(child);
            }
        });
    }

    // Queue up all banner/widget ads
    queueAd('ad-banner-desktop', BANNER_DESKTOP_CODE, BANNER_DESKTOP_ON);
    queueAd('ad-banner-mobile', BANNER_MOBILE_CODE, BANNER_MOBILE_ON);
    queueAd('ad-sidebar-1', SIDEBAR_1_CODE, SIDEBAR_1_ON);
    queueAd('ad-sidebar-2', SIDEBAR_2_CODE, SIDEBAR_2_ON);
    queueAd('ad-sticky-desktop', BANNER_DESKTOP_CODE, STICKY_DESKTOP_ON);
    queueAd('ad-sticky-mobile', BANNER_MOBILE_CODE, STICKY_MOBILE_ON);

    // Start sequential processing
    processQueue();
}

// Ensure the code runs regardless of when it's loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAds);
} else {
    initAds();
}
