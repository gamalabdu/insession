import Stripe from "stripe";

export interface UserDetails {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export interface Song {
  id: string;
  user_id: string;
  author: string;
  title: string;
  song_path: string;
  image_path: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  created_at: string;
  is_enabled: boolean;
  first_name: string;
  last_name: string;
}

export interface Job {
  user_id: string;
  created_by: string;
  created_at: string;
  job_id: string;
  job_title: string;
  job_description: string;
  additional_info: string;
  genre: string;
  budget: number;
}

export interface Product {
  id: string;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}

export interface Price {
  id: string;
  product_id?: string;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Stripe.Metadata;
  products?: Product;
}

export interface Subscription {
  id: string;
  user_id: string;
  status?: Stripe.Subscription.Status;
  metadata?: Stripe.Metadata;
  price_id?: string;
  quantity?: number;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  prices?: Price;
}

export interface Message {
  message_id: string;
  conversation_id: string;
  sender_id: string;
  message_type: string;
  content: string;
  seen: boolean;
  sent_at: string;
}

export interface Conversation {
  conversation_id: string;
  created_at: string;
  participant_ids: string;
  participants_names: string;
}

export interface Participant {
  participant_id: string;
  joined_at: string;
  user_id: string;
  conversation_id: string;
}
