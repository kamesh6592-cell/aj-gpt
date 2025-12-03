import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    const tavilyApiKey = process.env.TAVILY_API_KEY

    if (!tavilyApiKey) {
      return NextResponse.json(
        { error: 'Tavily API key not configured' },
        { status: 500 }
      )
    }

    // Call Tavily API
    const tavilyResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: query,
        search_depth: 'basic',
        include_answer: true,
        include_images: false,
        include_raw_content: false,
        max_results: 5,
      }),
    })

    if (!tavilyResponse.ok) {
      throw new Error(`Tavily API error: ${tavilyResponse.statusText}`)
    }

    const searchResults = await tavilyResponse.json()

    return NextResponse.json({
      success: true,
      results: searchResults.results || [],
      answer: searchResults.answer || null,
    })
  } catch (error) {
    console.error('Web search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform web search' },
      { status: 500 }
    )
  }
}