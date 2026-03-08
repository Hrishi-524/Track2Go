//  const userData = {
//         username: user.username,
//         email: user.email,
//         repositories: user.repositories,
//         followedUsers : user.followedUsers,
//         staredRepositories : user.staredRepositories,
//         pinnedRepositories : user.pinnedRepositories
//     }

export interface User {
    username: string,
    email: string,
    repositories: string[],
    followedUsers: string[],
    staredRepositories: string[],
    pinnedRepositories: string[]
}