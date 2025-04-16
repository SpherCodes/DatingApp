export interface Message {
    id: number
    senderUsername: string
    senderId: number
    senderPhotoUrl: string
    recipientId: number
    recipientUsername: string
    recipientPhotoUrl: string
    content: string
    dateRead?: Date
    messageSent: Date
  }