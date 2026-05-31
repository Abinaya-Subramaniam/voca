export function computeInsights(logEntries) {
  const now = new Date()

  const thisWeekEntries = logEntries.filter(e => {
    const d = new Date(e.timestamp)
    return (now - d) / 86400000 <= 7
  })

  const lastWeekEntries = logEntries.filter(e => {
    const d = new Date(e.timestamp)
    const daysAgo = (now - d) / 86400000
    return daysAgo > 7 && daysAgo <= 14
  })

  const topicCounts = {}
  thisWeekEntries.forEach(e => {
    const board = e.boardId || 'unknown'
    topicCounts[board] = (topicCounts[board] || 0) + 1
  })

  const olderSymbols = new Set(
    logEntries
      .filter(e => {
        const daysAgo = (now - new Date(e.timestamp)) / 86400000
        return daysAgo > 7 && daysAgo <= 30
      })
      .flatMap(e => e.symbols || [])
  )

  const newVocab = [...new Set(
    thisWeekEntries.flatMap(e => e.symbols || [])
  )].filter(s => !olderSymbols.has(s))

  const timeBuckets = { Morning: 0, Afternoon: 0, Evening: 0 }
  thisWeekEntries.forEach(e => {
    const hour = new Date(e.timestamp).getHours()
    if (hour >= 5 && hour < 12) timeBuckets.Morning++
    else if (hour >= 12 && hour < 18) timeBuckets.Afternoon++
    else timeBuckets.Evening++
  })
  const peakTime = Object.entries(timeBuckets)
    .sort((a, b) => b[1] - a[1])[0][0]

  const longestSentence = thisWeekEntries.reduce((max, e) => {
    return (e.symbols?.length || 0) > max ? (e.symbols?.length || 0) : max
  }, 0)

  return {
    totalThisWeek: thisWeekEntries.length,
    totalLastWeek: lastWeekEntries.length,
    topicCounts,
    newVocab,
    peakTime,
    longestSentence,
  }
}