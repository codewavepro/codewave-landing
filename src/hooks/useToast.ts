import toast, {ToastOptions} from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading';

interface UseToastProps {
    showToast: (message: string, type?: ToastType, options?: ToastOptions) => string | number;
    showPromiseToast: <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((err: any) => string);
        },
        options?: ToastOptions
    ) => Promise<T>;
    dismissAllToasts: () => void;
}

const defaultStyles = {
    background: '#1B1B1B',
    color: '#ffffff',
    borderRadius: '4px',
    border: '1px solid transparent',
    padding: '16px',
    boxShadow:
        '0px 4px 4px 0px rgba(0, 0, 0, 0.25),' +
        '0px 4px 4px 0px rgba(0, 0, 0, 0.25),' +
        '0px 2px 4px 0px rgba(0, 0, 0, 0.40),' +
        '0px 7px 13px -3px rgba(0, 0, 0, 0.30),' +
        '0px -3px 0px 0px rgba(0, 0, 0, 0.20) inset'
}

const successStyles = {
    ...defaultStyles,
    borderColor: "#2ecc71",
};

const errorStyles = {
    ...defaultStyles,
    borderColor: "#e74c3c",
};

export default function useToast(): UseToastProps {
    const showToast = (
        message: string,
        type: ToastType = 'success',
        options?: ToastOptions
    ): string | number => {
        const baseOptions: ToastOptions = {
            duration: 4000,
            position: 'top-right',
            ...options,
        };

        switch (type) {
            case 'success':
                return toast.success(message, {
                    ...baseOptions,
                    style: { ...successStyles, ...(options?.style || {}) },
                });
            case 'error':
                return toast.error(message, {
                    ...baseOptions,
                    style: { ...errorStyles, ...(options?.style || {}) },
                });
            case 'loading':
                return toast.loading(message, {
                    ...baseOptions,
                    style: { ...defaultStyles, ...(options?.style || {}) },
                });
            default:
                return toast(message, {
                    ...baseOptions,
                    style: { ...defaultStyles, ...(options?.style || {}) },
                });
        }
    };


    const showPromiseToast = <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((err: any) => string);
        },
        options?: ToastOptions
    ): Promise<T> => {
        const baseOptions: ToastOptions = {
            position: 'top-right',
            ...options,
        };

        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            {
                loading: {
                    ...baseOptions,
                    style: { ...defaultStyles, ...(options?.style || {}) },
                },
                success: {
                    ...baseOptions,
                    style: { ...successStyles, ...(options?.style || {}) },
                },
                error: {
                    ...baseOptions,
                    style: { ...errorStyles, ...(options?.style || {}) },
                },
            }
        );
    };

    const dismissAllToasts = () => {
        toast.dismiss();
    };

    return {
        showToast,
        showPromiseToast,
        dismissAllToasts,
    };
}