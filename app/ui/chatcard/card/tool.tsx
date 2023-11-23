import { formatDate, objectInfo } from '@/app/utils/utils'
import {
    SyncOutlined, CloseOutlined, FormOutlined,
    MenuOutlined, LineOutlined, UserOutlined,
    SettingFilled
} from '@ant-design/icons';
import { Button, Avatar, Tooltip, Dropdown, Switch } from 'antd';
import type { MenuProps } from 'antd';
import { memo } from 'react';

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

export default memo(function CardTools({ updateTime, role, fold, foldHandler, editMessageHandler,
    sendMessageHandler, delMessageHandler, switchRole, render, skip, renderHandler, skipHandler, }: any) {
    console.log("tool")

    return (
        <div className='border-b flex justify-between items-center p-0.5'>
            <div className='flex items-center gap-1 text-xs pl-1'>
                <div className='bg-green-700 rounded-full w-8'>
                    <Dropdown menu={{ items: roles, onClick: switchRole }} arrow>
                        <div className='hover:cursor-pointer'>
                            {role === 'assistant' && <Avatar className='bg-green-700 p-0.5' src='/ChatGPT_white.png' />}
                            {role === 'user' && <Avatar className='bg-green-700' icon={<UserOutlined />} />}
                            {role === 'system' && <Avatar className='bg-green-700' icon={<SettingFilled />} />}
                        </div>
                    </Dropdown>
                </div>
                <div className='flex flex-col w-max mr-2'>
                    <span>
                        {formatDate(updateTime)}
                    </span>
                    <span className='font-sans'>
                        {role === 'system' && <span>系统</span>}
                        {role === 'assistant' && <span>助理</span>}
                        {role === 'user' && <span>用户</span>}
                    </span>
                </div>
            </div>
            {/* <div ref={drag} className='hover:cursor-move w-full h-7' {...listeners} ></div> */}
            <div className='flex flex-col pb-1 pr-1'>
                <div className='flex'>
                    {fold ? <Tooltip title="展开" getPopupContainer={(triggerNode) => triggerNode}>
                        <Button type="text" size='small' shape="circle" icon={<MenuOutlined />}
                            onClick={foldHandler} />
                    </Tooltip> : <Tooltip title="折叠" getPopupContainer={(triggerNode) => triggerNode}>
                        <Button type="text" size='small' shape="circle" icon={<LineOutlined />}
                            onClick={foldHandler} />
                    </Tooltip>}
                    <Tooltip title="编辑" getPopupContainer={(triggerNode) => triggerNode}>
                        <Button type="text" size='small' shape="circle" icon={<FormOutlined />}
                            onClick={editMessageHandler} />
                    </Tooltip>
                    <Tooltip title="重发" getPopupContainer={(triggerNode) => triggerNode}>
                        <Button type="text" size='small' shape="circle" icon={<SyncOutlined />}
                            onClick={sendMessageHandler} />
                    </Tooltip>
                    <Tooltip title="删除" getPopupContainer={(triggerNode) => triggerNode}>
                        <Button type="text" size='small' shape="circle" icon={<CloseOutlined />}
                            onClick={delMessageHandler} />
                    </Tooltip>
                </div>
                <div className='flex gap-1 items-center justify-end'>
                    <Switch size="small" className='bg-zinc-400' checkedChildren="渲染"
                        unCheckedChildren="渲染" checked={render} onChange={renderHandler} />
                    <Switch size="small" className='bg-zinc-400' checkedChildren="跳过"
                        unCheckedChildren="跳过" checked={skip} onChange={skipHandler} />
                </div>
            </div>
        </div>
    )
})