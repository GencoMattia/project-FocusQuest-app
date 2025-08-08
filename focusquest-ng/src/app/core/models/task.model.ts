export interface Category { id: number; name: string; color?: string }
export interface Priority { id: number; name: string; color?: string }
export interface Status { id: number; name: string; color?: string }
export interface Moment { id: number; name: string; message?: string; task_id: number; emotion_id?: number; moments_type_id?: number }

export interface Task {
  id: number;
  name: string;
  description?: string;
  estimated_time: number;
  category?: Category;
  priority?: Priority;
  status?: Status;
  status_id?: number;
  moments?: Moment[];
  started_at?: string | null;
  deadline?: string | null;
}
