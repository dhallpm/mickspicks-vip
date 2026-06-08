import assert from 'node:assert/strict'
import {
  ACTIVE_TABLES,
  RESULTS_ARCHIVE_TABLE,
  archiveCompletedRecords,
  buildArchiveFields,
  canonicalTable,
  importActiveRecords,
  isOfficialActivePickEligible,
  isPickOfTheDayEligible,
  isActiveRecord,
  isCompletedRecord,
  isWatchlistRecord,
  listActivePicks,
  listArchivedResults,
  normalizeImportPayload,
  selectPickOfTheDay,
  settleAndArchive,
  tableName,
  validateFullAnalysisContent,
  validateMicksFirstPick,
  validateMlbConfirmationGate,
  validateParlayLimits
} from '../lib/airtableResultsWorkflow.js'

process.env.AIRTABLE_PICKS_TABLE_ID = 'tbl_picks'
process.env.AIRTABLE_PROPS_LAB_TABLE_ID = 'tbl_props'
process.env.AIRTABLE_LOTTO_PARLAYS_TABLE_ID = 'tbl_lotto'
process.env.AIRTABLE_LONGSHOTS_TABLE_ID = 'tbl_longshots'
process.env.AIRTABLE_RESULTS_ARCHIVE_TABLE_ID = 'tbl_archive'

console.info = () => {}
console.error = () => {}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function fakeClient(seed = {}) {
  const tables = clone(seed)
  const calls = {
    created: [],
    deleted: []
  }
  return {
    tables,
    calls,
    async listRecords(table) {
      return clone(tables[table] || [])
    },
    async createRecords(table, fieldsList) {
      if (!tables[table]) tables[table] = []
      const created = fieldsList.map((fields, index) => ({
        id: `rec${String(tables[table].length + index + 1).padStart(14, '0')}`,
        fields: clone(fields)
      }))
      tables[table].push(...created)
      calls.created.push({ table, records: clone(created) })
      return clone(created)
    },
    async updateRecords() {
      throw new Error('updateRecords should not be needed for archive tests')
    },
    async deleteRecord(table, recordId) {
      tables[table] = (tables[table] || []).filter(record => record.id !== recordId)
      calls.deleted.push({ table, recordId })
      return { deleted: true, id: recordId }
    }
  }
}

function actionableFields(index, overrides = {}) {
  return {
    Date: '2026-06-05',
    Sport: 'NBA',
    League: 'NBA',
    Game: `Team ${index} vs Opponent ${index}`,
    Pick: `Team ${index} +${index}.5`,
    Status: 'Released',
    Units: '0.25',
    Odds: '-110',
    Grade: 'B',
    'Best Number': `+${index}.5 or better`,
    ...overrides
  }
}

const importBatches = normalizeImportPayload({
  table: 'propsLab',
  records: [{
    Date: '2026-06-05',
    Pick: 'Caitlin Clark Over Assists',
    Result: 'Win',
    Outcome: 'Win',
    'Profit/Loss': 10,
    ROI: 100,
    Status: 'Released',
    Access: 'VIP'
  }]
})

assert.equal(importBatches.length, 1)
assert.equal(importBatches[0].canonicalTable, 'propsLab')
assert.equal(canonicalTable('Props Lab'), 'propsLab')
assert.equal(canonicalTable('Lotto Parlays'), 'lottoParlays')
assert.equal(canonicalTable('Results Archive'), 'resultsArchive')
assert.equal(importBatches[0].records[0].Result, undefined)
assert.equal(importBatches[0].records[0].Outcome, undefined)
assert.equal(importBatches[0].records[0]['Profit/Loss'], undefined)
assert.equal(importBatches[0].records[0].ROI, undefined)
assert.equal(importBatches[0].records[0].Status, 'Released')
assert.equal(importBatches[0].records[0].Access, 'Free')

const watchlistImport = normalizeImportPayload({
  table: 'picks',
  records: [{
    Pick: 'Game 3 Watchlist',
    Category: 'Live Tennis',
    Status: 'Live only',
    Units: 1,
    Odds: '-110',
    Featured: 'Yes'
  }]
})

