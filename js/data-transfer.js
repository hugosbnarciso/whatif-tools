// Conversion factors to bytes
const sizeMultipliers = {
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
};

const speedMultipliers = {
    'kB/s': 1024,
    'MB/s': 1024 * 1024,
    'GB/s': 1024 * 1024 * 1024,
    'Mbit/s': 1024 * 1024 / 8
};

// Get DOM elements
const fileSize = document.getElementById('fileSize');
const fileSizeUnit = document.getElementById('fileSizeUnit');
const transferSpeed = document.getElementById('transferSpeed');
const transferSpeedUnit = document.getElementById('transferSpeedUnit');
const timeResult = document.getElementById('timeResult');

function calculateTime() {
    // Get current values
    const size = parseFloat(fileSize.value) || 0;
    const speed = parseFloat(transferSpeed.value) || 0;

    if (size <= 0 || speed <= 0) {
        timeResult.textContent = 'Please enter valid values';
        return;
    }

    // Convert to bytes
    const sizeInBytes = size * sizeMultipliers[fileSizeUnit.value];
    const speedInBytesPerSecond = speed * speedMultipliers[transferSpeedUnit.value];

    // Calculate total seconds
    const totalSeconds = sizeInBytes / speedInBytesPerSecond;

    // Convert to days, hours, minutes, seconds
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Format the result string
    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    result += `${seconds}s`;

    timeResult.textContent = result;
}

// Add event listeners for all inputs
fileSize.addEventListener('input', calculateTime);
fileSizeUnit.addEventListener('change', calculateTime);
transferSpeed.addEventListener('input', calculateTime);
transferSpeedUnit.addEventListener('change', calculateTime);

// Initial calculation
calculateTime();