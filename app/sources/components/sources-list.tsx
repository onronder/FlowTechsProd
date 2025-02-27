"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from '@/lib/supabase/client'
import { SourceCard } from "./source-card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export interface Source {
  id: string
  name: string
  source_type: string
  connection_status: string
  last_sync_at: string | null
  credentials: any
  created_at: string
}

// Create a toast component that doesn't require importing the toast module
function SimpleToast({ message, variant = "default" }: { message: string, variant?: "default" | "destructive" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-sm z-50 transition-opacity ${variant === "destructive" ? "bg-red-600 text-white" : "bg-green-600 text-white"
      }`}>
      {message}
    </div>
  );
}

// Simple skeleton component
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );
}

export function SourcesList({ forceRefresh }: { forceRefresh?: number }) {
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [toast, setToast] = useState<{ message: string, variant: "default" | "destructive" } | null>(null)

  // Use a ref to store and manage the supabase client and subscription
  const supabaseRef = useRef(createClient())
  const subscriptionRef = useRef<any>(null)

  // Show a toast message
  const showToast = (message: string, variant: "default" | "destructive" = "default") => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 5000);
  };

  // Fetch sources from Supabase
  const fetchSources = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      // Get a fresh supabase client for each fetch to avoid stale connections
      const supabase = createClient();
      supabaseRef.current = supabase;

      console.log("Fetching sources from Supabase...");

      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setError('Failed to load sources');
        showToast('Failed to load sources. Please try again.', "destructive");
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} sources`);

      // Enhanced logging to debug source data
      if (data && data.length > 0) {
        console.log('Sources data:', data.map(source => ({
          id: source.id,
          name: source.name,
          type: source.source_type,
          status: source.connection_status,
          credentials: source.credentials ? 'Has credentials' : 'No credentials',
          created_at: source.created_at
        })));
      } else {
        console.log('No sources found in database');
      }

      setSources(data || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
      setError('Failed to load sources');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Setup real-time subscription
  const setupSubscription = useCallback(() => {
    try {
      // Clean up any existing subscription
      if (subscriptionRef.current) {
        console.log('Removing existing Supabase subscription');
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      console.log('Setting up new Supabase subscription');

      const supabase = supabaseRef.current;
      const subscription = supabase
        .channel('sources_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'sources'
        }, (payload) => {
          console.log('Received change from Supabase:', payload.eventType);
          console.log('Change payload:', {
            table: payload.table,
            schema: payload.schema,
            event: payload.eventType,
            new: payload.new,
            old: payload.old
          });
          fetchSources(true);
        })
        .subscribe((status) => {
          console.log('Supabase subscription status:', status);

          // If subscription fails, try to reconnect after a delay
          if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.log('Subscription closed or error, will attempt to reconnect in 5 seconds');

            // Store the timeout ID so we can clear it if needed
            const timeoutId = setTimeout(() => {
              console.log('Attempting to reconnect Supabase subscription');
              setupSubscription();
            }, 5000);

            // Store the timeout ID on the ref so we can clear it during cleanup
            subscriptionRef.current = {
              ...subscriptionRef.current,
              reconnectTimeoutId: timeoutId
            };
          }
        });

      // Store both the subscription and any previous timeoutId
      subscriptionRef.current = {
        ...subscriptionRef.current,
        subscription,
        unsubscribe: () => subscription.unsubscribe()
      };
    } catch (error) {
      console.error('Error setting up Supabase subscription:', error);
    }
  }, [fetchSources]);

  // Delete a source
  const handleDelete = async (id: string) => {
    try {
      const supabase = supabaseRef.current;

      console.log(`Deleting source with ID: ${id}`);

      const { error } = await supabase
        .from('sources')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting source:', error);
        showToast('Failed to delete source. Please try again.', "destructive");
        throw error;
      }

      // Remove from local state immediately for better UX
      setSources(prevSources => prevSources.filter(source => source.id !== id));
      showToast('Source deleted successfully');
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };

  // Manual refresh function
  const refreshSources = () => {
    console.log('Manual refresh triggered');
    fetchSources(true);
  };

  useEffect(() => {
    console.log('SourcesList component mounted or forceRefresh changed');

    // Fetch sources when component mounts or forceRefresh changes
    fetchSources();

    // Set up subscription
    setupSubscription();

    // Clean up subscription when component unmounts
    return () => {
      console.log('SourcesList component unmounting');
      if (subscriptionRef.current) {
        console.log('Cleaning up Supabase subscription');
        if (subscriptionRef.current.unsubscribe) {
          subscriptionRef.current.unsubscribe();
        }

        // Clear any pending reconnection timeout
        if (subscriptionRef.current.reconnectTimeoutId) {
          clearTimeout(subscriptionRef.current.reconnectTimeoutId);
        }

        subscriptionRef.current = null;
      }
    };
  }, [fetchSources, setupSubscription, forceRefresh]);

  // Handle loading state with better skeleton UI
  if (loading && !isRefreshing) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b">
              <Skeleton className="h-5 w-1/3" />
              <div className="flex space-x-1">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
            <div className="space-y-3 pt-1">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-end mt-2">
                <Skeleton className="h-7 w-20 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-10 border rounded-lg p-8 bg-gray-50 dark:bg-gray-800/30">
        <h3 className="text-xl font-medium text-red-600 dark:text-red-400">Error Loading Sources</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{error}</p>
        <button
          onClick={() => fetchSources()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Handle empty state with a more meaningful UI
  if (sources.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg p-8 bg-gray-50 dark:bg-gray-800/30">
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
              <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
              <line x1="8" y1="16" x2="8.01" y2="16"></line>
              <line x1="8" y1="20" x2="8.01" y2="20"></line>
              <line x1="12" y1="18" x2="12.01" y2="18"></line>
              <line x1="12" y1="22" x2="12.01" y2="22"></line>
              <line x1="16" y1="16" x2="16.01" y2="16"></line>
              <line x1="16" y1="20" x2="16.01" y2="20"></line>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No data sources connected</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md">
            Connect your first data source to start managing your e-commerce data flow.
            Click the "Add Source" button above to get started.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <Button
              onClick={refreshSources}
              variant="outline"
              className="w-full max-w-xs"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Sources
            </Button>
            <p className="text-sm text-gray-500 max-w-md">
              If you've just connected a source, it may take a moment to appear.
              Try refreshing the list or check the browser console for detailed information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isRefreshing && (
        <div className="text-center py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md p-2 flex items-center justify-center">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          <span>Refreshing sources...</span>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => (
          <SourceCard
            key={source.id}
            id={source.id}
            name={source.name || `${source.source_type.charAt(0).toUpperCase() + source.source_type.slice(1)} Source`}
            type={source.source_type}
            status={source.connection_status === 'active' ? 'active' : 'inactive'}
            lastSync={source.last_sync_at ? new Date(source.last_sync_at).toLocaleString() : undefined}
            credentials={source.credentials}
            createdAt={source.created_at ? new Date(source.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : undefined}
            onDelete={() => handleDelete(source.id)}
            onRefresh={refreshSources}
          />
        ))}
      </div>

      {/* Custom toast */}
      {toast && <SimpleToast message={toast.message} variant={toast.variant} />}
    </div>
  );
}