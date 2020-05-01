export interface FeedbackOption {
  id: string;
  name: string;
}

export interface Feedback {
  userId: string;
  storeId: string;
  optionId: string;
  description: string;
  longitude: string;
  latitude: string;
  createdAt: Date;
}
