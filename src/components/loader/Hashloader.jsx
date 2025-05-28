import React from 'react';
import { HashLoader } from 'react-spinners';

const Hashloader = () => {
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "blue",
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // full screen vertical center
                backgroundColor: "black", // optional, can be changed to match your app's theme
            }}
        >
            <HashLoader
                color="navy" // ensure loader itself is blue
                cssOverride={override}
                size={120}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default Hashloader;