assert.equal(watchlistImport[0].records[0].Status, 'Watchlist')
assert.equal(watchlistImport[0].records[0].Category, 'Watchlist')
assert.equal(watchlistImport[0].records[0].Units, 0)
assert.equal(watchlistImport[0].records[0].Odds, 'Watchlist')
assert.equal(watchlistImport[0].records[0].Featured, 'No')
assert.equal(watchlistImport[0].records[0]['Pick of the Day Eligible'], 'No')
assert.equal(watchlistImport[0].records[0]['Official Bet'], 'No')

const aPlusImport = normalizeImportPayload({
  table: 'picks',
  records: [{ Pick: 'Premium Pick', Grade: 'A+', Access: 'VIP' }]
})

assert.equal(aPlusImport[0].records[0].Access, 'Free')

const supportedAPlusImport = normalizeImportPayload({
  table: 'picks',
  records: [{
    Date: '2026-06-05',
    Sport: 'NBA',
    Game: 'Knicks vs Spurs',
    Pick: 'New York Knicks +5.5',
    Odds: '-110',
    Grade: 'A+',
    Access: 'VIP',
    'Best Number': '+5.5',
    'No Bet Cutoff': '+4',
    'True Probability': '58%',
    'Injury Notes': 'Rotation news checked.',
    'Market Notes': 'Line inside cutoff.',
    'Variance Check': 'Late foul variance checked.',
    'Full Analysis': 'Game Script: Knicks keep this inside the number.'
  }]
})

assert.equal(supportedAPlusImport[0].records[0].Access, 'VIP')

const officialImport = normalizeImportPayload({
  table: 'picks',
  records: [actionableFields(1)]
})

assert.equal(officialImport[0].records[0]['Official Bet'], 'Yes')
assert.equal(officialImport[0].records[0]['Pick of the Day Eligible'], 'Yes')
assert.equal(officialImport[0].records[0]['Source Influence Level'], 'Supporting')
assert.equal(officialImport[0].records[0]['Was Correlated Stack'], 'No')

const bMinusImport = normalizeImportPayload({
  table: 'picks',
  records: [actionableFields(2, { Grade: 'B-' })]
})

assert.equal(bMinusImport[0].records[0]['Official Bet'], 'Yes')
assert.equal(bMinusImport[0].records[0]['Pick of the Day Eligible'], 'No')

const correlatedImport = normalizeImportPayload({
  table: 'picks',
  records: [
    actionableFields(3, { 'Correlation Group': 'same-game-stack', Units: '0.5', Grade: 'A' }),
    actionableFields(3, { Pick: 'Opponent 3 Under 22.5 Points', 'Correlation Group': 'same-game-stack', Units: '0.25', Grade: 'B' })
  ]
})

assert.equal(correlatedImport[0].records[0]['Official Bet'], 'Yes')
assert.equal(correlatedImport[0].records[0]['Was Correlated Stack'], 'Yes')
assert.equal(correlatedImport[0].records[1]['Official Bet'], 'No')
assert.equal(correlatedImport[0].records[1]['Was Correlated Stack'], 'Yes')
assert.equal(correlatedImport[0].records[1]['Failure Reason'], 'Over-correlated stack')
assert.equal(correlatedImport[0].records[1].Status, 'Watchlist')

const importerClient = fakeClient({ tbl_props: [] })
const importResult = await importActiveRecords({
  batches: [{
    table: 'propsLab',
    records: [{
      Date: '2026-06-05',
      Pick: 'Import Active Pick',
      Result: 'Loss',
      Status: 'Released'
    }]
  }]
}, importerClient)

assert.equal(importResult.ok, true)
assert.equal(importResult.success, true)
assert.equal(importResult.table, 'propsLab')
assert.equal(importResult.attempted, 1)
assert.equal(importResult.created, 1)
assert.match(importResult.recordIds[0], /^rec[A-Za-z0-9]{8,}$/)
assert.equal(importResult.results[0].created, 1)
assert.equal(importerClient.tables.tbl_props[0].fields.Result, undefined)
assert.equal(importerClient.tables.tbl_props[0].fields.Status, 'Released')

const smokeClient = fakeClient({ tbl_picks: [] })
const smokeResult = await importActiveRecords({
  table: 'picks',
  smokeTest: true
}, smokeClient)

assert.equal(smokeResult.ok, true)
assert.equal(smokeResult.table, 'picks')
assert.equal(smokeResult.attempted, 1)
assert.equal(smokeResult.created, 1)
assert.match(smokeResult.recordIds[0], /^rec[A-Za-z0-9]{8,}$/)
assert.equal(smokeClient.tables.tbl_picks[0].fields.Pick, 'DELETE ME - Smoke Test Pick')
assert.equal(smokeClient.tables.tbl_picks[0].fields.Game, 'AIRTABLE IMPORT SMOKE TEST')
assert.equal(smokeClient.tables.tbl_picks[0].fields.Status, 'Pending')

