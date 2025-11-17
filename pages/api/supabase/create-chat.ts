import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

/**
 * API Route: create-chat
 * Función: create_chat_session
 * Descripción: Inserta una nueva fila vacía en la tabla 'chats'
 * Método: POST
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
      console.error('❌ [CREATE-CHAT] Missing Supabase configuration');
      return res.status(500).json({
        error: 'Server configuration error: Missing Supabase credentials'
      });
    }

    // Crear cliente de Supabase con la clave secreta para operaciones de escritura
    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('📝 [CREATE-CHAT] Creating new chat session...');

    // Insertar una nueva fila vacía en la tabla 'chats'
    const { data, error } = await supabase
      .from('chats')
      .insert([{}])
      .select('id')
      .single();

    if (error) {
      console.error('❌ [CREATE-CHAT] Database error:', error);
      return res.status(500).json({
        error: 'Failed to create chat session',
        details: error.message
      });
    }

    console.log('✅ [CREATE-CHAT] Chat session created:', data.id);

    // Retornar el ID de la nueva fila
    return res.status(200).json({
      chat_id: data.id
    });

  } catch (error) {
    console.error('❌ [CREATE-CHAT] Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

