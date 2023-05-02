import {createSlice} from '@reduxjs/toolkit';

export interface AppData {
  source: {
    id: null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface AppType {
  theme: 'dark' | 'light';
  lang: 'en' | 'ar';
}

export interface AppState extends AppType {
  state: {payload: any; type: string};
  data: AppData[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  data: [],
  theme: 'light',
  lang: 'en',
  loading: false,
  error: null,
  state: {
    payload: undefined,
    type: '',
  },
};

const carSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loadNews: (state: AppState, {payload}) => {
      state.data = payload;
      return state;
    },
    langToggle: (state: AppState, {payload}) => {
      state.lang = payload;
      return state;
    },
    loadingToggle: (state: AppState) => {
      state.loading = !state.loading;
      state.error = null;
      return state;
    },
  },
});

export const {loadNews, loadingToggle, langToggle} = carSlice.actions;
export default carSlice.reducer;

export const fetchNews =
  (category: string, language: string) => async (dispatch: Function) => {
    dispatch(loadNews([]));
    dispatch(loadingToggle());

    const today = new Date();
    const pastDate = new Date(today.setDate(today.getDate() - 25));
    const formattedDate = pastDate.toLocaleDateString('en-CA');
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${category}&language=${language}&from=${formattedDate}&sortBy=publishedAt&apiKey=5d0d49e595dc4b64a2fd3916b617ad8c`,
      );
      const news = await response.json();
      dispatch(loadingToggle());
      dispatch(loadNews(news?.articles));
    } catch (error: any) {
      dispatch(loadingToggle());
    }
  };

// Api key = b6b8a180d8f2403dbc0d7090770f7364
