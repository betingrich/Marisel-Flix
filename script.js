document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');
    const openDriveBtn = document.getElementById('openDriveBtn');
    const directLink = document.getElementById('directLink');
    const statusMessage = document.getElementById('statusMessage');

    // Google Drive file ID from your link
    const FILE_ID = '1xlgBt350U5xLTxA0eXbbTuGr9XAaHvH_';
    
    // Different Google Drive URL formats
    const driveUrls = {
        direct: `https://drive.google.com/uc?export=download&id=${FILE_ID}`,
        confirm: `https://drive.google.com/uc?export=download&confirm=t&id=${FILE_ID}`,
        view: `https://drive.google.com/file/d/${FILE_ID}/view`,
        directDownload: `https://drive.google.com/uc?export=download&confirm=no_antivirus&id=${FILE_ID}`
    };

    // Method 1: Direct download attempt
    downloadBtn.addEventListener('click', function() {
        attemptDirectDownload();
    });

    // Method 2: Open Drive page
    openDriveBtn.addEventListener('click', function() {
        window.open(driveUrls.view, '_blank');
        showStatus('Open the Google Drive page and click the download button (top right)', 'success');
    });

    // Method 3: Direct link (already set up in HTML)
    directLink.addEventListener('click', function(e) {
        showStatus('You may need to click "Download anyway" on the Google Drive page', 'success');
    });

    function attemptDirectDownload() {
        showStatus('Attempting to download...', 'success');
        
        // Try multiple methods
        const downloadMethods = [
            driveUrls.confirm,
            driveUrls.directDownload,
            driveUrls.direct
        ];

        let currentMethod = 0;
        
        function tryNextMethod() {
            if (currentMethod >= downloadMethods.length) {
                showStatus('All download methods failed. Please use the "Open Google Drive Page" button.', 'error');
                return;
            }

            const url = downloadMethods[currentMethod];
            showStatus(`Trying download method ${currentMethod + 1}...`, 'success');
            
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);

            // Wait and try next method if needed
            setTimeout(() => {
                document.body.removeChild(iframe);
                currentMethod++;
                tryNextMethod();
            }, 3000);
        }

        tryNextMethod();
    }

    // Advanced method using fetch (may not work due to CORS)
    async function advancedDownload() {
        try {
            showStatus('Starting advanced download...', 'success');
            
            // This may fail due to CORS, but worth trying
            const response = await fetch(driveUrls.direct, {
                mode: 'no-cors',
                method: 'GET'
            });
            
            // If we get here, create blob download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'my-app.apk';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showStatus('Download started successfully!', 'success');
            
        } catch (error) {
            console.error('Advanced download failed:', error);
            showStatus('Advanced download failed. Trying alternative methods...', 'error');
            // Fall back to iframe method
            attemptDirectDownload();
        }
    }

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message ' + type;
        statusMessage.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Add a service worker approach for more reliable downloads
    function initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered');
                })
                .catch(error => {
                    console.log('Service Worker registration failed');
                });
        }
    }

    // Initialize
    initializeServiceWorker();
});
