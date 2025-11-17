import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Enhanced initialization logging
console.log('🔧 [SUPABASE] Initializing Supabase client...');
console.log('🔧 [SUPABASE] URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
console.log('🔧 [SUPABASE] Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [SUPABASE] Missing required environment variables');
  console.error('❌ [SUPABASE] Please create a .env.local file with:');
  console.error('❌ [SUPABASE] NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('❌ [SUPABASE] NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('❌ [SUPABASE] OPENAI_API_KEY=your_openai_api_key');
  throw new Error('Supabase configuration is incomplete - missing environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection on initialization
console.log('🔧 [SUPABASE] Testing connection...');
(async () => {
  try {
    const { error } = await supabase.from('chatbot_logs').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('❌ [SUPABASE] Connection test failed:', error.message);
    } else {
      console.log('✅ [SUPABASE] Connection test successful');
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('❌ [SUPABASE] Connection test error:', errorMessage);
  }
})();

export async function logChatInteraction(query: string, response: string) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();
  
  console.log(`📝 [SUPABASE] [${requestId}] Starting chat interaction logging...`);
  console.log(`📝 [SUPABASE] [${requestId}] Query length: ${query.length} chars`);
  console.log(`📝 [SUPABASE] [${requestId}] Response length: ${response.length} chars`);
  console.log(`📝 [SUPABASE] [${requestId}] Query preview: ${query.substring(0, 100)}${query.length > 100 ? '...' : ''}`);
  console.log(`📝 [SUPABASE] [${requestId}] Response preview: ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}`);
  
  // Data validation
  if (!query || !response) {
    const error = new Error('Invalid data: query and response are required');
    console.error(`❌ [SUPABASE] [${requestId}] Validation failed:`, error.message);
    throw error;
  }
  
  if (query.length > 10000 || response.length > 10000) {
    console.warn(`⚠️ [SUPABASE] [${requestId}] Large data detected - Query: ${query.length} chars, Response: ${response.length} chars`);
  }
  
  try {
    console.log(`📝 [SUPABASE] [${requestId}] Preparing database insert...`);
    
    const insertData = {
      user_query: query,
      chatbotresponse: response,
      created_at: new Date().toISOString(),
      request_id: requestId
    };
    
    console.log(`📝 [SUPABASE] [${requestId}] Inserting data into Chatbot_logs table...`);
    
    const { data, error } = await supabase
      .from('chatbot_logs')
      .insert([insertData])
      .select();

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (error) {
      console.error(`❌ [SUPABASE] [${requestId}] Database insert failed after ${duration}ms`);
      console.error(`❌ [SUPABASE] [${requestId}] Error code:`, error.code);
      console.error(`❌ [SUPABASE] [${requestId}] Error message:`, error.message);
      console.error(`❌ [SUPABASE] [${requestId}] Error details:`, JSON.stringify(error, null, 2));
      console.error(`❌ [SUPABASE] [${requestId}] Full error object:`, error);
      throw error;
    }
    
    console.log(`✅ [SUPABASE] [${requestId}] Log saved successfully in ${duration}ms`);
    console.log(`✅ [SUPABASE] [${requestId}] Inserted record ID:`, data?.[0]?.id || 'Unknown');
    console.log(`✅ [SUPABASE] [${requestId}] Data saved:`, {
      id: data?.[0]?.id,
      created_at: data?.[0]?.created_at,
      query_length: query.length,
      response_length: response.length
    });
    
    return data;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error(`❌ [SUPABASE] [${requestId}] logChatInteraction failed after ${duration}ms`);
    console.error(`❌ [SUPABASE] [${requestId}] Error type:`, error?.constructor?.name || 'Unknown');
    console.error(`❌ [SUPABASE] [${requestId}] Error message:`, error instanceof Error ? error.message : String(error));
    console.error(`❌ [SUPABASE] [${requestId}] Stack trace:`, error instanceof Error ? error.stack : 'No stack trace');
    console.error(`❌ [SUPABASE] [${requestId}] Full error:`, error);
    throw error;
  }
}
