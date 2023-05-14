
interface IReturnDataSuccess {
	success: boolean;
	data: any;
}

interface IReturnDataError {
	success: boolean;
	error: string;
}

interface IDishesCompound {
	product: string;
	parametrs: string;
}