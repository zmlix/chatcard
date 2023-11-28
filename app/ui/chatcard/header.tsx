import { TSystemStore } from "@/app"
import { useSystemStore } from "@/app/store/system"

export default function ChatHeader() {

    const showHeader = useSystemStore((state: TSystemStore) => state.config.showHeader)

    return (
        <div className={showHeader ? "flex justify-center" : "hidden"}>
            <div className="font-bold text-5xl border-b-2 w-full text-center select-none"
                style={{ color: '#303030' }}>
                ChatCard
            </div>
        </div>
    )
}