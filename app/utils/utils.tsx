export function formatDate(date: Date): string {
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export function objectInfo(obj:{[key: string | number]: any;}){
    return (
        <ul>
            {Object.keys(obj).map((o:string | number, idx) => (<li key={idx}>{o}:{obj[o]}</li>))}
        </ul>
    )
}

export const random32BitNumber = () => {
    const maxInt32 = 0xffffffff
    return Math.floor(Math.random() * maxInt32)
  }