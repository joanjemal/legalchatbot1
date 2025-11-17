import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API Route: generate-doc
 * Función: generate_document
 * Descripción: Simula la generación de un documento y devuelve una URL de ejemplo
 * Método: POST
 * Body esperado: { inputs_json: object }
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
    // Validar el body de la petición (opcional, pero recomendado)
    const { inputs_json } = req.body;

    console.log('📄 [GENERATE-DOC] Document generation request received');
    
    if (inputs_json) {
      console.log('📄 [GENERATE-DOC] Inputs received:', JSON.stringify(inputs_json).substring(0, 200));
    }

    // Simular la generación de documento
    // En una implementación real, aquí se generaría el PDF/documento
    // Por ahora, simplemente devolvemos una URL de ejemplo
    const documentUrl = 'https://www.spanishdict.com/translate/ejemplo';

    console.log('✅ [GENERATE-DOC] Document URL generated:', documentUrl);

    // Retornar la URL del documento
    return res.status(200).json({
      document_url: documentUrl
    });

  } catch (error) {
    console.error('❌ [GENERATE-DOC] Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

