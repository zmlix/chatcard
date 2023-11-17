import { Button } from "antd"

export default function Footer({onOpenSetting}:any) {
    return (
        <div className="flex flex-col gap-1">
            <Button type="primary" danger onClick={onOpenSetting}>关闭</Button>
            <div className="flex justify-center border border-dashed rounded p-1">
                Star on<Button type="link" size="small">GitHub</Button>@zmlix
            </div>
        </div>
    )
}