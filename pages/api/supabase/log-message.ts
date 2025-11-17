import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

/**
 * API Route: log-message
 * Función: log_message
 * Descripción: Inserta un mensaje en la tabla 'messages'
 * Método: POST
 * Body esperado: { chat_id: string, role: string, content: string }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Solo aceptar peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Validar variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      console.error('❌ [LOG-MESSAGE] Missing Supabase configuration');
      return res.status(500).json({
        error: 'Server configuration error: Missing Supabase credentials'
      });
    }

    // Validar el body de la petición
    const { chat_id, role, content } = req.body;

    if (!chat_id || !role || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['chat_id', 'role', 'content']
      });
    }

    // Crear cliente de Supabase con la clave secreta para operaciones de escritura
    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('📝 [LOG-MESSAGE] Logging message for chat:', chat_id);

    // Insertar el mensaje en la tabla 'messages'
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          chat_id,
          role,
          content,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('❌ [LOG-MESSAGE] Database error:', error);
      return res.status(500).json({
        error: 'Failed to log message',
        details: error.message
      });
    }

    console.log('✅ [LOG-MESSAGE] Message logged successfully');

    // Retornar éxito
    return res.status(200).json({
      success: true,
      message: 'Message logged'
    });

  } catch (error) {
    console.error('❌ [LOG-MESSAGE] Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

