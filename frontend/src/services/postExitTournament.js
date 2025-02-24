
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const exitTournament = async (userId) => {
    try {
				const response = await fetch(`${backendUrl}/user_management/exit-tournament/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),  
        });

        if (!response.ok) throw new Error("Failed to exit tournament");

        // console.log("Successfully exited tournament");
    } catch (error) {
        console.error("Error exiting tournament:", error);
        throw error;  
    }
};

export default { exitTournament };
