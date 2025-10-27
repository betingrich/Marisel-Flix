// Simple redirect to ZIP file
document.getElementById('downloadBtn').addEventListener('click', function() {
    window.location.href = 'files/app-release (2).zip';
});

// Auto-download function
function autoDownloadZip() {
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'files/app-release.zip';
        link.download = 'app-release.zip';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 1000);
}

// Uncomment for auto-download on page load
// document.addEventListener('DOMContentLoaded', autoDownloadZip);
