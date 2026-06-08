import {
  listArchivedResults,
  parseRequestBody
} from '../lib/airtableResultsWorkflow.js'

export default async function handler(req, res) {
  try {
    const body = req.method === 'POST' ? parseRequestBody(req) : {}
    const result = await listArchivedResults({
      days: req.query?.days || body.days || 180,
      access: req.query?.access || body.access || ''
    })
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: error.message || String(error) })
  }
}
