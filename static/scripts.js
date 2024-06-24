document.addEventListener("DOMContentLoaded", function () {
    initializeSocket();  // Initialize socket connection on page load
});

let socket;

function initializeSocket() {
    socket = io.connect(window.location.href);

    socket.on('connect', function() {
        console.log('Socket connected');
    });

    socket.on('disconnect', function() {
        console.log('Socket disconnected');
    });

    socket.on('download_progress', function(data) {
        console.log("Download progress event received");
        document.getElementById('progress-message').innerText = "Downloading, wait!";
    });

    socket.on('download_complete', function(data) {
        console.log("Download complete event received, file name:", data.file_name);
        document.getElementById('progress-message').innerText = "Done";
        window.location.href = '/download?file=' + encodeURIComponent(data.file_name);
        resetForm(); // Reset the form after download is complete
    });

    socket.on('error', function(error) {
        console.error("Socket error:", error);
    });
}

document.getElementById('download-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    console.log("Form submitted with URL:", url);
    document.getElementById('progress-message').innerText = "Download started";
    socket.emit('download_video', { url: url });
});

// Initialize socket connection
initializeSocket();
