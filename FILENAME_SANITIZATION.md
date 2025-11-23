# Filename Sanitization Implementation

## Problem
Uploading files with special characters, spaces, or unsafe characters in filenames can cause issues with:
- Storage backends (Supabase, Firebase, S3, etc.)
- URL encoding problems
- File system compatibility
- Security vulnerabilities

## Solution
Implemented filename sanitization that:
1. **Removes special characters** - Replaces with underscores
2. **Generates unique identifiers** - Uses timestamp + random string (UUID-like)
3. **Preserves original filename** - Stores for display purposes
4. **Maintains file extension** - Keeps .pdf extension intact

## Implementation Details

### New Utility Function
**File**: `src/utils.js`

```javascript
sanitizeFileName(originalFilename)
```

**What it does:**
- Extracts file extension
- Removes special characters (keeps only alphanumeric, underscore, hyphen)
- Replaces spaces with underscores
- Limits filename length to 50 characters
- Generates unique identifier (timestamp + random string)
- Returns safe filename for storage + original filename for display

**Example:**
```javascript
Input:  "My Document (Final) - Copy #2.pdf"
Output: {
  safeFileName: "1732334735123_abc12def_My_Document_Final_Copy_2.pdf",
  originalFileName: "My Document (Final) - Copy #2.pdf",
  extension: ".pdf"
}
```

### Updated Upload Logic
**File**: `src/student.js`

**Before:**
```javascript
const fileName = `${user.uid}/${Date.now()}_${currentFile.name}`;
await supabase.storage.from('pdfs').upload(fileName, currentFile);
```

**After:**
```javascript
const fileInfo = sanitizeFileName(currentFile.name);
const storagePath = `${user.uid}/${fileInfo.safeFileName}`;
await supabase.storage.from('pdfs').upload(storagePath, currentFile);

// Store both filenames in database
await addDoc(collection(db, "requests"), {
  fileName: fileInfo.originalFileName,  // For display
  sanitizedFileName: fileInfo.safeFileName,  // For reference
  pdfPath: storagePath,
  // ... other fields
});
```

## Benefits

### ✅ Security
- Prevents path traversal attacks
- Blocks malicious filenames
- Sanitizes user input

### ✅ Compatibility
- Works across all file systems (Windows, Linux, macOS)
- Compatible with all storage backends
- No URL encoding issues

### ✅ Uniqueness
- Timestamp ensures chronological ordering
- Random string prevents collisions
- UUID-like format (industry standard)

### ✅ User Experience
- Original filename preserved for display
- Users see familiar filenames in UI
- No confusion about file identity

## Files Modified

| File | Changes |
|------|---------|
| [src/utils.js](file:///home/zyx/Downloads/campus-print-service/src/utils.js) | Added `sanitizeFileName()` function |
| [src/student.js](file:///home/zyx/Downloads/campus-print-service/src/student.js) | Updated upload logic to use sanitization |

## Testing

### Test Cases

1. **Special Characters**
   - Input: `"Report@2024!.pdf"`
   - Expected: `"1732334735123_abc12def_Report_2024.pdf"`

2. **Spaces**
   - Input: `"My Document.pdf"`
   - Expected: `"1732334735123_abc12def_My_Document.pdf"`

3. **Unicode Characters**
   - Input: `"Résumé™.pdf"`
   - Expected: `"1732334735123_abc12def_R_sum.pdf"`

4. **Long Filenames**
   - Input: `"Very_Long_Filename_That_Exceeds_Fifty_Characters_Limit.pdf"`
   - Expected: `"1732334735123_abc12def_Very_Long_Filename_That_Exceeds_Fifty_Charac.pdf"`

5. **Multiple Extensions**
   - Input: `"file.backup.pdf"`
   - Expected: `"1732334735123_abc12def_file_backup.pdf"`

### Manual Testing

1. **Upload a file with special characters**
   ```
   Filename: "Test (Final) - Copy #2.pdf"
   ```

2. **Check Supabase Storage**
   - Verify file is stored with sanitized name
   - Verify path: `{userId}/1732334735123_abc12def_Test_Final_Copy_2.pdf`

3. **Check Firestore**
   - Verify `fileName` field shows original name
   - Verify `sanitizedFileName` field shows safe name
   - Verify `pdfPath` uses sanitized name

4. **Check UI Display**
   - Verify "My Requests" shows original filename
   - Verify no display issues

## Database Schema Update

### New Field Added
```javascript
{
  fileName: "Original Name (Display).pdf",  // Original filename
  sanitizedFileName: "1732334735123_abc12def_Original_Name_Display.pdf",  // Safe filename
  pdfPath: "userId/1732334735123_abc12def_Original_Name_Display.pdf",  // Storage path
  // ... other fields
}
```

## Migration Notes

### For Existing Files
Existing files uploaded before this change will:
- Continue to work normally
- Display their original filenames
- Not be automatically renamed

### For New Files
All new uploads will:
- Use sanitized filenames in storage
- Store both original and sanitized names
- Display original filenames to users

## Security Considerations

### What's Protected
✅ Path traversal (`../../../etc/passwd.pdf`)  
✅ Command injection (`file; rm -rf /.pdf`)  
✅ Special characters (`file<>:"|?*.pdf`)  
✅ Unicode exploits  
✅ Null bytes (`file\0.pdf`)  

### Additional Recommendations
1. **File Type Validation** - Already implemented (PDF only)
2. **File Size Limits** - Already implemented (300MB max)
3. **Virus Scanning** - Consider adding for production
4. **Rate Limiting** - Consider adding upload rate limits

## Performance Impact

- **Minimal** - Sanitization happens in-memory
- **Fast** - Simple string operations
- **No latency** - Doesn't affect upload speed

## Rollback Plan

If issues occur, revert by:
1. Restore `src/utils.js` to previous version
2. Restore `src/student.js` upload logic
3. Remove `sanitizedFileName` field from new documents

## Future Enhancements

1. **Admin Dashboard Update**
   - Show both filenames in admin view
   - Add download with original filename

2. **File Download**
   - Serve files with original filename
   - Use Content-Disposition header

3. **Bulk Operations**
   - Sanitize multiple files at once
   - Batch upload support

## Summary

✅ **Implemented** filename sanitization  
✅ **Prevents** special character issues  
✅ **Maintains** user experience  
✅ **Improves** security  
✅ **Ensures** compatibility  

All file uploads now use safe, sanitized filenames while preserving the original filename for display purposes.
