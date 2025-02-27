import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Get the current user from Supabase
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the request body
    const { sourceId, credentials } = await request.json()

    if (!sourceId || !credentials) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Ensure the user owns this source
    const { data: source, error: sourceError } = await supabase
      .from('sources')
      .select('*')
      .eq('id', sourceId)
      .eq('user_id', session.user.id)
      .single()

    if (sourceError || !source) {
      return NextResponse.json(
        { error: 'Source not found or access denied' },
        { status: 404 }
      )
    }

    if (source.source_type !== 'shopify') {
      return NextResponse.json(
        { error: 'Not a Shopify source' },
        { status: 400 }
      )
    }

    // Update the source with new credentials
    const { error: updateError } = await supabase
      .from('sources')
      .update({
        credentials,
        connection_status: 'connected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sourceId)
      .eq('user_id', session.user.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update source' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating Shopify source:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}