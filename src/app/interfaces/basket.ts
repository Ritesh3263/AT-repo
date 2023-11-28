export interface Basket {
    id: number,
    name: string,
    description: string,
    invested_value: number,
    public: boolean,
    percent_change: number,
    value_change: number,
    account: string | null,
    following: boolean,
    linked_accounts_count: number,
    symbols_count: number,
    followers_count: number,
    created_date: Date,
    updated_date: Date,
    owner_image: string
}
