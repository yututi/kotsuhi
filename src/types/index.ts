export interface Input {
    id?: number
    date: number
    contact: string
    from: string
    to: string
    transportation: string
    cost?: number
    memo: string
    isRoundTrip: boolean
    isChecked: boolean
}

export interface BulkInput {
    id?: number[]
    date: number[]
    contact: string
    from: string
    to: string
    transportation: string
    cost?: number
    memo: string
    isRoundTrip: boolean
}

export interface InputEntity {
    id?: number
    ymd: Date
    contact: string
    from: string
    to: string
    transportation: string
    cost?: number
    memo: string
    isRoundTrip: boolean
}

export const TransportationTypes = [
    {
        value: "1",
        label: "電車"
    },
    {
        value: "2",
        label: "飛行機"
    },
    {
        value: "3",
        label: "タクシー"
    }
]

export function defaultInput(): Input {
    return {
        date: 1,
        contact: "",
        from: "",
        to: "",
        transportation: TransportationTypes[0].value,
        cost: 0,
        memo: "",
        isRoundTrip: false,
        isChecked: false
    }
}

export interface ModalConfig {
    show?: boolean
    slot?: string
    title?: string
    expandOnSp?: boolean
    header?: boolean
}

const DefaultModalConfig: ModalConfig = {
    show: true,
    slot: "default",
    header: true
}

export function createModalConfig(options: ModalConfig) {
    return {
        ...DefaultModalConfig,
        ...options
    }
}