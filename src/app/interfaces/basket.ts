export interface Basket {
    id: number,
    created_by_user: string,
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
    active_symbols_count: number,
    followers_count: number,
    created_date: Date,
    updated_date: Date,
    owner_initials: string,
    owner_image: string,
    invested_market: number,
    linked_accounts: number,
    basket_subscribers: number,
    is_owner : boolean,
    is_favorite: boolean,
    basket_favorites: number,
    is_subscribed: boolean,
    tags: string
}
