import {
    Avatar, Switch, Empty, Input, Button,
    Typography, Collapse, Tree, Upload, Tag, message
} from "antd"
import type { CollapseProps, UploadFile } from 'antd'
import {
    AppstoreAddOutlined, ReloadOutlined, SyncOutlined,
    DownloadOutlined, DeleteOutlined, UploadOutlined,
    PlusOutlined
} from "@ant-design/icons"
import { useState } from "react"
import { usePluginStore } from "@/app/store/plugin"
import { connectPluginSystem, connectDirectory } from "@/app/api/plugin"
import { DirectoryTreeNode, TPlugin, TPluginStore } from "@/app"
import { UploadChangeParam } from "antd/es/upload"

function PluginCard({ index, plugin }: any) {

    const { display, info, disable }: TPlugin = plugin
    const [setting, setSetting] = useState(false)
    const setPluginsAttr = usePluginStore((state: TPluginStore) => state.setPluginsAttr)

    return (
        <div>
            <div className={"flex gap-1 items-center border rounded-xl p-1 " + (setting ? "rounded-b-none" : "")}>
                <div className="hover:cursor-pointer" onClick={() => setSetting(!setting)}>
                    <Avatar shape="square" size="default" icon={<AppstoreAddOutlined />} />
                </div>
                <div className="flex justify-between items-center w-full">
                    <div className="text-sm">
                        <Typography.Text>{display}-{info[0].function.name}</Typography.Text>
                    </div>
                    <div className="min-w-fit">
                        <Switch className='bg-zinc-400' checkedChildren="启用" unCheckedChildren="禁用"
                            defaultChecked={!!!disable}
                            onChange={(v) => setPluginsAttr(index, 'disable', !v)} />
                    </div>
                </div>
            </div>
            <div className={setting ? "border border-t-0 rounded-xl rounded-t-none p-1" : "hidden"}>
                <div className="p-1 text-sm border rounded">
                    {info[0].function.description}
                </div>
                {/* <div>
                    <Empty image={<span>无配置项</span>} imageStyle={{ height: 14 }} description={""} />
                </div> */}
            </div>
        </div>
    )
}

export default function SettingPlugin() {

    const setUrl = usePluginStore((state: TPluginStore) => state.setUrl)
    const url = usePluginStore((state: TPluginStore) => state.url)
    const plugins = usePluginStore((state: TPluginStore) => state.plugins)
    const directory = usePluginStore((state: TPluginStore) => state.directory)
    const [paths, setPaths] = useState<Array<string>>([])
    const [dirs, setDirs] = useState<Array<string>>([])

    const connect = () => {
        connectPluginSystem()
    }

    const treeData = Array(directory)

    const CheckHandler = (checkedKeys: Array<string>, e: { checked: boolean, checkedNodes: Array<DirectoryTreeNode> }) => {
        setPaths(e.checkedNodes.filter(p => p.isLeaf).map(p => p.key))
        setDirs(e.checkedNodes.filter(p => !p.isLeaf).map(p => p.key))
        console.log("files", e.checkedNodes.filter(p => p.isLeaf).map(p => p.key))
        console.log("dirs", e.checkedNodes.filter(p => !p.isLeaf).map(p => p.key))
    }

    const [upload, setUpload] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const uploadAction = (option: any) => {
        return option.onSuccess()
    }
    const uploadFileHandler = (info: UploadChangeParam<UploadFile<any>>) => {
        console.log(info)
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-5);
        setFileList(newFileList)
    }

    const uploadHandler = () => {
        console.log("uploadFileHandler", fileList)
        if (dirs.length === 0) {
            message.warning("请选择目录")
            return
        }
        connectDirectory("upload", dirs, fileList)
    }

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: '插件',
            children: <div className="flex flex-col gap-1">
                {
                    plugins.map((plugin, idx) =>
                        <div key={idx}>
                            <PluginCard index={idx} plugin={plugin}></PluginCard>
                        </div>)
                }
            </div>
        },
        {
            key: '2',
            label: '文件',
            children: <div>
                <div className={upload ? 'border rounded p-1' : 'hidden'}>
                    <div className="mb-1 border-b pb-1">
                        <span>已选目录:</span>
                        {dirs.map(dir => <Tag key={dir}>{dir}</Tag>)}
                    </div>
                    <Upload
                        customRequest={uploadAction}
                        listType="picture-card"
                        multiple
                        fileList={fileList}
                        onChange={uploadFileHandler}
                    >
                        <div className='flex justify-between gap-2 items-center'>
                            <PlusOutlined />
                            <span>添加文件</span>
                        </div>
                    </Upload>
                    <div>
                        <Button type="primary" block onClick={uploadHandler}>上传</Button>
                    </div>
                </div>
                <div className="w-72 overflow-auto">
                    <Tree.DirectoryTree
                        multiple
                        checkable
                        checkStrictly
                        defaultExpandAll
                        //@ts-ignore
                        treeData={treeData}
                        //@ts-ignore
                        onCheck={CheckHandler}
                    />
                </div>
            </div>,
            extra: <div className="flex gap-2">
                <div><SyncOutlined
                    onClick={(e) => {
                        e.stopPropagation()
                        connectDirectory("refresh", [])
                    }}
                /></div>
                <div><DownloadOutlined
                    onClick={(e) => {
                        e.stopPropagation()
                        if (paths.length === 0) {
                            message.warning("请选择文件")
                            return
                        }
                        connectDirectory("download", paths)
                    }}
                /></div>
                <div><UploadOutlined
                    onClick={(e) => {
                        e.stopPropagation()
                        setUpload(!upload)
                    }}
                /></div>
                <div><DeleteOutlined
                    onClick={(e) => {
                        e.stopPropagation()
                        if (paths.length === 0) {
                            message.warning("请选择文件")
                            return
                        }
                        connectDirectory("delete", paths)
                    }}
                /></div>
            </div>
        }
    ]

    return (
        <>
            <div className="m-1 flex gap-1">
                <Input placeholder="插件系统地址" defaultValue={url} value={url}
                    onChange={(e) => setUrl(e.target.value)} />
                <Button shape="circle" icon={<ReloadOutlined />} onClick={connect} />
            </div>
            <div className="h-full m-1 overflow-auto no-scrollbar">
                <Collapse items={items} defaultActiveKey={['1', '2']} size="small" />
            </div>
        </>
    )
}