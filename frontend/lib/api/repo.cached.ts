import { cache } from "react"
import { getRepo } from "./repo.api"

export const getRepoCached = cache(getRepo)