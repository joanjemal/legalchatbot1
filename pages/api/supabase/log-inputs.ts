import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

/**
 * API Route: log-inputs
 * Función: log_inputs
 * Descripción: Guarda los inputs estructurados de generación de documentos en la tabla 'messages'
 * Método: POST
 * Body esperado: { chat_id: string, structured_data_json: object }
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
      console.error('❌ [LOG-INPUTS] Missing Supabase configuration');
      return res.status(500).json({
        error: 'Server configuration error: Missing Supabase credentials'
      });
    }

    // Validar el body de la petición
    const { chat_id, structured_data_json } = req.body;

    if (!chat_id || !structured_data_json) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['chat_id', 'structured_data_json']
      });
    }

    // Crear cliente de Supabase con la clave secreta para operaciones de escritura
    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('📝 [LOG-INPUTS] Logging structured inputs for chat:', chat_id);

    // Convertir el objeto structured_data_json a string JSON
    const contentString = JSON.stringify(structured_data_json);

    // Insertar en la tabla 'messages' con role='document_data'
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          chat_id,
          role: 'document_data', // String exacto para marcar los inputs
          content: contentString, // JSON stringificado
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('❌ [LOG-INPUTS] Database error:', error);
      return res.status(500).json({
        error: 'Failed to log inputs',
        details: error.message
      });
    }

    console.log('✅ [LOG-INPUTS] Inputs logged successfully as document_data');

    // Retornar éxito
    return res.status(200).json({
      success: true,
      message: 'Inputs logged as document_data'
    });

  } catch (error) {
    console.error('❌ [LOG-INPUTS] Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

