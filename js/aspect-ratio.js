document.addEventListener('DOMContentLoaded', function () {
    const pixelWidthInput = document.getElementById("pixelWidth");
    const pixelHeightInput = document.getElementById("pixelHeight");
    const aspectWidthInput = document.getElementById("aspectWidth");
    const aspectHeightInput = document.getElementById("aspectHeight");
    const aspectRatioBox = document.getElementById("aspect-ratio-box");
    const aspectRatioText = document.getElementById("aspect-ratio-text");
    const maxHeight = 200; // Maximum height for the display box

    // Helper function to calculate the greatest common divisor (GCD)
    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }

    // Function to update the aspect ratio box size and display both simplified and decimal aspect ratios
    function updateAspectRatioBox() {
        const pixelWidth = parseFloat(pixelWidthInput.value);
        const pixelHeight = parseFloat(pixelHeightInput.value);

        if (!isNaN(pixelWidth) && !isNaN(pixelHeight) && pixelWidth > 0 && pixelHeight > 0) {
            const ratio = pixelWidth / pixelHeight;

            // Calculate the GCD of the width and height to simplify the ratio
            const divisor = gcd(pixelWidth, pixelHeight);
            const simplifiedWidth = pixelWidth / divisor;
            const simplifiedHeight = pixelHeight / divisor;

            // Update the aspect ratio text in the center of the box with the simplified and decimal ratio
            aspectRatioText.textContent = `${simplifiedWidth}:${simplifiedHeight} (${formatNumber(ratio)}:1)`;

            if (pixelHeight > maxHeight) {
                // Height exceeds maxHeight, adjust width accordingly
                aspectRatioBox.style.height = maxHeight + "px";
                aspectRatioBox.style.width = (maxHeight * ratio) + "px";
            } else {
                // Set normal dimensions
                aspectRatioBox.style.height = pixelHeight + "px";
                aspectRatioBox.style.width = pixelWidth + "px";
            }
        } else {
            // Reset box to default size and clear text if inputs are invalid
            aspectRatioBox.style.width = "100px";
            aspectRatioBox.style.height = "100px";
            aspectRatioText.textContent = "";
        }
    }

    // Helper function to format numbers and omit .00 if it's a whole number
    function formatNumber(value) {
        return value % 1 === 0 ? value.toString() : value.toFixed(2);
    }

    // Function to update aspect height when aspect width is changed
    function updateAspectHeightFromWidth() {
        const pixelWidth = parseFloat(pixelWidthInput.value);
        const pixelHeight = parseFloat(pixelHeightInput.value);
        const aspectWidth = parseFloat(aspectWidthInput.value);

        if (!isNaN(pixelWidth) && !isNaN(pixelHeight) && !isNaN(aspectWidth) && pixelWidth > 0 && pixelHeight > 0 && aspectWidth > 0) {
            // Calculate and update aspect height
            const aspectHeight = (aspectWidth / pixelWidth) * pixelHeight;
            aspectHeightInput.value = formatNumber(aspectHeight);
            updateAspectRatioBox();
        }
    }

    // Function to update aspect width when aspect height is changed
    function updateAspectWidthFromHeight() {
        const pixelWidth = parseFloat(pixelWidthInput.value);
        const pixelHeight = parseFloat(pixelHeightInput.value);
        const aspectHeight = parseFloat(aspectHeightInput.value);

        if (!isNaN(pixelWidth) && !isNaN(pixelHeight) && !isNaN(aspectHeight) && pixelWidth > 0 && pixelHeight > 0 && aspectHeight > 0) {
            // Calculate and update aspect width
            const aspectWidth = (aspectHeight / pixelHeight) * pixelWidth;
            aspectWidthInput.value = formatNumber(aspectWidth);
            updateAspectRatioBox();
        }
    }

    // Event listeners for the aspect width and height inputs
    aspectWidthInput.addEventListener('input', updateAspectHeightFromWidth);
    aspectHeightInput.addEventListener('input', updateAspectWidthFromHeight);

    // Event listeners to trigger aspect ratio box update when pixel width or height changes
    pixelWidthInput.addEventListener('input', function () {
        updateAspectHeightFromWidth();
        updateAspectRatioBox();
    });

    pixelHeightInput.addEventListener('input', function () {
        updateAspectHeightFromWidth();
        updateAspectRatioBox();
    });

    // Initialize with default values
    updateAspectRatioBox();
});