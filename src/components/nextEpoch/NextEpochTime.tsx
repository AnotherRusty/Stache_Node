import { useEffect, useState } from "react";
import { getEpochTimeRemaining } from "utils/web3service";

const NextEpochTime = () => {
    const [nextEpochTime, setNextEpochTime] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const PRIMARY_NEXT_EPOCH = await getEpochTimeRemaining()
            setNextEpochTime(PRIMARY_NEXT_EPOCH)
            setError(null); // Clear any previous errors
        })()
        // Define the interval ID to clear later
        let intervalId: NodeJS.Timeout;

        // Function to update the next epoch time
        const updateEpochTime = async () => {
            try {
                const timeRemaining = await getEpochTimeRemaining();
                setNextEpochTime(timeRemaining);
                setError(null); // Clear any previous errors
            } catch (err) {
                setError("Failed to fetch epoch time");
                console.error("Error fetching epoch time:", err);
            }
        };

        // Initial call to update the epoch time
        updateEpochTime();

        // Set an interval to update the epoch time every second
        intervalId = setInterval(updateEpochTime, 3600000);

        // Cleanup function to clear the interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <p className='text-[16px] not-italic font-bold leading-[120%] -tracking-[0.32px]'>
            {error ? error : nextEpochTime}
        </p>
    );
}

export default NextEpochTime;