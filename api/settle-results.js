import {
  methodAllowsWrite,
  parseRequestBody,
  publicConfig,
  responseStatusFor,
  settleAndArchive
} from '../lib/airtableResultsWorkflow.js'

export default async function handler(req, res) {
  try {
    if (!methodAllowsWrite(req, 'SETTLE')) {
      res.status(200).json({
        success: true,
        message: 'POST to calculate settlement fields for completed picks, archive them, and remove them from active Airtable tables. GET requires ?confirm=SETTLE.',
        finalResults: ['Win', 'Loss', 'Push', 'Void', 'Cancelled'],
        summaryShape: {
          success: true,
          archived: 0,
          deletedFromActive: 0,
          skippedDuplicates: 0,
          errors: []
        },
        ...publicConfig()
      })
      return
    }

    const body = req.method === 'POST' ? parseRequestBody(req) : {}
    const result = await settleAndArchive({
      dryRun: req.query?.dryRun === 'true' || req.query?.dryRun === '1' || body.dryRun === true
    })
    res.status(responseStatusFor(result)).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, archived: 0, deletedFromActive: 0, skippedDuplicates: 0, errors: [error.message || String(error)] })
  }
}
