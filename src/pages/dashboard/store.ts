import { createStore } from 'redux';

// Defina o estado inicial
interface AppState {
  listaItens: { lacre: string; imagem: File }[];
}

const initialState: AppState = {
  listaItens: [],
};

// Defina as ações
const SET_LISTA_ITENS = 'SET_LISTA_ITENS';

interface SetListaItensAction {
  type: typeof SET_LISTA_ITENS;
  payload: { lacre: string; imagem: File }[];
}

type AppActionTypes = SetListaItensAction;

// Defina o reducer
const reducer = (state = initialState, action: AppActionTypes): AppState => {
  switch (action.type) {
    case SET_LISTA_ITENS:
      return {
        ...state,
        listaItens: action.payload,
      };
    default:
      return state;
  }
};

// Crie a store
const store = createStore(reducer);

export default store;

export type RootState = ReturnType<typeof store.getState>;