const smokeOverrideClient = fakeClient({ tbl_picks: [], tbl_longshots: [] })
const smokeOverrideResult = await importActiveRecords({
  table: 'longshots',
  smokeTest: true,
  dryRun: true,
  records: []
}, smokeOverrideClient)

assert.equal(smokeOverrideResult.ok, true)
assert.equal(smokeOverrideResult.dryRun, false)
assert.equal(smokeOverrideResult.table, 'picks')
assert.equal(smokeOverrideResult.created, 1)
assert.equal(smokeOverrideClient.tables.tbl_picks.length, 1)
assert.equal(smokeOverrideClient.tables.tbl_longshots.length, 0)

const dryRunClient = fakeClient({ tbl_picks: [] })
const dryRunImport = await importActiveRecords({
  table: 'picks',
  dryRun: true,
  records: [actionableFields(4)]
}, dryRunClient)

assert.equal(dryRunImport.ok, false)
assert.equal(dryRunImport.success, false)
assert.equal(dryRunImport.dryRun, true)
assert.equal(dryRunImport.banner, 'DRY RUN - NO AIRTABLE WRITE')
assert.equal(dryRunImport.created, 0)
assert.equal(dryRunClient.tables.tbl_picks.length, 0)

const emptyCreateResult = await importActiveRecords({
  table: 'picks',
  records: [actionableFields(5)]
}, {
  async createRecords() {
    return []
  }
})

assert.equal(emptyCreateResult.ok, false)
assert.equal(emptyCreateResult.created, 0)
assert.equal(emptyCreateResult.recordIds.length, 0)
assert.equal(emptyCreateResult.error, 'Airtable returned zero created records with record IDs.')

const invalidIdResult = await importActiveRecords({
  table: 'picks',
  records: [actionableFields(6)]
}, {
  async createRecords() {
    return [{ id: 'new_not_airtable', fields: {} }]
  }
})

assert.equal(invalidIdResult.ok, false)
assert.equal(invalidIdResult.created, 0)
assert.equal(invalidIdResult.error, 'Airtable returned zero created records with record IDs.')

const airtableErrorResult = await importActiveRecords({
  table: 'picks',
  records: [actionableFields(7)]
}, {
  async createRecords() {
    const error = new Error('wrapped error')
    error.airtableMessage = 'Exact Airtable error here'
    throw error
  }
})

assert.equal(airtableErrorResult.ok, false)
assert.equal(airtableErrorResult.created, 0)
assert.equal(airtableErrorResult.error, 'Exact Airtable error here')

const finalPick = {
  id: 'rec_win',
  fields: {
    Date: '2026-06-05',
    Sport: 'MLB',
    League: 'MLB',
    Game: 'A vs B',
    Pick: 'A ML',
    'Bet Type': 'Moneyline',
    Odds: '+150',
    Grade: 'A',
    Units: 1,
    'Best Number': '+150',
    'Closing Number': '+130',
    Result: 'Win',
    Access: 'VIP',
    'Official Bet': 'Yes',
    'Correlation Group': 'a-vs-b',
    'Primary Edge Type': 'Price',
    'Source Influence Level': 'Micks-generated',
    'Micks Independent Confirmation': 'Yes',
    'Closing Price Check': 'Inside cutoff',
    'Lineup Weather Confirmed': 'Yes',
    'Pick of the Day Eligible': 'Yes',
    Writeup: 'Test writeup'
  }
}

const archiveFields = buildArchiveFields(finalPick, ACTIVE_TABLES.picks, new Date('2026-06-05T12:00:00Z'))
assert.equal(archiveFields.Result, 'Win')
assert.equal(archiveFields['Profit/Loss'], 1.5)
assert.equal(archiveFields.ROI, 150)
assert.equal(archiveFields['Official Bet'], 'Yes')
assert.equal(archiveFields['Correlation Group'], 'a-vs-b')
assert.equal(archiveFields['Primary Edge Type'], 'Price')
assert.equal(archiveFields['Source Influence Level'], 'Micks-generated')
assert.equal(archiveFields['Micks Independent Confirmation'], 'Yes')
assert.equal(archiveFields['Closing Price Check'], 'Inside cutoff')
assert.equal(archiveFields['Lineup Weather Confirmed'], 'Yes')
assert.equal(archiveFields['Pick of the Day Eligible'], 'Yes')
assert.equal(archiveFields['ROI Bucket'], 'Official Straight')
assert.equal(archiveFields['Original Table'], 'picks')
assert.equal(archiveFields['Original Record ID'], 'rec_win')
assert.ok(archiveFields['Record Key'])

