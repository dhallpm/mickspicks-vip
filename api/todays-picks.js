module.exports = async function handler(req, res) {
  try {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(req.query || {})) {
      if (value !== undefined && value !== null) params.set(key, String(value))
    }
    const target = `https://www.mickspicks.us/api/todays-picks${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(target, { cache: 'no-store' })
    const body = await response.text()
    res.status(response.status)
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    res.end(body)
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    res.end(JSON.stringify({ ok: false, success: false, error: error.message || String(error), rows: [], allRows: [], vip: [], free: [], props: [], lotto: [], longshots: [], featured: [] }))
  }
}
