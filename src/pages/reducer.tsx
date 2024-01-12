import React, { useReducer, useEffect, useState } from 'react';
import EditUserModal from './edit';

import { User, TableState, TableAction } from '../types';

import LoaderSpinner from '../components/loader';

const SET_USERS = 'SET_USERS';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

const tableReducer = (state: TableState, action: TableAction): TableState => {
	switch (action.type) {
		case SET_USERS:
			return { ...state, users: action.payload as User[], loading: false };
		case SET_LOADING:
			return { ...state, loading: true };
		case SET_ERROR:
			return { ...state, error: action.payload as string, loading: false };
		default:
			return state;
	}
};

const initialState: TableState = {
	users: [],
	loading: false,
	error: null,
};


const TableComponent: React.FC = () => {
	const [state, dispatch] = useReducer(tableReducer, initialState);
	const [editingUser, setEditingUser] = useState<User | null>(null);

	const fetchUsers = async () => {
		dispatch({ type: SET_LOADING });
		try {
			const response = await fetch('https://jsonplaceholder.typicode.com/users');
			const data = await response.json();
			dispatch({ type: SET_USERS, payload: data });
		} catch (error) {
			dispatch({ type: SET_ERROR, payload: 'An error occurred while fetching users' });
		}
	};

	const handleDelete = (userId: number) => {
		dispatch({ type: SET_USERS, payload: state.users.filter((user) => user.id !== userId) });
	};

	const handleEdit = (user: User) => {
		setEditingUser(user);
	};

	const handleEditSave = (user: User) => {
		const updatedUsers = state.users.map((u) => (u.id === user.id ? user : u));
		dispatch({ type: SET_USERS, payload: updatedUsers });
		setEditingUser(null);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<>
			{state.loading ? (
				<LoaderSpinner />
			) : (
				<div className="relative overflow-x-auto shadow-md sm:rounded-lg m-[50px]">
					<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th className="px-6 py-3">ID</th>
								<th className="px-6 py-3">Name</th>
								<th className="px-6 py-3">Username</th>
								<th className="px-6 py-3">Email</th>
								<th className="px-6 py-3">City</th>
								<th className="px-6 py-3">Zipcode</th>
								<th className="px-6 py-3">Website</th>
								<th className="px-6 py-3">Company</th>
								<th className="px-6 py-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{state.users.map((user) => (
								<tr
									key={user.id}
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<td className="px-6 py-3">{user.id}</td>
									<td className="px-6 py-3">{user.name}</td>
									<td className="px-6 py-3">{user.username}</td>
									<td className="px-6 py-3">{user.email}</td>
									<td className="px-6 py-3">{user.address.city}</td>
									<td className="px-6 py-3">{user.address.zipcode}</td>
									<td className="px-6 py-3">
										<a href="" className="text-blue-500 hover:text-blue-800">
											{user.website}
										</a>
									</td>
									<td className="px-6 py-3">{user.company.name}</td>
									<td className="px-6 py-3 flex justify-start items-center">
										<button
											onClick={() => handleEdit(user)}
											className="text-indigo-600 hover:text-indigo-900 mr-3"
										>
											✏️
										</button>
										<button className="text-blue-500 hover:text-blue-800 px-[5px] pr-[15px]">
											Info
										</button>
										<button
											onClick={() => handleDelete(user.id)}
											// className="bg-red-600 hover:text-red-900"
										>
											🗑️
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			{editingUser && (
				<EditUserModal
					user={editingUser}
					onSave={handleEditSave}
					onClose={() => setEditingUser(null)}
				/>
			)}
		</>
	);
};

export default TableComponent;