
export type TModalView =
  | 'DELETE_CONFIRM'
  | 'WRITE_REVIEW'
  | 'SUSPEND_CONFIRM'
  | 'ADD_ADMIN'
  | 'EDIT_ADMIN'
  | 'STATUS_CHANGE_CONFIRM'
  | 'VIEW_EBOOK'
  | 'NONE';

export interface IOpenModalProps {
  view: TModalView;
  data?: any;
  title?: string;
  description?: string;
}

export interface IModalState {
  isOpen: boolean;
  view: TModalView;
  data: any;
  title: string;
  description: string;
}

export type TModalAction =
  | {
      type: 'OPEN_MODAL';
      payload: IOpenModalProps;
    }
  | { type: 'CLOSE_MODAL' };

export interface IModalContextType extends IModalState {
  openModal: (props: IOpenModalProps) => void;
  closeModal: () => void;
}
