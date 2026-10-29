import { useCallback, useState, type FC, type ReactNode } from 'react';

// Пропсы компонента
interface ModalProps {
    title: string;
    open: boolean;
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    onClose: (reason: CloseReason) => void;
}

type CloseReason = 'backdrop' | 'escape' | 'button';

const SIZES: Record<NonNullable<ModalProps['size']>, number> = { sm: 320, md: 480, lg: 720 };

export const Modal: FC<ModalProps> = ({ title, open, size = 'md', children, onClose }) => {
    const [closing, setClosing] = useState<boolean>(false);

    const handleKey = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Escape') onClose('escape');
        },
        [onClose],
    );

    if (!open) return null;

    return (
        <div className="backdrop" role="presentation" onClick={() => onClose('backdrop')}>
            {/* Диалог */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                style={{ width: SIZES[size], opacity: closing ? 0.5 : 1 }}
                onKeyDown={handleKey}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="modal-title">{title}</h2>
                {children}
                <Button variant="ghost" onClick={() => { setClosing(true); onClose('button'); }}>
                    Закрыть
                </Button>
            </div>
        </div>
    );
};

function Button<T extends string>({ variant, ...props }: { variant: T } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button className={`btn btn--${variant}`} type="button" {...props} />;
}

export default Modal;
