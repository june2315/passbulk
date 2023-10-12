import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { propsMessage, messageOption, messageQueueItem } from './type';
import { uuid } from '../../common/utils';
import useCssClassManager from '../../common/hooks/useCssClassManager';
import { successIcon } from '../../components/Icons';

const CONTAINER_ID = 'wdu-message__container';
const MESSAGE_QUEUE: Array<messageQueueItem> = [];

function createContainer() {
    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
        container = document.createElement('div');
        container.setAttribute('id', CONTAINER_ID);
        container.setAttribute(
            'class',
            'fixed top-0 w-screen z-50 pointer-events-none'
        );
        document.body.appendChild(container);
    }
    return container;
}

function addMessage(params: messageOption) {
    const id = uuid(8);
    MESSAGE_QUEUE.push({ ...params, id });
    renderMessage([...MESSAGE_QUEUE]);
}

function removeMessage(id: any) {
    const position = MESSAGE_QUEUE.findIndex((item) => item.id === id);
    MESSAGE_QUEUE.splice(position, 1);
    renderMessage([...MESSAGE_QUEUE]);
    // el.remove();
}

function BaseMessage(props: any) {
    const { type, message, id } = props;

    const refMessage = useRef<any>();

    const classMap = {
        base: '',
        visible: 'animate-fade-in',
        hidden: 'animate-fade-out',
    };

    const { addClassName, classList } = useCssClassManager(classMap);

    const clear = () => removeMessage(id);
    const handleHidden = () => {
        if (refMessage.current) {
            refMessage.current.addEventListener('animationend', clear, {
                once: true,
            });
        }
        addClassName('hidden');
    };

    useEffect(() => {
        addClassName('visible');

        setTimeout(() => {
            handleHidden();
        }, 1500);
    }, []);

    return (
        <div
            ref={refMessage}
            className={`wdu-message wdu-message__${type} relative my-2 w-max mx-auto text-neutral-700 opacity-0 ${classList} will-change-transform transition-all duration-75`}
        >
            <p className="flex items-center space-x-2 bg-white p-2 rounded-sm text-sm">
                <i className="inline-block text-[#52c41a]">{successIcon}</i>
                <span>{message}</span>
            </p>
        </div>
    );
}

let containerRoot: any;
function renderMessage(messageQueue: Array<any>) {
    const container = createContainer();
    if (!containerRoot) {
        containerRoot = createRoot(container);
    }

    const MessageComponents = messageQueue.map((props) => {
        return <BaseMessage {...props} key={props.id} />;
    });

    containerRoot.render(MessageComponents);
}

const Message: propsMessage = {
    info: (message: string) => addMessage({ type: 'info', message }),
    warn: (message: string) => addMessage({ type: 'warning', message }),
    error: (message: string) => addMessage({ type: 'error', message }),
    success: (message: string) => addMessage({ type: 'success', message }),
};

export default Message;
