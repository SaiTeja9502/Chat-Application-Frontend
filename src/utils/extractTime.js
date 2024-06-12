export function extractTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = padZero(date.getMinutes());
    const amPm = hours >= 12 ? "PM" : "AM"; // Determine whether it's AM or PM
    hours = hours % 12 || 12; // Convert hours to 12-hour format
    hours = padZero(hours); // Pad single-digit hours with leading zero
    return `${hours}:${minutes} ${amPm}`; // Return formatted time with AM/PM
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, "0");
}
