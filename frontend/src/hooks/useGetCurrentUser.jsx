import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverURL } from "../App";
import { setUserData } from "../redux/userSlice";

function useGetCurrentUser() {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverURL}/api/user/current`, { withCredentials: true });
                dispatch(setUserData(result.data))
            }
            catch (error) {
                console.log("Error fetching current user:", error);
            }
        };
        fetchUser();
    }, []);

}

export default useGetCurrentUser;
