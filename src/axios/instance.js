import axios  from "axios";

const axiosInstance = axios.create({baseURL: 'http://localhost:8080/api/'});

axiosInstance.interceptors.request.use(
    request => {
        const jwt = localStorage.getItem("jwt");
        console.log("jwt",jwt);
        if ( jwt!= null){
        request.headers['Authorization'] = `Bearer ${jwt}`
        }
        return request;
    }
);

export default axiosInstance