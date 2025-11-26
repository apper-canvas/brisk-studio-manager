async function streamFileToBase64(url, mimeType) {
  try {
    console.log(`Streaming file from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // For Node.js/Bun - stream and convert in chunks
    if (typeof Buffer !== 'undefined' && response.body) {
      const reader = response.body.getReader();
      const chunks = [];
      let totalSize = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        totalSize += value.length;
        
        // Log progress
        console.log(`Downloaded: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      }
      
      // Combine all chunks
      const allChunks = new Uint8Array(totalSize);
      let position = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
      }
      
      const base64String = Buffer.from(allChunks).toString('base64');
      return `data:${mimeType};base64,${base64String}`;
    }
    
    // Fallback for other environments
    const arrayBuffer = await response.arrayBuffer();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );
    return `data:${mimeType};base64,${base64String}`;
    
  } catch (error) {
    console.error('Error streaming file:', error);
    throw new Error(`Failed to stream file: ${error.message}`);
  }
}

apper.serve(async (req) => {
  const data = {
     message: 'Hello World!'
  };
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    }
  });
});