export interface LoaderDetails {
  id: number;
  message: string;
  status: 'In Progress' | 'Complete';
}

export interface LoadingState {
  auth: boolean;
  loaders: Array<LoaderDetails>;
  totalLoaders: number;
  isLoading: boolean;
  message: string;
}

export const initialLoadingState: LoadingState = {
  auth: false,
  totalLoaders: 0,
  loaders: [],
  isLoading: false,
  message: ''
}
