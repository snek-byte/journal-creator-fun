
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const { imageContext, tone, model = 'gpt-4o-mini' } = await req.json()

    if (!imageContext) {
      throw new Error('No image context provided')
    }

    const promptTemplate = tone 
      ? `Create a funny meme caption for an image with the following context or description: "${imageContext}". Make it ${tone} in tone. The caption should be short, witty, and suitable for a meme (top text and bottom text format). Return ONLY a JSON object with two fields: "topText" and "bottomText" without any explanation or additional text.`
      : `Create a funny meme caption for an image with the following context or description: "${imageContext}". The caption should be short, witty, and suitable for a meme (top text and bottom text format). Return ONLY a JSON object with two fields: "topText" and "bottomText" without any explanation or additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a creative and humorous meme caption generator. You create short, witty meme captions based on image contexts. Always respond with only a JSON object containing "topText" and "bottomText" keys.'
          },
          {
            role: 'user',
            content: promptTemplate
          }
        ],
        temperature: 0.8,
        max_tokens: 150,
      }),
    })

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from OpenAI API')
    }

    let caption;
    try {
      const content = data.choices[0].message.content;
      // Try to parse the response as JSON
      caption = JSON.parse(content);
    } catch (e) {
      // If parsing fails, try to extract JSON-like structure from the text
      const content = data.choices[0].message.content;
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          caption = JSON.parse(match[0]);
        } catch (e2) {
          // If all else fails, split the response and create our own structure
          const lines = content.split('\n').filter(line => line.trim().length > 0);
          let topText = '';
          let bottomText = '';
          
          if (lines.length >= 2) {
            topText = lines[0].replace(/^["']|["']$/g, '').replace(/^top(?:\s+text)?:\s*/i, '');
            bottomText = lines[1].replace(/^["']|["']$/g, '').replace(/^bottom(?:\s+text)?:\s*/i, '');
          } else if (lines.length === 1) {
            // If only one line, use it as top text
            topText = lines[0].replace(/^["']|["']$/g, '');
          }
          
          caption = { topText, bottomText };
        }
      } else {
        // Fallback to basic extraction
        const content = data.choices[0].message.content;
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        const topText = lines.length > 0 ? lines[0].replace(/^["']|["']$/g, '') : '';
        const bottomText = lines.length > 1 ? lines[lines.length - 1].replace(/^["']|["']$/g, '') : '';
        caption = { topText, bottomText };
      }
    }

    return new Response(
      JSON.stringify({ 
        caption: caption,
        model: model
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in AI meme generator function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
