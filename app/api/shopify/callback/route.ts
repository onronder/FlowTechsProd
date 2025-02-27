import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// Environment variables
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || '';
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Add export const dynamic = 'force-dynamic' to make this route dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shop = searchParams.get("shop");
  const code = searchParams.get("code");
  const hmac = searchParams.get("hmac");
  const timestamp = searchParams.get("timestamp");

  // Validate required parameters
  if (!shop || !code) {
    console.error("Missing required parameters in Shopify callback");
    return NextResponse.redirect(
      new URL(`/sources/add?status=error&error=Missing+required+parameters`, request.url)
    );
  }

  try {
    console.log(`Processing Shopify callback for shop: ${shop}`);

    // Exchange the code for an access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Failed to exchange code for token:", errorText);
      return NextResponse.redirect(
        new URL(`/sources/add?status=error&error=Token+exchange+failed&shop=${encodeURIComponent(shop)}`, request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("No access token received from Shopify");
      return NextResponse.redirect(
        new URL(`/sources/add?status=error&error=No+access+token+received&shop=${encodeURIComponent(shop)}`, request.url)
      );
    }

    // Get shop details to use as the source name
    const shopResponse = await fetch(`https://${shop}/admin/api/2023-07/shop.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    });

    if (!shopResponse.ok) {
      console.error("Failed to fetch shop details");
      return NextResponse.redirect(
        new URL(`/sources/add?status=error&error=Failed+to+fetch+shop+details&shop=${encodeURIComponent(shop)}`, request.url)
      );
    }

    const shopData = await shopResponse.json();
    const shopName = shopData.shop.name || shop;

    // Create or update the source in Supabase
    const supabase = createAdminClient();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.user) {
      console.error("No authenticated user found");
      return NextResponse.redirect(
        new URL(`/sources/add?status=error&error=Authentication+required&shop=${encodeURIComponent(shop)}`, request.url)
      );
    }

    // Check if this shop already exists for this user
    const { data: existingSources } = await supabase
      .from("sources")
      .select("id, name, credentials")
      .eq("user_id", session.user.id)
      .eq("source_type", "shopify")
      .filter("credentials->shop", "eq", shop);

    let sourceId;
    let isNewSource = true;

    if (existingSources && existingSources.length > 0) {
      // Update existing source
      sourceId = existingSources[0].id;
      isNewSource = false;

      const { error: updateError } = await supabase
        .from("sources")
        .update({
          name: shopName,
          credentials: {
            shop,
            accessToken,
          },
          connection_status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", sourceId);

      if (updateError) {
        console.error("Error updating source:", updateError);
        return NextResponse.redirect(
          new URL(`/sources/add?status=error&error=Database+update+failed&shop=${encodeURIComponent(shop)}`, request.url)
        );
      }
    } else {
      // Create new source
      const { data: newSource, error: insertError } = await supabase
        .from("sources")
        .insert({
          name: shopName,
          source_type: "shopify",
          credentials: {
            shop,
            accessToken,
          },
          connection_status: "active",
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Error creating source:", insertError);
        return NextResponse.redirect(
          new URL(`/sources/add?status=error&error=Database+insert+failed&shop=${encodeURIComponent(shop)}`, request.url)
        );
      }

      sourceId = newSource?.id;
    }

    // Set cookies to help the frontend detect the successful connection
    const cookieStore = cookies();

    // Set a cookie to indicate successful connection
    cookieStore.set("shopify_connection_success", "true", {
      maxAge: 60 * 5, // 5 minutes
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Set a cookie with connection details
    cookieStore.set("shopify_connection_details", JSON.stringify({
      shopName,
      shop,
      sourceId,
      timestamp: new Date().toISOString(),
    }), {
      maxAge: 60 * 5, // 5 minutes
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Redirect to the sources page with success parameters
    return NextResponse.redirect(
      new URL(`/sources?shopify=success&new=${isNewSource}&shop=${encodeURIComponent(shop)}`, request.url)
    );
  } catch (error) {
    console.error("Error in Shopify callback:", error);
    return NextResponse.redirect(
      new URL(`/sources/add?status=error&error=Unexpected+error&shop=${encodeURIComponent(shop || "")}`, request.url)
    );
  }
}