const workflowClient = fakeClient({
  tbl_archive: [],
  tbl_picks: [finalPick, {
    id: 'rec_pending',
    fields: {
      Date: '2026-06-05',
      Game: 'C vs D',
      Pick: 'Pending Pick',
      Status: 'Pending',
      Access: 'Free'
    }
  }],
  tbl_props: [],
  tbl_lotto: [{
    id: 'rec_lotto',
    fields: {
      Date: '2026-06-05',
      Game: 'Lotto Card',
      Pick: 'Safe 5-Leg Parlay',
      Result: 'Loss',
      Units: 0.25,
      Odds: '+450',
      Access: 'Free'
    }
  }],
  tbl_longshots: [{
    id: 'rec_longshot',
    fields: {
      Date: '2026-06-05',
      Game: 'Longshot Card',
      Pick: 'Anytime HR Longshot',
      Result: 'Push',
      Units: 0.1,
      Odds: '+1200',
      Access: 'Free'
    }
  }]
})

const settleResult = await settleAndArchive({ now: new Date('2026-06-05T12:00:00Z') }, workflowClient)
assert.equal(settleResult.success, true)
assert.equal(settleResult.archived, 3)
assert.equal(settleResult.deletedFromActive, 3)
assert.equal(settleResult.skippedDuplicates, 0)
assert.equal(workflowClient.tables.tbl_archive.length, 3)
assert.equal(workflowClient.tables.tbl_picks.some(record => record.id === 'rec_win'), false)
assert.equal(workflowClient.tables.tbl_lotto.some(record => record.id === 'rec_lotto'), false)
assert.equal(workflowClient.tables.tbl_longshots.some(record => record.id === 'rec_longshot'), false)
assert.equal(workflowClient.tables.tbl_picks.some(record => record.id === 'rec_pending'), true)
assert.equal(workflowClient.tables.tbl_archive.find(record => record.fields['Original Record ID'] === 'rec_lotto').fields.Result, 'Loss')
assert.equal(workflowClient.tables.tbl_archive.find(record => record.fields['Original Record ID'] === 'rec_longshot').fields.Result, 'Push')

const duplicateClient = fakeClient({
  tbl_archive: [{
    id: 'arch_existing',
    fields: {
      ...archiveFields,
      'Original Record ID': 'rec_win'
    }
  }],
  tbl_picks: [finalPick],
  tbl_props: [],
  tbl_lotto: [],
  tbl_longshots: []
})

const duplicateResult = await archiveCompletedRecords({}, duplicateClient)
assert.equal(duplicateResult.success, true)
assert.equal(duplicateResult.archived, 0)
assert.equal(duplicateResult.skippedDuplicates, 1)
assert.equal(duplicateResult.deletedFromActive, 1)
assert.equal(duplicateClient.tables.tbl_archive.length, 1)
assert.equal(duplicateClient.tables.tbl_picks.length, 0)

assert.equal(isCompletedRecord({ Result: 'Cancelled' }), true)
assert.equal(isCompletedRecord({ Result: 'Pending' }), false)
assert.equal(isActiveRecord({ Status: 'Watchlist' }), true)
assert.equal(isActiveRecord({ Outcome: 'Void' }), false)
assert.equal(isWatchlistRecord({ Status: 'Watchlist', Category: 'Watchlist' }), true)

const activeClient = fakeClient({
  tbl_archive: [],
  tbl_picks: [{
    id: 'active_1',
    fields: {
      Date: '2026-06-05',
      Game: 'Team A vs Team B',
      Pick: 'Team A ML',
      Status: 'Released',
      Access: 'VIP',
      Grade: 'A',
      Units: '1',
      Odds: '-120',
      'Best Number': '-120 or better'
    }
  }, {
    id: 'closed_1',
    fields: { Date: '2026-06-05', Pick: 'Closed Pick', Result: 'Loss', Access: 'VIP', Grade: 'A' }
  }],
  tbl_props: [{
    id: 'active_prop',
    fields: { Date: '2026-06-05', Pick: 'Watch Prop', Status: 'Watchlist', Category: 'Watchlist', Units: 0, Odds: 'Watchlist', Access: 'Free' }
  }],
  tbl_lotto: [],
  tbl_longshots: []
})

