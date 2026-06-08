import {
  importActiveRecords,
  parseRequestBody,
  publicConfig,
  responseStatusFor
} from '../lib/airtableResultsWorkflow.js'

function truthy(value) {
  return value === true || /^(1|true|yes|y|preview|dryrun|dry run)$/i.test(String(value || '').trim())
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(200).json({
        success: true,
        message: 'POST JSON with { table: "propsLab", records: [...] } or { batches: [...] }. Result/Outcome/Profit-Loss fields are stripped automatically; CLV and settlement are separate workflow steps. Use dryRun=true for preview or smokeTest=true for a one-row smoke test.',
        aliases: ['picks', 'propsLab', 'lottoParlays', 'longshots'],
        smokeTest: {
          method: 'POST',
          body: {
            smokeTest: true,
            dryRun: false,
            table: 'picks'
          },
          creates: {
            Pick: 'DELETE ME - Smoke Test Pick',
            Game: 'AIRTABLE IMPORT SMOKE TEST',
            Status: 'Pending'
          }
        },
        ...publicConfig()
      })
      return
    }

    const body = parseRequestBody(req)
    if (body.smokeTest === true) {
      const result = await importActiveRecords({
        smokeTest: true,
        dryRun: false,
        table: 'picks'
      })
      res.status(responseStatusFor(result)).json(result)
      return
    }

    const dryRun = truthy(req.query?.dryRun) || truthy(req.query?.preview) || truthy(body.dryRun) || truthy(body.preview)
    const result = await importActiveRecords({
      ...body,
      dryRun,
      preview: dryRun
    })
    res.status(responseStatusFor(result)).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, success: false, created: 0, recordIds: [], error: error.airtableMessage || error.message || String(error) })
  }
}
