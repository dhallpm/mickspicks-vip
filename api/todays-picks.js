import {
  listActivePicks,
  parseRequestBody
} from '../lib/airtableResultsWorkflow.js'

export default async function handler(req, res) {
  try {
    const body = req.method === 'POST' ? parseRequestBody(req) : {}
    const result = await listActivePicks({
      access: req.query?.access || body.access || '',
      section: req.query?.section || body.section || '',
      watchlist: req.query?.watchlist || body.watchlist || false
    })
    res.status(result.errors?.length ? 207 : 200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: error.message || String(error) })
  }
}