const activeFeed = await listActivePicks({}, activeClient)
assert.equal(activeFeed.rows.length, 1)
assert.equal(activeFeed.rows.some(row => row.pick === 'Closed Pick'), false)
assert.equal(activeFeed.rows.some(row => row.pick === 'Watch Prop'), false)
assert.equal(activeFeed.watchlist.length, 1)
assert.equal(activeFeed.vip.length, 1)
assert.equal(activeFeed.free.length, 0)

const watchlistFeed = await listActivePicks({ section: 'watchlist' }, activeClient)
assert.equal(watchlistFeed.rows.length, 1)
assert.equal(watchlistFeed.rows[0].Pick, 'Watch Prop')

const cappedTopCardFeed = await listActivePicks({}, fakeClient({
  tbl_archive: [],
  tbl_picks: [1, 2, 3, 4, 5].map(index => ({ id: `top_${index}`, fields: actionableFields(index) })),
  tbl_props: [],
  tbl_lotto: [],
  tbl_longshots: []
}))

assert.equal(cappedTopCardFeed.rows.length, 4)
assert.equal(cappedTopCardFeed.watchlist.length, 1)
assert.equal(cappedTopCardFeed.watchlist[0]['Official Bet'], 'No')
assert.equal(cappedTopCardFeed.watchlist[0]['Failure Reason'], 'Card limit overflow')

const correlatedActiveFeed = await listActivePicks({}, fakeClient({
  tbl_archive: [],
  tbl_picks: [{ id: 'corr_pick', fields: actionableFields(6, { 'Correlation Group': 'nba-finals', Units: '0.5', Grade: 'A' }) }],
  tbl_props: [{ id: 'corr_prop', fields: actionableFields(6, { Pick: 'Team 6 Over 5.5 Assists', 'Correlation Group': 'nba-finals', Units: '0.25', Grade: 'B' }) }],
  tbl_lotto: [],
  tbl_longshots: []
}))

assert.equal(correlatedActiveFeed.rows.length, 1)
assert.equal(correlatedActiveFeed.rows[0].Pick, 'Team 6 +6.5')
assert.equal(correlatedActiveFeed.watchlist.length, 1)
assert.equal(correlatedActiveFeed.watchlist[0].Pick, 'Team 6 Over 5.5 Assists')
assert.equal(correlatedActiveFeed.watchlist[0]['Was Correlated Stack'], 'Yes')

const independentCorrelationFeed = await listActivePicks({}, fakeClient({
  tbl_archive: [],
  tbl_picks: [{ id: 'ind_pick', fields: actionableFields(7, { 'Correlation Group': 'nba-independent', Units: '0.5', Grade: 'A' }) }],
  tbl_props: [{ id: 'ind_prop', fields: actionableFields(7, { Pick: 'Player 7 Over 8.5 Rebounds', Player: 'Player 7', 'Correlation Group': 'nba-independent', 'Micks Independent Confirmation': 'Yes', Units: '0.25', Grade: 'B' }) }],
  tbl_lotto: [],
  tbl_longshots: []
}))

assert.equal(independentCorrelationFeed.rows.length, 2)
assert.equal(independentCorrelationFeed.watchlist.length, 0)

const cappedParlayFeed = await listActivePicks({}, fakeClient({
  tbl_archive: [],
  tbl_picks: [],
  tbl_props: [],
  tbl_lotto: [
    { id: 'parlay_1', fields: actionableFields(8, { Category: 'Parlay', Pick: 'Team 8 +8.5 / Team 9 ML Parlay' }) },
    { id: 'parlay_2', fields: actionableFields(9, { Category: 'Parlay', Pick: 'Team 9 +9.5 / Team 10 ML Parlay' }) }
  ],
  tbl_longshots: []
}))

assert.equal(cappedParlayFeed.rows.length, 1)
assert.equal(cappedParlayFeed.lotto.length, 1)
assert.equal(cappedParlayFeed.watchlist.length, 1)

