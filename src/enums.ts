
export enum Role {
	admin = 'Администратор',
	manager = 'Менеджер',
	client = 'Клиент',
	cook = 'Повар',
	delivery = 'Доставщик'
}

export enum ClientStatus {
	confirmed = 'confirmed',
	not_confirmed = 'not_confirmed'
}

export enum StatusProductLine {
	revelant = 'revelant',
	not_revelant = 'not_revelant'
}

export enum PaymentStateOrder {
	paid = 'paid',
	not_paid = 'not_paid'
}

export enum PaymentMethodOrder {
	cash = 'cash',
	card = 'card'
}

export enum ProcessingOrder {
	confirmed = 'confirmed',
	not_confirmed = 'not_confirmed'
}

export enum StatusOrder {
	in_work = 'in_work',
	completed = 'completed'
}

export enum StatusBid {
	open = 'open',
	close = 'close',
	postponed = 'postponed'
}

export enum DishesType {
	breakfast = 'Завтрак',
	afternoon_tea = 'Полдник',
	lunch = 'Обед',
	dinner = 'Ужин',
	snack = 'Перекус'
}

export enum StageStatus {
	kitchen,
	delivery,
	complited
}