import apper from "https://cdn.apper.io/actions/apper-actions.js";

export default apper.serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get OpenAI API key from secrets
    const apiKey = await apper.getSecret('OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'OpenAI API key not configured' }),
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
    const { prompt, type = 'chat', model = 'gpt-3.5-turbo', maxTokens = 1000, temperature = 0.7 } = requestData;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Prompt is required and must be a non-empty string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate type parameter
    const validTypes = ['chat', 'completion', 'analysis', 'generation'];
    if (!validTypes.includes(type)) {
      return new Response(
        JSON.stringify({ success: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate numeric parameters
    if (typeof maxTokens !== 'number' || maxTokens < 1 || maxTokens > 4000) {
      return new Response(
        JSON.stringify({ success: false, error: 'maxTokens must be a number between 1 and 4000' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
      return new Response(
        JSON.stringify({ success: false, error: 'temperature must be a number between 0 and 2' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare OpenAI request based on type
    let openAIRequest;
    
    switch (type) {
      case 'chat':
        openAIRequest = {
          model: model,
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: maxTokens,
          temperature: temperature
        };
        break;
        
      case 'completion':
        openAIRequest = {
          model: model === 'gpt-3.5-turbo' ? 'gpt-3.5-turbo-instruct' : model,
          prompt: prompt,
          max_tokens: maxTokens,
          temperature: temperature
        };
        break;
        
      case 'analysis':
        openAIRequest = {
          model: model,
          messages: [
            { 
              role: 'system', 
              content: 'You are an expert analyst. Provide detailed, structured analysis of the given content.' 
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: maxTokens,
          temperature: temperature
        };
        break;
        
      case 'generation':
        openAIRequest = {
          model: model,
          messages: [
            { 
              role: 'system', 
              content: 'You are a creative content generator. Generate high-quality, original content based on the user request.' 
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: maxTokens,
          temperature: temperature
        };
        break;
    }

    // Determine the correct OpenAI endpoint
    const endpoint = (type === 'completion') 
      ? 'https://api.openai.com/v1/completions'
      : 'https://api.openai.com/v1/chat/completions';

    // Make request to OpenAI API
    let openAIResponse;
    try {
      openAIResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(openAIRequest)
      });
    } catch (fetchError) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to connect to OpenAI API',
          details: fetchError.message 
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle OpenAI API response
    if (!openAIResponse.ok) {
      let errorMessage = 'OpenAI API request failed';
      try {
        const errorData = await openAIResponse.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch (parseError) {
        errorMessage = `HTTP ${openAIResponse.status}: ${openAIResponse.statusText}`;
      }

      const statusCode = openAIResponse.status === 429 ? 429 : 
                        openAIResponse.status === 401 ? 401 :
                        openAIResponse.status === 403 ? 403 : 502;

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: errorMessage,
          statusCode: openAIResponse.status
        }),
        { status: statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse successful response
    let responseData;
    try {
      responseData = await openAIResponse.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to parse OpenAI API response' 
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract content based on response type
    let content;
    let usage = responseData.usage;
    
    if (type === 'completion') {
      content = responseData.choices?.[0]?.text?.trim() || '';
    } else {
      content = responseData.choices?.[0]?.message?.content?.trim() || '';
    }

    if (!content) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No content generated by OpenAI API' 
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          content: content,
          type: type,
          model: model,
          usage: usage,
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