const cappedLongshotFeed = await listActivePicks({}, fakeClient({
  tbl_archive: [],
  tbl_picks: [],
  tbl_props: [],
  tbl_lotto: [],
  tbl_longshots: [1, 2, 3, 4].map(index => ({
    id: `long_${index}`,
    fields: actionableFields(index + 10, { Category: 'Longshots', Units: '0.05', Odds: '+600' })
  }))
}))

assert.equal(cappedLongshotFeed.rows.length, 3)
assert.equal(cappedLongshotFeed.longshots.length, 3)

const resultsFeed = await listArchivedResults({ days: 365 }, workflowClient)
assert.equal(resultsFeed.rows.length, 3)
assert.equal(resultsFeed.rows.every(row => ['Win', 'Loss', 'Push', 'Void', 'Cancelled'].includes(row.Result)), true)
assert.equal(resultsFeed.vip.length, 1)
assert.equal(resultsFeed.lotto.length, 1)
assert.equal(resultsFeed.longshots.length, 1)
assert.equal(tableName(RESULTS_ARCHIVE_TABLE), 'tbl_archive')

const legacyLabelClient = fakeClient({
  tbl_archive: [{
    id: 'legacy_props',
    fields: {
      Date: '2026-06-05',
      Pick: 'Legacy Prop',
      Result: 'Win',
      Access: 'Free',
      'Original Table': 'Props Lab',
      'Original Record ID': 'legacy_1'
    }
  }],
  tbl_picks: [],
  tbl_props: [],
  tbl_lotto: [],
  tbl_longshots: []
})

const legacyResults = await listArchivedResults({ days: 365 }, legacyLabelClient)
assert.equal(legacyResults.props.length, 1)

const genericTennisRule = {
  Date: '2026-06-05',
  Sport: 'Tennis',
  League: 'ATP',
  Game: '',
  Pick: 'Elite Favorite Set-1 Loss Live Watchlist',
  Category: 'Live Tennis',
  Status: 'Watchlist',
  Units: '0',
  Odds: 'Live only',
  Grade: 'C',
  Featured: 'Yes'
}

const knicks = {
  Date: '2026-06-05',
  'Start Time': '2026-06-05T19:30:00Z',
  Sport: 'Basketball',
  League: 'NBA Finals',
  Game: 'Knicks vs Spurs',
  Pick: 'New York Knicks +5.5',
  Category: 'NBA',
  Status: 'Pending',
  Units: '0.5',
  Odds: '-110',
  Grade: 'B',
  'Best Number': '+5.5 or better',
  'No Bet Cutoff': '+4',
  Writeup: 'Actionable spread with a clear cutoff.'
}

const cubs = {
  Date: '2026-06-05',
  'Start Time': '2026-06-05T18:20:00Z',
  Sport: 'MLB',
  League: 'MLB',
  Game: 'Chicago Cubs vs Detroit Tigers',
  Pick: 'Cubs Team Total Over 5.5',
  Category: 'Team Total',
  Status: 'Released',
  Units: '0.5',
  Odds: '+105',
  Grade: 'B-',
  Featured: 'Yes',
  'Best Number': '5.5 or better'
}

assert.equal(isPickOfTheDayEligible(genericTennisRule), false)
assert.equal(isPickOfTheDayEligible({ ...knicks, Units: '0' }), false)
assert.equal(isPickOfTheDayEligible({ ...knicks, Odds: 'Watchlist' }), false)
assert.equal(isPickOfTheDayEligible({ ...knicks, Status: 'Live only' }), false)
assert.equal(isPickOfTheDayEligible({ ...knicks, Grade: 'Pass' }), false)
assert.equal(isPickOfTheDayEligible({ ...knicks, Category: 'Live Total' }), true)
assert.equal(isPickOfTheDayEligible({ ...knicks, Category: 'Live Total', Odds: '' }), false)
assert.equal(isPickOfTheDayEligible({ ...knicks, Grade: 'C' }), false)
assert.equal(isPickOfTheDayEligible({ ...knicks, Grade: 'C', Featured: 'Yes' }), false)
assert.equal(isPickOfTheDayEligible(knicks), true)
assert.equal(isPickOfTheDayEligible(cubs), false)
assert.equal(isOfficialActivePickEligible(genericTennisRule), false)
assert.equal(isOfficialActivePickEligible(knicks), true)
assert.equal(isOfficialActivePickEligible(cubs), true)
assert.equal(selectPickOfTheDay([genericTennisRule, knicks])?.Pick, 'New York Knicks +5.5')
assert.equal(selectPickOfTheDay([genericTennisRule])?.Pick, undefined)
assert.equal(selectPickOfTheDay([knicks, cubs])?.Pick, 'New York Knicks +5.5')
assert.equal(selectPickOfTheDay([{ ...knicks, Featured: '' }, { ...cubs, Featured: '', Grade: 'B-' }])?.Pick, 'New York Knicks +5.5')

