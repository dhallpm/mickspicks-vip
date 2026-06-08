import {
  archiveCompletedRecords,
  methodAllowsWrite,
  parseRequestBody,
  publicConfig,
  responseStatusFor
} from '../lib/airtableResultsWorkflow.js'

export default async function handler(req, res) {
  try {
    if (!methodAllowsWrite(req, 'ARCHIVE')) {
      res.status(200).json({
        success: true,
        message: 'POST to archive completed active picks, or call GET with ?confirm=ARCHIVE. Use dryRun=true to preview.',
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
    const result = await archiveCompletedRecords({
      dryRun: req.query?.dryRun === 'true' || req.query?.dryRun === '1' || body.dryRun === true
    })
    res.status(responseStatusFor(result)).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, archived: 0, deletedFromActive: 0, skippedDuplicates: 0, errors: [error.message || String(error)] })
  }
}
