import { Select, Spin } from 'antd';
import { memo } from "react";
import { useSystemStore } from '@/app/store/system';
import { TSystemStore } from '@/app';

export default memo(function CardFooter({ loading, role, fold, message, model, modelHandler }: any) {
    const modelOptions = useSystemStore((state: TSystemStore) => state.models)

    return (
        <>
            {fold && <div className='flex w-80'>
                <div className='truncate text-ellipsis p-2'>
                    {message}
                </div>
            </div>}
            <div className='flex justify-between border-t'>
                <div className='ml-2'><Spin className={loading ? '' : 'hidden'} size="small" /></div>
                <div className='w-max mb-0.5 h-6'>
                    {role === 'user' ? <Select
                        bordered={false}
                        defaultValue={model}
                        size="small"
                        style={{ width: 200, textAlign: 'right' }}
                        onChange={modelHandler}
                        options={modelOptions}
                    /> : <span className='mr-3 font-serif text-sm'>{model}</span>}
                </div>
            </div>
        </>
    )
})