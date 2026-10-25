'use client';

import {
  IModalContextType,
  IModalState,
  IOpenModalProps,
  TModalAction,
} from '@/types/customModal.types';
import { createContext, useContext, useReducer } from 'react';

const initialState: IModalState = {
  isOpen: false,
  view: 'NONE',
  data: null,
  title: '',
  description: '',
};

const modalReducer = (state: IModalState, action: TModalAction): IModalState => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        isOpen: true,
        view: action.payload.view,
        data: action.payload.data || null,
        title: action.payload.title || '',
        description: action.payload.description || '',
      };
    case 'CLOSE_MODAL':
      return initialState;
    default:
      return state;
  }
};

export const ModalContext = createContext<IModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const openModal = (props: IOpenModalProps) => {
    dispatch({
      type: 'OPEN_MODAL',
      payload: props,
    });
  };

  const closeModal = () => {
    dispatch({
      type: 'CLOSE_MODAL',
    });
  };
  return (
    <ModalContext.Provider value={{ ...state, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};
