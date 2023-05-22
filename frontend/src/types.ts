import {NextPage} from 'next'
import {ReactElement} from 'react'
import {AppProps} from 'next/app'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactElement
    authorization?: boolean
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export interface IInterest {
    _id: string
    name: string
}

export interface IEducation {
    _id: string
    name: string
    date: string
}

export interface IExperience {
    _id: string
    name: string
    date: string
}

export interface ISkill {
    _id: string
    name: string
}

export interface INotification {
    _id: string
    connectionUser: IUser
    user: string
    title: string
    type: string
    typeId: string
}

export interface IUser {
    _id: string
    slug: string
    firstName?: string
    lastName?: string
    company?: string
    email: string
    password?: string
    phone: string
    avatar: string | null
    instagram: string
    about: string
    interests: IInterest[]
    education: IEducation[]
    experiences: IExperience[]
    skills: ISkill[]
    notifications: INotification[]
    connections: string[]
    createdAt: string
}

export interface ILike {
    _id: string
    type: string
    user?: IUser
    createdAt: string
}

export interface IReply {
    _id: string
    title: string
    user: IUser
    createdAt: string
}

export interface IPost {
    _id: string
    title: string
    likeCount: number
    dislikeCount: number
    user?: IUser
    userLike?: ILike
    likes?: ILike[]
    replies?: IReply[]
    createdAt: string
}

export interface IJob {
    _id: string
    user?: IUser
    title: string
    location: string
    role: string
    createdAt: string
}

export interface IConversation {
    _id: string
    members: IUser[]
}

export interface IMessage {
    _id: string
    conversation: IConversation
    user: IUser
    message: string
}
