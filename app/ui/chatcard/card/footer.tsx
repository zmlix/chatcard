import { Select, Spin } from 'antd';
import { memo } from "react";
import { useSystemStore } from '@/app/store/system';
import { TSystemStore } from '@/app';

export default memo(function CardFooter({ loading, role, fold, message, model, status, modelHandler }: any) {
    const modelOptions = useSystemStore((state: TSystemStore) => state.models)

    return (
        <>
            {fold && <div className='flex'>
                <div className='truncate text-ellipsis p-2'>
                    {message}
                </div>
            </div>}
            {!fold && <div className='flex justify-between items-center border-t h-6'>
                <div className='ml-2'><Spin spinning={!!loading} size="small" /></div>
                <div className='w-max'>
                    {role === 'user' ? <Select
                        bordered={false}
                        defaultValue={model}
                        size="small"
                        className='font-serif text-sm w-52 text-right'
                        onChange={modelHandler}
                        options={modelOptions}
                    /> : <span className='mr-3 font-serif block text-sm' style={{ color: '#000000E0' }}>
                        {status === 'success' ? model : status}
                    </span>}
                </div>
            </div>}
        </>
    )
})