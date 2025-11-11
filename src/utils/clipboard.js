/**
 * Clipboard utility functions for reading and writing clipboard data
 */

/**
 * Read text from clipboard
 * @returns {Promise<string>} The text content from clipboard
 */
export const readTextFromClipboard = async () => {
  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard API not available");
    }
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error("Failed to read from clipboard:", error);
    throw error;
  }
};

/**
 * Write text to clipboard
 * @param {string} text - Text to write to clipboard
 * @returns {Promise<void>}
 */
export const writeTextToClipboard = async (text) => {
  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard API not available");
    }
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Failed to write to clipboard:", error);
    throw error;
  }
};

/**
 * Handle paste event and extract data
 * @param {ClipboardEvent} event - Paste event
 * @returns {Object} Object containing text and files
 */
export const handlePasteEvent = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;

  const result = {
    text: "",
    files: [],
    hasText: false,
    hasFiles: false,
  };

  // Get text data
  if (clipboardData.getData) {
    result.text =
      clipboardData.getData("text/plain") || clipboardData.getData("text");
    result.hasText = !!result.text;
  }

  // Get file data
  if (clipboardData.files && clipboardData.files.length > 0) {
    result.files = Array.from(clipboardData.files);
    result.hasFiles = true;
  }

  return result;
};

/**
 * Check if clipboard API is supported
 * @returns {boolean} True if clipboard API is supported
 */
export const isClipboardSupported = () => {
  return !!(navigator.clipboard && window.isSecureContext);
};
