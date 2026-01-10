import axios from 'axios'

export const getUser = async () => {
    const userId = localStorage.getItem('userId')
    const response = await axios.get( `/user/${userId}`)
    const userData = response.data.data
    return userData
}
/**
    const userData = {
        username,
        email,
        repositories,
        followedUsers,
        staredRepositories
    }
*/