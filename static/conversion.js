// Length Conversion Functions
function convertCmToM() {
    let cm = parseFloat(document.getElementById("cmInput").value);
    document.getElementById("mInput").value = cm / 100;
}

function convertMToCm() {
    let m = parseFloat(document.getElementById("mInput").value);
    document.getElementById("cmInput").value = m * 100;
}

function convertInchesToCm() {
    let inches = parseFloat(document.getElementById("inchesInput").value);
    document.getElementById("cmInchesInput").value = inches * 2.54;
}

function convertCmToInches() {
    let cm = parseFloat(document.getElementById("cmInchesInput").value);
    document.getElementById("inchesInput").value = cm / 2.54;
}

function convertFeetToMeters() {
    let feet = parseFloat(document.getElementById("feetInput").value);
    document.getElementById("metersInput").value = feet * 0.3048;
}

function convertMetersToFeet() {
    let meters = parseFloat(document.getElementById("metersInput").value);
    document.getElementById("feetInput").value = meters / 0.3048;
}

// Weight Conversion Functions
function convertOuncesToGrams() {
    let ounces = parseFloat(document.getElementById("ouncesInput").value);
    document.getElementById("gramsInput").value = ounces * 28.3495;
}

function convertGramsToOunces() {
    let grams = parseFloat(document.getElementById("gramsInput").value);
    document.getElementById("ouncesInput").value = grams / 28.3495;
}

function convertPoundsToKg() {
    let pounds = parseFloat(document.getElementById("poundsInput").value);
    document.getElementById("kgInput").value = pounds * 0.453592;
}

function convertKgToPounds() {
    let kg = parseFloat(document.getElementById("kgInput").value);
    document.getElementById("poundsInput").value = kg / 0.453592;
}

// Area Conversion Functions
function convertSqmToSqft() {
    let sqm = parseFloat(document.getElementById("sqmInput").value);
    document.getElementById("sqftInput").value = sqm * 10.7639;
}

function convertSqftToSqm() {
    let sqft = parseFloat(document.getElementById("sqftInput").value);
    document.getElementById("sqmInput").value = sqft / 10.7639;
}

// Speed Conversion Functions
function convertMphToKph() {
    let mph = parseFloat(document.getElementById("mphInput").value);
    document.getElementById("kphInput").value = mph * 1.60934;
}

function convertKphToMph() {
    let kph = parseFloat(document.getElementById("kphInput").value);
    document.getElementById("mphInput").value = kph / 1.60934;
}

// Time Conversion Functions
function convertMinutesToSeconds() {
    let minutes = parseFloat(document.getElementById("minutesInput").value);
    document.getElementById("secondsInput").value = minutes * 60;
}

function convertSecondsToMinutes() {
    let seconds = parseFloat(document.getElementById("secondsInput").value);
    document.getElementById("minutesInput").value = seconds / 60;
}

function convertHoursToMinutes() {
    let hours = parseFloat(document.getElementById("hoursInput").value);
    document.getElementById("hoursMinutesInput").value = hours * 60;
}

function convertMinutesToHours() {
    let minutes = parseFloat(document.getElementById("hoursMinutesInput").value);
    document.getElementById("hoursInput").value = minutes / 60;
}

function convertDaysToHours() {
    let days = parseFloat(document.getElementById("daysInput").value);
    document.getElementById("daysHoursInput").value = days * 24;
}

function convertHoursToDays() {
    let hours = parseFloat(document.getElementById("daysHoursInput").value);
    document.getElementById("daysInput").value = hours / 24;
}
// Function to find Greatest Common Divisor (GCD)
function gcd(a, b) {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

document.addEventListener("input", function(event) {
    let pixelWidth = parseFloat(document.getElementById("pixelWidth").value);
    let pixelHeight = parseFloat(document.getElementById("pixelHeight").value);
    let aspectWidth = parseFloat(document.getElementById("aspectWidth").value);
    let aspectHeight = parseFloat(document.getElementById("aspectHeight").value);
    
    // Check if both inputs in one of the sections are filled and not 0
    let pixelSizeFilled = !isNaN(pixelWidth) && pixelWidth !== 0 && !isNaN(pixelHeight) && pixelHeight !== 0;
    let aspectRatioFilled = !isNaN(aspectWidth) && aspectWidth !== 0 && !isNaN(aspectHeight) && aspectHeight !== 0;

    if (pixelSizeFilled && ["pixelWidth", "pixelHeight"].includes(event.target.id)) {
        // If Pixel Size section is changed, update Aspect Ratio section
        const gcdValue = gcd(pixelWidth, pixelHeight);
        document.getElementById("aspectWidth").value = pixelWidth / gcdValue;
        document.getElementById("aspectHeight").value = pixelHeight / gcdValue;
    } else if (aspectRatioFilled && ["aspectWidth", "aspectHeight"].includes(event.target.id)) {
        // If Aspect Ratio section is changed, update Pixel Size section
        // Assuming you want to keep one dimension constant. Here I'm keeping pixelWidth constant.
        document.getElementById("pixelHeight").value = (pixelWidth / aspectWidth) * aspectHeight;
    }
});