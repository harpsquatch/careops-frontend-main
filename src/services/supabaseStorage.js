/**
 * Upload a file to Supabase Storage.
 *
 * Bucket: patient-avatars
 * Requires env vars:
 *   REACT_APP_SUPABASE_URL   – e.g. https://sykoniyfqdaggmtcarkr.supabase.co
 *   REACT_APP_SUPABASE_ANON_KEY – public anon key
 */

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://sykoniyfqdaggmtcarkr.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5a29uaXlmcWRhZ2dtdGNhcmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMDczMTcsImV4cCI6MjA3Mjg4MzMxN30.7O9pKKN4Toyrbx3bDjZnq4U88MRy357FxnbIbErZ-aw';
const BUCKET = 'patient-avatars';

/**
 * Try to create the bucket if it doesn't exist (may fail if anon key lacks permissions).
 */
async function ensureBucketExists() {
    try {
        const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: BUCKET,
                public: true,
            }),
        });
        // Ignore errors - bucket might already exist or we lack permissions
    } catch (err) {
        // Silently fail - user will need to create bucket manually
    }
}

/**
 * Upload a file to Supabase storage and return its public URL.
 * @param {File} file – the image File object
 * @param {string} folder – optional subfolder (e.g. patient id)
 * @returns {Promise<string>} – public URL of the uploaded file
 */
export async function uploadAvatar(file, folder = '') {
    if (!SUPABASE_ANON_KEY) {
        throw new Error('REACT_APP_SUPABASE_ANON_KEY is not set');
    }

    const ext = file.name.split('.').pop();
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}.${ext}`;

    // Determine content type from file
    const contentType = file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`;

    const res = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': contentType,
                'x-upsert': 'true',
            },
            body: file,
        }
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
        const errorMsg = err.message || err.error || 'Upload failed';
        
        // If bucket not found, provide helpful message
        if (errorMsg.includes('not found') || errorMsg.includes('Bucket') || res.status === 404) {
            throw new Error(
                `Bucket "${BUCKET}" not found. Please create it in Supabase Dashboard:\n` +
                `1. Go to https://supabase.com/dashboard\n` +
                `2. Select your project\n` +
                `3. Go to Storage → New bucket\n` +
                `4. Name: ${BUCKET}, set to Public\n` +
                `5. Create bucket`
            );
        }
        
        throw new Error(errorMsg);
    }

    // Public URL
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
}

