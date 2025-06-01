import React, { useState } from 'react';
import Dropdown from './Dropdown';
import { useSearchParams } from 'react-router-dom';

const HomeTools = () => {
    const [_, setSearchParams] = useSearchParams();

    const [Selected, setSelected] = useState(null);

    const handleSelect = (item, e) => {
        e.preventDefault();
        setSearchParams({ type: item.value });
        setSelected(item);
    }
    const items = [
        { label: 'Police Station', value: 'police' },
        { label: 'Hospital', value: 'hospital' },
        { label: 'Fire Service', value: 'fire_station' },
    ];
    return (
        <div className='flex flex-col items-center justify-center md:hidden'>
            <Dropdown
                label="Select Issue"
                items={[
                    { id: "1", label: "View Profile" },
                    { id: "2", label: "Account Settings" },
                    { id: "3", label: "Notifications" },
                    { id: "4", label: "Sign Out" },
                ]}
            />
            <div className='flex justify-center items-center'>
                {
                    items.map((item, index) => (
                        <button
                            key={index}
                            className={`text-white ${Selected?.label === item.label && 'bg-gray-700'} border-1 px-4 py-2 m-2 rounded hover:bg-emerald-600 transition-colors`}
                            onClick={(e) => {
                                handleSelect(item, e);
                            }}
                        >
                            {item.label}
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default HomeTools;