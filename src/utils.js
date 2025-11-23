export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN');
};

/**
 * Sanitizes a filename by removing special characters and generating a safe storage name
 * @param {string} originalFilename - The original filename from user upload
 * @returns {object} - Object containing sanitized filename and extension
 */
export const sanitizeFileName = (originalFilename) => {
    // Extract file extension
    const lastDotIndex = originalFilename.lastIndexOf('.');
    const extension = lastDotIndex !== -1 ? originalFilename.substring(lastDotIndex) : '';
    const nameWithoutExt = lastDotIndex !== -1 ? originalFilename.substring(0, lastDotIndex) : originalFilename;

    // Convert to ASCII and remove all non-ASCII characters
    // This handles Unicode characters (Arabic, Malayalam, Chinese, etc.)
    let sanitizedName = nameWithoutExt
        // Normalize Unicode characters
        .normalize('NFD')
        // Remove diacritics and accents
        .replace(/[\u0300-\u036f]/g, '')
        // Remove all non-ASCII characters (anything above code 127)
        .replace(/[^\x00-\x7F]/g, '')
        // Keep only alphanumeric, underscores, hyphens, and spaces
        .replace(/[^a-zA-Z0-9_\-\s]/g, '_')
        // Replace multiple spaces/underscores with single underscore
        .replace(/[\s_]+/g, '_')
        // Remove leading/trailing underscores
        .replace(/^_+|_+$/g, '')
        // Limit length to 50 chars
        .substring(0, 50)
        // Remove trailing underscores again after substring
        .replace(/_+$/g, '');

    // If sanitization results in empty string, use 'file' as fallback
    if (!sanitizedName || sanitizedName.length === 0) {
        sanitizedName = 'file';
    }

    // Generate UUID-like unique identifier
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const uniqueId = `${timestamp}_${randomStr}`;

    return {
        // Safe filename for storage: uuid_sanitizedname.ext
        safeFileName: `${uniqueId}_${sanitizedName}${extension}`,
        // Original filename for display
        originalFileName: originalFilename,
        // Extension
        extension: extension
    };
};
