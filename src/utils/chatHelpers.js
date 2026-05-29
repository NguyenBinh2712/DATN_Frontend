import { userApi } from '../api/user.api'
import { chatApi } from '../api/chat.api'
import { normalizeId, unwrapList } from './helpers'

/** Tên hiển thị cuộc trò chuyện (1-1 = tên người kia) */
export function getConversationTitle(conv, userId, titleMap = {}) {
  if (!conv) return 'Chat'
  if (titleMap[conv.id]) return titleMap[conv.id]
  if (conv.name) return conv.name
  if (conv.isGroup) return 'Nhóm chat'
  return 'Chat 1-1'
}

/** Gợi ý peer id từ danh sách tin nhắn */
export function inferPeerIdFromMessages(messages, userId) {
  const me = normalizeId(userId)
  for (const m of messages) {
    const sid = normalizeId(m.senderId)
    if (sid != null && sid !== me) return sid
  }
  return null
}

/**
 * Resolve tên 1-1 chat: lấy sender khác mình từ tin nhắn, map bạn bè / gọi API profile
 */
export async function resolveConversationTitles(conversations, userId, friends = []) {
  const titles = {}
  const peerByConv = {}

  const friendName = Object.fromEntries(
    friends.map((f) => [normalizeId(f.userId), f.fullName || f.name]),
  )

  const oneToOne = conversations.filter((c) => !c.isGroup && !c.name)

  await Promise.all(
    oneToOne.map(async (conv) => {
      try {
        const { data } = await chatApi.getMessages(conv.id, 0, 30)
        const msgs = (data.result?.content || unwrapList(data)).slice().reverse()
        const peerId = inferPeerIdFromMessages(msgs, userId)
        if (peerId == null) return
        peerByConv[conv.id] = peerId
        if (friendName[peerId]) {
          titles[conv.id] = friendName[peerId]
        }
      } catch {
        /* ignore */
      }
    }),
  )

  const needProfile = Object.entries(peerByConv).filter(([cid]) => !titles[cid])
  await Promise.all(
    needProfile.map(async ([cid, peerId]) => {
      try {
        const { data } = await userApi.getById(peerId)
        const u = data.result
        titles[cid] = u?.profile?.fullName || u?.email || `User #${peerId}`
      } catch {
        titles[cid] = `User #${peerId}`
      }
    }),
  )

  return { titles, peerByConv }
}

/** Thêm tin nhắn không trùng id */
export function appendMessageUnique(prev, msg) {
  if (!msg?.id) return prev
  const idx = prev.findIndex((m) => m.id === msg.id)
  if (idx >= 0) {
    const next = [...prev]
    next[idx] = msg
    return next
  }
  return [...prev, msg]
}
