// config.js - Supabase Configuration
// Replace these with your actual Supabase project credentials

const SUPABASE_CONFIG = {
  url: 'https://mlczuanztnqcngioayas.supabase.co', // Replace with your project URL
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sY3p1YW56dG5xY25naW9heWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzIwOTYsImV4cCI6MjA2MjM0ODA5Nn0.ShPAiWshDqZD0pAP9RMGdpfrpBtoGd58r_agzigReeI' // Replace with your anon key
};

// Initialize Supabase client properly
let supabaseClient = null;

async function initializeSupabase() {
  try {
    // Don't create multiple clients - reuse if already exists
    if (supabaseClient) {
      console.log('Supabase client already initialized');
      return supabaseClient;
    }

    // Check if supabase is loaded
    if (typeof supabase === 'undefined') {
      throw new Error('Supabase library not loaded');
    }

    // Create client using the global supabase object
    supabaseClient = supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );

    console.log('Supabase client initialized successfully');
    return supabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    throw error;
  }
}

// Test connection function
async function testConnection() {
  try {
    if (!supabaseClient) {
      await initializeSupabase();
    }

    // Test with a simple query
    const { data, error } = await supabaseClient
      .from('create_chaos')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Connection test error:', err);
    return false;
  }
}

// Get the client instance
function getSupabaseClient() {
  if (!supabaseClient) {
    throw new Error('Supabase not initialized. Call initializeSupabase() first.');
  }
  return supabaseClient;
}

// Export for use in other files
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.initializeSupabase = initializeSupabase;
window.testConnection = testConnection;
window.getSupabaseClient = getSupabaseClient; 