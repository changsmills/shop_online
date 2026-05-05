import { createClient } from '@supabase/supabase-js'

// Badala ya kuandika siri hapa, tunazivuta kutoka .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 5,
    },
    timeout: 40000, 
  }
})

export const subscribeToStoreOrders = (storeId, onNewOrder, onStatusChange) => {
  if (!storeId) {
    console.error('❌ storeId inahitajika!');
    return null;
  }

  console.log(`🎧 Tunatega sikio kwa oda za store: ${storeId}`);

  const channel = supabase
    .channel(`store-orders-${storeId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
        filter: `store_id=eq.${storeId}`,
      },
      (payload) => {
        console.log('🆕 Oda mpya imeingia:', payload.new);
        
        // Hapa hatutafuti tena 'profiles' table.
        // Tunatengeneza muonekano ule ule ili UI isivunjike
        const orderWithPlaceholder = {
          ...payload.new,
          profiles: { full_name: 'Mteja (Auth User)' } 
        };

        if (onNewOrder) onNewOrder(orderWithPlaceholder);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `store_id=eq.${storeId}`,
      },
      (payload) => {
        console.log('✏️ Oda imebadilishwa status:', payload.new);
      }
    )

    .subscribe((status, err) => {
      console.log(`📡 Hali ya mawasiliano (${storeId}):`, status);
      
      // HAPA NDIPO REAL ERROR INAPOPATIKANA
      if (err) {
        console.error('🔴 SUPABASE REAL-ERROR:', {
          message: err.message, // Hapa itasema kwanini (mfano: "JWT expired" au "Tenant exceeded quota")
          details: err,
        });
      }

      if (onStatusChange) onStatusChange(status, err);
      
      if (status === 'CHANNEL_ERROR') {
        console.error('❌ Sababu ya kiufundi:', err?.message || 'Unknown server error');
      }
    });

  return channel;
};

export default {
  supabase,
  subscribeToStoreOrders,
};