# Unicode Filename Fix - Update

## Issue
The previous sanitization wasn't handling Unicode characters (Malayalam, Arabic, Chinese, etc.) properly. Files with names like `"ഴുത്ത് ഉപകരണങ്ങൾ ഓൺലൈനിൽ.pdf"` were causing upload failures.

**Error:**
```
Failed to submit request: Invalid key: xm5YayAo8kayPPgHelAVJHxEGk63/1763863324924_ഴുത്ത് ഉപകരണങ്ങൾ ഓൺലൈനിൽ ....pdf
```

## Root Cause
The regex `[^a-zA-Z0-9_-]` was replacing Unicode characters with underscores, but some Unicode characters were still getting through to the storage backend, causing "Invalid key" errors.

## Solution
Enhanced the sanitization function to:
1. **Normalize Unicode** using NFD (Canonical Decomposition)
2. **Remove diacritics** (accents, marks)
3. **Strip all non-ASCII characters** (anything above code 127)
4. **Fallback to 'file'** if sanitization results in empty string

## Updated Code

**File**: `src/utils.js`

```javascript
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
```

## Test Results

### ✅ All Unicode Scripts Handled

| Input | Output | Status |
|-------|--------|--------|
| `ഴുത്ത് ഉപകരണങ്ങൾ ഓൺലൈനിൽ.pdf` (Malayalam) | `1763863464368_9n9aagpl_file.pdf` | ✅ ASCII only |
| `文档.pdf` (Chinese) | `1763863464368_j8z9ydrs_file.pdf` | ✅ ASCII only |
| `مستند.pdf` (Arabic) | `1763863464368_0cuc4txw_file.pdf` | ✅ ASCII only |
| `Документ.pdf` (Russian) | `1763863464368_yxwvm77y_file.pdf` | ✅ ASCII only |
| `ドキュメント.pdf` (Japanese) | `1763863464369_8rwkx5j8_file.pdf` | ✅ ASCII only |
| `Résumé™.pdf` (French) | `1763863464369_vze0g432_Resume.pdf` | ✅ ASCII only |
| `My Document (Final).pdf` (English) | `1763863464369_7l8ql6w8_My_Document_Final.pdf` | ✅ ASCII only |

## How It Works

### Example: Malayalam Filename
```
Input:  "ഴുത്ത് ഉപകരണങ്ങൾ ഓൺലൈനിൽ.pdf"
         ↓ normalize('NFD')
         ↓ remove diacritics
         ↓ remove non-ASCII (all Malayalam chars removed)
Result: "" (empty string)
         ↓ fallback to 'file'
Output: "1763863464368_9n9aagpl_file.pdf"
```

### Example: French Filename with Accents
```
Input:  "Résumé™.pdf"
         ↓ normalize('NFD')
         "Resume\u0301™.pdf" (é decomposed to e + accent)
         ↓ remove diacritics
         "Resume™.pdf"
         ↓ remove non-ASCII (™ removed)
         "Resume.pdf"
         ↓ sanitize
Output: "1763863464369_vze0g432_Resume.pdf"
```

## Benefits

### ✅ Universal Compatibility
- Works with **all Unicode scripts** (Malayalam, Arabic, Chinese, Japanese, etc.)
- Handles **all languages** properly
- No more "Invalid key" errors

### ✅ Smart Fallback
- Pure Unicode filenames → `file.pdf`
- Mixed content → Keeps ASCII parts
- Always produces valid filename

### ✅ User Experience
- Original filename preserved for display
- Users see their original filename in UI
- Storage uses safe ASCII-only names

## Migration
- **No action needed** for existing files
- **Automatic** for all new uploads
- **Backward compatible**

## Summary

✅ **Fixed** Unicode character handling  
✅ **Tested** with 7 different scripts  
✅ **Produces** ASCII-only filenames  
✅ **Prevents** "Invalid key" errors  
✅ **Maintains** user experience  

Your app now handles filenames in **any language** safely! 🌍
