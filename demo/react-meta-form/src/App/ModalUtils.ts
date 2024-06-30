import { Modal, ModalFuncProps } from 'antd';

export const ModalUtils = {
  info: (
    message: ModalFuncProps['content'],
    options: Omit<ModalFuncProps, 'content' | 'onOk' | 'onCancel'> = {},
  ): Promise<void> => {
    return new Promise((res) =>
      Modal.info({
        ...options,
        content: message,
        onOk: () => res(),
        onCancel: () => res(),
      }),
    );
  },

  error: (
    message: ModalFuncProps['content'],
    options: Omit<ModalFuncProps, 'content' | 'onOk' | 'onCancel'> = {},
  ): Promise<void> => {
    return new Promise((res) =>
      Modal.error({
        ...options,
        content: message,
        onOk: () => res(),
        onCancel: () => res(),
      }),
    );
  },
};
