import { createStore } from 'redux';


// Defina o estado inicial
interface AppState {
  listaItens: { lacre: string; imagem: File }[];
}

const initialState: AppState = {
  listaItens: loadState(),
};

// Carregar o estado do sessionStorage
function loadState(): AppState['listaItens'] {
  try {
    const serializedState = sessionStorage.getItem('listaItens');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log(err);
    return [];
  }
}

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
      const newState = {
        ...state,
        listaItens: action.payload,
      };
      saveState(newState.listaItens);
      return newState;
    default:
      return state;
  }
};

// Salvar o estado no sessionStorage
function saveState(state: AppState['listaItens']) {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem('listaItens', serializedState);
  } catch (err) {
    console.log(err);
  }
}

// Crie a store
const store = createStore(reducer);

export default store;

export type RootState = ReturnType<typeof store.getState>;
