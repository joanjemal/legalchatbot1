import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { logChatInteraction } from '@/lib/supabase/logService';

// Inicializar OpenAI con la API key desde variables de entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parsear el body de la petición
    const { messages } = await request.json();
    
    // Validar que messages existe y es un array
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Validar que hay al menos un mensaje
    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'At least one message is required' },
        { status: 400 }
      );
    }

    // Extraer el último mensaje del usuario para el logging
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.role === 'user');
    
    const userQuery = lastUserMessage?.content || 'No query provided';
    
    // Enhanced logging for chat request
    const requestId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`🚀 [CHAT] [${requestId}] New chat request received`);
    console.log(`🚀 [CHAT] [${requestId}] Messages count: ${messages.length}`);
    console.log(`🚀 [CHAT] [${requestId}] User query: ${userQuery.substring(0, 100)}${userQuery.length > 100 ? '...' : ''}`);
    console.log(`🚀 [CHAT] [${requestId}] Request timestamp: ${new Date().toISOString()}`);

    // Llamar a la API de OpenAI
    console.log(`🤖 [CHAT] [${requestId}] Calling OpenAI API...`);
    const openaiStartTime = Date.now();
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant with access to current information. You can help with a wide range of topics including current events, technology, science, and general knowledge. Provide detailed, accurate, and helpful responses.'
        },
        ...messages
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: false,
    });
    
    const openaiEndTime = Date.now();
    const openaiDuration = openaiEndTime - openaiStartTime;
    console.log(`✅ [CHAT] [${requestId}] OpenAI API call completed in ${openaiDuration}ms`);

    // Extraer la respuesta
    const response = completion.choices[0]?.message?.content;

    if (!response) {
      console.error(`❌ [CHAT] [${requestId}] No response from OpenAI`);
      throw new Error('No response from OpenAI');
    }

    console.log(`📝 [CHAT] [${requestId}] Response received (${response.length} chars)`);
    console.log(`📝 [CHAT] [${requestId}] Response preview: ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}`);
    console.log(`📝 [CHAT] [${requestId}] Usage stats:`, completion.usage);

    // Guardar la interacción en Supabase (sin bloquear la respuesta)
    console.log(`💾 [CHAT] [${requestId}] Starting Supabase logging process...`);
    const logStartTime = Date.now();
    
    logChatInteraction(userQuery, response)
      .then((logData) => {
        const logEndTime = Date.now();
        const logDuration = logEndTime - logStartTime;
        console.log(`✅ [CHAT] [${requestId}] Chat interaction logged successfully in ${logDuration}ms`);
        console.log(`✅ [CHAT] [${requestId}] Log data:`, logData);
      })
      .catch((logError) => {
        const logEndTime = Date.now();
        const logDuration = logEndTime - logStartTime;
        console.error(`❌ [CHAT] [${requestId}] Failed to log chat interaction after ${logDuration}ms:`, logError);
        console.error(`❌ [CHAT] [${requestId}] Log error details:`, {
          error: logError instanceof Error ? logError.message : String(logError),
          stack: logError instanceof Error ? logError.stack : 'No stack trace'
        });
      });

    // Retornar la respuesta exitosa
    const totalEndTime = Date.now();
    const totalDuration = totalEndTime - openaiStartTime;
    console.log(`🎉 [CHAT] [${requestId}] Request completed successfully in ${totalDuration}ms`);
    console.log(`🎉 [CHAT] [${requestId}] Returning response to client`);
    
    return NextResponse.json({
      message: response,
      usage: completion.usage
    });

  } catch (error) {
    const errorRequestId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.error(`❌ [CHAT] [${errorRequestId}] OpenAI API error occurred`);
    console.error(`❌ [CHAT] [${errorRequestId}] Error type:`, error?.constructor?.name || 'Unknown');
    console.error(`❌ [CHAT] [${errorRequestId}] Error message:`, error instanceof Error ? error.message : String(error));
    console.error(`❌ [CHAT] [${errorRequestId}] Stack trace:`, error instanceof Error ? error.stack : 'No stack trace');
    console.error(`❌ [CHAT] [${errorRequestId}] Full error object:`, error);
    
    // Manejar errores específicos de cuota
    if (error instanceof Error && error.message.includes('quota')) {
      console.error(`❌ [CHAT] [${errorRequestId}] Quota exceeded error detected`);
      return NextResponse.json(
        {
          error: 'OpenAI API quota exceeded. Please check your API key and billing details.',
          quota_exceeded: true
        },
        { status: 429 }
      );
    }

    // Manejar errores de API key inválida
    if (error instanceof Error && error.message.includes('api_key')) {
      console.error(`❌ [CHAT] [${errorRequestId}] Invalid API key error detected`);
      return NextResponse.json(
        {
          error: 'Invalid OpenAI API key. Please check your configuration.',
          invalid_key: true
        },
        { status: 401 }
      );
    }

    // Error genérico
    console.error(`❌ [CHAT] [${errorRequestId}] Generic error - returning 500 status`);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
