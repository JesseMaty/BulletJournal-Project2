/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('errorAlertMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  document.getElementById('errorAlertMessage').classList.add('hidden');

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  // Callback handler function for handling requests
  if (handler) {
    handler(result);
  }
};

// Hide the error pop-up
const hideError = () => {
  document.getElementById('errorAlertMessage').classList.add('hidden');
}

// Gets a contrasting color based on percieved luminance
// Code adapted from:
// https://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
const contrastColor = (hexColor) => {

  // Converts hex to rgb and returns a 3-component object with R,G,B or null
  // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const { r, g, b } = hexToRgb(hexColor)

  let contrast = 0;

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (luminance > 0.5)
    contrast = 0; // black font for bright colors
  else
    contrast = 255; // white font for dark colors

  // Convert back to hex
  const valueToHex = (v) => {
    const hex = v.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  const value = valueToHex(contrast);
  return '#' + value + value + value;
};



module.exports = {
  handleError,
  sendPost,
  hideError,
  contrastColor,
};
