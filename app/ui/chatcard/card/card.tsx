import CardTools from './tool';
import CardMain from './main';
import CardFooter from './footer';
import { useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Card({ mid, chatsStore, systemStore, msg }: any) {

    const { setMessage } = chatsStore
    const { currentChat } = systemStore
    const [skip, setSkip] = useState(msg.skip)
    const [edit, setEdit] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef: preview,
        setActivatorNodeRef: drag,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: mid });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 9999 : undefined
    };

    const foldHandler = () => {
        setMessage(currentChat, msg.id, 'fold', !msg.fold)
    }

    const CTools = {
        foldHandler,
        chatsStore,
        systemStore,
        msg,
        edit,
        setEdit,
        drag,
        listeners
    }

    const CMain = {
        msg,
        edit,
        chatsStore,
        systemStore,
        setEdit
    }

    const CFooter = {
        msg,
        chatsStore,
        systemStore
    }

    return (
        <div ref={preview} className='border rounded w-full bg-white' style={style} {...attributes}>
            <CardTools {...CTools}></CardTools>
            {!msg.fold && <CardMain {...CMain}></CardMain>}
            {!edit && <CardFooter {...CFooter}></CardFooter>}
        </div>
    )
}