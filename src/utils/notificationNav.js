/** Map notification → route path */
export function getNotificationPath(notification) {
  const { type, targetType, targetId } = notification

  if (type === 'NEW_MESSAGE' || targetType === 'MESSAGES') {
    return targetId ? `/chat?conv=${targetId}` : '/chat'
  }
  if (type === 'FRIEND_REQUEST') return '/friends?tab=received'
  if (type === 'FRIEND_ACCEPTED') return '/friends?tab=list'
  if (
    type === 'GROUP_INVITE' ||
    type === 'JOIN_REQUEST' ||
    type === 'JOIN_REQUEST_APPROVED' ||
    type === 'JOIN_REQUEST_REJECTED' ||
    type === 'KICKED_FROM_GROUP' ||
    targetType === 'GROUP'
  ) {
    return targetId ? `/groups/${targetId}` : '/groups'
  }
  if (targetType === 'POST' || type?.includes('POST') || type?.includes('COMMENT')) {
    return targetId ? `/post/${targetId}` : '/'
  }
  if (targetType === 'REACTION') {
    return targetId ? `/post/${targetId}` : '/'
  }
  return '/'
}
