//axios
import axios from 'axios'

export default axios.create({
    baseURL: 'https://localhost:7217', //URL da api
    headers: {
        'Content-Type': 'application/json'
    }
    // baseURL: 'http://191.252.204.179:5000'  //URL da api
})