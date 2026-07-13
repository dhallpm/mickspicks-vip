const DEFAULT_PUBLIC_CARD = 'https://www.mickspicks.us/api/todays-picks'

function upstreamUrl(req) {
  const target = new URL(process.env.PUBLIC_PICKS_API_URL || DEFAULT_PUBLIC_CARD)
  target.searchParams.set('cache', String(Date.now()))
  if (req.query?.specialTabs) target.searchParams.set('specialTabs', String(req.query.specialTabs))
  return target
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  try {
    const response = await fetch(upstreamUrl(req), {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    })
    if (!response.ok) throw new Error(`Public picks upstream returned ${response.status}`)
    const payload = await response.json()
    res.status(200).json({
      ...payload,
      success: payload.success !== false,
      mirroredBy: 'mickspicks-vip-expanded-card-feed'
    })
  } catch (error) {
    console.error('VIP picks mirror failed:', error)
    res.status(502).json({
      ok: false,
      success: false,
      source: 'public-picks-upstream',
      vip: [],
      free: [],
      props: [],
      propsLab: [],
      lottoParlays: [],
      longshots: [],
      activePicks: [],
      message: 'The active card feed is temporarily unavailable.'
    })
  }
}