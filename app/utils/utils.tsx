export function formatDate(date: Date): string {
    console.log(date, typeof date)
    if (typeof date === 'string') {
        date = new Date(date)
    }
    return `${date.toISOString().split('T')[0].replaceAll('-', '/')} ${date.toISOString().split('T')[1].split('.')[0]}`
}

export function objectInfo(obj: { [key: string | number]: any; }) {
    return (
        <ul>
            {Object.keys(obj).map((o: string | number, idx) => (<li key={idx}>{o}:{obj[o]}</li>))}
        </ul>
    )
}

export const random32BitNumber = () => {
    const maxInt32 = 0xffffffff
    return Math.floor(Math.random() * maxInt32)
}