"use client"

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShopifyIcon } from '../../../components/icons/shopify';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react"

// Define types for store data
interface StoreCredentials {
  shop: string;
  accessToken?: string;
}

interface ExistingStore {
  id: string;
  name: string;
  credentials: StoreCredentials;
}

interface CheckStoreResult {
  exists: boolean;
  store?: ExistingStore;
}

// Connection result component to display status after OAuth flow
const ConnectionResult = ({ status, message, onDismiss }: {
  status: 'success' | 'error' | 'duplicate' | null,
  message: string | null,
  onDismiss: () => void
}) => {
  if (!status) return null;

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    duplicate: <AlertTriangle className="h-5 w-5 text-amber-500" />
  };

  const colors = {
    success: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
    error: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
    duplicate: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
  };

  return (
    <Alert className={`mb-6 ${colors[status]}`}>
      <div className="flex items-center gap-2">
        {icons[status]}
        <AlertTitle className="text-base">
          {status === 'success' ? 'Connection Successful' :
            status === 'error' ? 'Connection Failed' :
              'Duplicate Store'}
        </AlertTitle>
      </div>
      <AlertDescription className="mt-2">
        {message}
      </AlertDescription>
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onDismiss}
          className={status === 'success' ? "bg-green-100 hover:bg-green-200" :
            status === 'error' ? "bg-red-100 hover:bg-red-200" :
              "bg-amber-100 hover:bg-amber-200"}
        >
          Dismiss
        </Button>
      </div>
    </Alert>
  );
};

export function AddShopifySource() {
  const [shopUrl, setShopUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingStore, setExistingStore] = useState<ExistingStore | null>(null);
  const [showReconnectConfirm, setShowReconnectConfirm] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    status: 'success' | 'error' | 'duplicate' | null,
    message: string | null
  }>({ status: null, message: null });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Check for connection status in URL parameters
  useEffect(() => {
    const status = searchParams.get('status');
    const error = searchParams.get('error');
    const shop = searchParams.get('shop');

    if (status === 'success' && shop) {
      setConnectionResult({
        status: 'success',
        message: `Successfully connected to ${shop}. You can now view this source in your sources list.`
      });
      // Clear URL parameters
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else if (error) {
      setConnectionResult({
        status: 'error',
        message: `Failed to connect: ${error}`
      });
      // Clear URL parameters
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [searchParams]);

  // Check if a store URL already exists in the database
  const checkExistingStore = async (shopUrl: string): Promise<CheckStoreResult> => {
    try {
      const formattedShopUrl = formatShopUrl(shopUrl);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('sources')
        .select('id, name, credentials')
        .eq('source_type', 'shopify')
        .filter('credentials->shop', 'eq', formattedShopUrl)
        .maybeSingle();

      if (error) {
        console.error("Error checking existing store:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (data) {
        return {
          exists: true,
          store: data as ExistingStore
        };
      }

      return { exists: false };
    } catch (error: any) {
      console.error("Exception in checkExistingStore:", error);
      throw new Error(`Failed to check for existing store: ${error.message}`);
    }
  };

  // Form schema for validation
  const formSchema = z.object({
    shopUrl: z.string()
      .min(1, { message: "Shop URL is required" })
      .refine(
        (value) => /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(formatShopUrl(value)),
        { message: "Must be a valid Shopify store URL (e.g., your-store.myshopify.com)" }
      )
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopUrl: "",
    },
  });

  // Format shop URL to ensure consistent format
  const formatShopUrl = (url: string): string => {
    // Remove protocol and www if present
    let formatted = url.replace(/^(https?:\/\/)?(www\.)?/i, "");

    // Add .myshopify.com if not present
    if (!formatted.includes(".myshopify.com")) {
      formatted = `${formatted}.myshopify.com`;
    }

    return formatted.toLowerCase();
  };

  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setExistingStore(null);
      setShowReconnectConfirm(false);

      const formattedShopUrl = formatShopUrl(values.shopUrl);
      setShopUrl(formattedShopUrl);

      // Check if store already exists
      const checkResult = await checkExistingStore(formattedShopUrl);

      if (checkResult.exists && checkResult.store) {
        setExistingStore(checkResult.store);
        setShowReconnectConfirm(true);
        return;
      }

      // Proceed with new connection
      proceedWithConnection(formattedShopUrl);
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      setError(error.message || "An unexpected error occurred");
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Proceed with Shopify connection
  const proceedWithConnection = (shop: string) => {
    // Redirect to Shopify auth API
    router.push(`/api/shopify/auth?shop=${encodeURIComponent(shop)}`);
  };

  // Handle reconnect confirmation
  const handleReconnectConfirm = () => {
    if (existingStore) {
      proceedWithConnection(existingStore.credentials.shop);
    }
  };

  // Reset connection result
  const handleDismissResult = () => {
    setConnectionResult({ status: null, message: null });
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <ShopifyIcon className="h-6 w-6 text-[#95BF47]" />
            <CardTitle className="text-2xl">Connect Shopify Store</CardTitle>
          </div>
          <CardDescription>
            Enter your Shopify store URL to connect your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionResult.status && (
            <ConnectionResult
              status={connectionResult.status}
              message={connectionResult.message}
              onDismiss={handleDismissResult}
            />
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showReconnectConfirm && existingStore ? (
            <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Store Already Connected</AlertTitle>
              <AlertDescription className="mt-2">
                This store is already connected as &quot;{existingStore.name || 'Shopify Store'}&quot;.
                Do you want to reconnect it?
              </AlertDescription>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReconnectConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleReconnectConfirm}
                >
                  Reconnect
                </Button>
              </div>
            </Alert>
          ) : (
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <Label htmlFor="shopUrl">Shopify Store URL</Label>
              <div className="flex">
                <Input
                  id="shopUrl"
                  placeholder="your-store.myshopify.com"
                  {...form.register("shopUrl")}
                  onChange={(e) => {
                    setShopUrl(e.target.value);
                    form.setValue("shopUrl", e.target.value);
                  }}
                  disabled={isSubmitting}
                  className="flex-1"
                />
              </div>
              {form.formState.errors.shopUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.shopUrl.message}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Connect Store
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t px-6 py-4">
          <CardDescription className="text-xs text-center">
            By connecting your store, you authorize this app to access your Shopify data
            according to our terms of service and privacy policy.
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}