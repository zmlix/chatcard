// import  {useSt}
import { formatDate, objectInfo } from '@/app/utils/utils'
import {
    SyncOutlined, CloseOutlined, FormOutlined,
    MenuOutlined, LineOutlined, UserOutlined,
    SettingFilled
} from '@ant-design/icons';
import { Button, Avatar, Tooltip, Dropdown } from 'antd';
import type { MenuProps } from 'antd';


export default function CardTools({ chatsStore, systemStore, msg, foldHandler, edit, setEdit,
    drag, listeners }: any) {

    const { removeMessage, setMessage } = chatsStore
    const { currentChat } = systemStore


    const delMessageHandler = () => {
        removeMessage(currentChat, msg.id)
    }

    const editMessageHandler = () => {
        if (msg.fold) {
            return
        }
        setEdit(!edit)
    }

    const roles: MenuProps['items'] = [
        {
            key: 'system',
            label: <div><Avatar className='bg-green-700' icon={<SettingFilled />} /> 系统</div>
        },
        {
            key: 'assistant',
            label: <div><Avatar className='bg-green-700 p-0.5' src='/ChatGPT_white.png' /> 助理</div>
        },
        {
            key: 'user',
            label: <div><Avatar className='bg-green-700' icon={<UserOutlined />} /> 用户</div>
        }
    ]

    const switchRole: MenuProps['onClick'] = ({ key }) => {
        setMessage(currentChat, msg.id, 'role', key)
    };

    return (
        <div className='border-b flex justify-between items-center p-0.5'>
            <div className='flex items-center gap-1 text-xs'>
                <div className='bg-green-700 rounded-full w-8'>
                    <Dropdown menu={{ items: roles, onClick: switchRole }} arrow>
                        <div className='hover:cursor-pointer'>
                            {msg.role === 'assistant' && <Avatar className='bg-green-700 p-0.5' src='/ChatGPT_white.png' />}
                            {msg.role === 'user' && <Avatar className='bg-green-700' icon={<UserOutlined />} />}
                            {msg.role === 'system' && <Avatar className='bg-green-700' icon={<SettingFilled />} />}
                        </div>
                    </Dropdown>
                </div>
                <div className='w-max mr-2'>
                    {formatDate(msg.updateTime)}
                </div>
            </div>
            <div ref={drag} className='hover:cursor-move w-full h-7' {...listeners} ></div>
            <div>
                <div className='flex'>
                    {msg.fold ? <Tooltip title="展开" getPopupContainer={(triggerNode) => triggerNode}>
                        <Button type="text" size='small' shape="circle" icon={<MenuOutlined />} onClick={foldHandler} />
                    </Tooltip> : <Tooltip title="折叠" getPopupContainer={(triggerNode) => triggerNode}>
                        <Button type="text" size='small' shape="circle" icon={<LineOutlined />} onClick={foldHandler} />
                    </Tooltip>}
                    <Tooltip title="编辑" getPopupContainer={(triggerNode) => triggerNode}>
                        <Button type="text" size='small' shape="circle" icon={<FormOutlined />} onClick={editMessageHandler} />
                    </Tooltip>
                    <Tooltip title="重发" getPopupContainer={(triggerNode) => triggerNode}>
                        <Button type="text" size='small' shape="circle" icon={<SyncOutlined />} />
                    </Tooltip>
                    <Tooltip title="删除" getPopupContainer={(triggerNode) => triggerNode}>
                        <Button type="text" size='small' shape="circle" icon={<CloseOutlined />} onClick={delMessageHandler} />
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}