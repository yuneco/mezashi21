import firebase from './firebase'
import AuthApi from './AuthApi'
import RankingItem from './RankingItem'

const db = firebase.firestore()
const cachedRank: RankingItem[] = []

const getUid = async () => {
  const user = await AuthApi.getUser()
  if (!user) {
    return null
  }
  return user.uid
}

const addRanking = async (item: RankingItem): Promise<void> => {
  const ref = db.collection('ranking').doc()
  const uid = await getUid()
  if (!uid || uid !== item.uid) {
    return
  }
  await ref.set({
    uid,
    name: item.name,
    score: item.score,
    level: item.level,
    playmode: item.playmode,
    created: item.created
  })
  // キャッシュに差込
  cachedRank.push(item)
  // 得点降順（同点の場合は作成日の照準）でソート
  cachedRank.sort((a, b) => (a.score === b.score ? a.created - b.created : b.score - a.score))
}

const pushPlaylog = async (item: RankingItem): Promise<void> => {
  const ref = db.collection('playlog').doc()
  const uid = await getUid()
  if (!uid || uid !== item.uid) {
    return
  }
  await ref.set({
    uid,
    name: item.name,
    score: item.score,
    level: item.level,
    playmode: item.playmode,
    created: item.created
  })
}

const getRanking = async (count = 10): Promise<RankingItem[]> => {
  const list: RankingItem[] = []
  const ref = db
    .collection('ranking')
    .orderBy('score', 'desc')
    .limit(count)
  const docs = await ref.get()
  docs.forEach(doc => {
    const data = doc.data()
    if (!data) {
      return
    }
    const { uid, name, score, created, level, playmode } = data
    const item = new RankingItem(
      uid as string,
      name as string,
      score as number,
      level as number,
      playmode,
      created as number
    )
    list.push(item)
  })
  // キャッシュを更新
  cachedRank.length = 0
  cachedRank.push(...list)
  return list
}

/**
 * 指定した得点がランキングで何位になるか求めます。
 * @param score 得点
 * @param maxRank 最大何位まで調べるか？これを超える順位の場合、判定不能として-1を返します
 * @param shouldRefresh maxRankまでの順位情報がキャッシュされている場合にも、キャッシュを更新して最新の情報を用いるか？
 * @return 順位。maxRankを超える場合、-1
 */
const getRank = async (score: number, maxRank = 10, shouldRefresh = false): Promise<number> => {
  const isNeedReflesh = shouldRefresh || cachedRank.length < maxRank
  if (isNeedReflesh) {
    await getRanking(maxRank)
  }
  const rank = cachedRank.filter(item => item.score >= score).length + 1
  return rank === cachedRank.length + 1 ? -1 : rank
}

const DocApi = {
  addRanking,
  pushPlaylog,
  getRanking,
  getRank
}

export default DocApi
