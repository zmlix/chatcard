import { Button, Collapse, Input, message, Empty } from "antd";
import {
    PushpinOutlined, SmileOutlined,
    CopyOutlined, SearchOutlined, PlusOutlined,
    EditOutlined, DeleteOutlined
} from "@ant-design/icons";
import { ChangeEvent, useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import { useSystemStore } from "@/app/store/system"
import { TSystemStore } from "@/app";

function Prompt({ prompts, addPrompt, editPrompt, removePrompt }: any) {
    const { TextArea } = Input
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [context, setContext] = useState('')
    const [ptype, setPtype] = useState('')
    const [filterPrompts, setFilterPrompts] = useState(prompts)
    const [search, setSearch] = useState('')

    useEffect(() => {
        console.log("change prompts")
        setFilterPrompts(prompts.filter((p: any) =>
            (p.act.indexOf(search) !== -1 || p.prompt.indexOf(search) !== -1)))
    }, [prompts, search])

    const addPromptHandler = () => {
        if (title === "" && context === "" && open) {
            setOpen(false)
            return
        }
        setTitle('')
        setContext('')
        setPtype('')
        if (!open) {
            setOpen(!open)
        }
    }

    const removePromptHandler = () => {
        removePrompt(title)
        message.success({
            content: "删除成功"
        })
        setOpen(false)
    }

    const savePromptHandler = () => {
        if (title === "" || context === "") {
            message.warning({
                content: "请输入完整"
            })
            return
        }
        if (ptype === "user") {
            editPrompt(title, context)
            message.success({
                content: "修改成功"
            })
        } else {
            if (!addPrompt({ act: title, prompt: context, type: 'user' })) {
                message.error({
                    content: "存在同名提示词标题"
                })
                return
            }
            message.success({
                content: "添加成功"
            })
        }
        setOpen(false)
    }

    const promptList = filterPrompts.map((p: any, idx: number) => ({
        key: idx,
        label: p.act,
        children: p.prompt,
        extra: <div className="flex gap-2 pt-1">
            {p.type && <EditOutlined onClick={(e) => {
                setOpen(true)
                setTitle(p.act)
                setContext(p.prompt)
                setPtype('user')
                e.stopPropagation()
            }} />}
            <CopyOutlined onClick={(e) => {
                copy(p.prompt)
                message.success({
                    content: '复制成功'
                })
                e.stopPropagation()
            }} />
        </div>
    }))

    const searchPromptHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setFilterPrompts(prompts.filter((p: any) =>
            (p.act.indexOf(e.target.value) !== -1 || p.prompt.indexOf(e.target.value) !== -1)))
    }

    return (
        <div className="flex flex-col overflow-scroll no-scrollbar">
            <div className="flex gap-1 mb-1">
                <Input size="middle" placeholder="搜索提示词" prefix={<SearchOutlined />} allowClear
                    value={search} onChange={searchPromptHandler} />
                {search === "" && <Button type="primary" icon={<PlusOutlined />} onClick={addPromptHandler}>添加</Button>}
            </div>
            <div className={open ? "flex flex-col gap-2 border rounded-2xl p-2 mb-1" : "hidden"}>
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <span>标题</span>
                        {ptype === "user" &&
                            <Button type="primary" size="small" danger icon={<DeleteOutlined />}
                                onClick={removePromptHandler}>删除</Button>}
                    </div>
                    <div><Input value={title} onChange={(e) => setTitle(e.target.value)}
                        placeholder="给提示词起个标题" /></div>
                </div>
                <div className="flex flex-col gap-1">
                    <span>内容</span>
                    <div><TextArea value={context} onChange={(e) => setContext(e.target.value)}
                        placeholder="请输入提示词" autoSize={{ minRows: 3, maxRows: 20 }} /></div>
                </div>
                <div className="flex gap-1">
                    <Button type="primary" block onClick={savePromptHandler}>保存</Button>
                    <Button block onClick={() => setOpen(false)}>返回</Button>
                </div>
            </div>
            <div className="overflow-scroll no-scrollbar">
                {promptList.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无匹配的提示词" />}
                {promptList.length !== 0 && <Collapse items={promptList} className=" bg-white" expandIcon={() => <PushpinOutlined />} />}
            </div>
        </div >
    )
}


function RoleCard() {

}


function Role({ roles }: any) {
    const [search, setSearch] = useState('')
    const [filterRoles, setFilterRoles] = useState(roles)

    const searchPromptHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setFilterRoles(roles.filter((p: any) =>
            (p.act.indexOf(e.target.value) !== -1 || p.prompt.indexOf(e.target.value) !== -1)))
    }

    const addPromptHandler = () => {

    }

    const roleList = filterRoles.map((r: any, idx: number) => ({
        key: idx,
        label: r.name,
        children: r.prompts,
        extra: <div className="flex gap-2 pt-1"></div>
    }))



    return (
        <div className="flex flex-col overflow-scroll no-scrollbar">
            <div className="flex gap-1 mb-1">
                <Input size="middle" placeholder="搜索角色" prefix={<SearchOutlined />} allowClear
                    value={search} onChange={searchPromptHandler} />
                {search === "" && <Button type="primary" icon={<PlusOutlined />} onClick={addPromptHandler}>添加</Button>}
            </div>
            <div className="overflow-scroll no-scrollbar">
                {roleList.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无匹配的角色" />}
                {roleList.length !== 0 && <Collapse items={roleList} className=" bg-white" expandIcon={() => <PushpinOutlined />} />}
            </div>
        </div >
    )
}


export default function SettingPrompt() {
    console.log("SettingPrompt")
    type Tab = 'prompt' | 'role'
    const [tab, setTab] = useState<Tab>('prompt')

    const prompts = useSystemStore((state: TSystemStore) => state.prompts)
    const addPrompt = useSystemStore((state: TSystemStore) => state.addPrompt)
    const editPrompt = useSystemStore((state: TSystemStore) => state.editPrompt)
    const removePrompt = useSystemStore((state: TSystemStore) => state.removePrompt)

    const setTabHandler = (t: Tab) => () => {
        setTab(t)
    }

    const promptProps = {
        prompts: prompts.prompt,
        addPrompt,
        editPrompt,
        removePrompt
    }

    const roleProps = {
        roles: prompts.role
    }

    return (
        <div className="flex flex-col h-full m-1 gap-2 overflow-auto">
            <Button.Group className="w-full">
                <Button icon={<PushpinOutlined />} block shape="round"
                    type={tab === 'prompt' ? 'primary' : undefined}
                    onClick={setTabHandler("prompt")}>提示词</Button>
                <Button icon={<SmileOutlined />} block shape="round"
                    type={tab === 'role' ? 'primary' : undefined}
                    onClick={setTabHandler("role")}>角色</Button>
            </Button.Group>

            {{
                "prompt": <Prompt {...promptProps}></Prompt>,
                "role": <Role {...roleProps}></Role>
            }[tab]}

        </div>
    )
}