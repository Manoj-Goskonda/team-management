import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Admin = () => {

    const [data, setData] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const itemColor = [{ bg: "bg-purple-50", font: "text-purple-600" }, { bg: "bg-blue-50", font: "text-blue-600" }, { bg: "bg-blue-50", font: "text-violet-900" }]

    const loadUsers = async () => {
        const result = await axios.get("http://localhost:3002/users")
        console.log("=====>>>> JSON Ready", result);
        setData(result.data);
        console.log('=====>>>> All Users', result.data)
    };

    const deleteUser = async (id) => {
        // await axios.delete(`http://localhost:3002/users/${id}`);
        // loadUsers();
        const updatedRecords = data.filter(record => record.id !== id);
        setData(updatedRecords);
        setSelectedIds([]);
    };

    useEffect(() => {
        loadUsers();
    }, []);


    const handleCheckboxChange1 = (e) => {

        setIsChecked(!isChecked);

        console.log('======>>>> check all', e.target);

    };
    useEffect(() => {
        if (isChecked) {
            let allcheck = data.map((item) => item.id)
            setSelectedIds(allcheck);
        } else {
            setSelectedIds([]);
        }
    }, [isChecked])

    const handleCheckboxChange = (id) => {
        const updatedSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter(selectedId => selectedId !== id)
            : [...selectedIds, id];

        setSelectedIds(updatedSelectedIds);
    };

    const handleDeleteSelected = () => {
        selectedIds.forEach(id => {
            fetch(`http://localhost:3002/users/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to delete record with ID ${id}`);
                    }
                })
                .catch(error => console.error(`Error deleting record with ID ${id}:`, error));
        });

        const updatedRecords = data.filter(record => !selectedIds.includes(record.id));
        setData(updatedRecords);
        setSelectedIds([]);
    };

    return (
        <>
            <div className="main">
                <div className="container mx-auto">
                    <h1 className="text-4xl ml-2 font-inter font-bold">Team Settings</h1>
                    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                        <div className="head">
                            <div className="flex">
                                <h1 className="text-xl">Team Members</h1>
                                <p className="text-sm ml-2 mb-auto py-0.5 px-4 bg-purple-100 rounded-lg text-purple-600 font-semibold border-purple-400">{data.length} Users</p>
                            </div>
                            <button className="btn bg-purple-600 hover:bg-purple-500 text-white font-semibold hover:text-purple py-2 px-4 border border-purple-500 hover:border-transparent rounded" onClick={handleDeleteSelected} >
                                Delete Selected
                            </button>
                        </div>
                        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-medium text-gray-900 flex">
                                        <input type="checkbox" className="checkbox" checked={isChecked} onChange={handleCheckboxChange1} />
                                        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Name</th>
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium text-gray-900">Status</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-gray-900">Role</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-gray-900">Email Address</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-gray-900">Teams</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-gray-900"></th>
                                </tr>
                            </thead>
                            {data.map((user, i) => (
                                <tbody className="divide-y divide-gray-100 border-t border-gray-100" >
                                    <tr className="hover:bg-gray-50" >
                                        <th className="flex gap-3 px-6 py-4 font-normal text-gray-900" key={i}>
                                            <input type="checkbox" className="checkbox checkbox-secondary px-6 py-4 font-medium" name={user.name} checked={selectedIds.includes(user.id)} onChange={() => handleCheckboxChange(user.id)} />
                                            <div className="relative h-10 w-10">
                                                <img
                                                    className="h-full w-full rounded-full object-cover object-center"
                                                    src={user.avatar}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-700">{user.name}</div>
                                                <div className="text-gray-400">@{user.userName}</div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            <span
                                                className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600"
                                            >
                                                {user.isActive ?
                                                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" /> :
                                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />}
                                                {user.isActive ? <span
                                                    className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600"
                                                >Active</span> : <span
                                                    className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-red-600"
                                                >in Active</span>}
                                                {/* {user.isActive ? 'Active' : 'inActive'} */}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{user.role}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4 flex">
                                            {user.teams.map((useTeams, index) =>
                                                < div className="flex gap-2" key={index} >
                                                    {index < 3 && (
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full ${itemColor[index].bg} px-2 py-1 text-xs font-semibold ${itemColor[index].font}`}
                                                        >
                                                            {useTeams}
                                                        </span>)}
                                                </div>
                                            )}
                                            <span
                                                className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-900"
                                            >
                                                {user.teams.length > 3 ? `+${user.teams.length - 3}` : null}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-4">
                                                <Link x-data="{ tooltip: 'Delete' }" to="/" onClick={() => deleteUser(user.id)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        className="h-6 w-6 hover:bg-purple-200"
                                                        x-tooltip="tooltip"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                        />
                                                    </svg>
                                                </Link>
                                                {/* <Link x-data="{ tooltip: 'Edite' }" href="#">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                    x-tooltip="tooltip"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                                    />
                                                </svg>
                                            </Link> */}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div >
            </div>
        </>
    );
}

export default Admin;