const potdClient = fakeClient({
  tbl_archive: [],
  tbl_picks: [
    { id: 'bad_tennis', fields: genericTennisRule },
    { id: 'good_knicks', fields: knicks },
    { id: 'good_cubs', fields: cubs }
  ],
  tbl_props: [],
  tbl_lotto: [],
  tbl_longshots: []
})

const potdFeed = await listActivePicks({}, potdClient)
assert.equal(potdFeed.rows.length, 2)
assert.equal(potdFeed.rows.some(row => row.Pick === 'Elite Favorite Set-1 Loss Live Watchlist'), false)
assert.equal(potdFeed.watchlist.length, 1)
assert.equal(potdFeed.pickOfTheDay.Pick, 'New York Knicks +5.5')
assert.equal(potdFeed.featured.length, 0)
assert.equal(potdFeed.noPickOfTheDayMessage, '')

const noPotdFeed = await listActivePicks({}, fakeClient({
  tbl_archive: [],
  tbl_picks: [{ id: 'bad_tennis', fields: genericTennisRule }],
  tbl_props: [],
  tbl_lotto: [],
  tbl_longshots: []
}))

assert.equal(noPotdFeed.pickOfTheDay, null)
assert.equal(noPotdFeed.noPickOfTheDayMessage, 'No Pick of the Day yet — check back after lines confirm.')

const fullAnalysis = [
  'Why We Like It: Chicago has two run paths against a tired bullpen.',
  'Game Script: The Cubs pressure early and force middle relief by the fifth.',
  'Metric Edge: Implied probability 51%, true probability 56%, projection gap 0.4 runs.',
  'How It Cashes: Contact and walks create traffic before the bullpen bridge.',
  'What Can Go Wrong: Wind knocks down fly balls and the starter works deeper than expected.',
  'Best Number / Cutoff: Play Over 5.5 to -115. No bet at 6.5.',
  'Micks Picks Verdict: B grade because the edge is real but park variance stays live.'
].join('\n')

const micksMlbPick = {
  ...cubs,
  Grade: 'B',
  'Starting Pitcher': 'Confirmed',
  'Lineup Confirmed': 'Projected lineup strong enough',
  Weather: 'Wind out 8 mph',
  'Bullpen Usage': 'Opponent used top arms both of last 2 days',
  'True Probability': '56%',
  'EV Edge': '+4.8%',
  'Injury Notes': 'No lineup injuries that change the run path.',
  'Market Notes': 'Current price is inside cutoff with stable line movement.',
  'Variance Check': 'Weather and bullpen variance checked',
  'No Bet Cutoff': 'Pass at 6.5',
  'Full Analysis': fullAnalysis
}

assert.equal(validateMicksFirstPick({ ...micksMlbPick, Grade: 'A' }).ok, true)
assert.equal(validateMlbConfirmationGate(micksMlbPick).ok, true)
assert.equal(validateFullAnalysisContent(micksMlbPick).ok, true)
assert.equal(validateFullAnalysisContent({ 'Full Analysis': 'Opening thesis. The matchup gives enough paths.' }).ok, false)
assert.equal(validateMlbConfirmationGate({ ...cubs, Grade: 'B' }).ok, false)
assert.equal(validateMicksFirstPick({ ...cubs, Grade: 'A', 'Source Verification': 'Action Network only' }).ok, false)

const parlayCheck = validateParlayLimits([
  { Pick: 'Main 2-leg Parlay', Category: 'Parlay', Grade: 'B', Units: 0.25 },
  { Pick: 'Second 3-leg Parlay', Category: 'Parlay', Grade: 'B-', Units: 0.25 }
])

assert.equal(parlayCheck.ok, false)
assert.equal(parlayCheck.warnings.some(message => message.includes('Max 1 main parlay')), true)

console.log('Airtable results archive workflow tests passed.')
