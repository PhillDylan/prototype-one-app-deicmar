import { createStore } from 'redux';

// Defina o estado inicial
interface AppState {
  listaItens: { lacre: string; imagem: Buffer }[];
  mensagemFetch: boolean | null;
}

const initialState: AppState = {
  listaItens: [],
  mensagemFetch: null,
};


// Defina as ações
const SET_LISTA_ITENS = 'SET_LISTA_ITENS';

interface SetListaItensAction {
  type: typeof SET_LISTA_ITENS;
  payload: { lacre: string; imagem: Buffer }[];
}

const SET_MENSAGEM_FETCH = 'SET_MENSAGEM_FETCH';

interface SetMensagemFetchAction {
  type: typeof SET_MENSAGEM_FETCH;
  payload: boolean;
}

type AppActionTypes = SetListaItensAction | SetMensagemFetchAction;


// Defina o reducer
const reducer = (state = initialState, action: AppActionTypes): AppState => {
  switch (action.type) {
    case SET_LISTA_ITENS:
      return {
        ...state,
        listaItens: action.payload,
      };
    case SET_MENSAGEM_FETCH:
      return {
        ...state,
        mensagemFetch: action.payload,
      };
    default:
      return state;
  }
};


// Crie a store
const store = createStore(reducer);

export default store;

export type RootState = ReturnType<typeof store.getState>;
