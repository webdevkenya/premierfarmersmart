import { createContext, useState, useContext, ReactNode } from 'react';

interface AddressContextValue {
    setShippingAddress: (id: string) => void;
    address: string;
}

const AddressContext = createContext<AddressContextValue>({
    setShippingAddress: () => { },
    address: '',
});

const AddressProvider = ({ children }: { children: ReactNode }) => {
    const [address, setAddress] = useState<string>('');

    const setShippingAddress = (id: string) => {
        setAddress(id);
    };

    return (
        <AddressContext.Provider
            value={{
                address, setShippingAddress
            }}
        >
            {children}
        </AddressContext.Provider>
    );
};

const useShippingAddress = () => useContext(AddressContext);

export { AddressProvider, useShippingAddress };
