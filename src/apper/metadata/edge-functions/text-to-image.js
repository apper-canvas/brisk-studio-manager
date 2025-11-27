import apper from "https://cdn.apper.io/actions/apper-actions.js";

async function generateBase64Image(promptText, apiKey) {
  const url = 'https://clipdrop-api.co/text-to-image/v1';

  // FormData is used for 'multipart/form-data' requests.
  const form = new FormData();
  form.append('prompt', promptText);

  if (!apiKey) {
    console.error("❌ ERROR: apiKey is missing. Please set your environment variable.");
    return null;
  }

  try {
    console.log(`Sending request to Clipdrop for prompt: "${promptText}"`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // Pass the API key for authentication
        'x-api-key': apiKey,
        // NOTE: Content-Type header is typically omitted when using FormData
        // in fetch, letting the runtime set the correct 'multipart/form-data' boundary.
      },
      body: form,
    });

    if (response.ok) {
      // 1. Get the raw image data as an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // --- UNIVERSAL ARRAYBUFFER TO BASE64 CONVERSION ---
      // This replaces the Node-specific Buffer logic.

      // 2. Convert ArrayBuffer to an array of 8-bit unsigned integers
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';

      // 3. Convert Uint8Array to a "binary string" required by btoa
      // We use a chunking technique to avoid stack overflow for very large files.
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk);
      }

      // 4. Encode the binary string to Base64 using the global btoa() function.
      const base64Image = btoa(binary);

      // 5. Prepend the Data URL header (MIME type)
      const dataUrl = `data:image/png;base64,${base64Image}`;

      console.log("✅ Image successfully converted to Base64 Data URL.");
      return dataUrl;

    } else {
      const errorText = await response.text();
      throw new Error(`Clipdrop API Error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Error during image generation:", error);
    return null;
  }
}

export default apper.serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get CLIPDROP API key from secrets
    const apiKey = await apper.getSecret('CLIPDROP_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'CLIPDROP API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    const { prompt, width = 1024, height = 1024 } = requestData;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Prompt is required and must be a non-empty string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate prompt length
    if (prompt.length > 1000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Prompt must be less than 1000 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const base64String = await generateBase64Image(prompt, apiKey);
    const result = await apperClient.storage.uploadFile(
      base64DataUri,
      {
        filename: filename,
        purpose: purpose,
        contentType: contentType
      },
      (progress) => `console.log(Progress: ${progress.toFixed(1)}%)`
    );

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          result: result,
          image: base64String,
          prompt: prompt.trim(),
          width: width,
          height: height,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});