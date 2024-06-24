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

function convertSqmToSqft() {
    let sqm = parseFloat(document.getElementById("sqmInput").value);
    document.getElementById("sqftInput").value = sqm * 10.7639;
}

function convertSqftToSqm() {
    let sqft = parseFloat(document.getElementById("sqftInput").value);
    document.getElementById("sqmInput").value = sqft / 10.7639;
}

function convertMphToKph() {
    let mph = parseFloat(document.getElementById("mphInput").value);
    document.getElementById("kphInput").value = mph * 1.60934;
}

function convertKphToMph() {
    let kph = parseFloat(document.getElementById("kphInput").value);
    document.getElementById("mphInput").value = kph / 1.60934;
}

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

document.addEventListener("input", function(event) {
    let pixelWidth = parseFloat(document.getElementById("pixelWidth").value);
    let pixelHeight = parseFloat(document.getElementById("pixelHeight").value);
    let aspectWidth = parseFloat(document.getElementById("aspectWidth").value);
    let aspectHeight = parseFloat(document.getElementById("aspectHeight").value);

    let pixelSizeFilled = !isNaN(pixelWidth) && pixelWidth !== 0 && !isNaN(pixelHeight) && pixelHeight !== 0;
    let aspectRatioFilled = !isNaN(aspectWidth) && aspectWidth !== 0 || !isNaN(aspectHeight) && aspectHeight !== 0;

    if (aspectRatioFilled && ["aspectWidth", "aspectHeight"].includes(event.target.id)) {
        if (event.target.id === "aspectWidth") {
            document.getElementById("aspectHeight").value = (aspectWidth / pixelWidth) * pixelHeight;
        } else if (event.target.id === "aspectHeight") {
            document.getElementById("aspectWidth").value = (aspectHeight / pixelHeight) * pixelWidth;
        }
    }
});
